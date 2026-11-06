import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { enabledOAuthProviders, handleOAuthCallback, handleOAuthStart, OAUTH_NONCE_COOKIE } from '../src/server/auth/oauth.ts';

const ENV = {
  ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', ROOT_AUTH_ENVIRONMENT: 'production',
  APPWRITE_AUTH_PROJECT_ID: '6ae878f400268114a480', APPWRITE_DATABASE_ID: 'root_v2_core',
  ROOT_AUTH_ORIGIN: 'https://rootrcm.com', APPWRITE_AUTH_API_KEY: 'test-key', ROOT_OAUTH_GOOGLE: 'true',
};
const saved = { ...process.env };
const realFetch = globalThis.fetch;
let calls: Array<{ url: string; method: string; headers: Record<string, string>; body?: string }> = [];

function stubAppwrite(user: { status: boolean; emailVerification: boolean } = { status: true, emailVerification: true }, tokenOk = true) {
  calls = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, method: init?.method ?? 'GET', headers: (init?.headers ?? {}) as Record<string, string>, body: init?.body as string | undefined });
    if (url.endsWith('/account/sessions/token')) {
      return tokenOk
        ? new Response(JSON.stringify({ secret: 'sess-secret-123', expire: '2027-01-01T00:00:00Z' }), { status: 201 })
        : new Response('{}', { status: 401 });
    }
    if (url.endsWith('/account')) return new Response(JSON.stringify(user), { status: 200 });
    return new Response(null, { status: 204 });
  }) as typeof fetch;
}

beforeEach(() => {
  Object.assign(process.env, ENV);
  delete process.env.ROOT_OAUTH_MICROSOFT;
});
afterEach(() => {
  globalThis.fetch = realFetch;
  for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
  Object.assign(process.env, saved);
});

const start = (qs: string) => handleOAuthStart(new Request(`https://rootrcm.com/api/v1/auth/oauth/start?${qs}`));
const nonceOf = (res: Response) => /root_oauth_n=([^;]+)/.exec(res.headers.get('set-cookie') ?? '')?.[1] ?? '';
const callback = (qs: string, cookie?: string) =>
  handleOAuthCallback(new Request(`https://rootrcm.com/api/v1/auth/oauth/callback?${qs}`, { headers: cookie ? { cookie } : {} }));

test('providers are hidden until live auth AND the provider flag are both on', () => {
  assert.deepEqual(enabledOAuthProviders(process.env), ['google']);
  process.env.ROOT_OAUTH_MICROSOFT = 'true';
  assert.deepEqual(enabledOAuthProviders(process.env), ['google', 'microsoft']);
  process.env.ROOT_ENABLE_LIVE_AUTH = 'false';
  assert.deepEqual(enabledOAuthProviders(process.env), []);
  delete process.env.ROOT_OAUTH_GOOGLE;
  process.env.ROOT_ENABLE_LIVE_AUTH = 'true';
  assert.deepEqual(enabledOAuthProviders(process.env), ['microsoft']);
});

test('start: 404 for disabled/unknown providers; redirects to the Appwrite token flow with a nonce cookie otherwise', () => {
  assert.equal(start('provider=microsoft&locale=en').status, 404);
  assert.equal(start('provider=github&locale=en').status, 404);
  const res = start('provider=google&locale=es');
  assert.equal(res.status, 303);
  const target = new URL(res.headers.get('location')!);
  assert.equal(target.origin + target.pathname, 'https://nyc.cloud.appwrite.io/v1/account/tokens/oauth2/google');
  assert.equal(target.searchParams.get('project'), '6ae878f400268114a480');
  const success = new URL(target.searchParams.get('success')!);
  assert.equal(success.origin + success.pathname, 'https://rootrcm.com/api/v1/auth/oauth/callback');
  assert.equal(success.searchParams.get('locale'), 'es');
  assert.equal(success.searchParams.get('n'), nonceOf(res));
  assert.equal(target.searchParams.get('failure'), 'https://rootrcm.com/es/login?error=oauth_failed');
  const cookie = res.headers.get('set-cookie')!;
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=lax/i);
  assert.match(cookie, /Secure/i);
});

test('callback: valid token becomes a server-side session, HttpOnly strict cookie, redirect to /dashboard (EN and ES)', async () => {
  for (const locale of ['en', 'es']) {
    stubAppwrite();
    const n = nonceOf(start(`provider=google&locale=${locale}`));
    const res = await callback(`p=google&locale=${locale}&n=${n}&userId=user_1&secret=tok_abc`, `${OAUTH_NONCE_COOKIE}=${n}`);
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), `https://rootrcm.com/${locale}/dashboard`);
    const cookies = res.headers.getSetCookie().join('\n');
    assert.match(cookies, /root_v2_auth=sess-secret-123[^\n]*HttpOnly/i);
    assert.match(cookies, /root_v2_auth=[^\n]*SameSite=strict/i);
    assert.match(cookies, /root_oauth_n=;/);
    const exchange = calls.find((c) => c.url.endsWith('/account/sessions/token'))!;
    assert.equal(JSON.parse(exchange.body!).userId, 'user_1');
    assert.equal(exchange.headers['X-Appwrite-Key'], 'test-key', 'exchange happens server-side with the server key');
    assert.equal(res.headers.get('location')!.includes('secret'), false, 'no token ever reaches the browser URL');
  }
});

test('callback: login-CSRF defence - missing, wrong or malformed nonce never exchanges the token', async () => {
  stubAppwrite();
  const n = nonceOf(start('provider=google&locale=en'));
  const other = nonceOf(start('provider=google&locale=en'));
  const cases: Array<[string, string | undefined]> = [
    [n, undefined],
    [n, `${OAUTH_NONCE_COOKIE}=${other}`],
    ['short', `${OAUTH_NONCE_COOKIE}=short`],
    ['', undefined],
    [n, `${OAUTH_NONCE_COOKIE}=${n}; ${OAUTH_NONCE_COOKIE}=${n}`],
  ];
  for (const [qn, cookie] of cases) {
    const res = await callback(`p=google&locale=en&n=${qn}&userId=attacker&secret=tok`, cookie);
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), 'https://rootrcm.com/en/login?error=oauth_failed');
    assert.equal(res.headers.getSetCookie().some((c) => c.startsWith('root_v2_auth=') && !c.startsWith('root_v2_auth=;')), false);
  }
  assert.equal(calls.length, 0, 'no Appwrite call was made');
});

test('callback: unverified/disabled accounts, bad params and failed exchange never set a session', async () => {
  const n = nonceOf(start('provider=google&locale=en'));
  const ck = `${OAUTH_NONCE_COOKIE}=${n}`;
  stubAppwrite({ status: true, emailVerification: false });
  let res = await callback(`p=google&locale=en&n=${n}&userId=user_1&secret=tok`, ck);
  assert.equal(res.headers.get('location'), 'https://rootrcm.com/en/login?error=oauth_unverified');
  assert.equal(res.headers.getSetCookie().some((c) => c.startsWith('root_v2_auth=sess')), false);
  assert.ok(calls.some((c) => c.method === 'DELETE' && c.url.endsWith('/account/sessions/current')), 'unverified session is revoked');
  stubAppwrite({ status: false, emailVerification: true });
  res = await callback(`p=google&locale=en&n=${n}&userId=user_2&secret=tok`, ck);
  assert.match(res.headers.get('location')!, /oauth_unverified/);
  stubAppwrite({ status: true, emailVerification: true }, false);
  res = await callback(`p=google&locale=en&n=${n}&userId=user_3&secret=tok`, ck);
  assert.match(res.headers.get('location')!, /oauth_failed/);
  res = await callback(`p=google&locale=en&n=${n}&userId=../x&secret=tok`, ck);
  assert.match(res.headers.get('location')!, /oauth_failed/);
  res = await callback(`p=microsoft&locale=en&n=${n}&userId=user_1&secret=tok`, ck);
  assert.equal(res.status, 404, 'disabled provider');
});

test('buttons are driven by the server provider list; no client-side OAuth URL or secret exists', () => {
  const buttons = readFileSync('src/components/forms/oauth-buttons.tsx', 'utf8');
  assert.match(buttons, /\/api\/v1\/auth\/oauth\/providers/);
  assert.match(buttons, /if \(providers\.length === 0\) return null/);
  assert.doesNotMatch(buttons, /NEXT_PUBLIC_APPWRITE|account\/sessions\/oauth2|process\.env/);
  assert.doesNotMatch(readFileSync('src/server/auth/oauth.ts', 'utf8'), /client_?secret/i);
});

test('dashboard keeps role-based redirects and offers workspace setup only for membership-less verified users', () => {
  const page = readFileSync('src/app/[locale]/dashboard/page.tsx', 'utf8');
  assert.match(page, /defaultMemberDashboard/);
  assert.match(page, /membershipsUnavailable/);
  assert.match(page, /signupProvisioningEnabled\(\)/);
});
