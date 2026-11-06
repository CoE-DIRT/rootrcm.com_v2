import { evaluateFeature, permissionForFeature, type FeatureGrant } from '../../domain/feature-access.ts';
import { requireMembership, type AuthContext, type PolicyDecision } from '../auth/policy.ts';

export type FeatureAccess =
  | { allow: true; membership: Extract<PolicyDecision, { allow: true }>['membership']; via: 'free' | 'internal' | 'grant' }
  | { allow: false; code: 'unknown_feature' }
  | Extract<PolicyDecision, { allow: false }>;

/**
 * Order is fixed: tenant membership + role permission first (a non-member can never learn
 * plan state), then the plan. orgId is only a selector and is re-checked against the caller's
 * own memberships here; grants are loaded server-side by the caller.
 */
export function authorizeFeature(ctx: AuthContext, orgId: string, feature: string, grants: readonly FeatureGrant[], now = Date.now()): FeatureAccess {
  const permission = permissionForFeature(feature);
  if (!permission) return { allow: false, code: 'unknown_feature' };
  const membership = requireMembership(ctx, orgId, permission);
  if (!membership.allow) return membership;
  const decision = evaluateFeature(feature, orgId, grants, now);
  if (!decision.allow) return { allow: false, code: 'entitlement_inactive' };
  return { allow: true, membership: membership.membership, via: decision.via };
}
