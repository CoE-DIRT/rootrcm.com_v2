import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { captureLead, resetLeadRateLimit, HONEYPOT_FIELD } from '../src/server/leads/capture.ts';
import { MemoryLeadStore } from '../src/server/leads/lead-store.ts';
import { drainOutbox, nextDelayMs, MAX_JOB_ATTEMPTS } from '../src/server/leads/outbox-worker.ts';
import { leadCaptureEnabled, leadStoreConfig } from '../src/server/leads/lead-config.ts';
import { handlePublicInquiry } from '../src/server/leads/inquiry-http.ts';

const good = { name: 'Dana Reyes', email: 'dana@clinic.example', organization: 'Reyes Family Medicine', message: 'Interested in AR review.', consent: true };
const meta = (extra: object = {}) => ({ ip: '203.0.113.9', locale: 'en' as const, correlationId: 'c1', now: Date.parse('2026-11-06T12:00:00Z'), ...extra });

beforeEach(() => resetLeadRateLimit());

test('capture persists lead, consent proof, two outbox jobs and audit', async () => {
  const store = new MemoryLeadStore();
  const result = await captureLead(good, store, meta());
  assert.deepEqual(result, { ok: true, accepted: true, duplicate: false });
  assert.equal(store.all('lead_submissions').length, 1);
  assert.equal(store.all('consent_records').length, 1);
  assert.equal(store.all('crm_sync_jobs').length, 2);
  assert.equal(store.all('audit_events').length, 1);
  const lead = store.all('lead_submissions')[0];
  assert.equal(lead.status, 'new');
  assert.equal(lead.consentVersion, 'business-inquiry.v1');
  assert.notEqual(lead.ipHash, '203.0.113.9');
});

test('same-day duplicate is acknowledged identically and creates nothing new', async () => {
  const store = new MemoryLeadStore();
  await captureLead(good, store, meta());
  resetLeadRateLimit();
  const again = await captureLead({ ...good, email: 'DANA@clinic.example' }, store, meta());
  assert.deepEqual(again, { ok: true, accepted: true, duplicate: true });
  assert.equal(store.all('lead_submissions').length, 1);
  assert.equal(store.all('crm_sync_jobs').length, 2);
});

test('validation, missing consent and PHI hints are rejected without writes', async () => {
  const store = new MemoryLeadStore();
  for (const bad of [{ ...good, consent: false }, { ...good, email: 'nope' }, { ...good, message: 'patient SSN 123' }]) {
    const r = await captureLead(bad, store, meta());
    assert.equal(r.ok, false);
    assert.equal((r as { reason: string }).reason, 'validation');
  }
  assert.equal(store.rows.size, 0);
});

test('honeypot is dropped silently with no write', async () => {
  const store = new MemoryLeadStore();
  const r = await captureLead({ ...good, [HONEYPOT_FIELD]: 'http://spam' }, store, meta());
  assert.equal(r.ok, true);
  assert.equal(store.rows.size, 0);
});

test('per-email and per-ip rate limits apply', async () => {
  const store = new MemoryLeadStore();
  let limited = 0;
  for (let i = 0; i < 5; i++) {
    const r = await captureLead({ ...good, organization: `Org ${i} Clinic` }, store, meta());
    if (!r.ok && r.reason === 'rate_limited') limited++;
  }
  assert.equal(limited, 2); // 3 per email per window
});

test('store failure never reports success', async () => {
  const store = new MemoryLeadStore();
  store.failNext = true;
  const r = await captureLead(good, store, meta());
  assert.deepEqual(r, { ok: false, reason: 'store_unavailable' });
});

test('outbox: skipped without transport, retried with backoff, dead after max attempts, delivered on success', async () => {
  const store = new MemoryLeadStore();
  await captureLead(good, store, meta());
  const now = Date.parse('2026-11-06T12:00:00Z');
  assert.deepEqual(await drainOutbox(store, {}, { now }), { delivered: 0, retried: 0, dead: 0, skipped: 2 });
  assert.ok(store.all('crm_sync_jobs').every((j) => j.attempts === 0 && j.status === 'pending'));

  const failing = { hubspot: async () => ({ ok: false as const, error: 'http_503' }) };
  let t = now;
  assert.deepEqual(await drainOutbox(store, failing, { now: t }), { delivered: 0, retried: 1, dead: 0, skipped: 1 });
  assert.deepEqual(await drainOutbox(store, failing, { now: t }), { delivered: 0, retried: 0, dead: 0, skipped: 1 }); // not due yet
  for (let i = 2; i < MAX_JOB_ATTEMPTS; i++) {
    t += nextDelayMs(i) + 1;
    await drainOutbox(store, failing, { now: t });
  }
  t += nextDelayMs(MAX_JOB_ATTEMPTS) + 1;
  const last = await drainOutbox(store, failing, { now: t });
  assert.equal(last.dead, 1);

  const ok = { notify: async () => ({ ok: true as const }) };
  assert.equal((await drainOutbox(store, ok, { now: t })).delivered, 1);
});

test('capture is off by default and needs a dedicated key', () => {
  assert.equal(leadCaptureEnabled({} as NodeJS.ProcessEnv), false);
  const base = { APPWRITE_AUTH_PROJECT_ID: '6ae878f400268114a480', APPWRITE_DATABASE_ID: 'root_v2_core' };
  assert.equal(leadCaptureEnabled({ ...base, ROOT_ENABLE_LEAD_CAPTURE: 'true' } as NodeJS.ProcessEnv), false);
  assert.equal(leadCaptureEnabled({ ...base, APPWRITE_AUTH_API_KEY: 'auth-key', ROOT_ENABLE_LEAD_CAPTURE: 'true' } as NodeJS.ProcessEnv), false);
  assert.equal(leadCaptureEnabled({ ...base, APPWRITE_LEADS_API_KEY: 'k', ROOT_ENABLE_LEAD_CAPTURE: 'true' } as NodeJS.ProcessEnv), true);
  assert.equal(leadCaptureEnabled({ ...base, APPWRITE_LEADS_API_KEY: 'k', ROOT_ENABLE_LEAD_CAPTURE: '1' } as NodeJS.ProcessEnv), false);
  assert.equal(leadStoreConfig({} as NodeJS.ProcessEnv), null);
});

test('http handler enforces origin, media type, size and returns 202 only after write', async () => {
  process.env.ROOT_AUTH_ORIGIN = 'https://rootrcm.com';
  const store = new MemoryLeadStore();
  const post = (body: string, headers: Record<string, string> = {}) =>
    handlePublicInquiry(new Request('https://rootrcm.com/api/v1/public/inquiries', {
      method: 'POST', body, headers: { origin: 'https://rootrcm.com', 'content-type': 'application/json', ...headers },
    }), store);
  assert.equal((await post(JSON.stringify(good), { origin: 'https://evil.example' })).status, 403);
  assert.equal((await post(JSON.stringify(good), { 'content-type': 'text/plain' })).status, 415);
  assert.equal((await post('{bad')).status, 400);
  assert.equal((await post('x'.repeat(9000))).status, 413);
  assert.equal((await post(JSON.stringify({ ...good, consent: false }))).status, 422);
  const ok = await post(JSON.stringify(good));
  assert.equal(ok.status, 202);
  assert.equal((await ok.json()).data.status, 'accepted_persisted');
  assert.equal(store.all('lead_submissions').length, 1);
});

test('route stays fail-closed by default and never calls a CRM inline', () => {
  const route = readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8');
  assert.match(route, /leadCaptureEnabled\(\)\) return publicInquiryUnavailableResponse/);
  const capture = readFileSync('src/server/leads/capture.ts', 'utf8');
  assert.doesNotMatch(capture, /hubspot\/|fetch\(/);
});
