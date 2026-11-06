import { randomBytes, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { allowAuthAttempt } from './rate-limit.ts';
import { authConfig, liveAuthEnabled, ROOT_AUTH_COOKIE, ROOT_AUTH_ENDPOINT } from './live-config.ts';
import { authRequest } from './transport.ts';

export const oauthProviders = ['google', 'microsoft'] as const;
export type OAuthProvider = (typeof oauthProviders)[number];
export const OAUTH_NONCE_COOKIE = 'root_oauth_n';

const isProvider = (value: unknown): value is OAuthProvider => (oauthProviders as readonly unknown[]).includes(value);

/**
 * A provider is offered only when live auth is on AND the operator attests, per provider, that the Appwrite OAuth2
 * provider is configured (client id/secret live only in the Appwrite console, never in this repository):
 * ROOT_OAUTH_GOOGLE=true / ROOT_OAUTH_MICROSOFT=true. Otherwise no button is shown and the routes return 404.
 */
export function enabledOAuthProviders(env: NodeJS.ProcessEnv = process.env): OAuthProvider[] {
  if (!liveAuthEnabled()) return [];
  return oauthProviders.filter((p) => env[`ROOT_OAUTH_${p.toUpperCase()}`] === 'true');
}

const localeOf = (value: unknown): 'en' | 'es' => (value === 'es' ? 'es' : 'en');
const noStore = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' };

function redirect(url: string, extra?: (response: NextResponse) => void) {
  const response = NextResponse.redirect(url, { status: 303, headers: noStore });
  extra?.(response);
  return response;
}

const clearNonce = (response: NextResponse, secure: boolean) =>
  response.cookies.set(OAUTH_NONCE_COOKIE, '', { httpOnly: true, secure, sameSite: 'lax', path: '/api/v1/auth/oauth', maxAge: 0 });

/** GET /api/v1/auth/oauth/start?provider=google&locale=en — begins the Appwrite token-flow OAuth2 login. */
export function handleOAuthStart(request: Request): Response {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const config = authConfig();
  if (!config || !isProvider(provider) || !enabledOAuthProviders().includes(provider)) {
    return NextResponse.json({ ok: false }, { status: 404, headers: noStore });
  }
  const locale = localeOf(url.searchParams.get('locale'));
  const origin = new URL(config.origin);
  const nonce = randomBytes(32).toString('base64url');
  const success = `${origin.origin}/api/v1/auth/oauth/callback?p=${provider}&locale=${locale}&n=${nonce}`;
  const failure = `${origin.origin}/${locale}/login?error=oauth_failed`;
  const target = `${ROOT_AUTH_ENDPOINT}/account/tokens/oauth2/${provider}?project=${encodeURIComponent(config.projectId)}&success=${encodeURIComponent(success)}&failure=${encodeURIComponent(failure)}`;
  return redirect(target, (response) =>
    // Lax so the cookie is sent on the top-level redirect back from Appwrite; binds the callback to THIS browser (login-CSRF defence).
    response.cookies.set(OAUTH_NONCE_COOKIE, nonce, { httpOnly: true, secure: origin.protocol === 'https:', sameSite: 'lax', path: '/api/v1/auth/oauth', maxAge: 600 }),
  );
}

function nonceMatches(cookieHeader: string | null, supplied: string | null): boolean {
  if (!supplied || !/^[A-Za-z0-9_-]{43}$/.test(supplied)) return false;
  const found = (cookieHeader ?? '').split(';').map((s) => s.trim()).filter((s) => s.startsWith(`${OAUTH_NONCE_COOKIE}=`));
  if (found.length !== 1) return false;
  const stored = found[0].slice(OAUTH_NONCE_COOKIE.length + 1);
  return stored.length === supplied.length && timingSafeEqual(Buffer.from(stored), Buffer.from(supplied));
}

/**
 * GET /api/v1/auth/oauth/callback — exchanges Appwrite's one-time token for a session SERVER-SIDE and sets the same
 * HttpOnly root_v2_auth cookie as password login. Requires a verified email (Appwrite marks provider-verified emails
 * verified). Role/organization routing is unchanged: /dashboard redirects by real membership.
 */
export async function handleOAuthCallback(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const config = authConfig();
  const provider = url.searchParams.get('p');
  const locale = localeOf(url.searchParams.get('locale'));
  if (!config || !isProvider(provider) || !enabledOAuthProviders().includes(provider)) {
    return NextResponse.json({ ok: false }, { status: 404, headers: noStore });
  }
  const origin = new URL(config.origin);
  const secure = origin.protocol === 'https:';
  const fail = (code: string) => redirect(`${origin.origin}/${locale}/login?error=${code}`, (r) => clearNonce(r, secure));

  if (!nonceMatches(request.headers.get('cookie'), url.searchParams.get('n'))) return fail('oauth_failed');
  const userId = url.searchParams.get('userId') ?? '';
  const secret = url.searchParams.get('secret') ?? '';
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(userId) || !/^[A-Za-z0-9._~+/=-]{1,256}$/.test(secret)) return fail('oauth_failed');
  if (!allowAuthAttempt(`oauth:${userId}`)) return fail('oauth_failed');

  try {
    const session = await authRequest<{ secret: string; expire: string }>('/account/sessions/token', 'POST', { userId, secret }, undefined, true);
    if (!session.secret || !Number.isFinite(Date.parse(session.expire))) return fail('oauth_failed');
    const user = await authRequest<{ status: boolean; emailVerification: boolean }>('/account', 'GET', undefined, session.secret);
    if (!user.status || user.emailVerification !== true) {
      try { await authRequest('/account/sessions/current', 'DELETE', undefined, session.secret); } catch { /* best effort */ }
      return fail('oauth_unverified');
    }
    return redirect(`${origin.origin}/${locale}/dashboard`, (response) => {
      clearNonce(response, secure);
      response.cookies.set(ROOT_AUTH_COOKIE, session.secret, { httpOnly: true, secure, sameSite: 'strict', path: '/', expires: new Date(session.expire) });
    });
  } catch {
    return fail('oauth_failed');
  }
}
