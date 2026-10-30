import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('src/content/operations-demo.ts', 'utf8');
const commandCenter = fs.readFileSync('src/components/app-shell/operations-command-center.tsx', 'utf8');
const client = fs.readFileSync('src/app/[locale]/preview/client/page.tsx', 'utf8');
const credentialing = fs.readFileSync('src/app/[locale]/preview/credentialing/page.tsx', 'utf8');

test('command center covers the full practice to payment cycle', () => {
  for (const step of ['Scheduling', 'Eligibility', 'Authorization', 'Charge & coding',
    'Claim submission', 'Payer processing', 'Remittance', 'Denials & appeals', 'A/R follow-up']) {
    assert.ok(source.includes(step), `Missing operational stage: ${step}`);
  }
});

test('credentialing is tracked by individual provider-payer application and six milestones', () => {
  for (const key of ['caqh', 'primary_source', 'payer_submission', 'payer_review', 'effective']) {
    assert.ok(source.includes(key));
  }
  assert.match(source, /organizationId: 'demo-bayview'/);
  assert.match(source, /sourceReference: null, verifiedAt: null, effectiveDate: null/);
  assert.match(commandCenter, /CredentialTimeline/);
  assert.match(commandCenter, /nextAction\[locale\]/);
  assert.match(commandCenter, /owner\[locale\]/);
});

test('no mock credentialing or claim row is presented as externally verified', () => {
  assert.match(source, /source: 'synthetic'/);
  assert.match(source, /No live EHR, payer, patient or credentialing feeds/);
  assert.doesNotMatch(source, /status: 'live'/);
  assert.match(commandCenter, /t\.disclaimer/);
  assert.match(commandCenter, /t\.liveState/);
});

test('client, credentialing and staff previews preserve existing shells and integrate dashboard', () => {
  assert.match(client, /OperationsCommandCenter/);
  assert.match(credentialing, /OperationsCommandCenter/);
  assert.match(credentialing, /initialTab="credentialing"/);
  assert.match(fs.readFileSync('src/app/[locale]/preview/staff/page.tsx','utf8'), /OperationsCommandCenter/);
  assert.match(client, /clientQueue\.map/);
});
