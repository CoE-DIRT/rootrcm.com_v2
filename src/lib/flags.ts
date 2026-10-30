/**
 * Single kill-switch module. Env must be the exact string "true" to enable.
 * Unset, empty, "1", "yes", and any other value is deny.
 * liveClaims is hard-denied regardless of env until a later ADR.
 */
export type FeatureFlags = {
  auth: boolean;
  crm: boolean;
  billing: boolean;
  prospecting: boolean;
  liveClaims: false;
};

function envEnabled(name: string): boolean {
  const value = process.env[name];
  return value === 'true';
}

export function getFeatureFlags(): FeatureFlags {
  return {
    auth: envEnabled('ROOT_ENABLE_AUTH'),
    crm: envEnabled('ROOT_ENABLE_CRM'),
    billing: envEnabled('ROOT_ENABLE_PAYMENTS'),
    prospecting: envEnabled('ROOT_ENABLE_PROSPECTING'),
    liveClaims: false,
  };
}

/** Back-compat snapshot used by UI copy. Always derived from getFeatureFlags(). */
export const featureFlags = getFeatureFlags();
