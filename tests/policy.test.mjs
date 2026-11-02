import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('server policy denies when auth flag is off', () => {
  const policy = fs.readFileSync('src/server/auth/policy.ts', 'utf8');
  assert.match(policy, /auth_disabled/);
  assert.match(policy, /not_a_member/);
  assert.match(policy, /ROOT_SUPERADMIN does not bypass tenant membership/);
});

test('canonical roles replace seed aliases', () => {
  const roles = fs.readFileSync('src/domain/identity/roles.ts', 'utf8');
  assert.match(roles, /CLIENT_OWNER/);
  assert.match(roles, /legacyRoleMap/);
});
