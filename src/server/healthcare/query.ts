/**
 * Operations-ledger healthcare queries. Go is a synthetic gate, not a second store.
 * Claim/credentialing mutations stay in src/server/operations.
 */
import { healthcareOrgIds, isHealthcareOrgId } from '../../domain/healthcare/identities.ts';
import {
  HEALTHCARE_IDENTITY_CATALOG,
  type HealthcareCapabilities,
  type HealthcareClaimRow,
  type HealthcareCredentialingRow,
  type HealthcareEligibilityRow,
  type HealthcareEnvelope,
  type HealthcareEventRow,
  type HealthcareKind,
  type HealthcareKindData,
  type HealthcareOrgId,
} from '../../domain/healthcare/types.ts';
import type { OpsSnapshot } from '../../domain/operations/types.ts';
import type { OpsSessionContext } from '../operations/session.ts';
import { peekOpsSnapshot } from '../operations/store.ts';
import { describeStediConnection } from './stedi.ts';
import { probeGoHealthcare, type GoClientOptions } from './go-client.ts';

const TRANSACTION_FAMILIES = [
  '270/271 eligibility',
  '276/277 claim status',
  'credentialing application status',
] as const;

function payerName(snapshot: OpsSnapshot, payerId: string): string {
  return snapshot.payers.find((row) => row.id === payerId)?.name ?? payerId;
}

function providerAlias(snapshot: OpsSnapshot, providerId: string): string {
  return snapshot.providers.find((row) => row.id === providerId)?.alias ?? providerId;
}

function eligibilityRows(snapshot: OpsSnapshot, orgId: HealthcareOrgId): HealthcareEligibilityRow[] {
  return snapshot.eligibility
    .filter((row) => row.orgId === orgId)
    .map((row) => ({
      id: row.id,
      payer: payerName(snapshot, row.payerId),
      transaction: '270/271',
      state: row.state,
      nextAction: row.nextAction,
    }));
}

function claimRows(snapshot: OpsSnapshot, orgId: HealthcareOrgId): HealthcareClaimRow[] {
  return snapshot.claims
    .filter((row) => row.orgId === orgId)
    .map((row) => ({
      id: row.id,
      payer: payerName(snapshot, row.payerId),
      transaction: row.lastTransaction ?? 'internal',
      stage: row.status,
      nextAction: row.nextAction ?? '',
      version: row.version,
    }));
}

function credentialingRows(
  snapshot: OpsSnapshot,
  orgId: HealthcareOrgId,
): HealthcareCredentialingRow[] {
  return snapshot.credentialingApplications
    .filter((row) => row.orgId === orgId)
    .map((row) => ({
      applicationId: row.id,
      providerAlias: providerAlias(snapshot, row.providerId),
      payer: payerName(snapshot, row.payerId),
      phase: row.status,
      owner: row.ownerId ?? 'preview-staff',
      nextAction: row.nextAction ?? '',
      effectiveDate: row.effectiveDate,
      version: row.version,
    }));
}

function eventRows(snapshot: OpsSnapshot, orgId: HealthcareOrgId): HealthcareEventRow[] {
  return snapshot.auditEvents
    .filter(
      (row) =>
        row.orgId === orgId && (row.resourceType === 'claim' || row.resourceType === 'credentialing'),
    )
    .map((row) => ({
      id: row.id,
      orgId: row.orgId,
      action: row.action,
      resourceType: row.resourceType,
      resourceId: row.resourceId,
      fromStatus: row.fromStatus,
      toStatus: row.toStatus,
      at: row.at,
      version: row.version,
    }));
}

function capabilities(): HealthcareCapabilities {
  const stedi = describeStediConnection();
  return {
    language: 'Go',
    live: false,
    transactionFamilies: TRANSACTION_FAMILIES,
    plannedPrimaryClearinghouse: 'Stedi',
    identityCatalog: HEALTHCARE_IDENTITY_CATALOG,
    syntheticOrganizations: healthcareOrgIds,
    ledger: 'operations',
    credentialingNote:
      'Payer application status needs authorized evidence; 271/NPPES does not prove enrollment.',
    stedi: {
      status: stedi.status,
      live: stedi.live,
      role: stedi.role,
    },
  };
}

function envelope<K extends HealthcareKind>(
  kind: K,
  orgId: HealthcareOrgId | undefined,
  data: HealthcareKindData[K],
): HealthcareEnvelope<K> {
  return {
    mode: 'synthetic',
    source: 'synthetic',
    verifiedAt: null,
    ledger: 'operations',
    identityCatalog: HEALTHCARE_IDENTITY_CATALOG,
    orgId,
    kind,
    data,
    error: null,
  };
}

function unavailable(
  kind: HealthcareKind,
  orgId: HealthcareOrgId | undefined,
  error: { code: string; message: string },
): HealthcareEnvelope {
  return {
    mode: 'unavailable',
    source: 'synthetic',
    verifiedAt: null,
    ledger: 'operations',
    identityCatalog: HEALTHCARE_IDENTITY_CATALOG,
    orgId,
    kind,
    data: null,
    error,
  };
}

export function projectHealthcareFromSnapshot(
  snapshot: OpsSnapshot,
  kind: HealthcareKind,
  orgId?: string,
): HealthcareEnvelope {
  if (kind === 'healthz') {
    return envelope('healthz', undefined, {
      status: 'ok',
      service: 'root-healthcare-go',
      livePayerConnection: false,
    });
  }
  if (kind === 'capabilities') {
    return envelope('capabilities', undefined, capabilities());
  }
  if (!isHealthcareOrgId(orgId)) {
    return unavailable(kind, undefined, {
      code: 'unknown_synthetic_organization',
      message: 'Supported: bayview, cedar-grove, metro-asc.',
    });
  }
  switch (kind) {
    case 'eligibility':
      return envelope('eligibility', orgId, eligibilityRows(snapshot, orgId));
    case 'claims':
      return envelope('claims', orgId, claimRows(snapshot, orgId));
    case 'credentialing':
      return envelope('credentialing', orgId, credentialingRows(snapshot, orgId));
    case 'events':
      return envelope('events', orgId, eventRows(snapshot, orgId));
    default:
      return unavailable(kind, orgId, {
        code: 'unknown_capability',
        message: 'Unknown healthcare query kind.',
      });
  }
}

export type HealthcareQueryInput = {
  kind: HealthcareKind;
  orgId?: string;
  session?: OpsSessionContext;
  go?: GoClientOptions;
};

/**
 * Probe Go for synthetic availability, then read the Next operations snapshot.
 * A credentialing or claim mutation is therefore queryable from this adapter
 * without copying records into Go.
 */
export async function queryHealthcare(input: HealthcareQueryInput): Promise<HealthcareEnvelope> {
  const probe = await probeGoHealthcare(input.go);
  const orgId = isHealthcareOrgId(input.orgId) ? input.orgId : undefined;
  if (!probe.ok) {
    return unavailable(input.kind, orgId, probe.error);
  }
  const snapshot = peekOpsSnapshot(input.session);
  return projectHealthcareFromSnapshot(snapshot, input.kind, input.orgId);
}
