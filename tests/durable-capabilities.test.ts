import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { reset } from '../src/domain/operations/transitions.ts';
import {
  FileDemoSessionStore,
  getDemoSessionBackend,
  MAX_DEMO_SESSIONS,
} from '../src/server/operations/persistence.ts';
import { FileInquiryStore } from '../src/server/leads/file-inquiry-store.ts';
import { recordDurableInquiry } from '../src/server/leads/durable-inquiry.ts';
import { deliverHubSpotContact } from '../src/integrations/hubspot/deliver.ts';
import { applyVerifiedStripeTestWebhook, createStripeTestCheckout, FileEntitlementLedger } from '../src/integrations/stripe/entitlements.ts';
import { migrationIsRowSecure } from '../src/integrations/appwrite/schema.ts';
import { resolveProductionAppwriteSession, SyntheticAppwriteDirectory } from '../src/integrations/appwrite/synthetic-directory.ts';
import { requireMembership } from '../src/server/auth/policy.ts';
import { runSyntheticClaimFixture, runSyntheticEligibility } from '../src/integrations/healthcare/synthetic-sandbox.ts';
import { connectStedi } from '../src/integrations/stedi/client.ts';
import { integrationAcceptance } from '../src/integrations/acceptance.ts';

const contact = {
  name: 'Jordan Lee',
  email: 'jordan@example.invalid',
  organization: 'Cedar Grove Family Practice',
  message: 'Need help scoping A/R follow-up.',
  consent: true,
};

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), 'root-v2-'));
}

test('file demo sessions survive a new store, isolate practices, expire, cap, and reset', () => {
  const dir = tempDir();
  try {
    const snapshot = reset();
    const denied = structuredClone(snapshot);
    denied.claims[0].status = 'denied';
    const future = Date.now() + 60_000;
    const first = new FileDemoSessionStore(dir);
    first.save({ sessionId: 'sess-a', snapshot: denied, expiresAt: future, actionTimes: [1] });
    first.save({ sessionId: 'sess-b', snapshot, expiresAt: future, actionTimes: [] });
    const restarted = new FileDemoSessionStore(dir);
    assert.equal(restarted.load('sess-a')?.snapshot.claims[0].status, 'denied');
    assert.equal(restarted.load('sess-b')?.snapshot.claims[0].status, 'payer_processing');
    assert.equal(restarted.load('sess-a')?.snapshot.claims[0].id, restarted.load('sess-b')?.snapshot.claims[0].id);
    restarted.clear('sess-a');
    assert.equal(new FileDemoSessionStore(dir).load('sess-a'), null);
    assert.ok(new FileDemoSessionStore(dir).load('sess-b'));

    const expiring = new FileDemoSessionStore(dir);
    expiring.save({ sessionId: 'sess-old', snapshot, expiresAt: Date.now() - 1, actionTimes: [] });
    expiring.prune();
    assert.equal(expiring.load('sess-old'), null);

    const capped = new FileDemoSessionStore(join(dir, 'cap'));
    for (let index = 0; index < MAX_DEMO_SESSIONS; index += 1) {
      capped.save({
        sessionId: `cap-${index}`,
        snapshot,
        expiresAt: future + index,
        actionTimes: [],
      });
    }
    capped.save({ sessionId: 'cap-new', snapshot, expiresAt: future + 10_000, actionTimes: [] });
    assert.equal(capped.load('cap-0'), null);
    assert.ok(capped.load('cap-new'));
    assert.doesNotThrow(() =>
      capped.save({ sessionId: '../escape', snapshot, expiresAt: future, actionTimes: [] }),
    );
    assert.equal(capped.load('../escape'), null);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('file backend is selected only with a directory; appwrite stays fail-closed', () => {
  const dir = tempDir();
  const previousBackend = process.env.ROOT_DEMO_SESSION_BACKEND;
  const previousDir = process.env.ROOT_DEMO_SESSION_DIR;
  try {
    process.env.ROOT_DEMO_SESSION_BACKEND = 'file';
    delete process.env.ROOT_DEMO_SESSION_DIR;
    assert.equal(getDemoSessionBackend().kind, 'durable_stub');
    process.env.ROOT_DEMO_SESSION_DIR = dir;
    assert.equal(getDemoSessionBackend().kind, 'file');
    assert.equal(getDemoSessionBackend().writable, true);
    process.env.ROOT_DEMO_SESSION_BACKEND = 'appwrite';
    assert.equal(getDemoSessionBackend().kind, 'durable_stub');
    assert.equal(getDemoSessionBackend().writable, false);
  } finally {
    if (previousBackend === undefined) delete process.env.ROOT_DEMO_SESSION_BACKEND;
    else process.env.ROOT_DEMO_SESSION_BACKEND = previousBackend;
    if (previousDir === undefined) delete process.env.ROOT_DEMO_SESSION_DIR;
    else process.env.ROOT_DEMO_SESSION_DIR = previousDir;
    rmSync(dir, { recursive: true, force: true });
  }
});

test('durable inquiries dedupe, survive restart, and track HubSpot retry without a live send', async () => {
  const dir = tempDir();
  const previous = process.env.ROOT_ENABLE_CRM;
  delete process.env.ROOT_ENABLE_CRM;
  try {
    const store = new FileInquiryStore(dir);
    let calls = 0;
    const suppressed = await recordDurableInquiry(contact, store, {
      correlationId: 'corr-1',
      now: Date.parse('2026-11-01T00:00:00.000Z'),
      transport: async () => {
        calls += 1;
        return { ok: true, remoteId: 'should-not-run' };
      },
    });
    assert.equal(suppressed.ok, true);
    if (!suppressed.ok) return;
    assert.equal(suppressed.delivery, 'suppressed');
    assert.equal(calls, 0);

    process.env.ROOT_ENABLE_CRM = 'true';
    const attempts: number[] = [];
    const delivered = await recordDurableInquiry(
      { ...contact, email: 'ada@example.invalid', organization: 'Bayview Sample Practice' },
      store,
      {
        correlationId: 'corr-2',
        now: Date.parse('2026-11-01T00:00:00.000Z'),
        transport: async (_key, attempt) => {
          attempts.push(attempt);
          if (attempt < 3) return { ok: false, retryable: true, code: 'rate_limit' };
          return { ok: true, remoteId: 'hs-synthetic' };
        },
      },
    );
    assert.equal(delivered.ok, true);
    if (!delivered.ok) return;
    assert.equal(delivered.delivery, 'delivered');
    assert.deepEqual(attempts, [1, 2, 3]);
    assert.equal(delivered.record.remoteId, 'hs-synthetic');

    const again = await recordDurableInquiry(
      { ...contact, email: 'ada@example.invalid', organization: 'Bayview Sample Practice' },
      new FileInquiryStore(dir),
      {
        correlationId: 'corr-3',
        now: Date.parse('2026-11-01T00:00:00.000Z'),
        transport: async () => {
          calls += 1;
          return { ok: true, remoteId: 'hs-second' };
        },
      },
    );
    assert.equal(again.ok, true);
    if (!again.ok) return;
    assert.equal(again.duplicate, true);
    assert.equal(again.record.remoteId, 'hs-synthetic');
    assert.equal(calls, 0);

    const phi = await recordDurableInquiry(
      { ...contact, message: 'Patient DOB is 1/1/1980 and MRN 123' },
      store,
    );
    assert.equal(phi.ok, false);
    const route = readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8');
    assert.doesNotMatch(route, /FileInquiryStore|recordDurableInquiry/);
  } finally {
    if (previous === undefined) delete process.env.ROOT_ENABLE_CRM;
    else process.env.ROOT_ENABLE_CRM = previous;
    rmSync(dir, { recursive: true, force: true });
  }
});

test('HubSpot delivery stays disabled without CRM and dedupes a repeated key', async () => {
  delete process.env.ROOT_ENABLE_CRM;
  const disabled = await deliverHubSpotContact({ idempotencyKey: 'inq_test' }, {
    transport: async () => ({ ok: true, remoteId: 'nope' }),
  });
  assert.equal(disabled.status, 'disabled');
  process.env.ROOT_ENABLE_CRM = 'true';
  try {
    const seen = new Set(['inq_test']);
    const duplicate = await deliverHubSpotContact({ idempotencyKey: 'inq_test' }, { alreadyDelivered: seen });
    assert.equal(duplicate.status, 'duplicate');
  } finally {
    delete process.env.ROOT_ENABLE_CRM;
  }
});

test('Stripe test checkout and verified webhooks update only a server-side test entitlement', async () => {
  const dir = tempDir();
  const previous = process.env.ROOT_ENABLE_PAYMENTS;
  delete process.env.ROOT_ENABLE_PAYMENTS;
  try {
    const secret = 'whsec_test_fixture_not_live';
    const seen = new Map<string, string>();
    const disabled = await createStripeTestCheckout(
      { orgId: 'bayview', offerId: 'revenue-diagnostic', idempotencyKey: 'idem-1' },
      { transport: async () => ({ id: 'cs_test', livemode: false }), seen },
    );
    assert.equal(disabled.status, 'disabled');
    process.env.ROOT_ENABLE_PAYMENTS = 'true';
    const prepared = await createStripeTestCheckout(
      { orgId: 'bayview', offerId: 'revenue-diagnostic', idempotencyKey: 'idem-1' },
      { transport: async () => ({ id: 'cs_test_synthetic', livemode: false }), seen },
    );
    assert.equal(prepared.status, 'test_prepared');
    const duplicateCheckout = await createStripeTestCheckout(
      { orgId: 'bayview', offerId: 'revenue-diagnostic', idempotencyKey: 'idem-1' },
      { transport: async () => ({ id: 'cs_second', livemode: false }), seen },
    );
    assert.equal(duplicateCheckout.status, 'duplicate');
    const live = await createStripeTestCheckout(
      { orgId: 'bayview', offerId: 'revenue-diagnostic', idempotencyKey: 'idem-live' },
      { transport: async () => ({ id: 'cs_live', livemode: true }), seen },
    );
    assert.equal(live.status, 'rejected');
    if (live.status === 'rejected') assert.equal(live.reason, 'livemode');

    const ledger = new FileEntitlementLedger(join(dir, 'entitlements.json'));
    const event = {
      id: 'evt_synthetic',
      type: 'checkout.session.completed',
      data: {
        object: {
          livemode: false,
          payment_status: 'paid',
          metadata: { orgId: 'bayview', featureCode: 'operations-workspace' },
        },
      },
    };
    const payload = JSON.stringify(event);
    const timestamp = 1_700_000_000;
    const signature = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
    const applied = applyVerifiedStripeTestWebhook({
      payload,
      signatureHeader: `t=${timestamp},v1=${signature}`,
      secret,
      ledger,
      nowMs: timestamp * 1000,
    });
    assert.equal(applied.status, 'applied');
    const duplicate = applyVerifiedStripeTestWebhook({
      payload,
      signatureHeader: `t=${timestamp},v1=${signature}`,
      secret,
      ledger: new FileEntitlementLedger(join(dir, 'entitlements.json')),
      nowMs: timestamp * 1000,
    });
    assert.equal(duplicate.status, 'duplicate');
    const liveEvent = { ...event, id: 'evt_live', data: { object: { ...event.data.object, livemode: true } } };
    const livePayload = JSON.stringify(liveEvent);
    const liveSignature = createHmac('sha256', secret).update(`${timestamp}.${livePayload}`).digest('hex');
    const rejected = applyVerifiedStripeTestWebhook({
      payload: livePayload,
      signatureHeader: `t=${timestamp},v1=${liveSignature}`,
      secret,
      ledger,
      nowMs: timestamp * 1000,
    });
    assert.equal(rejected.status, 'rejected');
  } finally {
    if (previous === undefined) delete process.env.ROOT_ENABLE_PAYMENTS;
    else process.env.ROOT_ENABLE_PAYMENTS = previous;
    rmSync(dir, { recursive: true, force: true });
  }
});

test('synthetic Appwrite sessions enforce membership and production resolution stays disabled', () => {
  assert.equal(migrationIsRowSecure(), true);
  const directory = new SyntheticAppwriteDirectory();
  directory.addMembership('user-a', 'org-a', 'CLIENT_OWNER');
  directory.createSession('user-a', 'secret-a', Date.now() + 1_000);
  directory.createSession('user-a', 'secret-old', Date.now() - 1);
  const context = directory.resolve('secret-a');
  assert.equal(requireMembership(context, 'org-a', 'organization.read').allow, false);
  process.env.ROOT_ENABLE_AUTH = 'true';
  try {
    assert.equal(requireMembership(context, 'org-a', 'organization.read').allow, true);
    assert.equal(requireMembership(context, 'org-b', 'organization.read').allow, false);
    assert.equal(directory.resolve('secret-old').session, null);
    assert.equal(resolveProductionAppwriteSession('root_v2_session=not-a-session').status, 'disabled');
  } finally {
    delete process.env.ROOT_ENABLE_AUTH;
  }
});

test('healthcare sandbox fixtures stay synthetic and external acceptance is not claimed', () => {
  const eligibility = runSyntheticEligibility({ payerCode: 'SYN-PAYER', memberToken: 'synthetic-member' });
  assert.equal(eligibility.status, 'synthetic');
  assert.equal(eligibility.live, false);
  assert.equal(eligibility.claimedPartnership, false);
  assert.equal(runSyntheticEligibility({ payerCode: 'OTHER', memberToken: 'synthetic-member' }).status, 'disabled');
  assert.equal(runSyntheticClaimFixture({ payerCode: 'SYN-PAYER', claimToken: 'Patient MRN 12' }).status, 'rejected');
  assert.equal(connectStedi({ orgId: 'bayview', payerCode: 'SYN-PAYER', transaction: '270/271' }).status, 'disabled');
  const acceptance = integrationAcceptance();
  for (const item of Object.values(acceptance)) {
    assert.equal(item.sandbox, false);
    assert.equal(item.live, false);
  }
});
