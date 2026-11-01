import test from 'node:test';
import assert from 'node:assert/strict';
import { requireEntitlement, requireMembership } from '../src/server/auth/policy.ts';
import type { AuthContext } from '../src/server/auth/policy.ts';
import { requireOrgMembership } from '../src/server/auth/membership.ts';

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

test('two-tenant: ROOT_SUPERADMIN still cannot read an org they are not a member of', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const superadmin: AuthContext = {
    session: { userId: 'user-root', email: 'superadmin@example.invalid' },
    memberships: [{ orgId: 'sample-solo', role: 'ROOT_SUPERADMIN' }],
  };
  const own = requireMembership(superadmin, 'sample-solo', 'root_admin.manage');
  const cross = requireMembership(superadmin, 'sample-group', 'organization.read');
  assert.equal(own.allow, true);
  assert.equal(cross.allow, false);
  if (!cross.allow) assert.equal(cross.code, 'not_a_member');
  delete process.env.ROOT_ENABLE_AUTH;
});

test('org membership helper is the same PDP as requireMembership', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const viaHelper = requireOrgMembership(cedar, 'sample-group', 'organization.read');
  const viaPolicy = requireMembership(cedar, 'sample-group', 'organization.read');
  assert.equal(viaHelper.allow, false);
  assert.equal(viaPolicy.allow, false);
  if (!viaHelper.allow && !viaPolicy.allow) {
    assert.equal(viaHelper.code, viaPolicy.code);
    assert.equal(viaHelper.code, 'not_a_member');
  }
  delete process.env.ROOT_ENABLE_AUTH;
});

test('entitlement cannot bypass tenant membership or browser-style missing grants', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  const activeOnA = requireEntitlement(cedar, 'sample-solo', 'billing.read', {
    orgId: 'sample-solo',
    featureCode: 'dashboard',
    state: 'active',
  });
  const missingGrant = requireEntitlement(cedar, 'sample-solo', 'billing.read', null);
  const otherOrgGrant = requireEntitlement(cedar, 'sample-solo', 'billing.read', {
    orgId: 'sample-group',
    featureCode: 'dashboard',
    state: 'active',
  });
  const crossTenant = requireEntitlement(cedar, 'sample-group', 'billing.read', {
    orgId: 'sample-group',
    featureCode: 'dashboard',
    state: 'active',
  });
  assert.equal(activeOnA.allow, true);
  assert.equal(missingGrant.allow, false);
  if (!missingGrant.allow) assert.equal(missingGrant.code, 'entitlement_inactive');
  assert.equal(otherOrgGrant.allow, false);
  if (!otherOrgGrant.allow) assert.equal(otherOrgGrant.code, 'entitlement_inactive');
  assert.equal(crossTenant.allow, false);
  if (!crossTenant.allow) assert.equal(crossTenant.code, 'not_a_member');
  delete process.env.ROOT_ENABLE_AUTH;
});
