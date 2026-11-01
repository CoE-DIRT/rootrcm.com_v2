import test from 'node:test';
import assert from 'node:assert/strict';
import { featureFlags, getFeatureFlags } from '../src/lib/flags.ts';
import {
  createAppwriteAuthClient,
  createAppwriteTablesClient,
  createAppwriteTeamsClient,
} from '../src/integrations/appwrite/client.ts';
import { createHubSpotClient, upsertHubSpotContact } from '../src/integrations/hubspot/client.ts';
import { createCheckoutSession, createStripeClient } from '../src/integrations/stripe/client.ts';
import { isBusinessContact, validateBusinessContact } from '../src/lib/validation/business-contact.ts';

function clearEnableFlags() {
  delete process.env.ROOT_ENABLE_AUTH;
  delete process.env.ROOT_ENABLE_CRM;
  delete process.env.ROOT_ENABLE_PAYMENTS;
  delete process.env.ROOT_ENABLE_PROSPECTING;
}

test('featureFlags snapshot keeps auth, billing and crm disabled by default', () => {
  clearEnableFlags();
  const flags = getFeatureFlags();
  assert.equal(flags.auth, false);
  assert.equal(flags.billing, false);
  assert.equal(flags.crm, false);
  assert.equal(featureFlags.auth, false);
  assert.equal(featureFlags.billing, false);
  assert.equal(featureFlags.crm, false);
});

test('Appwrite client methods fail closed with structured disabled errors', async () => {
  clearEnableFlags();
  const auth = createAppwriteAuthClient();
  const teams = createAppwriteTeamsClient();
  const tables = createAppwriteTablesClient();
  const session = await auth.getSession();
  const memberships = await teams.listMemberships('team_synthetic');
  const rows = await tables.listRows({ tableId: 'organizations' });
  for (const result of [session, memberships, rows]) {
    assert.equal(result.ok, false);
    assert.equal(result.status, 'disabled');
    assert.equal(result.integration, 'appwrite');
    assert.match(result.message, /appwrite adapter is typed and disabled/i);
  }
});

test('Stripe and HubSpot clients fail closed without network calls', async () => {
  clearEnableFlags();
  const stripe = createStripeClient();
  const checkout = createCheckoutSession({
    orgId: 'sample-solo',
    offerId: 'revenue-diagnostic',
    mode: 'payment',
    successUrl: 'https://example.invalid/success',
    cancelUrl: 'https://example.invalid/cancel',
    idempotencyKey: 'idem-adapters-1',
    correlationId: 'corr-adapters-1',
  });
  assert.equal(checkout.ok, false);
  assert.equal(checkout.status, 'disabled');
  assert.equal(checkout.integration, 'stripe');
  assert.match(checkout.message, /stripe adapter is typed and disabled/i);
  assert.equal(typeof stripe.createCheckoutSession, 'function');

  const hubspot = createHubSpotClient();
  const contact = await upsertHubSpotContact({
    email: 'owner@example.invalid',
    companyName: 'Cedar Grove Family Practice',
    consentAt: '2026-10-30T00:00:00Z',
    consentVersion: 'v1',
    idempotencyKey: 'hs_v1_adapters',
    correlationId: 'corr-adapters-hs',
    source: 'consultation',
  });
  assert.equal(contact.ok, false);
  assert.equal(contact.status, 'disabled');
  assert.equal(contact.integration, 'hubspot');
  assert.match(contact.message, /hubspot adapter is typed and disabled/i);
  assert.equal(typeof hubspot.upsertContact, 'function');
});

test('isBusinessContact rejects personal email domains and malformed schemas', () => {
  assert.equal(
    isBusinessContact({
      name: 'Jordan Lee',
      email: 'jordan@gmail.com',
      organization: 'Cedar Grove Family Practice',
      consent: true,
    }),
    false,
  );
  assert.equal(
    isBusinessContact({
      name: 'Jordan Lee',
      email: 'jordan@yahoo.com',
      organization: 'Cedar Grove Family Practice',
      consent: true,
    }),
    false,
  );
  assert.equal(isBusinessContact({ email: 'not-an-email' }), false);
  assert.equal(isBusinessContact(null), false);
  assert.equal(isBusinessContact('owner@example.invalid'), false);

  const malformed = validateBusinessContact({
    name: 'J',
    email: 'broken',
    organization: '',
    consent: false,
  });
  assert.equal(malformed.ok, false);
  if (!malformed.ok) {
    assert.equal(malformed.fieldErrors.email, 'emailInvalid');
    assert.equal(malformed.fieldErrors.name, 'nameShort');
    assert.equal(malformed.fieldErrors.organization, 'orgShort');
    assert.equal(malformed.fieldErrors.consent, 'consentRequired');
  }

  assert.equal(
    isBusinessContact({
      name: 'Jordan Lee',
      email: 'jordan@example.invalid',
      organization: 'Cedar Grove Family Practice',
      consent: true,
    }),
    true,
  );
});
