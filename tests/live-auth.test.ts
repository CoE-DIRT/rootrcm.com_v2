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
    { userId: 'synthetic', orgId: 'org', role: 'CLIENT_MEMBER' },
  ], 'synthetic'), [{ orgId: 'org', role: 'CLIENT_MEMBER' }]);
  assert.throws(() => canonicalMemberships([
    { userId: 'synthetic', orgId: 'org', role: 'CLIENT_MEMBER' },
    { userId: 'synthetic', orgId: 'org', role: 'ROOT_SUPERADMIN' },
  ], 'synthetic'));
});
test('login limiter bounds attempts and expires', () => {
  for (let i = 0; i < 5; i++) assert.equal(allowAuthAttempt('test@example.invalid', 1), true);
  assert.equal(allowAuthAttempt('test@example.invalid', 1), false);
  assert.equal(allowAuthAttempt('test@example.invalid', 60002), true);
});
test('verified identity loads only server memberships; provider failures deny access', async () => {
  const names = ['ROOT_ENABLE_AUTH', 'ROOT_ENABLE_LIVE_AUTH', 'APPWRITE_AUTH_API_KEY', 'ROOT_AUTH_ORIGIN', 'APPWRITE_DATABASE_ID'];
  const previous = names.map(name => process.env[name]);
  const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, { ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', APPWRITE_AUTH_API_KEY: 'synthetic-key', ROOT_AUTH_ORIGIN: 'https://preview.example.invalid', APPWRITE_DATABASE_ID: 'synthetic' });
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
      return Response.json({ total: 1, rows: [{ userId: 'synthetic', orgId: 'org', role: 'CLIENT_MEMBER' }] });
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
  const names = ['ROOT_ENABLE_AUTH', 'ROOT_ENABLE_LIVE_AUTH', 'APPWRITE_AUTH_API_KEY', 'ROOT_AUTH_ORIGIN', 'APPWRITE_DATABASE_ID'];
  const previous = names.map(name => process.env[name]);
  const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, { ROOT_ENABLE_AUTH: 'true', ROOT_ENABLE_LIVE_AUTH: 'true', APPWRITE_AUTH_API_KEY: 'synthetic-key', ROOT_AUTH_ORIGIN: 'https://preview.example.invalid', APPWRITE_DATABASE_ID: 'synthetic' });
    const request = (origin: string, data: unknown = {}, cookie = '') => new Request('https://preview.example.invalid/api/v1/auth/login', { method: 'POST', headers: { origin, 'content-type': 'application/json', cookie }, body: JSON.stringify(data) });
    globalThis.fetch = async () => { throw new Error('CSRF must not call provider'); };
    assert.equal((await handleAuth(request('https://attacker.example.invalid'), 'login')).status, 403);
    globalThis.fetch = async () => Response.json({ secret: 'synthetic-session', expire: '2099-01-01T00:00:00.000Z' });
    const response = await handleAuth(request('https://preview.example.invalid', { email: 'http@example.invalid', password: 'synthetic-password' }), 'login');
    assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie')!;
    for (const attribute of ['HttpOnly', 'Secure', 'SameSite=strict', 'Path=/']) assert.ok(cookie.includes(attribute));
    assert.deepEqual(await response.json(), { ok: true });
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
