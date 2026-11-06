import type { EntitlementState } from './entitlement.ts';
import type { Permission } from './identity/roles.ts';
import { offerFeatureCodes } from './catalog-entitlement.ts';

/** Internal operator org. Its members work for ROOT and need no purchased plan. */
export const INTERNAL_ORG_ID = 'root_internal';

/** FREE baseline = exactly the free catalog offer. Everything else is PAID and needs a server grant. */
export const FREE_FEATURES: readonly string[] = offerFeatureCodes['free-account-consultation'];

const featurePermission: Record<string, Permission> = {
  basic_workspace: 'organization.read',
  consultation: 'organization.read',
  diagnostic_report: 'organization.read',
  rcm_dashboard: 'organization.read',
  credentialing_tracker: 'organization.read',
  dirt_workspace: 'organization.read',
  mso_reporting: 'organization.read',
  multi_location: 'organization.read',
  managed_requests: 'requests.read',
};

export const knownFeatures: readonly string[] = Object.keys(featurePermission);
export const isKnownFeature = (code: string): boolean => Object.hasOwn(featurePermission, code);
export const isFreeFeature = (code: string): boolean => FREE_FEATURES.includes(code);
export const permissionForFeature = (code: string): Permission | null => (isKnownFeature(code) ? featurePermission[code] : null);

export type FeatureGrant = { featureCode: string; state: EntitlementState; expiresAt?: string | null };

const GRANTING: readonly EntitlementState[] = ['active', 'grace'];
const BLOCKING: readonly EntitlementState[] = ['suspended', 'disputed'];

export type FeatureDecision =
  | { allow: true; via: 'free' | 'internal' | 'grant' }
  | { allow: false; reason: 'unknown_feature' | 'entitlement_inactive' };

function unexpired(grant: FeatureGrant, now: number): boolean {
  if (!grant.expiresAt) return true;
  const end = Date.parse(grant.expiresAt);
  return !Number.isNaN(end) && end > now; // unparsable expiry fails closed
}

/**
 * Pure feature decision for one org. Free features always pass; paid features need a
 * server-side grant that is active/grace, unexpired, and not overridden by a suspended/disputed row.
 * past_due, canceled, expired and checkout_pending never grant. Browser state is not an input.
 */
export function evaluateFeature(code: string, orgId: string, grants: readonly FeatureGrant[], now = Date.now()): FeatureDecision {
  if (!isKnownFeature(code)) return { allow: false, reason: 'unknown_feature' };
  if (isFreeFeature(code)) return { allow: true, via: 'free' };
  if (orgId === INTERNAL_ORG_ID) return { allow: true, via: 'internal' };
  const rows = grants.filter((g) => g.featureCode === code);
  if (rows.some((g) => BLOCKING.includes(g.state))) return { allow: false, reason: 'entitlement_inactive' };
  const live = rows.some((g) => GRANTING.includes(g.state) && unexpired(g, now));
  return live ? { allow: true, via: 'grant' } : { allow: false, reason: 'entitlement_inactive' };
}

export function effectiveFeatures(orgId: string, grants: readonly FeatureGrant[], now = Date.now()): string[] {
  return knownFeatures.filter((code) => evaluateFeature(code, orgId, grants, now).allow);
}
