import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildAppealLetter,
  filterDenialsByTab,
  loadPortalDenials,
} from '../src/features/portal/denials/load-denials.ts';
import { HIGH_PRIORITY_USD } from '../src/features/portal/denials/types.ts';
import { loadPortalPriorAuth } from '../src/features/portal/prior-auth/load-prior-auth.ts';
import { loadPortalAuditLog } from '../src/features/portal/settings/load-audit-log.ts';

const PHI_PATTERNS = [/ssn/i, /date of birth/i, /dob\b/i, /\b\d{3}-\d{2}-\d{4}\b/];

function assertNoPhi(text: string) {
  for (const pattern of PHI_PATTERNS) {
    assert.equal(pattern.test(text), false, `Unexpected PHI-like pattern ${pattern} in: ${text.slice(0, 120)}`);
  }
}

test('portal denial seed uses synthetic claim and REF-* only', () => {
  const rows = loadPortalDenials();
  assert.ok(rows.length >= 4);
  for (const row of rows) {
    assert.match(row.claimId, /^CLM-SYN-/);
    assert.match(row.patientRef, /^REF-\d+$/);
    assertNoPhi(JSON.stringify(row));
  }
});

test('denial tabs filter active, appeal, resolved, and high-dollar rows', () => {
  const rows = loadPortalDenials();
  const active = filterDenialsByTab(rows, 'all');
  const appeal = filterDenialsByTab(rows, 'appeal');
  const resolved = filterDenialsByTab(rows, 'resolved');
  const high = filterDenialsByTab(rows, 'high');

  assert.ok(active.every((row) => row.queueState === 'active' || row.queueState === 'appeal'));
  assert.ok(appeal.every((row) => row.queueState === 'appeal'));
  assert.ok(resolved.every((row) => row.queueState === 'resolved'));
  assert.ok(high.every((row) => row.amountUsd > HIGH_PRIORITY_USD));
  assert.ok(high.length >= 1);
});

test('appeal letter is formal CMS-1500/UB-04 style and fail-closed', () => {
  const row = loadPortalDenials()[0];
  assert.ok(row);
  const letter = buildAppealLetter(row, 'en');
  assert.match(letter, /FORMAL APPEAL LETTER/);
  assert.match(letter, new RegExp(row.formType));
  assert.match(letter, /Modifier|Coding citation/i);
  assert.match(letter, /clearinghouse adapter stays disabled/i);
  assert.match(letter, new RegExp(row.patientRef));
  assert.doesNotMatch(letter, /SSN|date of birth/i);
});

test('prior auth tracker seed includes REF-8491 and SLA statuses', () => {
  const rows = loadPortalPriorAuth();
  assert.ok(rows.some((row) => row.patientRef === 'REF-8491'));
  const statuses = new Set(rows.map((row) => row.status));
  assert.ok(statuses.has('approved'));
  assert.ok(statuses.has('payer_review'));
  assert.ok(statuses.has('peer_to_peer'));
  assert.ok(statuses.has('additional_docs'));
  assert.ok(rows.some((row) => /Urgent: 24h/i.test(row.slaRemaining.en)));
  assert.ok(rows.some((row) => /Elective: 5 business days/i.test(row.slaLabel.en)));
  for (const row of rows) {
    assert.match(row.patientRef, /^REF-\d+$/);
    assertNoPhi(JSON.stringify(row));
  }
});

test('RBAC audit log includes required synthetic events', () => {
  const events = loadPortalAuditLog();
  const summaries = events.map((event) => event.summary.en);
  assert.ok(summaries.some((text) => /835 ERA posted/i.test(text)));
  assert.ok(summaries.some((text) => /Prior auth approved by BCBS/i.test(text)));
  assert.ok(summaries.some((text) => /Licensure renewal tracked/i.test(text)));
});

test('portal seed fixtures exist under data/seed', () => {
  const files = [
    'portal-denials.example.json',
    'portal-prior-auth.example.json',
    'portal-audit-log.example.json',
  ];
  for (const file of files) {
    const full = path.join('data', 'seed', file);
    assert.ok(fs.existsSync(full), `missing ${full}`);
    const raw = fs.readFileSync(full, 'utf8');
    assert.ok(raw.includes('Synthetic') || raw.includes('synthetic'));
    assertNoPhi(raw);
  }
});
