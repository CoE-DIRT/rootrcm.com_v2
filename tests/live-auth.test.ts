import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalMemberships, getAuthContext, sessionSecret } from '../src/server/auth/session.ts';
import { allowAuthAttempt } from '../src/server/auth/rate-limit.ts';
import { authRequest } from '../src/server/auth/transport.ts';

test('cookie parser rejects duplicate, malformed and unrelated cookies', () => {
  assert.equal(sessionSecret('root_v2_auth=synthetic; root_v2_auth=other'), undefined);
  assert.equal(sessionSecret('root_v2_auth=%0a'), undefined);
  assert.equal(sessionSecret('root_v2_session=forged'), undefined);
  assert.equal(sessionSecret('root_v2_auth=synthetic'), 'synthetic');
});
test('canonical membership rejects email grants, unknown roles and other users', () => {
  assert.deepEqual(canonicalMemberships([
    { userId: 'other', orgId: 'org', role: 'ROOT_SUPERADMIN' },
    { userId: 'synthetic', orgId: 'org', role: 'admin' },
    { email: 'admin@example.invalid', orgId: 'org', role: 'ROOT_SUPERADMIN' },
    { userId: 'synthetic', orgId: 'org', role: 'CLIENT_MEMBER', status: 'active', revokedAt: null },
  ], 'synthetic'), [{ orgId: 'org', role: 'CLIENT_MEMBER' }]);
  assert.throws(() => canonicalMemberships([
    { userId: 'synthetic', orgId: 'org', role: 'CLIENT_MEMBER', status: 'active', revokedAt: null },
    { userId: 'synthetic', orgId: 'org', role: 'ROOT_SUPERADMIN', status: 'active', revokedAt: null },
  ], 'synthetic'));
});
test('login limiter bounds attempts and expires', () => {
  for (let i = 0; i < 5; i++) assert.equal(allowAuthAttempt('test@example.invalid', 1), true);
  assert.equal(allowAuthAttempt('test@example.invalid', 1), false);
  assert.equal(allowAuthAttempt('test@example.invalid', 60002), true);
});
test('verified identity loads only server memberships; provider failures deny access', async () => {
  const names = ['APPWRITE_AUTH_PROJECT_ID', 'ROOT_AUTH_ENVIRONMENT', 'NEXT_PUBLIC_APPWRITE_PROJECT_ID', 'ROOT_ENABLE_AUTH', 'ROOT_ENABLE_LIVE_AUTH', 'APPWRITE_AUTH_API_KEY', 'ROOT_AUTH_ORIGIN', 'APPWRITE_DATABASE_ID'];
  const previous = names.map(name => process.env[name]);
  const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, { APPWRITE_AUTH_PROJECT_ID: 'synthetic-staging', ROOT_AUTH_ENVIRONMENT: 'staging', NEXT_PUBLIC_APPWRITE_PROJECT_ID: '', ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', APPWRITE_AUTH_API_KEY: 'synthetic-key', ROOT_AUTH_ORIGIN: 'https://preview.example.invalid', APPWRITE_DATABASE_ID: 'synthetic' });
    let calls = 0;
    globalThis.fetch = async (input, init) => {
      calls++;
      const headers = init?.headers as Record<string, string>;
      assert.equal(init?.cache, 'no-store');
      if (String(input).endsWith('/account')) {
        assert.equal(headers['X-Appwrite-Key'], undefined);
        assert.equal(headers['X-Appwrite-Session'], 'synthetic');
        return Response.json({ $id: 'synthetic', email: 'test@example.invalid', status: true, emailVerification: true });
      }
      assert.match(String(input), /tables\/memberships\/rows/);
      assert.equal(headers['X-Appwrite-Session'], undefined);
      return Response.json({ total: 1, rows: [{ data: { userId: 'synthetic', orgId: 'org', role: 'CLIENT_MEMBER', status: 'active', revokedAt: null } }] });
    };
    assert.equal((await getAuthContext('root_v2_auth=synthetic')).memberships[0].role, 'CLIENT_MEMBER');
    assert.equal(calls, 2);
    globalThis.fetch = async () => Response.json({ $id: 'synthetic', status: true, emailVerification: false });
    assert.equal((await getAuthContext('root_v2_auth=synthetic')).session, null);
    globalThis.fetch = async () => new Response('', { status: 401 });
    assert.equal((await getAuthContext('root_v2_auth=synthetic')).session, null);
    process.env.ROOT_ENABLE_AUTH = 'false';
    globalThis.fetch = async () => { throw new Error('disabled transport called'); };
    await assert.rejects(authRequest('/account'));
  } finally {
    globalThis.fetch = originalFetch;
    names.forEach((name, i) => { if (previous[i] === undefined) delete process.env[name]; else process.env[name] = previous[i]; });
  }
});

test('HTTP auth rejects CSRF, keeps session tokens private and revokes logout', async () => {
  const { handleAuth } = await import('../src/server/auth/http.ts');
  const names = ['APPWRITE_AUTH_PROJECT_ID', 'ROOT_AUTH_ENVIRONMENT', 'NEXT_PUBLIC_APPWRITE_PROJECT_ID', 'ROOT_ENABLE_AUTH', 'ROOT_ENABLE_LIVE_AUTH', 'APPWRITE_AUTH_API_KEY', 'ROOT_AUTH_ORIGIN', 'APPWRITE_DATABASE_ID'];
  const previous = names.map(name => process.env[name]);
  const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, { APPWRITE_AUTH_PROJECT_ID: 'synthetic-staging', ROOT_AUTH_ENVIRONMENT: 'staging', NEXT_PUBLIC_APPWRITE_PROJECT_ID: '', ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', APPWRITE_AUTH_API_KEY: 'synthetic-key', ROOT_AUTH_ORIGIN: 'https://preview.example.invalid', APPWRITE_DATABASE_ID: 'synthetic' });
    const request = (origin: string, data: unknown = {}, cookie = '') => new Request('https://preview.example.invalid/api/v1/auth/login', { method: 'POST', headers: { origin, 'content-type': 'application/json', cookie }, body: JSON.stringify(data) });
    globalThis.fetch = async () => { throw new Error('CSRF must not call provider'); };
    assert.equal((await handleAuth(request('https://attacker.example.invalid'), 'login')).status, 403);
    globalThis.fetch = async url => String(url).endsWith('/account')
      ? Response.json({ status: true, emailVerification: true })
      : Response.json({ secret: 'synthetic-session', expire: '2099-01-01T00:00:00.000Z' });
    const response = await handleAuth(request('https://preview.example.invalid', { email: 'http@example.invalid', password: 'synthetic-password' }), 'login');
    assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie')!;
    for (const attribute of ['HttpOnly', 'Secure', 'SameSite=strict', 'Path=/']) assert.ok(cookie.includes(attribute));
    assert.deepEqual(await response.json(), { ok: true, verified: true });
    const unverifiedCalls: string[] = [];
    globalThis.fetch = async url => {
      unverifiedCalls.push(String(url));
      return String(url).endsWith('/account')
        ? Response.json({ status: true, emailVerification: false })
        : Response.json({ secret: 'synthetic-session', expire: '2099-01-01T00:00:00.000Z' });
    };
    const unverified = await handleAuth(request('https://preview.example.invalid', { email: 'unverified@example.invalid', password: 'synthetic-password' }), 'login');
    assert.deepEqual(await unverified.json(), { ok: true, verified: false });
    assert.equal(unverifiedCalls.length, 2);
    assert.ok(unverifiedCalls.every(url => !url.endsWith('/account/verification')), 'login never resends verification');
    let revoked = false;
    globalThis.fetch = async (url, init) => {
      assert.ok(String(url).endsWith('/account/sessions/current'));
      assert.equal(init?.method, 'DELETE'); revoked = true;
      return new Response(null, { status: 204 });
    };
    const logout = await handleAuth(request('https://preview.example.invalid', {}, 'root_v2_auth=synthetic-session'), 'logout');
    assert.equal(revoked, true);
    assert.match(logout.headers.get('set-cookie')!, /Max-Age=0/);
    process.env.ROOT_ENABLE_LIVE_AUTH = 'false';
    assert.equal((await handleAuth(request('https://preview.example.invalid'), 'login')).status, 503);
  } finally {
    globalThis.fetch = originalFetch;
    names.forEach((name, i) => { if (previous[i] === undefined) delete process.env[name]; else process.env[name] = previous[i]; });
  }
});

test('signup and verification/recovery contracts in EN/ES preserve least privilege', async () => {
  const { handleAuth } = await import('../src/server/auth/http.ts');
  const { requireMembership } = await import('../src/server/auth/policy.ts');
  const names = ['APPWRITE_AUTH_PROJECT_ID', 'ROOT_AUTH_ENVIRONMENT', 'NEXT_PUBLIC_APPWRITE_PROJECT_ID', 'ROOT_ENABLE_AUTH', 'ROOT_ENABLE_LIVE_AUTH', 'APPWRITE_AUTH_API_KEY', 'ROOT_AUTH_ORIGIN', 'APPWRITE_DATABASE_ID'];
  const previous = names.map(name => process.env[name]);
  const originalFetch = globalThis.fetch;
  const origin = 'https://preview.example.invalid';
  const request = (data: unknown, cookie = '') => new Request(`${origin}/api/v1/auth/signup`, {
    method: 'POST', headers: { origin, 'content-type': 'application/json', cookie }, body: JSON.stringify(data),
  });
  try {
    Object.assign(process.env, { APPWRITE_AUTH_PROJECT_ID: 'synthetic-staging', ROOT_AUTH_ENVIRONMENT: 'staging', NEXT_PUBLIC_APPWRITE_PROJECT_ID: '', ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', APPWRITE_AUTH_API_KEY: 'synthetic-key', ROOT_AUTH_ORIGIN: origin, APPWRITE_DATABASE_ID: 'synthetic' });
    for (const locale of ['en', 'es']) {
      const calls: { path: string; method?: string; body: Record<string, unknown>; headers: Record<string, string> }[] = [];
      globalThis.fetch = async (url, init) => {
        const path = new URL(String(url)).pathname.replace('/v1', '');
        const body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;
        const headers = init?.headers as Record<string, string>;
        calls.push({ path, method: init?.method, body, headers });
        if (path === '/account/sessions/email') return Response.json({ secret: 'synthetic-session', expire: '2099-01-01T00:00:00.000Z' });
        return Response.json({ secret: 'must-never-leak' });
      };
      const signup = await handleAuth(request({ email: `${locale}@example.invalid`, password: 'synthetic-password', locale, role: 'ROOT_SUPERADMIN', orgId: 'other-tenant' }), 'signup');
      assert.deepEqual(await signup.json(), { ok: true, verificationSent: true });
      assert.deepEqual(calls.map(call => call.path), ['/account', '/account/sessions/email', '/account/verification']);
      assert.equal(calls[0].headers['X-Appwrite-Key'], undefined);
      assert.deepEqual(Object.keys(calls[0].body).sort(), ['email', 'password', 'userId']);
      assert.equal(calls[1].headers['X-Appwrite-Key'], 'synthetic-key');
      assert.equal(calls[2].headers['X-Appwrite-Key'], undefined);
      assert.equal(calls[2].headers['X-Appwrite-Session'], 'synthetic-session');
      assert.equal(calls[2].body.url, `${origin}/${locale}/sign-in?mode=verify`);
      calls.length = 0;
      for (const action of ['verification', 'verify', 'recover', 'reset']) {
        const response = await handleAuth(request({ locale, email: 'recovery@example.invalid', userId: 'synthetic-user', secret: 'synthetic-token', password: 'synthetic-new-password' }, 'root_v2_auth=synthetic-session'), action);
        assert.deepEqual(await response.json(), { ok: true });
        const call = calls.at(-1)!;
        assert.equal(call.headers['X-Appwrite-Key'], undefined);
        assert.equal(call.method, ['verify', 'reset'].includes(action) ? 'PUT' : 'POST');
        if (action === 'recover') assert.equal(call.body.url, `${origin}/${locale}/sign-in?mode=reset`);
        if (action === 'reset') assert.deepEqual(call.body, { userId: 'synthetic-user', secret: 'synthetic-token', password: 'synthetic-new-password' });
      }
    }
    // Partial signup must preserve its cookie and explicitly report email failure.
    globalThis.fetch = async url => {
      if (String(url).endsWith('/verification')) return new Response(null, { status: 503 });
      return Response.json({ secret: 'synthetic-session', expire: '2099-01-01T00:00:00.000Z' });
    };
    const partial = await handleAuth(request({ email: 'partial@example.invalid', password: 'synthetic-password' }), 'signup');
    assert.deepEqual(await partial.json(), { ok: true, verificationSent: false });
    assert.match(partial.headers.get('set-cookie')!, /HttpOnly/);
    // Expired links fail without disclosing provider token/errors or setting a session.
    globalThis.fetch = async () => Response.json({ secret: 'must-never-leak' }, { status: 401 });
    for (const action of ['verify', 'reset']) {
      const failed = await handleAuth(request({ userId: 'synthetic', secret: 'expired', password: 'synthetic-password' }), action);
      assert.equal(failed.status, 400);
      assert.deepEqual(await failed.json(), { ok: false });
      assert.equal(failed.headers.get('set-cookie'), null);
    }
    const expiredLogout = await handleAuth(request({}, 'root_v2_auth=expired'), 'logout');
    assert.equal(expiredLogout.status, 200);
    assert.match(expiredLogout.headers.get('set-cookie')!, /Max-Age=0/);
    // Fresh server reads enforce revocation and canonical role changes across requests.
    let role = 'CLIENT_MEMBER';
    let rows: unknown[] | undefined = undefined;
    globalThis.fetch = async url => String(url).endsWith('/account')
      ? Response.json({ $id: 'synthetic-user', email: 'client@example.invalid', status: true, emailVerification: true })
      : Response.json({ total: rows?.length ?? 1, rows: rows ?? [{ data: { userId: 'synthetic-user', orgId: 'tenant-a', role, status: 'active', revokedAt: null } }] });
    let context = await getAuthContext('root_v2_auth=synthetic-session');
    assert.equal(requireMembership(context, 'tenant-a', 'organization.read').allow, true);
    assert.equal(requireMembership(context, 'tenant-a', 'root_admin.manage').allow, false);
    assert.equal(requireMembership(context, 'tenant-b', 'organization.read').allow, false);
    role = 'ROOT_SUPERADMIN';
    context = await getAuthContext('root_v2_auth=synthetic-session');
    assert.equal(requireMembership(context, 'tenant-a', 'root_admin.manage').allow, true);
    assert.equal(requireMembership(context, 'tenant-b', 'root_admin.manage').allow, false);
    rows = [];
    context = await getAuthContext('root_v2_auth=synthetic-session');
    assert.equal(requireMembership(context, 'tenant-a', 'root_admin.manage').allow, false);
  } finally {
    globalThis.fetch = originalFetch;
    names.forEach((name, i) => { if (previous[i] === undefined) delete process.env[name]; else process.env[name] = previous[i]; });
  }
});

test('staging configuration rejects missing, public-only, mismatched and production targets before network', async () => {
  const { liveAuthEnabled, authConfig } = await import('../src/server/auth/live-config.ts');
  const names = ['APPWRITE_AUTH_PROJECT_ID', 'ROOT_AUTH_ENVIRONMENT', 'NEXT_PUBLIC_APPWRITE_PROJECT_ID', 'ROOT_ENABLE_AUTH', 'ROOT_ENABLE_LIVE_AUTH', 'APPWRITE_AUTH_API_KEY', 'ROOT_AUTH_ORIGIN', 'APPWRITE_DATABASE_ID'];
  const previous = names.map(name => process.env[name]);
  const originalFetch = globalThis.fetch;
  const valid = { APPWRITE_AUTH_PROJECT_ID: 'synthetic-staging', ROOT_AUTH_ENVIRONMENT: 'staging', NEXT_PUBLIC_APPWRITE_PROJECT_ID: '', ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', APPWRITE_AUTH_API_KEY: 'synthetic-key', ROOT_AUTH_ORIGIN: 'https://staging.example.invalid:8443', APPWRITE_DATABASE_ID: 'synthetic' };
  try {
    globalThis.fetch = async () => { throw new Error('unexpected_network'); };
    for (const patch of [
      { APPWRITE_AUTH_PROJECT_ID: '' },
      { APPWRITE_AUTH_PROJECT_ID: '', NEXT_PUBLIC_APPWRITE_PROJECT_ID: 'synthetic-staging' },
      { APPWRITE_AUTH_PROJECT_ID: 'bad/project' },
      { NEXT_PUBLIC_APPWRITE_PROJECT_ID: 'different-project' },
      { ROOT_AUTH_ENVIRONMENT: '' }, { ROOT_AUTH_ENVIRONMENT: 'invalid' },
      { ROOT_AUTH_ORIGIN: '' }, { ROOT_AUTH_ORIGIN: 'https://rootrcm.com' },
      { ROOT_AUTH_ORIGIN: 'https://www.rootrcm.com' },
      { ROOT_AUTH_ORIGIN: 'https://staging.example.invalid/' },
      { ROOT_AUTH_ORIGIN: 'https://user@staging.example.invalid' },
      { ROOT_AUTH_ORIGIN: 'https://staging.example.invalid/callback' },
      { ROOT_AUTH_ORIGIN: 'http://staging.example.invalid' },
      { APPWRITE_AUTH_API_KEY: '' }, { APPWRITE_DATABASE_ID: '' },
      { ROOT_ENABLE_AUTH: 'false' }, { ROOT_ENABLE_LIVE_AUTH: 'false' },
    ]) {
      Object.assign(process.env, valid, patch);
      assert.equal(liveAuthEnabled(), false, JSON.stringify(patch));
      await assert.rejects(authRequest('/account'), /live_auth_not_configured/);
    }
    Object.assign(process.env, valid);
    assert.deepEqual(authConfig(), { projectId: 'synthetic-staging', origin: valid.ROOT_AUTH_ORIGIN });
    globalThis.fetch = async (_url, init) => {
      assert.equal((init?.headers as Record<string, string>)['X-Appwrite-Project'], 'synthetic-staging');
      return Response.json({});
    };
    await authRequest('/account');
    const { handleAuth } = await import('../src/server/auth/http.ts');
    const request = (origin: string) => new Request(`${valid.ROOT_AUTH_ORIGIN}/api/v1/auth/signup`, {
      method: 'POST', headers: { origin, 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'port@example.invalid', password: 'synthetic-password', locale: 'es' }),
    });
    assert.equal((await handleAuth(request('https://staging.example.invalid'), 'signup')).status, 403);
    globalThis.fetch = async (url, init) => {
      if (String(url).endsWith('/verification')) {
        assert.equal(JSON.parse(String(init?.body)).url, `${valid.ROOT_AUTH_ORIGIN}/es/sign-in?mode=verify`);
      }
      return Response.json({ secret: 'synthetic-session', expire: '2099-01-01T00:00:00.000Z' });
    };
    const signup = await handleAuth(request(valid.ROOT_AUTH_ORIGIN), 'signup');
    assert.equal(signup.status, 200);
    assert.match(signup.headers.get('set-cookie')!, /Secure/);
    assert.doesNotMatch(signup.headers.get('set-cookie')!, /Domain=/i);
  } finally {
    globalThis.fetch = originalFetch;
    names.forEach((name, i) => { if (previous[i] === undefined) delete process.env[name]; else process.env[name] = previous[i]; });
  }
});

test('production config is explicit, canonical, project-pinned and keeps CSRF/session boundaries', async () => {
  const { authConfig, liveAuthEnabled, canonicalAuthRedirect } = await import('../src/server/auth/live-config.ts');
  const { handleAuth } = await import('../src/server/auth/http.ts');
  const names = ['ROOT_AUTH_ENVIRONMENT','APPWRITE_AUTH_PROJECT_ID','APPWRITE_DATABASE_ID','ROOT_AUTH_ORIGIN','APPWRITE_AUTH_API_KEY','ROOT_ENABLE_AUTH','ROOT_ENABLE_LIVE_AUTH','NEXT_PUBLIC_APPWRITE_PROJECT_ID'];
  const previous = names.map(name => process.env[name]);
  const originalFetch = globalThis.fetch;
  const valid = { ROOT_AUTH_ENVIRONMENT: 'production', APPWRITE_AUTH_PROJECT_ID: '6ae878f400268114a480', APPWRITE_DATABASE_ID: 'synthetic', ROOT_AUTH_ORIGIN: 'https://rootrcm.com', APPWRITE_AUTH_API_KEY: 'synthetic-key', ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', NEXT_PUBLIC_APPWRITE_PROJECT_ID: '' };
  try {
    Object.assign(process.env, valid);
    assert.equal(liveAuthEnabled(), true);
    assert.equal(authConfig()!.origin, valid.ROOT_AUTH_ORIGIN);
    for (const locale of ['en', 'es']) {
      const path = `/${locale}/dashboard/admin?orgId=root_internal`;
      assert.equal(canonicalAuthRedirect(new URL(`https://preview.example.invalid${path}`))?.href, `${valid.ROOT_AUTH_ORIGIN}${path}`);
      assert.equal(canonicalAuthRedirect(new URL(`${valid.ROOT_AUTH_ORIGIN}${path}`)), null);
    }
    assert.equal(canonicalAuthRedirect(new URL('https://preview.example.invalid/en/consultation')), null);
    assert.equal(canonicalAuthRedirect(new URL('https://preview.example.invalid/api/v1/auth/login')), null);
    for (const patch of [
      { APPWRITE_AUTH_PROJECT_ID: 'another-project' }, { APPWRITE_AUTH_PROJECT_ID: '' },
      { NEXT_PUBLIC_APPWRITE_PROJECT_ID: 'another-project' },
      { APPWRITE_DATABASE_ID: 'bad/database' }, { ROOT_AUTH_ENVIRONMENT: '' },
      { ROOT_AUTH_ORIGIN: 'http://rootrcm.com' }, { ROOT_AUTH_ORIGIN: 'https://localhost' },
      { ROOT_AUTH_ORIGIN: 'https://rootrcm.com/' }, { ROOT_AUTH_ORIGIN: 'https://rootrcm.com?test=1' },
      { ROOT_AUTH_ORIGIN: 'https://user@rootrcm.com' }, { ROOT_AUTH_ORIGIN: 'https://ROOTRCM.com' },
      { ROOT_ENABLE_AUTH: 'false' }, { ROOT_ENABLE_LIVE_AUTH: 'false' },
    ]) {
      Object.assign(process.env, valid, patch);
      assert.equal(liveAuthEnabled(), false, JSON.stringify(patch));
    }
    Object.assign(process.env, valid);
    const request = (origin: string, cookie = '') => new Request(`${valid.ROOT_AUTH_ORIGIN}/api/v1/auth/login`, {
      method: 'POST', headers: { origin, 'content-type': 'application/json', cookie },
      body: JSON.stringify({ email: 'synthetic@example.invalid', password: 'synthetic-password' }),
    });
    globalThis.fetch = async () => { throw new Error('foreign_origin_must_not_call_provider'); };
    assert.equal((await handleAuth(request('https://preview.example.invalid'), 'login')).status, 403);
    assert.equal((await handleAuth(request('https://www.rootrcm.com'), 'login')).status, 403);
    globalThis.fetch = async url => String(url).endsWith('/account')
      ? Response.json({ status: true, emailVerification: true })
      : Response.json({ secret: 'synthetic-session', expire: '2099-01-01T00:00:00.000Z' });
    const login = await handleAuth(request(valid.ROOT_AUTH_ORIGIN), 'login');
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie')!;
    for (const attribute of ['Secure','HttpOnly','SameSite=strict','Path=/']) assert.ok(cookie.includes(attribute));
    assert.doesNotMatch(cookie, /Domain=/i);
    assert.deepEqual(await login.json(), { ok: true, verified: true });
    globalThis.fetch = async () => new Response(null, { status: 204 });
    const logout = await handleAuth(request(valid.ROOT_AUTH_ORIGIN, 'root_v2_auth=synthetic-session'), 'logout');
    assert.match(logout.headers.get('set-cookie')!, /Max-Age=0/);
  } finally {
    globalThis.fetch = originalFetch;
    names.forEach((name, i) => { if (previous[i] === undefined) delete process.env[name]; else process.env[name] = previous[i]; });
  }
});
