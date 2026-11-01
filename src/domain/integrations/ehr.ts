/**
 * Operational EHR-connection contract.
 * Separate from public “systems we know” familiarity lists; no vendor logo catalog.
 */
export const ehrOperationalCapabilities = [
  'scheduling_read',
  'charge_export',
  'demographic_sync_business_only',
] as const;

export type EhrOperationalCapability = (typeof ehrOperationalCapabilities)[number];

export type EhrConnectionRequest = {
  orgId: string;
  /** Opaque operational code (not a brand marquee). */
  systemCode: string;
  capabilities: EhrOperationalCapability[];
};

export type EhrConnection = {
  orgId: string;
  systemCode: string;
  status: 'disabled';
  live: false;
  approvedIntegration: false;
};
