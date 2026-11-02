import test from 'node:test';
import assert from 'node:assert/strict';
import { canAdvanceCredentialingStatus } from '../src/domain/operations/types.ts';
import { reset } from '../src/domain/operations/transitions.ts';
import {
  mergeCookiePreferences,
  necessaryOnlyPreferences,
  persistCookieRecord,
} from '../src/domain/cookie-preferences.ts';
import { publicStatusMessage } from '../src/lib/public-status.ts';
import {
  MAX_DEMO_SESSIONS,
  MemoryDemoSessionStore,
} from '../src/server/operations/persistence.ts';
import {
  capabilityFromPath,
  shouldReplacePreviewCapability,
} from '../src/server/operations/session.ts';
import { principalFromCookieHeader } from '../src/server/auth/session.ts';

const copy = {
  inquiryUnavailable: 'inquiry-es',
  checkoutUnavailable: 'checkout-es',
  generic: 'generic-es',
};

test('shared preview routes do not mint or downgrade an operator cookie', () => {
  assert.equal(capabilityFromPath('/en/preview/staff'), 'operator');
  assert.equal(capabilityFromPath('/es/preview/client'), 'client');
  assert.equal(capabilityFromPath('/en/preview/client/requests'), 'client');
  assert.equal(capabilityFromPath('/en/preview/credentialing'), null);
  assert.equal(capabilityFromPath('/en/preview/sales'), null);
  assert.equal(shouldReplacePreviewCapability('operator', 'client'), false);
  assert.equal(shouldReplacePreviewCapability('client', 'operator'), true);
  assert.equal(principalFromCookieHeader('root_ops_cap=operator.deadbeef; root_ops_sid=abc'), null);
});

test('terminal credentialing statuses cannot advance', () => {
  assert.equal(canAdvanceCredentialingStatus('payer_review'), true);
  assert.equal(canAdvanceCredentialingStatus('effective'), false);
  assert.equal(canAdvanceCredentialingStatus('rejected'), false);
  assert.equal(canAdvanceCredentialingStatus('withdrawn'), false);
  assert.equal(canAdvanceCredentialingStatus('false'), false);
});

test('demo session memory is capped and drops the soonest expiry', () => {
  const store = new MemoryDemoSessionStore();
  const snapshot = reset();
  for (let index = 0; index < MAX_DEMO_SESSIONS; index += 1) {
    store.save({
      sessionId: `session-${index}`,
      snapshot,
      expiresAt: Date.now() + 60_000 + index,
      actionTimes: [],
    });
  }
  store.save({
    sessionId: 'session-new',
    snapshot,
    expiresAt: Date.now() + 120_000,
    actionTimes: [],
  });
  assert.equal(store.load('session-0'), null);
  assert.ok(store.load('session-new'));
  assert.ok(store.load(`session-${MAX_DEMO_SESSIONS - 1}`));
});

test('cookie edits keep the other choice and survive a storage failure', () => {
  const current = { ...necessaryOnlyPreferences('2026-11-01T00:00:00.000Z'), marketing: true };
  const next = mergeCookiePreferences(current, { analytics: true }, '2026-11-01T01:00:00.000Z');
  assert.equal(next.analytics, true);
  assert.equal(next.marketing, true);
  assert.equal(mergeCookiePreferences(current, { analytics: false }).analytics, false);
  const thrown = persistCookieRecord(
    {
      getItem: () => null,
      setItem: () => {
        throw new Error('storage disabled');
      },
    },
    next,
  );
  assert.equal(thrown, 'memory');
});

test('inquiry and checkout errors map to caller-supplied copy', () => {
  assert.equal(publicStatusMessage('inquiry_submission_unavailable', copy), 'inquiry-es');
  assert.equal(publicStatusMessage('checkout_unavailable', copy), 'checkout-es');
  assert.equal(publicStatusMessage('other', copy), 'generic-es');
  assert.equal(publicStatusMessage(undefined, copy), 'generic-es');
});
