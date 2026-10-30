import test from 'node:test';
import assert from 'node:assert/strict';
import { getFeatureFlags } from '../src/lib/flags.ts';
import {
  apolloAdapter,
  appwriteAdapter,
  DisabledIntegrationError,
  hubspotAdapter,
  stripeAdapter,
} from '../src/integrations/disabled.ts';
import {
  createAppwriteAuthClient,
  createAppwriteTablesClient,
  createAppwriteTeamsClient,
} from '../src/integrations/appwrite/client.ts';
import { createAppwriteAdminClient } from '../src/integrations/appwrite/admin.ts';
import { createHubSpotClient, createHubSpotIdempotencyKey, upsertHubSpotContact, upsertHubSpotDeal } from '../src/integrations/hubspot/client.ts';
import { createCheckoutSession, createSubscriptionCheckout } from '../src/integrations/stripe/client.ts';
import { createApolloClient, enrichApolloPerson } from '../src/integrations/apollo/client.ts';
import { listOrgRows } from '../src/server/auth/membership.ts';
import type { AuthContext } from '../src/server/auth/policy.ts';
import { mayActivateFromBrowserRedirect } from '../src/domain/entitlement.ts';

function clearEnableFlags() {
  delete process.env.ROOT_ENABLE_AUTH;
  delete process.env.ROOT_ENABLE_CRM;
  delete process.env.ROOT_ENABLE_PAYMENTS;
  delete process.env.ROOT_ENABLE_PROSPECTING;
}

test('feature flags default deny', () => {
  clearEnableFlags();
  const flags = getFeatureFlags();
  assert.equal(flags.auth, false);
  assert.equal(flags.crm, false);
  assert.equal(flags.billing, false);
  assert.equal(flags.prospecting, false);
  assert.equal(flags.liveClaims, false);
});

test('legacy adapter facades return disabled', () => {
  assert.equal(appwriteAdapter().status, 'disabled');
  assert.equal(hubspotAdapter().status, 'disabled');
  assert.equal(stripeAdapter().status, 'disabled');
  assert.equal(apolloAdapter().status, 'disabled');
});

test('Appwrite Auth/Teams/TablesDB clients do not call a network and stay disabled', async () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const auth = createAppwriteAuthClient();
  const teams = createAppwriteTeamsClient();
  const tables = createAppwriteTablesClient();
  const session = await auth.getSession();
  const memberships = await teams.listMemberships('team_synthetic');
  const rows = await tables.listRows({ tableId: 'organizations' });
  assert.equal(session.status, 'disabled');
  assert.equal(memberships.status, 'disabled');
  assert.equal(rows.status, 'disabled');
  assert.equal(session.ok, false);
  delete process.env.ROOT_ENABLE_AUTH;
});

test('Appwrite admin client throws DisabledIntegrationError instead of mutating', () => {
  const admin = createAppwriteAdminClient();
  assert.throws(() => admin.teams.create(), (error: unknown) => {
    assert.ok(error instanceof DisabledIntegrationError);
    assert.equal(error.integration, 'appwrite');
    assert.equal(error.status, 'disabled');
    return true;
  });
});

test('HubSpot contact upsert is disabled and still mints a local idempotency key', async () => {
  process.env.ROOT_ENABLE_CRM = 'true';
  const key = createHubSpotIdempotencyKey({
    email: 'owner@example.invalid',
    event: 'consultation.requested',
    occurredAt: '2026-10-30T00:00:00Z',
  });
  assert.match(key, /^hs_v1_[a-f0-9]{32}$/);
  const result = await upsertHubSpotContact({
    email: 'owner@example.invalid',
    companyName: 'Cedar Grove Family Practice',
    consentAt: '2026-10-30T00:00:00Z',
    consentVersion: 'v1',
    idempotencyKey: key,
    correlationId: 'corr-synthetic',
    source: 'consultation',
  });
  assert.equal(result.status, 'disabled');
  assert.equal(createHubSpotClient().upsertContact, upsertHubSpotContact);
  const deal = await upsertHubSpotDeal({
    companyName: 'Cedar Grove Family Practice',
    offerId: 'revenue-diagnostic',
    stage: 'proposal',
    idempotencyKey: key,
    correlationId: 'corr-synthetic-deal',
  });
  assert.equal(deal.status, 'disabled');
  assert.equal(createHubSpotClient().upsertDeal, upsertHubSpotDeal);
  delete process.env.ROOT_ENABLE_CRM;
});

test('Stripe checkout and subscription factories return disabled', () => {
  process.env.ROOT_ENABLE_PAYMENTS = 'true';
  const checkout = createCheckoutSession({
    orgId: 'sample-solo',
    offerId: 'revenue-diagnostic',
    mode: 'payment',
    successUrl: 'https://example.invalid/success',
    cancelUrl: 'https://example.invalid/cancel',
    idempotencyKey: 'idem-1',
    correlationId: 'corr-1',
  });
  const subscription = createSubscriptionCheckout({
    orgId: 'sample-solo',
    offerId: 'managed-rcm',
    mode: 'subscription',
    successUrl: 'https://example.invalid/success',
    cancelUrl: 'https://example.invalid/cancel',
    idempotencyKey: 'idem-2',
    correlationId: 'corr-2',
  });
  assert.equal(checkout.status, 'disabled');
  assert.equal(subscription.status, 'disabled');
  assert.equal(mayActivateFromBrowserRedirect(), false);
  delete process.env.ROOT_ENABLE_PAYMENTS;
});

test('Apollo enrichment adapter is disabled', async () => {
  process.env.ROOT_ENABLE_PROSPECTING = 'true';
  const result = await enrichApolloPerson({
    businessEmail: 'owner@example.invalid',
    correlationId: 'corr-apollo',
  });
  assert.equal(result.status, 'disabled');
  assert.equal(createApolloClient().enrichPerson, enrichApolloPerson);
  delete process.env.ROOT_ENABLE_PROSPECTING;
});

test('org-scoped TablesDB reads still require membership and stay disabled', async () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const cedar: AuthContext = {
    session: { userId: 'user-a', email: 'owner@example.invalid' },
    memberships: [{ orgId: 'sample-solo', role: 'CLIENT_OWNER' }],
  };
  const denied = await listOrgRows(cedar, 'sample-group', 'organizations');
  const allowedButDisabled = await listOrgRows(cedar, 'sample-solo', 'organizations');
  assert.equal('allow' in denied && denied.allow === false, true);
  if ('allow' in denied && denied.allow === false) assert.equal(denied.code, 'not_a_member');
  assert.equal('status' in allowedButDisabled && allowedButDisabled.status === 'disabled', true);
  delete process.env.ROOT_ENABLE_AUTH;
});
