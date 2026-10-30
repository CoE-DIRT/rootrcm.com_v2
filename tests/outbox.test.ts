import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MemoryInquiryOutbox } from '../src/integrations/outbox/memory.ts';
import { enqueueSuppressedBusinessContact } from '../src/integrations/outbox/suppressed.ts';

test('memory outbox stores a suppressed record and is unused by the public inquiry route', async () => {
  const outbox = new MemoryInquiryOutbox();
  const record = await outbox.enqueue({
    topic: 'inquiry.business_contact',
    payloadHash: 'sha256:synthetic',
  });
  assert.equal(record.status, 'suppressed');
  assert.equal(outbox.records.length, 1);

  const suppressed = await enqueueSuppressedBusinessContact(outbox, 'sha256:synthetic-hash-only');
  assert.equal(suppressed.status, 'suppressed');
  assert.equal(suppressed.delivered, false);
  assert.equal(suppressed.claimedSent, false);
  assert.equal(suppressed.payloadHash.includes('@'), false);

  const route = readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8');
  const gate = readFileSync('src/server/leads/inquiry.ts', 'utf8');
  assert.match(route + gate, /status:\s*503/);
  assert.doesNotMatch(route, /from ['"][^'"]*outbox/);
  assert.doesNotMatch(route, /MemoryInquiryOutbox/);
  assert.doesNotMatch(route, /enqueueSuppressedBusinessContact/);
  assert.doesNotMatch(route, /request\.json\(/);
});
