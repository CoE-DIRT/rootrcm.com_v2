import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { authRequest, AuthError } from '@/server/auth/transport';
import { canonicalMemberships, SESSION_COOKIE_NAME } from '@/server/auth/session';
import { liveAuthEnabled } from '@/server/auth/live-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Local development only. Returns no credentials or identifiers. */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') return new Response(null, { status: 404 });
  const reply = (data: Record<string, string | boolean | number | null>) =>
    NextResponse.json(data, { headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  if (!liveAuthEnabled()) return reply({ stage: 'auth_configuration_disabled', cookiePresent: false });
  const secret = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!secret) return reply({ stage: 'browser_cookie_missing', cookiePresent: false });
  if (secret.length > 4096 || /[\r\n\0]/.test(secret)) return reply({ stage: 'cookie_invalid', cookiePresent: true });
  let user: { $id: string; emailVerification: boolean; status: boolean };
  try { user = await authRequest('/account', 'GET', undefined, secret); }
  catch (error) { return reply({ stage: 'appwrite_session_rejected', cookiePresent: true,
    httpStatus: error instanceof AuthError ? error.status : null }); }
  if (!user.$id || !user.status || !user.emailVerification) return reply({
    stage: 'identity_not_eligible', cookiePresent: true, verified: !!user.emailVerification,
  });
  try {
    const db = encodeURIComponent(process.env.APPWRITE_DATABASE_ID!);
    const q = new URLSearchParams();
    q.append('queries[]', JSON.stringify({ method: 'equal', attribute: 'userId', values: [user.$id] }));
    q.append('queries[]', JSON.stringify({ method: 'limit', values: [100] }));
    const rows = await authRequest<{ rows: unknown[]; total: number }>(`/tablesdb/${db}/tables/memberships/rows?${q}`, 'GET', undefined, undefined, true);
    const memberships = canonicalMemberships(rows.rows, user.$id);
    return reply({ stage: memberships.length ? 'ready' : 'no_authorized_membership', cookiePresent: true,
      verified: true, returnedRows: rows.total, recognizedMemberships: memberships.length,
      hasSuperadmin: memberships.some(m => m.role === 'ROOT_SUPERADMIN') });
  } catch (error) {
    return reply({ stage: 'membership_query_failed', cookiePresent: true, verified: true,
      httpStatus: error instanceof AuthError ? error.status : null });
  }
}
