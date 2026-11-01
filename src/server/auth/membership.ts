import type { Permission } from '../../domain/identity/roles.ts';
import { createAppwriteTablesClient } from '../../integrations/appwrite/client.ts';
import { requireMembership, type AuthContext, type PolicyDecision } from './policy.ts';

/** Organization access always goes through the tenant PDP. */
export function requireOrgMembership(
  ctx: AuthContext,
  orgId: string,
  permission: Permission,
): PolicyDecision {
  return requireMembership(ctx, orgId, permission);
}

/**
 * TablesDB read after membership. The Appwrite client remains disabled, so a
 * successful PDP still cannot return tenant rows.
 */
export async function listOrgRows(ctx: AuthContext, orgId: string, tableId: string) {
  const decision = requireMembership(ctx, orgId, 'organization.read');
  if (!decision.allow) return decision;
  return createAppwriteTablesClient().listRows({ tableId });
}
