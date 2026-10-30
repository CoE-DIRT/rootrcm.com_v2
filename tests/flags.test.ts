import test from 'node:test';
import assert from 'node:assert/strict';
import { getFeatureFlags } from '../src/lib/flags.ts';

test('only the string true enables a flag', () => {
  process.env.ROOT_ENABLE_AUTH = 'true';
  process.env.ROOT_ENABLE_CRM = '1';
  process.env.ROOT_ENABLE_PAYMENTS = 'yes';
  process.env.ROOT_ENABLE_PROSPECTING = '';
  const flags = getFeatureFlags();
  assert.equal(flags.auth, true);
  assert.equal(flags.crm, false);
  assert.equal(flags.billing, false);
  assert.equal(flags.prospecting, false);
  delete process.env.ROOT_ENABLE_AUTH;
  assert.equal(getFeatureFlags().auth, false);
});
