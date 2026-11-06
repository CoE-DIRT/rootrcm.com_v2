import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluateFeature, effectiveFeatures, FREE_FEATURES, knownFeatures, INTERNAL_ORG_ID, type FeatureGrant } from '../src/domain/feature-access.ts';
import { offerFeatureCodes } from '../src/domain/catalog-entitlement.ts';
import { authorizeFeature } from '../src/server/entitlements/gate.ts';
import { parseGrants } from '../src/server/entitlements/grants.ts';
import type { AuthContext } from '../src/server/auth/policy.ts';
import type { Role } from '../src/domain/identity/roles.ts';

before(() => { process.env.ROOT_ENABLE_AUTH = 'true'; });

const NOW = Date.parse('2026-11-06T12:00:00Z');
const ctx = (role: Role, orgId: string): AuthContext => ({ session: { userId: 'u1', email: 'u@x.example' }, memberships: [{ orgId, role }] });
const grant = (featureCode: string, state: FeatureGrant['state'], expiresAt?: string): FeatureGrant => ({ featureCode, state, expiresAt });

test('FREE = basic workspace + consultation only; every catalog feature is mapped to a permission', () => {
  assert.deepEqual([...FREE_FEATURES], ['basic_workspace', 'consultation']);
  const all = new Set(Object.values(offerFeatureCodes).flat());
  for (const code of all) assert.ok(knownFeatures.includes(code), `unmapped feature ${code}`);
  assert.deepEqual(effectiveFeatures('org-a', [], NOW), ['basic_workspace', 'consultation']);
});

test('paid features need an active/grace, unexpired grant; every other state or expiry denies', () => {
  const ok = (g: FeatureGrant[]) => evaluateFeature('rcm_dashboard', 'org-a', g, NOW).allow;
  assert.equal(ok([grant('rcm_dashboard', 'active')]), true);
  assert.equal(ok([grant('rcm_dashboard', 'grace')]), true);
  for (const state of ['none', 'checkout_pending', 'past_due', 'suspended', 'canceled', 'expired', 'disputed'] as const) {
    assert.equal(ok([grant('rcm_dashboard', state)]), false, state);
  }
  assert.equal(ok([grant('rcm_dashboard', 'active', '2026-11-06T11:59:59Z')]), false, 'expired plan');
  assert.equal(ok([grant('rcm_dashboard', 'active', '2026-12-01T00:00:00Z')]), true, 'future expiry');
  assert.equal(ok([grant('rcm_dashboard', 'active', 'garbage')]), false, 'unparsable expiry fails closed');
  assert.equal(ok([grant('rcm_dashboard', 'active'), grant('rcm_dashboard', 'disputed')]), false, 'restrictive row wins');
  assert.equal(ok([grant('dirt_workspace', 'active')]), false, 'grant for another feature does not apply');
});

test('upgrade adds only the features granted; expiry downgrades back to FREE', () => {
  const managed = ['rcm_dashboard', 'credentialing_tracker', 'managed_requests'].map((f) => grant(f, 'active', '2026-12-01T00:00:00Z'));
  assert.deepEqual(effectiveFeatures('org-a', managed, NOW), ['basic_workspace', 'consultation', 'rcm_dashboard', 'credentialing_tracker', 'managed_requests']);
  assert.deepEqual(effectiveFeatures('org-a', managed, Date.parse('2026-12-02T00:00:00Z')), ['basic_workspace', 'consultation']);
});

test('internal operator org needs no purchased plan; client orgs do', () => {
  assert.equal(evaluateFeature('rcm_dashboard', INTERNAL_ORG_ID, [], NOW).allow, true);
  assert.equal(evaluateFeature('rcm_dashboard', 'org-a', [], NOW).allow, false);
});

test('gate: membership first, then plan; roles and permissions apply to client, staff and admin', () => {
  assert.equal(authorizeFeature(ctx('CLIENT_OWNER', 'org-a'), 'org-a', 'consultation', []).allow, true);
  const paid = authorizeFeature(ctx('CLIENT_OWNER', 'org-a'), 'org-a', 'rcm_dashboard', []);
  assert.deepEqual(paid, { allow: false, code: 'entitlement_inactive' });
  assert.equal(authorizeFeature(ctx('CLIENT_OWNER', 'org-a'), 'org-a', 'rcm_dashboard', [grant('rcm_dashboard', 'active')]).allow, true);
  // CLIENT_MEMBER lacks requests.read even with a plan
  assert.deepEqual(authorizeFeature(ctx('CLIENT_MEMBER', 'org-a'), 'org-a', 'managed_requests', [grant('managed_requests', 'active')]), { allow: false, code: 'forbidden' });
  // staff / admin work in root_internal without a purchased plan
  assert.equal(authorizeFeature(ctx('ROOT_SPECIALIST', INTERNAL_ORG_ID), INTERNAL_ORG_ID, 'managed_requests', []).allow, true);
  assert.equal(authorizeFeature(ctx('ROOT_SUPERADMIN', INTERNAL_ORG_ID), INTERNAL_ORG_ID, 'rcm_dashboard', []).allow, true);
  assert.deepEqual(authorizeFeature(ctx('CLIENT_OWNER', 'org-a'), 'org-a', 'nope', []), { allow: false, code: 'unknown_feature' });
});

test('cross-tenant: another org grant, superadmin and wrong org never grant access', () => {
  const grantsB = parseGrants([{ orgId: 'org-b', featureCode: 'rcm_dashboard', state: 'active' }], 'org-a');
  assert.deepEqual(grantsB, [], 'rows for another org are dropped');
  const a = ctx('CLIENT_OWNER', 'org-a');
  assert.deepEqual(authorizeFeature(a, 'org-b', 'consultation', [grant('consultation', 'active')]), { allow: false, code: 'not_a_member' });
  assert.deepEqual(authorizeFeature(a, 'org-b', 'rcm_dashboard', [grant('rcm_dashboard', 'active')]), { allow: false, code: 'not_a_member' });
  const admin = ctx('ROOT_SUPERADMIN', INTERNAL_ORG_ID);
  assert.deepEqual(authorizeFeature(admin, 'org-a', 'rcm_dashboard', [grant('rcm_dashboard', 'active')]), { allow: false, code: 'not_a_member' });
  assert.deepEqual(authorizeFeature({ session: null, memberships: [] }, 'org-a', 'consultation', []), { allow: false, code: 'unauthenticated' });
});

test('parseGrants drops preview-sourced, unknown-state and malformed rows; accepts data envelope and period end', () => {
  const rows = [
    { orgId: 'org-a', featureCode: 'rcm_dashboard', state: 'active', source: 'preview' },
    { orgId: 'org-a', featureCode: 'rcm_dashboard', state: 'platinum', source: 'stripe' },
    null,
    { data: { orgId: 'org-a', featureCode: 'dirt_workspace', state: 'active', source: 'stripe', currentPeriodEnd: '2026-12-01T00:00:00Z' } },
  ];
  assert.deepEqual(parseGrants(rows, 'org-a'), [{ featureCode: 'dirt_workspace', state: 'active', expiresAt: '2026-12-01T00:00:00Z' }]);
});

test('no feature endpoint accepts client plan state; checkout redirect still cannot grant', () => {
  const feature = readFileSync('src/app/api/v1/orgs/[orgId]/features/[feature]/route.ts', 'utf8');
  assert.doesNotMatch(feature, /searchParams|request\.json|headers\.get\((?!'cookie')/);
  assert.match(feature, /402/);
});
