import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBusinessContact } from '../src/lib/validation/business-contact.ts';

test('accepts a consented business contact', () => {
  const result = validateBusinessContact({
    name: 'Jordan Lee',
    email: 'jordan@example.invalid',
    organization: 'Cedar Grove Family Practice',
    message: 'Need help scoping A/R follow-up.',
    consent: true,
  });
  assert.equal(result.ok, true);
});

test('rejects missing consent and PHI-like free text', () => {
  const noConsent = validateBusinessContact({
    name: 'Jordan Lee',
    email: 'jordan@example.invalid',
    organization: 'Cedar Grove Family Practice',
    consent: false,
  });
  assert.equal(noConsent.ok, false);

  const phi = validateBusinessContact({
    name: 'Jordan Lee',
    email: 'jordan@example.invalid',
    organization: 'Cedar Grove Family Practice',
    message: 'Patient DOB is 1/1/1980 and MRN 123',
    consent: true,
  });
  assert.equal(phi.ok, false);
  if (!phi.ok) assert.ok(phi.fieldErrors.message);
});
