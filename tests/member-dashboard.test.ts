import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { AuthContext } from '../src/server/auth/policy.ts';
import {
  authorizeMemberDashboard,
  buildMemberSample,
  defaultMemberDashboard,
  isMemberDashboardKind,
} from '../src/server/operations/member-dashboard.ts';

const session = { userId: 'user-a', email: 'a@example.invalid' };
const ctxOf = (...memberships: AuthContext['memberships']): AuthContext => ({ session, memberships });
const client = ctxOf({ orgId: 'org-a', role: 'CLIENT_OWNER' });
const specialist = ctxOf({ orgId: 'org-root', role: 'ROOT_SPECIALIST' });
const admin = ctxOf({ orgId: 'org-root', role: 'ROOT_SUPERADMIN' });

beforeEach(() => { process.env.ROOT_ENABLE_AUTH = 'true'; });
afterEach(() => { delete process.env.ROOT_ENABLE_AUTH; });

test('denied when auth flag is off or no session (fail closed)', () => {
  delete process.env.ROOT_ENABLE_AUTH;
  const off = authorizeMemberDashboard(client, 'client');
  assert.equal(off.allow, false);
  if (!off.allow) assert.equal(off.decision.code, 'auth_disabled');
  process.env.ROOT_ENABLE_AUTH = 'true';
  const anon = authorizeMemberDashboard({ session: null, memberships: [] }, 'client', 'org-a');
  assert.equal(anon.allow, false);
  if (!anon.allow) assert.equal(anon.decision.code, 'unauthenticated');
});

test('role-matched entry: client, staff and admin land on their own dashboard', () => {
  assert.equal(defaultMemberDashboard(client)?.kind, 'client');
  assert.equal(defaultMemberDashboard(specialist)?.kind, 'staff');
  assert.equal(defaultMemberDashboard(admin)?.kind, 'admin');
  assert.equal(defaultMemberDashboard(ctxOf({ orgId: 'x', role: 'GUEST' })), null);
  assert.equal(defaultMemberDashboard(ctxOf()), null);
});

test('roles cannot reach a higher dashboard kind', () => {
  assert.equal(authorizeMemberDashboard(client, 'admin').allow, false);
  assert.equal(authorizeMemberDashboard(client, 'staff').allow, false);
  assert.equal(authorizeMemberDashboard(specialist, 'admin').allow, false);
  assert.equal(authorizeMemberDashboard(specialist, 'staff').allow, true);
  assert.equal(authorizeMemberDashboard(ctxOf({ orgId: 'o', role: 'AUDITOR_READ_ONLY' }), 'staff').allow, false);
});

test('tenant isolation: client-supplied orgId must be an own membership, even for admins', () => {
  assert.equal(authorizeMemberDashboard(client, 'client', 'org-b').allow, false);
  const cross = authorizeMemberDashboard(admin, 'admin', 'org-victim');
  assert.equal(cross.allow, false);
  if (!cross.allow) assert.equal(cross.decision.code, 'not_a_member');
  const own = authorizeMemberDashboard(admin, 'admin', 'org-root');
  assert.equal(own.allow && own.membership.orgId, 'org-root');
  // A client membership in org-a does not grant client access to a differently-roled org.
  const mixed = ctxOf({ orgId: 'org-a', role: 'CLIENT_OWNER' }, { orgId: 'org-b', role: 'GUEST' });
  assert.equal(authorizeMemberDashboard(mixed, 'client', 'org-b').allow, false);
  assert.equal(authorizeMemberDashboard(mixed, 'client').allow, true);
});

test('kind is validated', () => {
  assert.equal(isMemberDashboardKind('client'), true);
  assert.equal(isMemberDashboardKind('owner'), false);
  assert.equal(isMemberDashboardKind(undefined), false);
});

test('sample is synthetic-labeled, read-only and never carries the caller org as data', () => {
  const access = authorizeMemberDashboard(client, 'client', 'org-a');
  assert.ok(access.allow);
  const view = buildMemberSample(access);
  assert.equal(view.sample, true);
  assert.equal(view.readOnly, true);
  assert.equal(view.origin, 'synthetic');
  assert.equal(view.member.orgId, 'org-a');
  assert.ok(view.claims.length > 0 && view.credentialingApplications.length > 0);
  assert.ok(view.claims.every(row => row.orgId === view.orgId));
  assert.notEqual(view.orgId, 'org-a');
  // Client sample must not expose other fixture orgs.
  assert.deepEqual(view.organizations.map(o => o.id), [view.orgId]);
});

test('each call returns an independent fixture (no shared mutable state)', () => {
  const access = authorizeMemberDashboard(client, 'client');
  assert.ok(access.allow);
  const a = buildMemberSample(access);
  a.claims.length = 0;
  assert.ok(buildMemberSample(access).claims.length > 0);
});

test('staff and admin samples are synthetic multi-practice fixtures', () => {
  const access = authorizeMemberDashboard(admin, 'admin');
  assert.ok(access.allow);
  const view = buildMemberSample(access);
  assert.equal(view.persona, 'staff');
  assert.equal(view.origin, 'synthetic');
});

test('boundary: member surface never touches the preview-cookie ops API', () => {
  for (const file of [
    'src/app/api/v1/dashboard/state/route.ts',
    'src/server/operations/member-dashboard.ts',
    'src/app/[locale]/dashboard/[kind]/page.tsx',
    'src/app/[locale]/dashboard/page.tsx',
  ]) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /readOpsSessionFromRequest|authorizeOpsPreview|applyOpsCookies|PreviewSessionBinder|preview-bind|root_ops_/, file);
  }
  const route = readFileSync('src/app/api/v1/dashboard/state/route.ts', 'utf8');
  assert.match(route, /getAuthContext/);
  assert.match(route, /authorizeMemberDashboard/);
  // Real-session hook mode is read-only and never posts actions.
  const hook = readFileSync('src/components/operations/use-ops-state.ts', 'utf8');
  assert.match(hook, /if \(memberKind\) throw/);
});
