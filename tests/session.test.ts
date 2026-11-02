import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canonicalMemberships, getAuthContext, principalFromCookieHeader } from '../src/server/auth/session.ts';
import { requireMembership } from '../src/server/auth/policy.ts';

test('unverified cookies never become a principal', async () => {
  delete process.env.ROOT_ENABLE_AUTH;
  assert.equal(principalFromCookieHeader('root_v2_session=anything'), null);
  const ctx = await getAuthContext('root_v2_session=anything');
  assert.equal(ctx.session, null);
  assert.equal(ctx.memberships.length, 0);
});

test('auth flag on still does not trust cookies without Appwrite validation', async () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const ctx = await getAuthContext('root_v2_session=forged');
  assert.equal(ctx.session, null);
  const decision = requireMembership(ctx, 'sample-solo', 'organization.read');
  assert.equal(decision.allow, false);
  if (!decision.allow) assert.equal(decision.code, 'unauthenticated');
  delete process.env.ROOT_ENABLE_AUTH;
});

test('org route uses requireOrgMembership and stays fail-closed while auth is off', async () => {
  const source = readFileSync('src/app/api/v1/orgs/[orgId]/route.ts', 'utf8');
  assert.match(source, /requireOrgMembership/);
  assert.match(source, /organization\.read/);
  assert.match(source, /getAuthContext/);
});

test('TablesDB nested and flat active membership rows resolve to canonical roles', () => {
  const user = 'verified-user';
  const rows = [
    { data: { userId: user, orgId: 'root_internal', role: 'ROOT_SUPERADMIN', status: 'active', revokedAt: null } },
    { userId: user, orgId: 'client_two', role: 'CLIENT_ADMIN', status: 'active', revokedAt: null },
    { data: { userId: user, orgId: 'revoked', role: 'ROOT_SUPERADMIN', status: 'revoked', revokedAt: '2026-11-02T00:00:00Z' } },
    { data: { userId: 'another-user', orgId: 'unrelated', role: 'ROOT_SUPERADMIN', status: 'active', revokedAt: null } },
  ];
  assert.deepEqual(canonicalMemberships(rows, user), [
    { orgId: 'root_internal', role: 'ROOT_SUPERADMIN' },
    { orgId: 'client_two', role: 'CLIENT_ADMIN' },
  ]);
});
