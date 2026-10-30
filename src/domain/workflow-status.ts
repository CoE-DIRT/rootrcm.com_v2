/**
 * Provider enrollment and payer transaction status envelopes.
 * External records must carry a real source reference and verification time.
 * This module does not access credentials, contact payer systems or store PHI.
 */
export const credentialingOutcomes = [
  'intake', 'documents_pending', 'caqh_attestation', 'primary_source',
  'submitted', 'payer_acknowledged', 'payer_review', 'additional_information',
  'approved_pending_effective', 'effective', 'revalidation_due',
  'rejected', 'withdrawn', 'on_hold',
] as const;
export type CredentialingOutcome = (typeof credentialingOutcomes)[number];

export type VerifiedOrigin = 'synthetic' | 'api_verified' | 'payer_portal_verified' | 'staff_verified';

export type WorkflowStatusRecord<TStatus extends string> = {
  orgId: string;
  resourceId: string;
  status: TStatus;
  origin: VerifiedOrigin;
  /** Proof of confirmation, never a public patient identifier. */
  sourceReference: string | null;
  /** Timestamp at which this specific external status was confirmed. */
  verifiedAt: string | null;
  /** Timestamp when ROOT last updated its cache; not external verification. */
  synchronizedAt: string | null;
  ownerId: string | null;
  nextAction: string | null;
  version: number;
};

export type CredentialingStatusRecord = WorkflowStatusRecord<CredentialingOutcome> & {
  providerId: string;
  payerId: string;
  locationId: string;
  enrollmentType: 'initial' | 'revalidation' | 'location_addition' | 'payer_change';
  submissionReceipt: string | null;
  /** Must come from authorized payer evidence; never infer from submission. */
  effectiveDate: string | null;
  applicationReference: string | null;
};

export type ClaimStatusState =
  | 'queued' | '837_submitted' | '999_acknowledged' | '277ca_accepted'
  | '277ca_rejected' | 'payer_processing' | '276_277_pending'
  | '276_277_adjudicated' | '835_posted' | 'denied' | 'appealed';
export type ClaimStatusRecord = WorkflowStatusRecord<ClaimStatusState> & {
  payerId: string;
  lastTransaction: '837' | '999' | '277CA' | '276/277' | '835' | 'internal' | null;
};

/** A synchronized cache entry is not the same as an externally verified status. */
export function isExternallyVerified<T extends string>(
  record: WorkflowStatusRecord<T>,
): boolean {
  if (record.origin === 'synthetic') return false;
  if (!record.sourceReference || !record.verifiedAt) return false;
  return Number.isFinite(Date.parse(record.verifiedAt));
}

/**
 * Freshness is a presentation indicator, not proof a payer has changed state.
 * The caller supplies its approved per-payer TTL; never hardcode one universal
 * real-time guarantee for credentialing, benefits and claim-status channels.
 */
export function evaluateStatusFreshness<T extends string>(
  record: WorkflowStatusRecord<T>,
  asOfMs: number,
  maxAgeMs: number,
): 'demo' | 'unverified' | 'current_snapshot' | 'stale_snapshot' {
  if (record.origin === 'synthetic') return 'demo';
  if (!isExternallyVerified(record)) return 'unverified';
  if (!Number.isFinite(asOfMs) || !Number.isFinite(maxAgeMs) || maxAgeMs < 0) return 'unverified';
  const age = asOfMs - Date.parse(record.verifiedAt!);
  if (age < 0) return 'unverified';
  return age <= maxAgeMs ? 'current_snapshot' : 'stale_snapshot';
}
