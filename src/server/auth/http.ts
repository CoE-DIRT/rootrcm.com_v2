import { NextResponse } from 'next/server.js';
import { randomUUID } from 'node:crypto';
import { allowAuthAttempt } from './rate-limit.ts';
import { liveAuthEnabled, ROOT_AUTH_COOKIE } from './live-config.ts';
import { cleanEmail, validPassword } from './session-guards.ts';
import { sessionSecret } from './session.ts';
import { authRequest, AuthError } from './transport.ts';

function reply(status: number, ok = false, verificationSent?: boolean, verified?: boolean) {
  return NextResponse.json({ ok, ...(verificationSent === undefined ? {} : { verificationSent }), ...(verified === undefined ? {} : { verified }) }, { status, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
}
export async function handleAuth(request: Request, action: string) {
  if (!liveAuthEnabled()) return reply(503);
  const configured = process.env.ROOT_AUTH_ORIGIN!;
  let origin: URL;
  try { origin = new URL(configured); } catch { return reply(503); }
  if (origin.origin !== configured || (origin.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && origin.hostname === 'localhost'))) return reply(503);
  if (request.headers.get('origin') !== origin.origin) return reply(403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415);
  // Public requests retain Appwrite's upstream rate limits; only session creation uses a key.
  if (Number(request.headers.get('content-length')) > 8192) return reply(413);
  let body: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return reply(413); }
      chunks.push(value);
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    if (raw.length > 8192) return reply(413);
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400);
  } catch { return reply(400); }
  const secret = sessionSecret(request.headers.get('cookie'));
  const locale = body.locale === 'es' ? 'es' : 'en';
  const callback = (mode: string) => `${origin.origin}/${locale}/sign-in?mode=${mode}`;
  try {
    if (action === 'login' || action === 'signup') {
      const email = cleanEmail(body.email);
      if (!email || typeof body.password !== 'string' || body.password.length > 256 || !body.password.length || (action === 'signup' && !validPassword(body.password))) return reply(400);
      if (!allowAuthAttempt(email)) return reply(429);
      if (action === 'signup') await authRequest('/account', 'POST', { userId: randomUUID(), email, password: body.password });
      const session = await authRequest<{ secret: string; expire: string }>('/account/sessions/email', 'POST', { email, password: body.password }, undefined, true);
      if (!session.secret || !Number.isFinite(Date.parse(session.expire))) return reply(502);
      let verified: boolean | undefined;
      if (action === 'login') {
        const user = await authRequest<{ emailVerification: boolean; status: boolean }>('/account', 'GET', undefined, session.secret);
        if (!user.status || typeof user.emailVerification !== 'boolean') return reply(400);
        verified = user.emailVerification;
      }
      let verificationSent: boolean | undefined;
      if (action === 'signup') {
        verificationSent = false;
        try {
          await authRequest('/account/verification', 'POST', { url: callback('verify') }, session.secret);
          verificationSent = true;
        } catch { /* Preserve the created account/session so verification can be retried. */ }
      }
      const response = reply(200, true, verificationSent, verified);
      response.cookies.set(ROOT_AUTH_COOKIE, session.secret, { httpOnly: true, secure: origin.protocol === 'https:', sameSite: 'strict', path: '/', expires: new Date(session.expire) });
      return response;
    }
    if (action === 'logout') {
      if (secret) {
        try { await authRequest('/account/sessions/current', 'DELETE', undefined, secret); }
        catch (error) { if (!(error instanceof AuthError) || error.status !== 401) throw error; }
      }
      const response = reply(200, true);
      response.cookies.set(ROOT_AUTH_COOKIE, '', { httpOnly: true, secure: origin.protocol === 'https:', sameSite: 'strict', path: '/', maxAge: 0 });
      return response;
    }
    if (action === 'verification') {
      if (!secret) return reply(401);
      await authRequest('/account/verification', 'POST', { url: callback('verify') }, secret);
    } else if (action === 'recover') {
      const email = cleanEmail(body.email);
      if (!email) return reply(400);
      try { await authRequest('/account/recovery', 'POST', { email, url: callback('reset') }); }
      catch (error) { if (!(error instanceof AuthError) || ![400, 404].includes(error.status)) throw error; }
    } else if (action === 'verify' || action === 'reset') {
      if (typeof body.userId !== 'string' || typeof body.secret !== 'string' || !body.userId || !body.secret) return reply(400);
      if (action === 'reset' && !validPassword(body.password)) return reply(400);
      await authRequest(action === 'verify' ? '/account/verification' : '/account/recovery', 'PUT', {
        userId: body.userId, secret: body.secret, ...(action === 'reset' ? { password: body.password } : {}),
      });
    } else return reply(404);
    return reply(200, true);
  } catch (error) {
    return reply(error instanceof AuthError && error.status === 429 ? 429 : 400);
  }
}
