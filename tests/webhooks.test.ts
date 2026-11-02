import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { catalogEntitlementsForOffer } from '../src/domain/catalog-entitlement.ts';
import { FileEntitlementLedger, applyVerifiedStripeTestWebhook } from '../src/integrations/stripe/entitlements.ts';
import { verifyStripeWebhookSignature } from '../src/integrations/stripe/webhooks.ts';

const fixtureSecret = 'whsec_test_fixture_not_live';
const payload = '{"id":"evt_synthetic"}';
const timestamp = 1_700_000_000;

function signedHeader(body: string, secret = fixtureSecret, t = timestamp): string {
  const v1 = createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');
  return `t=${t},v1=${v1}`;
}

test('webhook verifier rejects a missing Stripe secret', () => {
  delete process.env.STRIPE_WEBHOOK_SECRET;
  const result = verifyStripeWebhookSignature({
    payload,
    signatureHeader: signedHeader(payload),
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'missing_secret');
});

test('webhook verifier rejects an empty Stripe secret', () => {
  const result = verifyStripeWebhookSignature({
    payload,
    signatureHeader: signedHeader(payload),
    secret: '   ',
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'missing_secret');
});

test('webhook verifier rejects a missing signature header when a secret exists', () => {
  const result = verifyStripeWebhookSignature({
    payload,
    signatureHeader: null,
    secret: fixtureSecret,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'missing_header');
});

test('webhook verifier rejects a malformed signature header', () => {
  const result = verifyStripeWebhookSignature({
    payload,
    signatureHeader: 'not-a-stripe-header',
    secret: fixtureSecret,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'malformed_header');
});

test('webhook verifier rejects a bad signature', () => {
  const result = verifyStripeWebhookSignature({
    payload,
    signatureHeader: signedHeader('{"id":"evt_other"}'),
    secret: fixtureSecret,
    nowMs: timestamp * 1000,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'bad_signature');
});

test('webhook verifier accepts a well-formed local HMAC and rejects stale timestamps', () => {
  const ok = verifyStripeWebhookSignature({
    payload,
    signatureHeader: signedHeader(payload),
    secret: fixtureSecret,
    nowMs: timestamp * 1000,
  });
  assert.equal(ok.ok, true);
  const stale = verifyStripeWebhookSignature({
    payload,
    signatureHeader: signedHeader(payload),
    secret: fixtureSecret,
    nowMs: (timestamp + 10_000) * 1000,
  });
  assert.equal(stale.ok, false);
  if (!stale.ok) assert.equal(stale.code, 'timestamp_expired');
});

test('signed Stripe test webhook accepts a canonical underscore feature code', () => {
  const priorFlag = process.env.ROOT_ENABLE_PAYMENTS;
  const directory = mkdtempSync(join(tmpdir(), 'root-test-webhook-'));
  try {
    process.env.ROOT_ENABLE_PAYMENTS = 'true';
    const featureCode = catalogEntitlementsForOffer('managed-rcm').find((feature) => feature === 'rcm_dashboard');
    assert.equal(featureCode, 'rcm_dashboard');
    const eventBody = JSON.stringify({
      id: 'evt_synthetic_underscore',
      type: 'checkout.session.completed',
      data: { object: { livemode: false, payment_status: 'paid', metadata: { orgId: 'bayview', featureCode } } },
    });
    const result = applyVerifiedStripeTestWebhook({
      payload: eventBody,
      signatureHeader: signedHeader(eventBody),
      secret: fixtureSecret,
      ledger: new FileEntitlementLedger(join(directory, 'entitlements.json')),
      nowMs: timestamp * 1000,
    });
    assert.equal(result.status, 'applied');
    if (result.status === 'applied') assert.equal(result.entitlement.featureCode, featureCode);
  } finally {
    if (priorFlag === undefined) delete process.env.ROOT_ENABLE_PAYMENTS;
    else process.env.ROOT_ENABLE_PAYMENTS = priorFlag;
    rmSync(directory, { recursive: true, force: true });
  }
});

test('Stripe webhook and checkout routes fail closed without body parse', () => {
  const webhook = readFileSync('src/app/api/v1/webhooks/stripe/route.ts', 'utf8');
  const checkout = readFileSync('src/app/api/v1/billing/checkout/route.ts', 'utf8');
  const inquiry =
    readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8') +
    readFileSync('src/server/leads/inquiry.ts', 'utf8');
  assert.match(webhook, /stripe_webhook_unavailable/);
  assert.match(webhook, /503/);
  assert.doesNotMatch(webhook, /request\.json\(/);
  assert.doesNotMatch(webhook, /request\.text\(/);
  assert.match(checkout, /checkout_unavailable/);
  assert.match(checkout, /503/);
  assert.doesNotMatch(checkout, /request\.json\(/);
  assert.match(inquiry, /inquiry_submission_unavailable/);
  assert.doesNotMatch(inquiry, /request\.json\(/);
});
