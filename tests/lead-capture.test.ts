import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { captureLead, resetLeadRateLimit, HONEYPOT_FIELD } from '../src/server/leads/capture.ts';
import { MemoryLeadStore } from '../src/server/leads/lead-store.ts';
import { drainOutbox, nextDelayMs, MAX_JOB_ATTEMPTS, LEASE_MS } from '../src/server/leads/outbox-worker.ts';
import { leadCaptureEnabled, leadActivationBlockers, leadStoreConfig } from '../src/server/leads/lead-config.ts';
import { contractViolations, LEAD_SCHEMA } from '../src/server/leads/lead-schema.ts';
import { handlePublicInquiry } from '../src/server/leads/inquiry-http.ts';

const good = { name: 'Dana Reyes', email: 'dana@clinic.example', organization: 'Reyes Family Medicine', message: 'Interested in AR review.', consent: true };
const NOW = Date.parse('2026-11-06T12:00:00Z');
const meta = (extra: object = {}) => ({ ip: '203.0.113.9', locale: 'en' as const, correlationId: 'c1', now: NOW, salt: 'test-salt-test-salt', ...extra });
const CHAIN_WRITES = 7;

beforeEach(() => resetLeadRateLimit());

test('capture writes every record using only live-schema columns (contract enforced)', async () => {
  const store = new MemoryLeadStore(); // enforceContract = true: unsupported/missing columns throw
  assert.deepEqual(await captureLead(good, store, meta()), { ok: true, accepted: true, duplicate: false });
  for (const [table, count] of [['crm_companies', 1], ['crm_contacts', 1], ['consent_records', 1], ['crm_sync_jobs', 2], ['audit_events', 1], ['lead_submissions', 1]] as const) {
    assert.equal(store.all(table).length, count, table);
  }
  const lead = store.all('lead_submissions')[0];
  assert.equal(lead.status, 'new');
  assert.equal(lead.consentGiven, true);
  const consent = store.all('consent_records')[0];
  assert.equal(consent.consentType, 'service_contact'); // never marketing
  assert.equal(consent.granted, true);
  const contact = store.all('crm_contacts')[0];
  assert.equal(contact.emailNormalized, 'dana@clinic.example');
  assert.equal(contact.firstName, 'Dana');
  assert.equal(contact.lastName, 'Reyes');
});

test('no free text, raw ip or PHI-prone content is persisted anywhere', async () => {
  const store = new MemoryLeadStore();
  await captureLead({ ...good, message: 'please call about billing' }, store, meta());
  const dump = JSON.stringify([...store.rows.values()]);
  assert.equal(dump.includes('please call about billing'), false);
  assert.equal(dump.includes('203.0.113.9'), false);
});

test('schema contract: rejects unsupported and missing columns, lists the live required set', () => {
  assert.deepEqual(contractViolations('lead_submissions', { name: 'x' }).sort(),
    ['missing:capturedAt', 'missing:dedupKey', 'missing:idempotencyKey', 'missing:source', 'missing:status', 'unsupported:name']);
  assert.ok(contractViolations('consent_records', { subjectEmail: 'a', purpose: 'b' }).some((v) => v.startsWith('unsupported:')));
  assert.ok(contractViolations('crm_sync_jobs', { leadId: 'a', target: 'hubspot', lastError: 'x' }).includes('unsupported:lastError'));
  assert.ok(contractViolations('audit_events', { resourceId: 'a', correlationId: 'b', at: 'c' }).includes('unsupported:at'));
  assert.deepEqual(LEAD_SCHEMA.crm_companies.required, ['name', 'lifecycleStage', 'status']);
});

test('same-day duplicate is acknowledged identically and creates nothing new', async () => {
  const store = new MemoryLeadStore();
  await captureLead(good, store, meta());
  resetLeadRateLimit();
  const before = store.rows.size;
  assert.deepEqual(await captureLead({ ...good, email: 'DANA@clinic.example' }, store, meta()), { ok: true, accepted: true, duplicate: true });
  assert.equal(store.rows.size, before);
});

test('same person on a later day keeps one contact/company and adds a new lead', async () => {
  const store = new MemoryLeadStore();
  await captureLead(good, store, meta());
  await captureLead(good, store, meta({ now: NOW + 86_400_000 }));
  assert.equal(store.all('crm_contacts').length, 1);
  assert.equal(store.all('crm_companies').length, 1);
  assert.equal(store.all('lead_submissions').length, 2);
});

test('partial-write failure at EVERY step returns 503, then a retry repairs the chain before 202', async () => {
  for (let failAt = 1; failAt <= CHAIN_WRITES; failAt++) {
    resetLeadRateLimit();
    const store = new MemoryLeadStore();
    store.failOnCalls = new Set([failAt]);
    const first = await captureLead(good, store, meta());
    assert.deepEqual(first, { ok: false, reason: 'store_unavailable' }, `step ${failAt}`);
    assert.equal(store.all('lead_submissions').length, 0, 'lead is written last, never alone');
    store.failOnCalls = new Set();
    const retry = await captureLead(good, store, meta());
    assert.equal(retry.ok, true, `retry after step ${failAt}`);
    assert.equal(store.all('crm_companies').length, 1);
    assert.equal(store.all('crm_contacts').length, 1);
    assert.equal(store.all('consent_records').length, 1);
    assert.equal(store.all('crm_sync_jobs').length, 2);
    assert.equal(store.all('audit_events').length, 1);
    assert.equal(store.all('lead_submissions').length, 1);
  }
});

test('a dependent missing behind an existing lead is never accepted as complete', async () => {
  const store = new MemoryLeadStore();
  await captureLead(good, store, meta());
  for (const key of [...store.rows.keys()].filter((k) => k.startsWith('consent_records/'))) store.rows.delete(key);
  resetLeadRateLimit();
  assert.equal((await captureLead(good, store, meta())).ok, true);
  assert.equal(store.all('consent_records').length, 1, 'consent repaired on retry');
});

test('validation, missing consent and PHI hints are rejected without writes', async () => {
  const store = new MemoryLeadStore();
  for (const bad of [{ ...good, consent: false }, { ...good, email: 'nope' }, { ...good, message: 'patient SSN 123' }]) {
    const r = await captureLead(bad, store, meta());
    assert.equal((r as { reason: string }).reason, 'validation');
  }
  assert.equal(store.rows.size, 0);
});

test('honeypot is dropped silently with no write', async () => {
  const store = new MemoryLeadStore();
  assert.equal((await captureLead({ ...good, [HONEYPOT_FIELD]: 'http://spam' }, store, meta())).ok, true);
  assert.equal(store.rows.size, 0);
});

test('per-email rate limit applies (backstop)', async () => {
  const store = new MemoryLeadStore();
  let limited = 0;
  for (let i = 0; i < 5; i++) {
    const r = await captureLead({ ...good, organization: `Org ${i} Clinic` }, store, meta());
    if (!r.ok && r.reason === 'rate_limited') limited++;
  }
  assert.equal(limited, 2);
});

test('outbox: skipped without transport, backoff retry, dead letter, delivery, uses provider/localId/lastErrorCode', async () => {
  const store = new MemoryLeadStore();
  await captureLead(good, store, meta());
  assert.deepEqual(await drainOutbox(store, {}, { now: NOW }), { delivered: 0, retried: 0, dead: 0, skipped: 2, contended: 0 });
  assert.ok(store.all('crm_sync_jobs').every((j) => j.attempts === 0 && j.status === 'pending'));

  const seen: string[] = [];
  const failing = { hubspot: async (j: { localId: string; idempotencyKey: string }) => { seen.push(`${j.localId}|${j.idempotencyKey}`); return { ok: false as const, error: 'http_503' }; } };
  let t = NOW;
  assert.equal((await drainOutbox(store, failing, { now: t })).retried, 1);
  assert.match(seen[0], /^ct_[a-f0-9]{32}\|jb_hs_/);
  const hs = () => store.all('crm_sync_jobs').find((j) => j.provider === 'hubspot')!;
  assert.equal(hs().status, 'retry');
  assert.equal(hs().lastErrorCode, 'http_503');
  assert.equal((await drainOutbox(store, failing, { now: t })).retried, 0); // not due yet
  for (let i = 1; i < MAX_JOB_ATTEMPTS - 1; i++) { t += nextDelayMs(i) + 1; await drainOutbox(store, failing, { now: t }); }
  t += nextDelayMs(MAX_JOB_ATTEMPTS - 1) + 1;
  assert.equal((await drainOutbox(store, failing, { now: t })).dead, 1);
  assert.equal(hs().status, 'dead');
  assert.equal(hs().attempts, MAX_JOB_ATTEMPTS);

  const ok = { internal: async () => ({ ok: true as const }) };
  assert.equal((await drainOutbox(store, ok, { now: t })).delivered, 1);
});

test('outbox concurrency: two workers never both deliver one job; crashed lease is recovered', async () => {
  const store = new MemoryLeadStore();
  await captureLead(good, store, meta());
  let sends = 0;
  const slow = { hubspot: async () => { sends++; await new Promise((r) => setTimeout(r, 5)); return { ok: true as const }; } };
  const [a, b] = await Promise.all([drainOutbox(store, slow, { now: NOW }), drainOutbox(store, slow, { now: NOW })]);
  assert.equal(sends, 1);
  assert.equal(a.delivered + b.delivered, 1);
  assert.equal(a.contended + b.contended, 1);

  // Worker crashes mid-flight: job left 'processing' with a lease; not due until it expires.
  const store2 = new MemoryLeadStore();
  resetLeadRateLimit();
  await captureLead(good, store2, meta());
  const crash = { hubspot: async () => { throw new Error('boom'); } };
  await drainOutbox(store2, crash, { now: NOW });
  const jobs = () => store2.all('crm_sync_jobs').find((j) => j.provider === 'hubspot')!;
  jobs().status = 'processing'; jobs().nextAttemptAt = new Date(NOW + LEASE_MS).toISOString();
  assert.equal((await drainOutbox(store2, { hubspot: async () => ({ ok: true as const }) }, { now: NOW + 1000 })).delivered, 0);
  assert.equal((await drainOutbox(store2, { hubspot: async () => ({ ok: true as const }) }, { now: NOW + LEASE_MS + 1 })).delivered, 1);
});

test('activation needs store key, salt, shared rate limit and origin; all else stays off', () => {
  const full = { APPWRITE_AUTH_PROJECT_ID: '6ae878f400268114a480', APPWRITE_DATABASE_ID: 'root_v2_core', APPWRITE_LEADS_API_KEY: 'k',
    ROOT_LEAD_HASH_SALT: 'a-long-enough-salt-value', ROOT_LEAD_SHARED_RATE_LIMIT: 'true', ROOT_AUTH_ORIGIN: 'https://rootrcm.com', ROOT_ENABLE_LEAD_CAPTURE: 'true' };
  const env = (o: object) => ({ ...full, ...o }) as NodeJS.ProcessEnv;
  assert.equal(leadCaptureEnabled({} as NodeJS.ProcessEnv), false);
  assert.equal(leadCaptureEnabled(env({})), true);
  assert.deepEqual(leadActivationBlockers(env({ ROOT_LEAD_HASH_SALT: 'short' })), ['hash_salt']);
  assert.deepEqual(leadActivationBlockers(env({ ROOT_LEAD_SHARED_RATE_LIMIT: undefined })), ['shared_rate_limit']);
  assert.deepEqual(leadActivationBlockers(env({ APPWRITE_LEADS_API_KEY: undefined, APPWRITE_AUTH_API_KEY: 'auth-key' })), ['store_config']);
  assert.equal(leadCaptureEnabled(env({ ROOT_ENABLE_LEAD_CAPTURE: '1' })), false);
  assert.equal(leadStoreConfig({} as NodeJS.ProcessEnv), null);
});

test('http handler enforces origin, media type, size and returns 202 only after the full chain', async () => {
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
  store.failOnCalls = new Set([store.calls + 3]);
  assert.equal((await post(JSON.stringify(good))).status, 503);
  assert.equal(store.all('lead_submissions').length, 0);
  resetLeadRateLimit();
  const ok = await post(JSON.stringify(good));
  assert.equal(ok.status, 202);
  assert.equal(store.all('lead_submissions').length, 1);
});

test('route stays fail-closed by default and capture never calls a CRM inline', () => {
  assert.match(readFileSync('src/app/api/v1/public/inquiries/route.ts', 'utf8'), /leadCaptureEnabled\(\)\) return publicInquiryUnavailableResponse/);
  assert.doesNotMatch(readFileSync('src/server/leads/capture.ts', 'utf8'), /hubspot\/|fetch\(/);
});
