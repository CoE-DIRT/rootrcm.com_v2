import { entitlementStates, type EntitlementState } from '../../domain/entitlement.ts';
import type { FeatureGrant } from '../../domain/feature-access.ts';
import { authRequest } from '../auth/transport.ts';

/**
 * Normalize `entitlements` rows for ONE org. Rows for other orgs, preview-sourced rows and
 * unknown states are dropped, so a bad row can only reduce access.
 */
export function parseGrants(rows: unknown[], orgId: string): FeatureGrant[] {
  const grants: FeatureGrant[] = [];
  for (const value of rows) {
    if (!value || typeof value !== 'object') continue;
    const envelope = value as Record<string, unknown>;
    const row = envelope.data && typeof envelope.data === 'object' && !Array.isArray(envelope.data) ? (envelope.data as Record<string, unknown>) : envelope;
    if (row.orgId !== orgId || typeof row.featureCode !== 'string' || row.source === 'preview') continue;
    if (!(entitlementStates as readonly unknown[]).includes(row.state)) continue;
    const expires = typeof row.expiresAt === 'string' ? row.expiresAt : typeof row.currentPeriodEnd === 'string' ? row.currentPeriodEnd : null;
    grants.push({ featureCode: row.featureCode, state: row.state as EntitlementState, expiresAt: expires });
  }
  return grants;
}

/** Server-key read of the existing `entitlements` table. Any failure returns [] (free baseline only). */
export async function loadOrgGrants(orgId: string): Promise<FeatureGrant[]> {
  try {
    const database = encodeURIComponent(process.env.APPWRITE_DATABASE_ID!);
    const query = new URLSearchParams();
    query.append('queries[]', JSON.stringify({ method: 'equal', attribute: 'orgId', values: [orgId] }));
    query.append('queries[]', JSON.stringify({ method: 'limit', values: [200] }));
    const data = await authRequest<{ rows: unknown[]; total: number }>(`/tablesdb/${database}/tables/entitlements/rows?${query}`, 'GET', undefined, undefined, true);
    if (data.total > 200) return [];
    return parseGrants(data.rows, orgId);
  } catch {
    return [];
  }
}
