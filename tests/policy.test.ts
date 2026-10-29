import test from 'node:test';
import assert from 'node:assert/strict';
import { requireMembership } from '../src/server/auth/policy.ts';
import type { AuthContext } from '../src/server/auth/policy.ts';

const cedar: AuthContext = {
  session: { userId: 'user-a', email: 'owner@example.invalid' },
  memberships: [{ orgId: 'sample-solo', role: 'CLIENT_OWNER' }],
};

const bayviewStaff: AuthContext = {
  session: { userId: 'user-b', email: 'specialist@example.invalid' },
  memberships: [{ orgId: 'sample-group', role: 'ROOT_SPECIALIST' }],
};

test('PDP denies privileged reads while Auth flag is off', () => {
  delete process.env.ROOT_ENABLE_AUTH;
  const decision = requireMembership(cedar, 'sample-solo', 'organization.read');
  assert.equal(decision.allow, false);
  if (!decision.allow) assert.equal(decision.code, 'auth_disabled');
});

test('two-tenant: owner of A cannot read org B', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const own = requireMembership(cedar, 'sample-solo', 'organization.read');
  const cross = requireMembership(cedar, 'sample-group', 'organization.read');
  assert.equal(own.allow, true);
  assert.equal(cross.allow, false);
  if (!cross.allow) assert.equal(cross.code, 'not_a_member');
});

test('two-tenant: specialist on B cannot write org A even as ROOT staff', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const assigned = requireMembership(bayviewStaff, 'sample-group', 'assigned_work.read');
  const escalation = requireMembership(bayviewStaff, 'sample-solo', 'organization.write');
  assert.equal(assigned.allow, true);
  assert.equal(escalation.allow, false);
});

test('auditor cannot invite members', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const auditor: AuthContext = {
    session: { userId: 'auditor', email: 'audit@example.invalid' },
    memberships: [{ orgId: 'sample-group', role: 'AUDITOR_READ_ONLY' }],
  };
  const read = requireMembership(auditor, 'sample-group', 'organization.read');
  const invite = requireMembership(auditor, 'sample-group', 'members.invite');
  assert.equal(read.allow, true);
  assert.equal(invite.allow, false);
  if (!invite.allow) assert.equal(invite.code, 'forbidden');
  delete process.env.ROOT_ENABLE_AUTH;
});
