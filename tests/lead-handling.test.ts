import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  assembleBusinessLead,
  businessLeadPayloadHash,
  createLeadDedupKey,
  isDurableInquiryDeliveryEnabled,
  mayPersistPublicInquiry,
} from '../src/domain/lead-handling.ts';

const contact = {
  name: 'Jordan Lee',
  email: 'jordan@example.invalid',
  organization: 'Cedar Grove Family Practice',
  message: 'Need help scoping A/R follow-up.',
  consent: true,
};

test('consented business lead receives dedup key, ownership and unavailable delivery', () => {
  const result = assembleBusinessLead(contact, 'corr-lead-1');
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.delivery, 'unavailable');
  assert.equal(result.lead.consent, true);
  assert.equal(result.lead.consentVersion, 'business-inquiry.v1');
  assert.equal(result.lead.dedupKey, createLeadDedupKey(contact.email, contact.organization));
  assert.equal(result.lead.ownership.team, 'unassigned');
  assert.equal(result.lead.ownership.assigneeId, null);
  assert.equal(result.lead.ownership.sourceOfTruth, 'hubspot');
  assert.equal(result.lead.delivery, 'unavailable');
  assert.equal(result.lead.correlationId, 'corr-lead-1');
});

test('dedup keys are case-insensitive and collapse organization whitespace', () => {
  const left = createLeadDedupKey('Jordan@Example.invalid', 'Cedar Grove   Family Practice');
  const right = createLeadDedupKey('jordan@example.invalid', 'cedar grove family practice');
  assert.equal(left, right);
  assert.match(left, /^lead_v1:jordan@example\.invalid\|cedar grove family practice$/);
});

test('PHI-like free text and missing consent are rejected before assembly', () => {
  const phi = assembleBusinessLead({
    ...contact,
    message: 'Patient DOB is 1/1/1980 and MRN 123',
  });
  assert.equal(phi.ok, false);
  if (!phi.ok) {
    assert.equal(phi.reason, 'validation');
    assert.equal(phi.fieldErrors.message, 'phiRejected');
  }

  const noConsent = assembleBusinessLead({ ...contact, consent: false });
  assert.equal(noConsent.ok, false);
});

test('public inquiry delivery stays fail-closed', () => {
  assert.equal(isDurableInquiryDeliveryEnabled(), false);
  assert.equal(mayPersistPublicInquiry(), false);

  const route = readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8');
  const gate = readFileSync('src/server/leads/inquiry.ts', 'utf8');
  assert.match(route, /publicInquiryUnavailableResponse/);
  assert.match(route + gate, /status:\s*503/);
  assert.doesNotMatch(route, /request\.json\(/);
  assert.doesNotMatch(route, /MemoryInquiryOutbox/);
  assert.doesNotMatch(route, /enqueueSuppressedBusinessContact/);
  assert.doesNotMatch(route, /from ['"][^'"]*outbox/);
});

test('lead payload hash is digest-only and never stores contact fields', () => {
  const result = assembleBusinessLead(contact, 'corr-lead-hash');
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const hash = businessLeadPayloadHash(result.lead);
  assert.match(hash, /^sha256:[a-f0-9]{64}$/);
  assert.equal(hash.includes(contact.email), false);
  assert.equal(hash.includes(contact.name), false);
  assert.equal(hash.includes(contact.organization), false);
  assert.equal(result.lead.delivery, 'unavailable');
});
