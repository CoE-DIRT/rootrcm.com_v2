import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const api = readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8');
const gate = readFileSync('src/server/leads/inquiry.ts', 'utf8');
const form = readFileSync('src/components/forms/business-inquiry-form.tsx', 'utf8');
const messages = readFileSync('src/content/messages.ts', 'utf8');
const inquiry = api + gate;

// Until a real, approved durable delivery adapter exists, a successful receipt
// would misrepresent the processing of potentially sensitive business contacts.
test('disabled public inquiry endpoint fails closed without consuming contact data', () => {
  assert.match(inquiry, /status:\s*503/);
  assert.match(inquiry, /inquiry_submission_unavailable/);
  assert.match(inquiry, /Cache-Control/);
  assert.doesNotMatch(api, /request\.json\(/);
  assert.doesNotMatch(inquiry, /received_local_only/);
  assert.doesNotMatch(api, /from ['"][^'"]*outbox/);
});

test('client cannot submit or claim success without durable acceptance', () => {
  assert.match(form, /const inquirySubmissionEnabled = false/);
  assert.match(form, /disabled=\{!inquirySubmissionEnabled\}/);
  assert.match(form, /accepted_persisted/);
  assert.match(form, /catch\s*\{/);
});

test('English and Spanish clearly disclose that inquiries are not being sent', () => {
  assert.match(messages, /Online inquiries are not active yet/);
  assert.match(messages, /Las consultas en línea aún no están activas/);
  assert.doesNotMatch(messages, /Inquiry stored locally as a receipt/);
});
