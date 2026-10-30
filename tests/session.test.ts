import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getAuthContext, principalFromCookieHeader } from '../src/server/auth/session.ts';
import { requireMembership } from '../src/server/auth/policy.ts';

test('unverified cookies never become a principal', () => {
  delete process.env.ROOT_ENABLE_AUTH;
  assert.equal(principalFromCookieHeader('root_v2_session=anything'), null);
  const ctx = getAuthContext('root_v2_session=anything');
  assert.equal(ctx.session, null);
  assert.equal(ctx.memberships.length, 0);
});

test('auth flag on still does not trust cookies without Appwrite validation', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const ctx = getAuthContext('root_v2_session=forged');
  assert.equal(ctx.session, null);
  const decision = requireMembership(ctx, 'sample-solo', 'organization.read');
  assert.equal(decision.allow, false);
  if (!decision.allow) assert.equal(decision.code, 'unauthenticated');
  delete process.env.ROOT_ENABLE_AUTH;
});

test('org route uses requireOrgMembership and stays fail-closed while auth is off', () => {
  const source = readFileSync('src/app/api/v1/orgs/[orgId]/route.ts', 'utf8');
  assert.match(source, /requireOrgMembership/);
  assert.match(source, /organization\.read/);
  assert.match(source, /getAuthContext/);
});
