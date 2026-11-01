import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateStatusFreshness, isExternallyVerified } from '../src/domain/workflow-status.ts';

const base = {
  orgId: 'demo-org', resourceId: 'demo-status', status: 'payer_review',
  origin: 'synthetic', sourceReference: null, verifiedAt: null,
  synchronizedAt: null, ownerId: null, nextAction: null, version: 1,
};

test('synthetic UI fixtures cannot be reported as externally verified or live', () => {
  assert.equal(isExternallyVerified(base), false);
  assert.equal(evaluateStatusFreshness(base, Date.now(), 1000), 'demo');
});

test('external status needs both evidence reference and verified timestamp', () => {
  assert.equal(isExternallyVerified({ ...base, origin: 'api_verified' }), false);
  assert.equal(isExternallyVerified({
    ...base, origin: 'payer_portal_verified', sourceReference: 'portal-ref', verifiedAt: '2026-10-30T10:00:00Z',
  }), true);
});

test('outdated payer evidence stays visible but is not presented as current', () => {
  const verified = {
    ...base, origin: 'staff_verified', sourceReference: 'verified-note',
    verifiedAt: '2026-10-30T10:00:00Z',
  };
  assert.equal(evaluateStatusFreshness(verified, Date.parse('2026-10-30T10:05:00Z'), 10 * 60000), 'current_snapshot');
  assert.equal(evaluateStatusFreshness(verified, Date.parse('2026-10-30T11:00:00Z'), 10 * 60000), 'stale_snapshot');
  assert.equal(evaluateStatusFreshness(verified, Date.parse('2026-10-30T09:59:00Z'), 10 * 60000), 'unverified');
});
