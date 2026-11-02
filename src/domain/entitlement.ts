export const entitlementStates = [
  'none',
  'checkout_pending',
  'active',
  'past_due',
  'grace',
  'suspended',
  'canceled',
  'expired',
  'disputed',
] as const;

export type EntitlementState = (typeof entitlementStates)[number];

export type EntitlementRecord = {
  orgId: string;
  featureCode: string;
  state: EntitlementState;
  source: 'stripe' | 'manual' | 'preview';
};

/** Browser checkout redirect never grants access. */
export function mayActivateFromBrowserRedirect() {
  return false;
}

/** Feature grants for paid/preview workspaces come from `catalog-entitlement`, never an Enterprise SKU. */
