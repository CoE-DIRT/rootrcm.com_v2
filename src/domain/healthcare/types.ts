/**
 * Server-side healthcare transaction contracts.
 * Modes are synthetic | unavailable until a later authorized-sandbox / live ADR.
 * Never expose Go URLs, vendor keys or PHI to the browser.
 */
import type { ClientOpsOrgId } from '../operations/types.ts';

export const HEALTHCARE_IDENTITY_CATALOG = 'ops-seed-v1' as const;
export type HealthcareIdentityCatalog = typeof HEALTHCARE_IDENTITY_CATALOG;

export const healthcareModes = ['synthetic', 'unavailable'] as const;
export type HealthcareMode = (typeof healthcareModes)[number];

export const healthcareKinds = [
  'healthz',
  'capabilities',
  'eligibility',
  'claims',
  'credentialing',
  'events',
] as const;
export type HealthcareKind = (typeof healthcareKinds)[number];

export type HealthcareOrgId = ClientOpsOrgId;

export type HealthcareError = {
  code: string;
  message: string;
};

export type HealthcareEligibilityRow = {
  id: string;
  payer: string;
  transaction: '270/271';
  state: string;
  nextAction: string;
};

export type HealthcareClaimRow = {
  id: string;
  payer: string;
  transaction: string;
  stage: string;
  nextAction: string;
  version: number;
};

export type HealthcareCredentialingRow = {
  applicationId: string;
  providerAlias: string;
  payer: string;
  phase: string;
  owner: string;
  nextAction: string;
  effectiveDate: string | null;
  version: number;
};

export type HealthcareEventRow = {
  id: string;
  orgId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  fromStatus: string | null;
  toStatus: string | null;
  at: string;
  version: number;
};

export type HealthcareCapabilities = {
  language: 'Go';
  live: false;
  transactionFamilies: readonly string[];
  plannedPrimaryClearinghouse: 'Stedi';
  identityCatalog: HealthcareIdentityCatalog;
  syntheticOrganizations: readonly HealthcareOrgId[];
  ledger: 'operations';
  credentialingNote: string;
  stedi: {
    status: 'disabled';
    live: false;
    role: 'planned_primary';
  };
};

export type HealthcareHealthz = {
  status: 'ok' | 'unavailable';
  service: 'root-healthcare-go';
  livePayerConnection: false;
};

export type HealthcareKindData = {
  healthz: HealthcareHealthz;
  capabilities: HealthcareCapabilities;
  eligibility: HealthcareEligibilityRow[];
  claims: HealthcareClaimRow[];
  credentialing: HealthcareCredentialingRow[];
  events: HealthcareEventRow[];
};

export type HealthcareEnvelope<K extends HealthcareKind = HealthcareKind> = {
  mode: HealthcareMode;
  source: 'synthetic';
  verifiedAt: null;
  ledger: 'operations';
  identityCatalog: HealthcareIdentityCatalog;
  orgId?: HealthcareOrgId;
  kind: K;
  data: HealthcareKindData[K] | null;
  error: HealthcareError | null;
};

export function isHealthcareKind(value: unknown): value is HealthcareKind {
  return typeof value === 'string' && (healthcareKinds as readonly string[]).includes(value);
}
