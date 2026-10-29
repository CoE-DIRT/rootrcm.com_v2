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

/** Browser checkout redirect never grants access. */
export function mayActivateFromBrowserRedirect() {
  return false;
}
