/**
 * Synthetic operations records for the preview command center.
 * origin is always 'synthetic'. No NPI, DOB, MRN, SSN, or patient names.
 */
import type { EntitlementRecord } from '../entitlement.ts';
import type {
  ClaimStatusRecord,
  ClaimStatusState,
  CredentialingOutcome,
  CredentialingStatusRecord,
} from '../workflow-status.ts';

export const OPS_ORIGIN = 'synthetic' as const;
export type OpsOrigin = typeof OPS_ORIGIN;

export const opsOrgIds = ['cedar-grove', 'bayview', 'metro-asc', 'root-internal'] as const;
export type OpsOrgId = (typeof opsOrgIds)[number];

export const clientOpsOrgIds = ['cedar-grove', 'bayview', 'metro-asc'] as const;
export type ClientOpsOrgId = (typeof clientOpsOrgIds)[number];

export const orgKinds = ['solo', 'multi', 'complex', 'internal'] as const;
export type OrgKind = (typeof orgKinds)[number];

export const opsPersonas = ['client', 'staff'] as const;
export type OpsPersona = (typeof opsPersonas)[number];

export const previewTiers = ['Free', 'Growth', 'Managed'] as const;
export type PreviewTier = (typeof previewTiers)[number];

export const opsActionTypes = [
  'reset',
  'advance_credentialing',
  'deny_claim',
  'advance_timeline',
  'set_persona',
  'set_tier',
] as const;
export type OpsActionType = (typeof opsActionTypes)[number];

/** Mirrors ClaimStatusState. Keep in lockstep with workflow-status.ts (do not edit that file). */
export const claimStatusStates: readonly ClaimStatusState[] = [
  'queued',
  '837_submitted',
  '999_acknowledged',
  '277ca_accepted',
  '277ca_rejected',
  'payer_processing',
  '276_277_pending',
  '276_277_adjudicated',
  '835_posted',
  'denied',
  'appealed',
];

export const eligibilityStates = [
  'queued',
  '270_submitted',
  '271_active',
  '271_inactive',
  '271_error',
  'needs_review',
] as const;
export type EligibilityState = (typeof eligibilityStates)[number];

export const authorizationStates = [
  'not_required',
  'pending',
  'submitted',
  'approved',
  'denied',
  'expired',
] as const;
export type AuthorizationState = (typeof authorizationStates)[number];

export const taskStatuses = ['open', 'blocked', 'done'] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export const taskKinds = [
  'credentialing',
  'denial',
  'eligibility',
  'authorization',
  'ar',
] as const;
export type TaskKind = (typeof taskKinds)[number];

export type OpsPreviewSession = {
  orgId: OpsOrgId;
  persona: OpsPersona;
  tier: PreviewTier;
};

export type OpsOrganization = {
  id: OpsOrgId;
  legalName: string;
  kind: OrgKind;
  lifecycleState: 'preview';
  teamId: string;
  origin: OpsOrigin;
};

export type OpsLocation = {
  id: string;
  orgId: OpsOrgId;
  label: string;
  origin: OpsOrigin;
};

/** Display alias only — never an NPI or legal name of a real clinician. */
export type OpsProvider = {
  id: string;
  orgId: OpsOrgId;
  alias: string;
  origin: OpsOrigin;
};

export type OpsPayer = {
  id: string;
  name: string;
  origin: OpsOrigin;
};

export type OpsAppointment = {
  id: string;
  orgId: OpsOrgId;
  locationId: string;
  providerId: string;
  payerId: string;
  eligibilityId: string;
  slotLabel: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'blocked';
  origin: OpsOrigin;
};

export type OpsEligibilityCheck = {
  id: string;
  orgId: OpsOrgId;
  appointmentId: string;
  payerId: string;
  state: EligibilityState;
  origin: OpsOrigin;
  sourceReference: null;
  verifiedAt: null;
  nextAction: string;
};

export type OpsAuthorization = {
  id: string;
  orgId: OpsOrgId;
  appointmentId: string;
  payerId: string;
  state: AuthorizationState;
  origin: OpsOrigin;
  nextAction: string;
};

export type OpsEncounter = {
  id: string;
  orgId: OpsOrgId;
  appointmentId: string;
  providerId: string;
  locationId: string;
  occurredAt: string;
  status: 'open' | 'coded' | 'closed';
  origin: OpsOrigin;
};

export type OpsCharge = {
  id: string;
  orgId: OpsOrgId;
  encounterId: string;
  claimId: string | null;
  serviceAlias: string;
  amountCents: number;
  status: 'captured' | 'coded' | 'billed';
  origin: OpsOrigin;
};

export type OpsClaimLine = {
  id: string;
  claimId: string;
  orgId: OpsOrgId;
  sequence: number;
  serviceAlias: string;
  units: number;
  amountCents: number;
  origin: OpsOrigin;
};

export type OpsClaim = ClaimStatusRecord & {
  id: string;
  orgId: OpsOrgId;
  locationId: string;
  providerId: string;
  encounterId: string;
  billedAmountCents: number;
  lines: OpsClaimLine[];
};

export type OpsDenial = {
  id: string;
  orgId: OpsOrgId;
  claimId: string;
  reasonCode: string;
  reasonLabel: string;
  status: 'open' | 'appealed' | 'closed';
  origin: OpsOrigin;
};

export type OpsArItem = {
  id: string;
  orgId: OpsOrgId;
  claimId: string;
  balanceCents: number;
  openedAt: string;
  status: 'open' | 'closed';
  origin: OpsOrigin;
};

export type OpsCredentialingApplication = CredentialingStatusRecord & {
  id: string;
  orgId: OpsOrgId;
};

export type OpsTask = {
  id: string;
  orgId: OpsOrgId;
  kind: TaskKind;
  status: TaskStatus;
  assignedPersona: OpsPersona;
  relatedType: 'credentialing' | 'claim' | 'eligibility' | 'authorization';
  relatedId: string;
  title: string;
  nextAction: string;
  origin: OpsOrigin;
};

export type OpsNotification = {
  id: string;
  orgId: OpsOrgId;
  audience: OpsPersona;
  title: string;
  body: string;
  relatedId: string | null;
  createdAt: string;
  read: boolean;
  origin: OpsOrigin;
};

export type OpsAuditEvent = {
  id: string;
  orgId: OpsOrgId;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  fromStatus: string | null;
  toStatus: string | null;
  at: string;
  origin: OpsOrigin;
  version: number;
};

export type OpsEntitlement = EntitlementRecord & {
  tier: PreviewTier;
};

export type OpsSnapshot = {
  clock: string;
  preview: OpsPreviewSession;
  organizations: OpsOrganization[];
  locations: OpsLocation[];
  providers: OpsProvider[];
  payers: OpsPayer[];
  appointments: OpsAppointment[];
  eligibility: OpsEligibilityCheck[];
  auths: OpsAuthorization[];
  encounters: OpsEncounter[];
  charges: OpsCharge[];
  claims: OpsClaim[];
  denials: OpsDenial[];
  arItems: OpsArItem[];
  credentialingApplications: OpsCredentialingApplication[];
  tasks: OpsTask[];
  notifications: OpsNotification[];
  auditEvents: OpsAuditEvent[];
  entitlements: OpsEntitlement[];
};

/**
 * Ratio with explicit numerator and denominator so callers never invent a KPI.
 * `value` is 0 when denominator is 0.
 */
export type RatioMetric = {
  numerator: number;
  denominator: number;
  value: number;
};

export type OpsMetrics = {
  denialRate: RatioMetric;
  openEnrollments: number;
  claimCountsByStage: Record<ClaimStatusState, number>;
  exceptionCount: number;
  daysInAr: RatioMetric;
  asOf: string;
};

export type OpsStateView = {
  origin: OpsOrigin;
  orgId: OpsOrgId;
  persona: OpsPersona;
  preview: OpsPreviewSession;
  metrics: OpsMetrics;
  organizations: OpsOrganization[];
  locations: OpsLocation[];
  providers: OpsProvider[];
  payers: OpsPayer[];
  appointments: OpsAppointment[];
  eligibility: OpsEligibilityCheck[];
  auths: OpsAuthorization[];
  encounters: OpsEncounter[];
  charges: OpsCharge[];
  claims: OpsClaim[];
  denials: OpsDenial[];
  arItems: OpsArItem[];
  credentialingApplications: OpsCredentialingApplication[];
  tasks: OpsTask[];
  notifications: OpsNotification[];
  auditEvents: OpsAuditEvent[];
  entitlements: OpsEntitlement[];
};

export type OpsActionRequest = {
  type: OpsActionType;
  orgId: string;
  persona: string;
  applicationId?: string;
  claimId?: string;
};

export function isOpsOrgId(value: unknown): value is OpsOrgId {
  return typeof value === 'string' && (opsOrgIds as readonly string[]).includes(value);
}

export function isClientOpsOrgId(value: unknown): value is ClientOpsOrgId {
  return typeof value === 'string' && (clientOpsOrgIds as readonly string[]).includes(value);
}

export function isOpsPersona(value: unknown): value is OpsPersona {
  return typeof value === 'string' && (opsPersonas as readonly string[]).includes(value);
}

export function isOpsActionType(value: unknown): value is OpsActionType {
  return typeof value === 'string' && (opsActionTypes as readonly string[]).includes(value);
}

export function isPreviewTier(value: unknown): value is PreviewTier {
  return typeof value === 'string' && (previewTiers as readonly string[]).includes(value);
}

export function cloneSnapshot(snapshot: OpsSnapshot): OpsSnapshot {
  return structuredClone(snapshot);
}

/** Happy-path enrollment sequence. Branch/terminal outcomes are not in this list. */
export const credentialingHappyPath: readonly CredentialingOutcome[] = [
  'intake',
  'documents_pending',
  'caqh_attestation',
  'primary_source',
  'submitted',
  'payer_acknowledged',
  'payer_review',
  'approved_pending_effective',
  'effective',
];

export function nextCredentialingOutcome(
  current: CredentialingOutcome,
): CredentialingOutcome | null {
  if (current === 'additional_information' || current === 'on_hold') return 'payer_review';
  if (current === 'revalidation_due') return 'submitted';
  const index = credentialingHappyPath.indexOf(current);
  if (index < 0 || index === credentialingHappyPath.length - 1) return null;
  return credentialingHappyPath[index + 1] ?? null;
}

export function credentialingNextAction(status: CredentialingOutcome): string {
  switch (status) {
    case 'intake':
      return 'Complete application intake packet';
    case 'documents_pending':
      return 'Collect outstanding enrollment documents';
    case 'caqh_attestation':
      return 'Validate CAQH attestation';
    case 'primary_source':
      return 'Complete primary-source verification';
    case 'submitted':
      return 'Confirm payer acknowledgement — submission is not an effective date';
    case 'payer_acknowledged':
      return 'Track payer review';
    case 'payer_review':
      return 'Request payer review status';
    case 'additional_information':
      return 'Supply requested payer information';
    case 'approved_pending_effective':
      return 'Await payer-stated effective date — not inferred from submission';
    case 'effective':
      return 'Monitor revalidation window';
    case 'revalidation_due':
      return 'Start revalidation packet';
    case 'rejected':
      return 'Review rejection and decide resubmit or withdraw';
    case 'withdrawn':
      return 'Close withdrawn enrollment';
    case 'on_hold':
      return 'Resolve hold reason';
    default:
      return 'Review enrollment status';
  }
}
