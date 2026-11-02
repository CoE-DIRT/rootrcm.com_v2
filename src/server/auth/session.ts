import { liveAuthEnabled, ROOT_AUTH_COOKIE } from './live-config.ts';
import { authRequest } from './transport.ts';
import { isRole } from '../../domain/identity/roles.ts';
import type { AuthContext, Membership, SessionPrincipal } from './policy.ts';

export const SESSION_COOKIE_NAME = ROOT_AUTH_COOKIE;
export function principalFromCookieHeader(header: string | null | undefined): SessionPrincipal | null {
  void header;
  return null; // Cookie bytes alone never establish identity.
}
export function sessionSecret(header?: string | null): string | undefined {
  const values = (header ?? '').split(';').map(s => s.trim()).filter(s => s.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (values.length !== 1) return undefined;
  const value = values[0].slice(SESSION_COOKIE_NAME.length + 1);
  return /^[A-Za-z0-9._~+\/-]{1,4096}$/.test(value) ? value : undefined;
}
export function canonicalMemberships(rows: unknown[], userId: string): Membership[] {
  const result: Membership[] = [];
  for (const value of rows) {
    if (!value || typeof value !== 'object') continue;
    const record = value as Record<string, unknown>;
    const row = record.data && typeof record.data === 'object' && !Array.isArray(record.data)
      ? record.data as Record<string, unknown>
      : record;
    if (typeof row.status === 'string' && row.status !== 'active') continue;
    if (row.revokedAt) continue;
    if (row.userId !== userId || typeof row.orgId !== 'string' || !row.orgId || !isRole(row.role)) continue;
    // Ambiguous role assignments fail closed rather than depending on row ordering.
    if (result.some(m => m.orgId === row.orgId)) throw new Error('ambiguous_membership');
    result.push({ orgId: row.orgId, role: row.role });
  }
  return result;
}
export async function getAuthContext(header?: string | null): Promise<AuthContext> {
  return getAuthContextFromSessionSecret(sessionSecret(header));
}

export async function getAuthContextFromSessionSecret(rawSecret?: string | null): Promise<AuthContext> {
  const denied: AuthContext = { session: null, memberships: [] };
  if (!liveAuthEnabled()) return denied;
  const secret = rawSecret && rawSecret.length <= 4096 && !/[\r\n\0]/.test(rawSecret) ? rawSecret : undefined;
  if (!secret) return denied;
  try {
    const user = await authRequest<{ $id: string; email: string; emailVerification: boolean; status: boolean }>('/account', 'GET', undefined, secret);
    if (!user.status || !user.emailVerification || !user.$id) return denied;
    const database = encodeURIComponent(process.env.APPWRITE_DATABASE_ID!);
    const query = new URLSearchParams();
    query.append('queries[]', JSON.stringify({ method: 'equal', attribute: 'userId', values: [user.$id] }));
    query.append('queries[]', JSON.stringify({ method: 'limit', values: [100] }));
    const data = await authRequest<{ rows: unknown[]; total: number }>(`/tablesdb/${database}/tables/memberships/rows?${query}`, 'GET', undefined, undefined, true);
    if (data.total > 100) return denied;
    return { session: { userId: user.$id, email: user.email }, memberships: canonicalMemberships(data.rows, user.$id) };
  } catch { return denied; }
}
