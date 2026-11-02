import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SEED_IDS } from '../src/domain/operations/seed.ts';
import {
  DurableStubDemoSessionStore,
  getDemoSessionBackend,
  resetDemoSessionPersistence,
} from '../src/server/operations/persistence.ts';
import { authorizeOpsPreview } from '../src/server/operations/policy.ts';
import {
  OPS_ACTION_LIMIT,
  isPreviewPrefetch,
  signOpsCapability,
  verifyOpsCapability,
  type OpsSessionContext,
} from '../src/server/operations/session.ts';
import { applyOpsAction, readOpsState, resetOpsStore } from '../src/server/operations/store.ts';

const operator = (id: string): OpsSessionContext => ({ id, capability: 'operator' });

test('router prefetch does not rebind the operator preview cookie', () => {
  assert.equal(isPreviewPrefetch(new Headers()), false);
  assert.equal(isPreviewPrefetch(new Headers({ 'next-router-prefetch': '1' })), true);
  assert.equal(
    isPreviewPrefetch(new Headers({ 'next-router-segment-prefetch': '/en/preview/credentialing' })),
    true,
  );
  assert.equal(isPreviewPrefetch(new Headers({ purpose: 'prefetch' })), true);
  assert.equal(isPreviewPrefetch(new Headers({ 'sec-purpose': 'prefetch' })), true);
  const source = readFileSync('src/middleware.ts', 'utf8');
  const guard = source.indexOf('if (isPreviewPrefetch(request.headers)) return response;');
  const bind = source.indexOf('return bindPreviewCookies(request, response);');
  assert.ok(guard > 0);
  assert.ok(bind > guard);
});

test('missing or tampered capability cookie fails closed to client', async () => {
  assert.equal(await verifyOpsCapability('sid-a', undefined), 'client');
  assert.equal(await verifyOpsCapability('sid-a', 'operator'), 'client');
  assert.equal(await verifyOpsCapability('sid-a', 'operator.deadbeef'), 'client');
  const signature = await signOpsCapability('sid-a', 'operator');
  assert.equal(await verifyOpsCapability('sid-a', `operator.${signature}`), 'operator');
  assert.equal(await verifyOpsCapability('sid-b', `operator.${signature}`), 'client');
});

test('omitted policy capability cannot select staff operator membership', () => {
  const omitted = authorizeOpsPreview({ orgId: 'bayview', persona: 'staff' });
  assert.equal(omitted.allow, true);
  if (!omitted.allow) return;
  assert.equal(omitted.persona, 'client');

  const explicit = authorizeOpsPreview({
    orgId: 'bayview',
    persona: 'staff',
    capability: 'operator',
  });
  assert.equal(explicit.allow, true);
  if (!explicit.allow) return;
  assert.equal(explicit.persona, 'staff');
});

test('unauthorized operator action is forbidden 403; two session ids stay isolated; reset is scoped', () => {
  const alpha = operator('sec-alpha');
  const beta = operator('sec-beta');
  const viewer: OpsSessionContext = { id: 'sec-viewer', capability: 'client' };
  resetOpsStore(alpha);
  resetOpsStore(beta);

  const unauthorized = applyOpsAction(
    { type: 'deny_claim', orgId: 'bayview', persona: 'staff', claimId: SEED_IDS.deniableClaim },
    viewer,
  );
  assert.equal(unauthorized.ok, false);
  if (!unauthorized.ok) {
    assert.equal(unauthorized.kind, 'denied');
    if (unauthorized.kind === 'denied') {
      assert.equal(unauthorized.decision.code, 'forbidden');
    }
  }

  const denyAlpha = applyOpsAction(
    { type: 'deny_claim', orgId: 'bayview', persona: 'staff', claimId: SEED_IDS.deniableClaim },
    alpha,
  );
  assert.equal(denyAlpha.ok, true);

  const betaRead = readOpsState('bayview', 'staff', beta);
  assert.equal(betaRead.ok, true);
  if (!betaRead.ok) return;
  assert.equal(betaRead.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'payer_processing');

  const resetBeta = applyOpsAction({ type: 'reset', orgId: 'bayview', persona: 'staff' }, beta);
  assert.equal(resetBeta.ok, true);

  const alphaAfter = readOpsState('bayview', 'staff', alpha);
  assert.equal(alphaAfter.ok, true);
  if (!alphaAfter.ok) return;
  assert.equal(alphaAfter.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'denied');
});

test('cross-tenant deny does not mutate the other org; seed grants project Free/Growth/Managed', () => {
  const session = operator('sec-entitlements');
  resetOpsStore(session);

  const cross = applyOpsAction(
    {
      type: 'deny_claim',
      orgId: 'cedar-grove',
      persona: 'staff',
      claimId: SEED_IDS.deniableClaim,
    },
    session,
  );
  assert.equal(cross.ok, false);
  if (!cross.ok) {
    assert.equal(cross.kind, 'denied');
    if (cross.kind === 'denied') assert.equal(cross.decision.code, 'not_a_member');
  }

  const cedar = readOpsState('cedar-grove', 'staff', session);
  const metro = readOpsState('metro-asc', 'staff', session);
  const bayview = readOpsState('bayview', 'staff', session);
  assert.equal(cedar.ok && metro.ok && bayview.ok, true);
  if (!cedar.ok || !metro.ok || !bayview.ok) return;
  assert.equal(cedar.view.preview.tier, 'Free');
  assert.equal(metro.view.preview.tier, 'Growth');
  assert.equal(bayview.view.preview.tier, 'Managed');
  assert.equal(bayview.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'payer_processing');

  const cycled = applyOpsAction({ type: 'set_tier', orgId: 'bayview', persona: 'staff' }, session);
  assert.equal(cycled.ok, true);
  if (!cycled.ok) return;
  assert.equal(cycled.view.preview.tier, 'Free');
  assert.equal(cycled.view.entitlements[0]?.source, 'preview');

  const cedarAfter = readOpsState('cedar-grove', 'staff', session);
  const metroAfter = readOpsState('metro-asc', 'staff', session);
  assert.equal(cedarAfter.ok && metroAfter.ok, true);
  if (!cedarAfter.ok || !metroAfter.ok) return;
  assert.equal(cedarAfter.view.preview.tier, 'Free');
  assert.equal(metroAfter.view.preview.tier, 'Growth');
});

test('operator actions are rate limited per session', () => {
  const session = operator('sec-rate-limit');
  resetOpsStore(session);
  for (let i = 0; i < OPS_ACTION_LIMIT; i += 1) {
    const result = applyOpsAction({ type: 'advance_timeline', orgId: 'bayview', persona: 'staff' }, session);
    assert.equal(result.ok, true, `action ${i} should succeed under the session limit`);
  }
  const blocked = applyOpsAction({ type: 'advance_timeline', orgId: 'bayview', persona: 'staff' }, session);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.equal(blocked.kind, 'rate_limited');
});

test('durable session stub fails closed without inventing Appwrite or KV credentials', () => {
  resetDemoSessionPersistence();
  process.env.ROOT_DEMO_SESSION_BACKEND = 'appwrite';
  try {
    const backend = getDemoSessionBackend();
    assert.equal(backend.kind, 'durable_stub');
    assert.equal(backend.writable, false);
    assert.equal(backend.load('any-session'), null);
    assert.ok(backend instanceof DurableStubDemoSessionStore);

    const write = applyOpsAction(
      { type: 'reset', orgId: 'bayview', persona: 'staff' },
      operator('sec-durable'),
    );
    assert.equal(write.ok, false);
    if (!write.ok) assert.equal(write.kind, 'persistence_unavailable');

    const persistence = readFileSync('src/server/operations/persistence.ts', 'utf8');
    assert.doesNotMatch(persistence, /APPWRITE_API_KEY|HUBSPOT_PRIVATE_APP_TOKEN|STRIPE_SECRET_KEY|APOLLO_API_KEY/);
    assert.doesNotMatch(persistence, /projectId\s*[:=]/);
  } finally {
    delete process.env.ROOT_DEMO_SESSION_BACKEND;
    resetDemoSessionPersistence();
  }

  assert.equal(getDemoSessionBackend().kind, 'memory');
  assert.equal(getDemoSessionBackend().writable, true);
  const restored = applyOpsAction(
    { type: 'advance_timeline', orgId: 'bayview', persona: 'staff' },
    operator('sec-memory-restored'),
  );
  assert.equal(restored.ok, true);
});

test('ops action route maps persistence_unavailable to HTTP 503 and does not mention secrets', () => {
  const actionRoute = readFileSync('src/app/api/v1/ops/actions/route.ts', 'utf8');
  const errors = readFileSync('src/server/http/errors.ts', 'utf8');
  assert.match(actionRoute, /persistence_unavailable/);
  assert.match(actionRoute, /jsonError\(\s*503/);
  assert.match(errors, /case 'forbidden':/);
  assert.match(errors, /return 403/);
  assert.doesNotMatch(actionRoute, /APPWRITE_API_KEY/);
  assert.doesNotMatch(actionRoute, /HUBSPOT_PRIVATE_APP_TOKEN/);
});
