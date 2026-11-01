import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getFeatureFlags } from '../src/lib/flags.ts';

test('safe seed has no patient identifiers', () => {
  const source = fs.readFileSync('data/seed/organizations.example.json', 'utf8');
  assert.ok(source.includes('fictional'));
  assert.ok(!source.includes('patient_dob'));
});

test('feature flags default deny and ignore liveClaims env', () => {
  delete process.env.ROOT_ENABLE_AUTH;
  delete process.env.ROOT_ENABLE_CRM;
  delete process.env.ROOT_ENABLE_PAYMENTS;
  delete process.env.ROOT_ENABLE_PROSPECTING;
  process.env.ROOT_ENABLE_LIVE_CLAIMS = 'true';
  const flags = getFeatureFlags();
  assert.equal(flags.auth, false);
  assert.equal(flags.crm, false);
  assert.equal(flags.billing, false);
  assert.equal(flags.prospecting, false);
  assert.equal(flags.liveClaims, false);
});
