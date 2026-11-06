import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSignupProfile, normalizePhone, type SignupProfile } from '../src/server/signup/profile.ts';
import { provisionFreeWorkspace, workspaceIds } from '../src/server/signup/provision.ts';
import { MemoryRowWriter, provisionConfig, signupProvisioningEnabled } from '../src/server/signup/row-store.ts';
import { handleWorkspaceProvision, resetSignupRateLimit } from '../src/server/signup/http.ts';
import { canonicalMemberships } from '../src/server/auth/session.ts';
import { requireMembership, type AuthContext } from '../src/server/auth/policy.ts';
import { catalogEntitlementsForOffer } from '../src/domain/catalog-entitlement.ts';

const input = { firstName: 'Dana', lastName: 'Reyes', phone: '(555) 010-2030', practiceName: 'Reyes Family Medicine', specialty: 'Family medicine', practiceSize: '2-5', termsAccepted: true };
const profile = (extra: Partial<SignupProfile> = {}): SignupProfile => ({ ...(validateSignupProfile(input) as { ok: true; data: SignupProfile }).data, ...extra });
const user: AuthContext = { session: { userId: 'u-100', email: 'Dana@Clinic.example' }, memberships: [] };
const NOW = Date.parse('2026-11-06T12:00:00Z');
const WRITES = 6; // organization, company, contact, terms consent, audit, membership (marketing opt-out)

beforeEach(() => resetSignupRateLimit());

test('profile: required fields, optional specialty/size, separate optional marketing consent', () => {
  const ok = validateSignupProfile(input);
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.data.phone, '5550102030');
    assert.equal(ok.data.marketingConsent, false, 'marketing is never implied by terms');
  }
  const min = validateSignupProfile({ firstName: 'A', lastName: 'B', phone: '+1 555 010 2030', practiceName: 'AB', termsAccepted: true });
  assert.equal(min.ok && min.data.phone, '+15550102030');
  const bad = validateSignupProfile({ firstName: '', lastName: '<b>', phone: '12', practiceName: 'x', specialty: 'patient list', practiceSize: 'huge', marketingConsent: 'yes' });
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.deepEqual(Object.keys(bad.errors).sort(), ['firstName', 'lastName', 'marketingConsent', 'phone', 'practiceName', 'practiceSize', 'specialty', 'terms']);
  assert.equal(normalizePhone('abc'), null);
});

test('provisions org, company, contact, terms consent, audit and CLIENT_OWNER membership (no marketing row by default)', async () => {
  const w = new MemoryRowWriter();
  const r = await provisionFreeWorkspace(user, profile(), w, NOW);
  const id = workspaceIds('u-100');
  assert.deepEqual(r, { ok: true, orgId: id.orgId, created: true });
  for (const t of ['organizations', 'crm_companies', 'crm_contacts', 'audit_events', 'memberships']) assert.equal(w.all(t).length, 1, t);
  assert.deepEqual(w.all('consent_records').map((c) => c.consentType), ['account_terms']);
  assert.equal(w.all('crm_contacts')[0].emailNormalized, 'dana@clinic.example');
  assert.equal(w.all('organizations')[0].ownerUserId, 'u-100');
});

test('marketing consent is a separate row only when the user opts in', async () => {
  const w = new MemoryRowWriter();
  await provisionFreeWorkspace(user, profile({ marketingConsent: true }), w, NOW);
  assert.deepEqual(w.all('consent_records').map((c) => c.consentType).sort(), ['account_terms', 'marketing_email']);
});

test('the written membership is accepted by the real session parser and PDP; free plan only', async () => {
  const w = new MemoryRowWriter();
  await provisionFreeWorkspace(user, profile(), w, NOW);
  const memberships = canonicalMemberships(w.all('memberships'), 'u-100');
  assert.deepEqual(memberships, [{ orgId: workspaceIds('u-100').orgId, role: 'CLIENT_OWNER' }]);
  process.env.ROOT_ENABLE_AUTH = 'true';
  const ctx: AuthContext = { session: user.session, memberships };
  assert.equal(requireMembership(ctx, memberships[0].orgId, 'organization.write').allow, true);
  assert.equal(requireMembership(ctx, 'someone-else-org', 'organization.read').allow, false);
  assert.deepEqual([...catalogEntitlementsForOffer('free-account-consultation')], ['basic_workspace', 'consultation'], 'free plan is basic + consultation only');
  assert.equal(w.all('entitlements').length, 0);
});

test('idempotent: repeat for an already-provisioned user creates nothing and reports created:false', async () => {
  const w = new MemoryRowWriter();
  await provisionFreeWorkspace(user, profile(), w, NOW);
  const size = w.rows.size;
  const again = { ...user, memberships: [{ orgId: workspaceIds('u-100').orgId, role: 'CLIENT_OWNER' as const }] };
  assert.deepEqual(await provisionFreeWorkspace(again, profile(), w, NOW), { ok: true, orgId: workspaceIds('u-100').orgId, created: false });
  assert.equal(w.rows.size, size);
});

test('partial failure at every step: 503, no membership yet, retry repairs and then succeeds', async () => {
  for (let failAt = 1; failAt <= WRITES; failAt++) {
    const w = new MemoryRowWriter();
    w.failOnCalls = new Set([failAt]);
    assert.deepEqual(await provisionFreeWorkspace(user, profile(), w, NOW), { ok: false, reason: 'store_unavailable' }, `step ${failAt}`);
    if (failAt <= WRITES) assert.equal(w.all('memberships').length, 0, 'membership is written last');
    w.failOnCalls = new Set();
    const retry = await provisionFreeWorkspace(user, profile(), w, NOW);
    assert.equal(retry.ok, true);
    for (const t of ['organizations', 'crm_companies', 'crm_contacts', 'consent_records', 'audit_events', 'memberships']) assert.equal(w.all(t).length, 1, `${t} after step ${failAt}`);
  }
});

test('users with another org membership, or no session, are refused and nothing is written', async () => {
  const w = new MemoryRowWriter();
  const staff: AuthContext = { ...user, memberships: [{ orgId: 'root_internal', role: 'ROOT_SPECIALIST' }] };
  assert.deepEqual(await provisionFreeWorkspace(staff, profile(), w, NOW), { ok: false, reason: 'existing_membership' });
  assert.deepEqual(await provisionFreeWorkspace({ session: null, memberships: [] }, profile(), w, NOW), { ok: false, reason: 'unauthenticated' });
  assert.equal(w.rows.size, 0);
});

test('two users get separate tenants even with the same practice name', async () => {
  const w = new MemoryRowWriter();
  const other: AuthContext = { session: { userId: 'u-200', email: 'x@y.example' }, memberships: [] };
  await provisionFreeWorkspace(user, profile(), w, NOW);
  await provisionFreeWorkspace(other, profile(), w, NOW);
  assert.equal(w.all('organizations').length, 2);
  assert.notEqual(workspaceIds('u-100').orgId, workspaceIds('u-200').orgId);
});

test('activation needs the flag, live auth and a dedicated provisioning key', () => {
  const base = { APPWRITE_AUTH_PROJECT_ID: '6ae878f400268114a480', APPWRITE_DATABASE_ID: 'root_v2_core', ROOT_ENABLE_LIVE_AUTH: 'true', ROOT_ENABLE_SIGNUP_PROVISIONING: 'true' };
  assert.equal(signupProvisioningEnabled({ ...base } as NodeJS.ProcessEnv), false);
  assert.equal(signupProvisioningEnabled({ ...base, APPWRITE_AUTH_API_KEY: 'auth' } as NodeJS.ProcessEnv), false, 'auth key never reused');
  assert.equal(signupProvisioningEnabled({ ...base, APPWRITE_PROVISION_API_KEY: 'k' } as NodeJS.ProcessEnv), true);
  assert.equal(signupProvisioningEnabled({ ...base, APPWRITE_PROVISION_API_KEY: 'k', ROOT_ENABLE_SIGNUP_PROVISIONING: '1' } as NodeJS.ProcessEnv), false);
  assert.equal(provisionConfig({} as NodeJS.ProcessEnv), null);
});

test('http: off by default; origin, media type, size and unverified/unauthenticated callers are rejected', async () => {
  const req = (body: string, headers: Record<string, string> = {}) =>
    new Request('https://rootrcm.com/api/v1/account/workspace', { method: 'POST', body, headers: { origin: 'https://rootrcm.com', 'content-type': 'application/json', ...headers } });
  const saved = { ...process.env };
  try {
    delete process.env.ROOT_ENABLE_SIGNUP_PROVISIONING;
    assert.equal((await handleWorkspaceProvision(req(JSON.stringify(input)), new MemoryRowWriter())).status, 503);
    Object.assign(process.env, { APPWRITE_AUTH_PROJECT_ID: '6ae878f400268114a480', APPWRITE_DATABASE_ID: 'root_v2_core', ROOT_ENABLE_LIVE_AUTH: 'true',
      ROOT_ENABLE_SIGNUP_PROVISIONING: 'true', APPWRITE_PROVISION_API_KEY: 'k', ROOT_AUTH_ORIGIN: 'https://rootrcm.com' });
    const w = new MemoryRowWriter();
    assert.equal((await handleWorkspaceProvision(req(JSON.stringify(input), { origin: 'https://evil.example' }), w)).status, 403);
    assert.equal((await handleWorkspaceProvision(req('x', { 'content-type': 'text/plain' }), w)).status, 415);
    assert.equal((await handleWorkspaceProvision(req('x'.repeat(5000)), w)).status, 413);
    assert.equal((await handleWorkspaceProvision(req('{bad'), w)).status, 400);
    assert.equal((await handleWorkspaceProvision(req(JSON.stringify(input)), w)).status, 401, 'no verified session');
    assert.equal(w.rows.size, 0);
  } finally {
    for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
    Object.assign(process.env, saved);
  }
});

test('route takes no user, org or role from the request', () => {
  const src = readFileSync('src/server/signup/http.ts', 'utf8') + readFileSync('src/server/signup/provision.ts', 'utf8');
  assert.doesNotMatch(src, /body\.(userId|orgId|role)|searchParams|params\./);
  assert.match(readFileSync('src/app/api/v1/account/workspace/route.ts', 'utf8'), /handleWorkspaceProvision/);
});

test('membership lookup failure is not "no memberships": nothing is written', async () => {
  const w = new MemoryRowWriter();
  const unknown: AuthContext = { ...user, membershipsUnavailable: true };
  assert.deepEqual(await provisionFreeWorkspace(unknown, profile(), w, NOW), { ok: false, reason: 'store_unavailable' });
  assert.equal(w.rows.size, 0);
  const session = readFileSync('src/server/auth/session.ts', 'utf8');
  assert.equal((session.match(/membershipsUnavailable: true/g) ?? []).length, 2, 'both lookup failure paths flag the context');
});

test('a revoked/inactive existing membership is denied, never reported as provisioned', async () => {
  const w = new MemoryRowWriter();
  await provisionFreeWorkspace(user, profile(), w, NOW);
  // Revoked: the row still exists but canonicalMemberships excludes it, so the caller has none.
  const key = [...w.rows.keys()].find((k) => k.startsWith('memberships/'))!;
  w.rows.set(key, { ...w.rows.get(key)!, status: 'revoked' });
  assert.deepEqual(canonicalMemberships(w.all('memberships'), 'u-100'), []);
  assert.deepEqual(await provisionFreeWorkspace(user, profile(), w, NOW), { ok: false, reason: 'membership_inactive' });
});

test('http: oversized streamed body is cancelled at the limit, before auth or allocation of the full body', async () => {
  const saved = { ...process.env };
  try {
    Object.assign(process.env, { APPWRITE_AUTH_PROJECT_ID: '6ae878f400268114a480', APPWRITE_DATABASE_ID: 'root_v2_core', ROOT_ENABLE_LIVE_AUTH: 'true',
      ROOT_ENABLE_SIGNUP_PROVISIONING: 'true', APPWRITE_PROVISION_API_KEY: 'k', ROOT_AUTH_ORIGIN: 'https://rootrcm.com' });
    let pulled = 0;
    const chunk = new Uint8Array(1024).fill(120);
    const stream = new ReadableStream<Uint8Array>({ pull(c) { pulled += 1; if (pulled > 1000) c.close(); else c.enqueue(chunk); } });
    const request = new Request('https://rootrcm.com/api/v1/account/workspace', {
      method: 'POST', body: stream, duplex: 'half', headers: { origin: 'https://rootrcm.com', 'content-type': 'application/json' },
    } as RequestInit);
    assert.equal((await handleWorkspaceProvision(request, new MemoryRowWriter())).status, 413);
    assert.ok(pulled < 20, `stream consumed ${pulled} KB`);
  } finally {
    for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
    Object.assign(process.env, saved);
  }
});
