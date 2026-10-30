import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const publicPages = [
  'why-root',
  'services',
  'solutions',
  'technology',
  'plans',
  'resources',
  'company',
  'consultation',
  'account',
  'diagnostic',
  'custom',
  'custom-rcm',
  'sign-in',
  'privacy',
  'terms',
  'cookies',
];

test('approved public routes exist for locale IA', () => {
  for (const route of publicPages) {
    const file = path.join('src', 'app', '[locale]', route, 'page.tsx');
    assert.ok(fs.existsSync(file), `missing ${file}`);
  }
});

test('one price catalog defines the diagnostic fee once', () => {
  const catalog = fs.readFileSync('src/content/catalog.ts', 'utf8');
  assert.equal(catalog.match(/id: '/g)?.length, 6);
  assert.match(catalog, /id: 'revenue-diagnostic'/);
  assert.match(catalog, /\$2,500/);
});

test('integrations remain typed disabled adapters', () => {
  const adapter = fs.readFileSync('src/integrations/disabled.ts', 'utf8');
  assert.match(adapter, /status: 'disabled'/);
  const inquiry = fs.readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8');
  assert.match(adapter, /hubspotAdapter/);
  // Delivery is disabled: the route must not claim to store or forward leads.
  assert.match(inquiry, /inquiry_submission_unavailable/);
  assert.ok(inquiry.includes('status: 503'));
  assert.doesNotMatch(inquiry, /received_local_only/);
});

test('business contact validation rejects PHI hints', () => {
  const src = fs.readFileSync('src/lib/validation/business-contact.ts', 'utf8');
  assert.match(src, /patient\|ssn/);
  assert.match(src, /consent/);
});

test('browser checkout cannot grant entitlement', () => {
  const src = fs.readFileSync('src/domain/entitlement.ts', 'utf8');
  assert.match(src, /mayActivateFromBrowserRedirect/);
  assert.match(src, /return false/);
});
