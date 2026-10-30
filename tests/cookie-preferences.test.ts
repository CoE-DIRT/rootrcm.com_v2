import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acceptAllPreferences,
  coerceCookiePreferences,
  isAnalyticsRuntimeEnabled,
  isMarketingRuntimeEnabled,
  necessaryOnlyPreferences,
} from '../src/domain/cookie-preferences.ts';

test('cookie preferences default deny optional categories and keep necessary on', () => {
  const necessary = necessaryOnlyPreferences('2026-10-31T00:00:00.000Z');
  assert.equal(necessary.necessary, true);
  assert.equal(necessary.analytics, false);
  assert.equal(necessary.marketing, false);
  const allowed = acceptAllPreferences('2026-10-31T00:00:00.000Z');
  assert.equal(allowed.analytics, true);
  assert.equal(allowed.marketing, true);
  assert.equal(allowed.necessary, true);
});

test('invalid or version-mismatched cookie preference payloads fail closed', () => {
  assert.equal(coerceCookiePreferences(null), null);
  assert.equal(coerceCookiePreferences({ v: 2, decidedAt: '2026-10-31T00:00:00.000Z' }), null);
  assert.equal(coerceCookiePreferences({ v: 1, analytics: true, marketing: true }), null);
  const coerced = coerceCookiePreferences({
    v: 1,
    necessary: false,
    analytics: 'yes',
    marketing: true,
    decidedAt: '2026-10-31T00:00:00.000Z',
  });
  assert.equal(coerced?.necessary, true);
  assert.equal(coerced?.analytics, false);
  assert.equal(coerced?.marketing, true);
});

test('stored allow cannot enable analytics or marketing runtimes', () => {
  const allowed = acceptAllPreferences();
  assert.equal(isAnalyticsRuntimeEnabled(allowed), false);
  assert.equal(isMarketingRuntimeEnabled(allowed), false);
});
