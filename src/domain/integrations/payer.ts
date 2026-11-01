/**
 * Operational payer-connection contract.
 * This is not a marketing/familiarity catalog and must not duplicate frontend marquees.
 */
export const payerOperationalCapabilities = [
  'eligibility_inquiry',
  'claim_status',
  'era_reconciliation',
  'prior_authorization_status',
] as const;

export type PayerOperationalCapability = (typeof payerOperationalCapabilities)[number];

export type PayerConnectionRequest = {
  orgId: string;
  /** Opaque operational code (not a logo or partnership claim). */
  payerCode: string;
  capabilities: PayerOperationalCapability[];
};

export type PayerConnection = {
  orgId: string;
  payerCode: string;
  status: 'disabled';
  live: false;
  claimedPartnership: false;
  approvedIntegration: false;
};
