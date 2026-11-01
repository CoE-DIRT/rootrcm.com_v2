import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('safe seed has no patient identifiers', () => {
  const s = fs.readFileSync('data/seed/organizations.example.json', 'utf8');
  assert.ok(s.includes('fictional'));
  assert.ok(!s.includes('patient_dob'));
});

test('Appwrite and billing integrations are disabled in foundation', () => {
  const flags = fs.readFileSync('src/lib/flags.ts', 'utf8');
  assert.match(flags, /liveClaims: false/);
  assert.match(flags, /value === 'true'/);
  assert.match(flags, /ROOT_ENABLE_AUTH/);
  assert.match(flags, /ROOT_ENABLE_PAYMENTS/);
});
