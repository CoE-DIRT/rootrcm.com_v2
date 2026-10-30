/**
 * Deterministic relational seed for the operations preview.
 * Bayview (multi) + Cedar Grove (solo) + Metro ASC (complex) + ROOT internal.
 * Stable IDs. origin:'synthetic'. No NPI/DOB/MRN/SSN or patient names.
 */
import type { ClaimStatusState, CredentialingOutcome } from '../workflow-status.ts';
import {
  credentialingNextAction,
  OPS_ORIGIN,
  type OpsArItem,
  type OpsAuditEvent,
  type OpsAuthorization,
  type OpsClaim,
  type OpsClaimLine,
  type OpsCredentialingApplication,
  type OpsDenial,
  type OpsEligibilityCheck,
  type OpsEntitlement,
  type OpsNotification,
  type OpsSnapshot,
  type OpsTask,
} from './types.ts';

/** Frozen demo clock. advance_timeline moves this; reset restores it. */
export const SEED_CLOCK = '2026-10-30T16:00:00.000Z';

export const SEED_IDS = {
  orgs: {
    cedarGrove: 'cedar-grove',
    bayview: 'bayview',
    metroAsc: 'metro-asc',
    rootInternal: 'root-internal',
  },
  denialClaim: 'clm-bv-1002',
  deniableClaim: 'clm-bv-1001',
  bottleneckApplication: 'cred-bv-004',
  pendingEffectiveApplication: 'cred-asc-001',
  submittedApplication: 'cred-bv-003',
} as const;

function freezeAudit(events: OpsAuditEvent[]): OpsAuditEvent[] {
  return events.map((event) => Object.freeze({ ...event }));
}

function claimLines(
  claimId: string,
  orgId: OpsClaimLine['orgId'],
  aliases: readonly { alias: string; amountCents: number }[],
): OpsClaimLine[] {
  return aliases.map((item, index) => ({
    id: `${claimId}-ln-${index + 1}`,
    claimId,
    orgId,
    sequence: index + 1,
    serviceAlias: item.alias,
    units: 1,
    amountCents: item.amountCents,
    origin: OPS_ORIGIN,
  }));
}

function claim(input: {
  id: string;
  orgId: OpsClaim['orgId'];
  payerId: string;
  locationId: string;
  providerId: string;
  encounterId: string;
  status: ClaimStatusState;
  billedAmountCents: number;
  lastTransaction: OpsClaim['lastTransaction'];
  nextAction: string;
  lines: OpsClaimLine[];
}): OpsClaim {
  return {
    id: input.id,
    orgId: input.orgId,
    resourceId: input.id,
    status: input.status,
    origin: OPS_ORIGIN,
    sourceReference: null,
    verifiedAt: null,
    synchronizedAt: SEED_CLOCK,
    ownerId: 'preview-staff',
    nextAction: input.nextAction,
    version: 1,
    payerId: input.payerId,
    lastTransaction: input.lastTransaction,
    locationId: input.locationId,
    providerId: input.providerId,
    encounterId: input.encounterId,
    billedAmountCents: input.billedAmountCents,
    lines: input.lines,
  };
}

function application(input: {
  id: string;
  orgId: OpsCredentialingApplication['orgId'];
  providerId: string;
  payerId: string;
  locationId: string;
  status: CredentialingOutcome;
  enrollmentType: OpsCredentialingApplication['enrollmentType'];
  submissionReceipt: string | null;
  effectiveDate: string | null;
}): OpsCredentialingApplication {
  return {
    id: input.id,
    orgId: input.orgId,
    resourceId: input.id,
    status: input.status,
    origin: OPS_ORIGIN,
    sourceReference: null,
    verifiedAt: null,
    synchronizedAt: SEED_CLOCK,
    ownerId: 'preview-staff',
    nextAction: credentialingNextAction(input.status),
    version: 1,
    providerId: input.providerId,
    payerId: input.payerId,
    locationId: input.locationId,
    enrollmentType: input.enrollmentType,
    submissionReceipt: input.submissionReceipt,
    effectiveDate: input.effectiveDate,
    applicationReference: input.id,
  };
}

function eligibility(
  id: string,
  orgId: OpsEligibilityCheck['orgId'],
  appointmentId: string,
  payerId: string,
  state: OpsEligibilityCheck['state'],
  nextAction: string,
): OpsEligibilityCheck {
  return {
    id,
    orgId,
    appointmentId,
    payerId,
    state,
    origin: OPS_ORIGIN,
    sourceReference: null,
    verifiedAt: null,
    nextAction,
  };
}

function auth(
  id: string,
  orgId: OpsAuthorization['orgId'],
  appointmentId: string,
  payerId: string,
  state: OpsAuthorization['state'],
  nextAction: string,
): OpsAuthorization {
  return { id, orgId, appointmentId, payerId, state, origin: OPS_ORIGIN, nextAction };
}

function task(input: Omit<OpsTask, 'origin'>): OpsTask {
  return { ...input, origin: OPS_ORIGIN };
}

function notification(input: Omit<OpsNotification, 'origin' | 'read'>): OpsNotification {
  return { ...input, origin: OPS_ORIGIN, read: false };
}

function entitlement(
  orgId: OpsEntitlement['orgId'],
  tier: OpsEntitlement['tier'],
): OpsEntitlement {
  return {
    orgId,
    featureCode: 'operations_workspace',
    state: 'active',
    source: 'preview',
    tier,
  };
}

function ar(
  claimId: string,
  orgId: OpsArItem['orgId'],
  balanceCents: number,
  openedAt: string,
  status: OpsArItem['status'],
): OpsArItem {
  return {
    id: `ar-${claimId}`,
    orgId,
    claimId,
    balanceCents,
    openedAt,
    status,
    origin: OPS_ORIGIN,
  };
}

/**
 * Build a fresh snapshot. Callers must clone if they intend to mutate.
 * Relational integrity: appointments → eligibility; claims → encounters/charges/lines;
 * credentialing is provider × payer × location; one denial story; one enrollment bottleneck.
 */
export function createSeedSnapshot(): OpsSnapshot {
  const claims: OpsClaim[] = [
    claim({
      id: 'clm-bv-1001',
      orgId: 'bayview',
      payerId: 'payer-healthfirst',
      locationId: 'loc-bv-north',
      providerId: 'prv-bv-a',
      encounterId: 'enc-bv-01',
      status: 'payer_processing',
      billedAmountCents: 125000,
      lastTransaction: '276/277',
      nextAction: 'Next 276/277 status inquiry',
      lines: claimLines('clm-bv-1001', 'bayview', [
        { alias: 'established-visit', amountCents: 125000 },
      ]),
    }),
    claim({
      id: 'clm-bv-1002',
      orgId: 'bayview',
      payerId: 'payer-aetna',
      locationId: 'loc-bv-south',
      providerId: 'prv-bv-b',
      encounterId: 'enc-bv-02',
      status: 'denied',
      billedAmountCents: 240000,
      lastTransaction: '276/277',
      nextAction: 'Review payer response and prepare appeal',
      lines: claimLines('clm-bv-1002', 'bayview', [
        { alias: 'procedure-block', amountCents: 240000 },
      ]),
    }),
    claim({
      id: 'clm-bv-1003',
      orgId: 'bayview',
      payerId: 'payer-uhc',
      locationId: 'loc-bv-north',
      providerId: 'prv-bv-c',
      encounterId: 'enc-bv-03',
      status: '835_posted',
      billedAmountCents: 98000,
      lastTransaction: '835',
      nextAction: 'Reconcile posted remittance',
      lines: claimLines('clm-bv-1003', 'bayview', [{ alias: 'established-visit', amountCents: 98000 }]),
    }),
    claim({
      id: 'clm-bv-1004',
      orgId: 'bayview',
      payerId: 'payer-healthfirst',
      locationId: 'loc-bv-north',
      providerId: 'prv-bv-a',
      encounterId: 'enc-bv-04',
      status: '837_submitted',
      billedAmountCents: 110000,
      lastTransaction: '837',
      nextAction: 'Await 999 acknowledgement',
      lines: claimLines('clm-bv-1004', 'bayview', [{ alias: 'established-visit', amountCents: 110000 }]),
    }),
    claim({
      id: 'clm-bv-1005',
      orgId: 'bayview',
      payerId: 'payer-aetna',
      locationId: 'loc-bv-south',
      providerId: 'prv-bv-b',
      encounterId: 'enc-bv-05',
      status: '999_acknowledged',
      billedAmountCents: 132000,
      lastTransaction: '999',
      nextAction: 'Await 277CA acceptance',
      lines: claimLines('clm-bv-1005', 'bayview', [{ alias: 'established-visit', amountCents: 132000 }]),
    }),
    claim({
      id: 'clm-bv-1006',
      orgId: 'bayview',
      payerId: 'payer-healthfirst',
      locationId: 'loc-bv-north',
      providerId: 'prv-bv-a',
      encounterId: 'enc-bv-06',
      status: '277ca_accepted',
      billedAmountCents: 88000,
      lastTransaction: '277CA',
      nextAction: 'Track payer processing',
      lines: claimLines('clm-bv-1006', 'bayview', [{ alias: 'established-visit', amountCents: 88000 }]),
    }),
    claim({
      id: 'clm-bv-1007',
      orgId: 'bayview',
      payerId: 'payer-fidelis',
      locationId: 'loc-bv-south',
      providerId: 'prv-bv-c',
      encounterId: 'enc-bv-07',
      status: 'queued',
      billedAmountCents: 76000,
      lastTransaction: 'internal',
      nextAction: 'Submit 837',
      lines: claimLines('clm-bv-1007', 'bayview', [{ alias: 'established-visit', amountCents: 76000 }]),
    }),
    claim({
      id: 'clm-bv-1008',
      orgId: 'bayview',
      payerId: 'payer-healthfirst',
      locationId: 'loc-bv-north',
      providerId: 'prv-bv-a',
      encounterId: 'enc-bv-08',
      status: '276_277_pending',
      billedAmountCents: 154000,
      lastTransaction: '276/277',
      nextAction: 'Follow up 276/277 inquiry',
      lines: claimLines('clm-bv-1008', 'bayview', [{ alias: 'established-visit', amountCents: 154000 }]),
    }),
    claim({
      id: 'clm-cg-2001',
      orgId: 'cedar-grove',
      payerId: 'payer-healthfirst',
      locationId: 'loc-cg-main',
      providerId: 'prv-cg-a',
      encounterId: 'enc-cg-01',
      status: '835_posted',
      billedAmountCents: 72000,
      lastTransaction: '835',
      nextAction: 'Reconcile posted remittance',
      lines: claimLines('clm-cg-2001', 'cedar-grove', [
        { alias: 'established-visit', amountCents: 72000 },
      ]),
    }),
    claim({
      id: 'clm-cg-2002',
      orgId: 'cedar-grove',
      payerId: 'payer-aetna',
      locationId: 'loc-cg-main',
      providerId: 'prv-cg-a',
      encounterId: 'enc-cg-02',
      status: '277ca_rejected',
      billedAmountCents: 64000,
      lastTransaction: '277CA',
      nextAction: 'Correct 837 and resubmit',
      lines: claimLines('clm-cg-2002', 'cedar-grove', [
        { alias: 'established-visit', amountCents: 64000 },
      ]),
    }),
    claim({
      id: 'clm-cg-2003',
      orgId: 'cedar-grove',
      payerId: 'payer-healthfirst',
      locationId: 'loc-cg-main',
      providerId: 'prv-cg-a',
      encounterId: 'enc-cg-03',
      status: '276_277_pending',
      billedAmountCents: 81000,
      lastTransaction: '276/277',
      nextAction: 'Follow up 276/277 inquiry',
      lines: claimLines('clm-cg-2003', 'cedar-grove', [
        { alias: 'established-visit', amountCents: 81000 },
      ]),
    }),
    claim({
      id: 'clm-asc-3001',
      orgId: 'metro-asc',
      payerId: 'payer-uhc',
      locationId: 'loc-asc-or',
      providerId: 'prv-asc-a',
      encounterId: 'enc-asc-01',
      status: 'payer_processing',
      billedAmountCents: 410000,
      lastTransaction: '276/277',
      nextAction: 'Next 276/277 status inquiry',
      lines: claimLines('clm-asc-3001', 'metro-asc', [
        { alias: 'facility-procedure', amountCents: 410000 },
      ]),
    }),
    claim({
      id: 'clm-asc-3002',
      orgId: 'metro-asc',
      payerId: 'payer-aetna',
      locationId: 'loc-asc-or',
      providerId: 'prv-asc-a',
      encounterId: 'enc-asc-02',
      status: '837_submitted',
      billedAmountCents: 365000,
      lastTransaction: '837',
      nextAction: 'Await 999 acknowledgement',
      lines: claimLines('clm-asc-3002', 'metro-asc', [
        { alias: 'facility-procedure', amountCents: 365000 },
      ]),
    }),
    claim({
      id: 'clm-asc-3003',
      orgId: 'metro-asc',
      payerId: 'payer-healthfirst',
      locationId: 'loc-asc-or',
      providerId: 'prv-asc-a',
      encounterId: 'enc-asc-03',
      status: 'appealed',
      billedAmountCents: 288000,
      lastTransaction: 'internal',
      nextAction: 'Track appeal acknowledgement',
      lines: claimLines('clm-asc-3003', 'metro-asc', [
        { alias: 'facility-procedure', amountCents: 288000 },
      ]),
    }),
  ];

  const credentialingApplications: OpsCredentialingApplication[] = [
    application({
      id: 'cred-bv-001',
      orgId: 'bayview',
      providerId: 'prv-bv-a',
      payerId: 'payer-healthfirst',
      locationId: 'loc-bv-north',
      status: 'payer_review',
      enrollmentType: 'initial',
      submissionReceipt: 'SUB-cred-bv-001-2026-09-12',
      effectiveDate: null,
    }),
    application({
      id: 'cred-bv-002',
      orgId: 'bayview',
      providerId: 'prv-bv-b',
      payerId: 'payer-aetna',
      locationId: 'loc-bv-north',
      status: 'caqh_attestation',
      enrollmentType: 'revalidation',
      submissionReceipt: null,
      effectiveDate: null,
    }),
    application({
      id: 'cred-bv-003',
      orgId: 'bayview',
      providerId: 'prv-bv-c',
      payerId: 'payer-uhc',
      locationId: 'loc-bv-south',
      status: 'submitted',
      enrollmentType: 'location_addition',
      submissionReceipt: 'SUB-cred-bv-003-2026-10-02',
      effectiveDate: null,
    }),
    application({
      id: 'cred-bv-004',
      orgId: 'bayview',
      providerId: 'prv-bv-a',
      payerId: 'payer-fidelis',
      locationId: 'loc-bv-north',
      status: 'additional_information',
      enrollmentType: 'initial',
      submissionReceipt: 'SUB-cred-bv-004-2026-08-20',
      effectiveDate: null,
    }),
    application({
      id: 'cred-cg-001',
      orgId: 'cedar-grove',
      providerId: 'prv-cg-a',
      payerId: 'payer-healthfirst',
      locationId: 'loc-cg-main',
      status: 'documents_pending',
      enrollmentType: 'initial',
      submissionReceipt: null,
      effectiveDate: null,
    }),
    application({
      id: 'cred-asc-001',
      orgId: 'metro-asc',
      providerId: 'prv-asc-a',
      payerId: 'payer-uhc',
      locationId: 'loc-asc-or',
      status: 'approved_pending_effective',
      enrollmentType: 'initial',
      submissionReceipt: 'SUB-cred-asc-001-2026-09-01',
      effectiveDate: null,
    }),
  ];

  const denials: OpsDenial[] = [
    {
      id: 'den-bv-1002',
      orgId: 'bayview',
      claimId: 'clm-bv-1002',
      reasonCode: 'CO-16',
      reasonLabel: 'Claim lacks required attachment',
      status: 'open',
      origin: OPS_ORIGIN,
    },
  ];

  const tasks: OpsTask[] = [
    task({
      id: 'task-bv-cred-001',
      orgId: 'bayview',
      kind: 'credentialing',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'credentialing',
      relatedId: 'cred-bv-001',
      title: 'Healthfirst enrollment follow-up',
      nextAction: credentialingNextAction('payer_review'),
    }),
    task({
      id: 'task-bv-cred-002',
      orgId: 'bayview',
      kind: 'credentialing',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'credentialing',
      relatedId: 'cred-bv-002',
      title: 'Aetna CAQH attestation',
      nextAction: credentialingNextAction('caqh_attestation'),
    }),
    task({
      id: 'task-bv-cred-003',
      orgId: 'bayview',
      kind: 'credentialing',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'credentialing',
      relatedId: 'cred-bv-003',
      title: 'UHC location packet acknowledgement',
      nextAction: credentialingNextAction('submitted'),
    }),
    task({
      id: 'task-bv-cred-004',
      orgId: 'bayview',
      kind: 'credentialing',
      status: 'blocked',
      assignedPersona: 'staff',
      relatedType: 'credentialing',
      relatedId: 'cred-bv-004',
      title: 'Fidelis additional information bottleneck',
      nextAction: credentialingNextAction('additional_information'),
    }),
    task({
      id: 'task-bv-denial-1002',
      orgId: 'bayview',
      kind: 'denial',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'claim',
      relatedId: 'clm-bv-1002',
      title: 'Aetna denial review',
      nextAction: 'Review payer response and prepare appeal',
    }),
    task({
      id: 'task-bv-elg-02',
      orgId: 'bayview',
      kind: 'eligibility',
      status: 'open',
      assignedPersona: 'client',
      relatedType: 'eligibility',
      relatedId: 'elg-bv-02',
      title: 'Aetna benefits review before procedure block',
      nextAction: 'Confirm plan-level coverage before service',
    }),
    task({
      id: 'task-bv-auth-02',
      orgId: 'bayview',
      kind: 'authorization',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'authorization',
      relatedId: 'auth-bv-02',
      title: 'Prior-authorization pending for procedure block',
      nextAction: 'Submit missing authorization packet',
    }),
    task({
      id: 'task-cg-cred-001',
      orgId: 'cedar-grove',
      kind: 'credentialing',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'credentialing',
      relatedId: 'cred-cg-001',
      title: 'Cedar Grove document roster',
      nextAction: credentialingNextAction('documents_pending'),
    }),
    task({
      id: 'task-cg-claim-2002',
      orgId: 'cedar-grove',
      kind: 'denial',
      status: 'open',
      assignedPersona: 'client',
      relatedType: 'claim',
      relatedId: 'clm-cg-2002',
      title: '277CA rejection correction',
      nextAction: 'Correct 837 and resubmit',
    }),
    task({
      id: 'task-asc-cred-001',
      orgId: 'metro-asc',
      kind: 'credentialing',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'credentialing',
      relatedId: 'cred-asc-001',
      title: 'Await UHC stated effective date',
      nextAction: credentialingNextAction('approved_pending_effective'),
    }),
    task({
      id: 'task-asc-appeal-3003',
      orgId: 'metro-asc',
      kind: 'denial',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'claim',
      relatedId: 'clm-asc-3003',
      title: 'ASC appeal tracking',
      nextAction: 'Track appeal acknowledgement',
    }),
  ];

  const notifications: OpsNotification[] = [
    notification({
      id: 'ntf-bv-denial-1002',
      orgId: 'bayview',
      audience: 'staff',
      title: 'Denial posted',
      body: 'Synthetic Aetna denial on clm-bv-1002 is open for review.',
      relatedId: 'clm-bv-1002',
      createdAt: '2026-10-20T16:00:00.000Z',
    }),
    notification({
      id: 'ntf-bv-bottleneck',
      orgId: 'bayview',
      audience: 'staff',
      title: 'Enrollment bottleneck',
      body: 'Fidelis requested additional information on cred-bv-004.',
      relatedId: 'cred-bv-004',
      createdAt: '2026-10-18T16:00:00.000Z',
    }),
    notification({
      id: 'ntf-cg-docs',
      orgId: 'cedar-grove',
      audience: 'client',
      title: 'Documents pending',
      body: 'Enrollment packet for cred-cg-001 still needs documents.',
      relatedId: 'cred-cg-001',
      createdAt: '2026-10-22T16:00:00.000Z',
    }),
  ];

  const auditEvents = freezeAudit([
    {
      id: 'aud-0001',
      orgId: 'bayview',
      actorId: 'system',
      action: 'seed.created',
      resourceType: 'snapshot',
      resourceId: 'seed',
      fromStatus: null,
      toStatus: 'preview',
      at: SEED_CLOCK,
      origin: OPS_ORIGIN,
      version: 1,
    },
    {
      id: 'aud-0002',
      orgId: 'metro-asc',
      actorId: 'system',
      action: 'seed.created',
      resourceType: 'snapshot',
      resourceId: 'seed',
      fromStatus: null,
      toStatus: 'preview',
      at: SEED_CLOCK,
      origin: OPS_ORIGIN,
      version: 2,
    },
  ]);

  const snapshot: OpsSnapshot = {
    clock: SEED_CLOCK,
    preview: { orgId: 'bayview', persona: 'client', tier: 'Managed' },
    organizations: [
      {
        id: 'cedar-grove',
        legalName: 'Cedar Grove Family Practice',
        kind: 'solo',
        lifecycleState: 'preview',
        teamId: 'team-cedar-grove',
        origin: OPS_ORIGIN,
      },
      {
        id: 'bayview',
        legalName: 'Bayview Multi-Specialty Group',
        kind: 'multi',
        lifecycleState: 'preview',
        teamId: 'team-bayview',
        origin: OPS_ORIGIN,
      },
      {
        id: 'metro-asc',
        legalName: 'Metro Ambulatory Surgery Center',
        kind: 'complex',
        lifecycleState: 'preview',
        teamId: 'team-metro-asc',
        origin: OPS_ORIGIN,
      },
      {
        id: 'root-internal',
        legalName: 'ROOT operations',
        kind: 'internal',
        lifecycleState: 'preview',
        teamId: 'team-root-internal',
        origin: OPS_ORIGIN,
      },
    ],
    locations: [
      { id: 'loc-cg-main', orgId: 'cedar-grove', label: 'Main office', origin: OPS_ORIGIN },
      { id: 'loc-bv-north', orgId: 'bayview', label: 'North clinic', origin: OPS_ORIGIN },
      { id: 'loc-bv-south', orgId: 'bayview', label: 'South clinic', origin: OPS_ORIGIN },
      { id: 'loc-asc-or', orgId: 'metro-asc', label: 'OR suite 1', origin: OPS_ORIGIN },
    ],
    providers: [
      { id: 'prv-cg-a', orgId: 'cedar-grove', alias: 'Clinician A', origin: OPS_ORIGIN },
      { id: 'prv-bv-a', orgId: 'bayview', alias: 'Sample Clinician A', origin: OPS_ORIGIN },
      { id: 'prv-bv-b', orgId: 'bayview', alias: 'Sample Clinician B', origin: OPS_ORIGIN },
      { id: 'prv-bv-c', orgId: 'bayview', alias: 'Sample Clinician C', origin: OPS_ORIGIN },
      { id: 'prv-asc-a', orgId: 'metro-asc', alias: 'ASC Clinician A', origin: OPS_ORIGIN },
    ],
    payers: [
      { id: 'payer-healthfirst', name: 'Healthfirst', origin: OPS_ORIGIN },
      { id: 'payer-aetna', name: 'Aetna', origin: OPS_ORIGIN },
      { id: 'payer-uhc', name: 'UnitedHealthcare', origin: OPS_ORIGIN },
      { id: 'payer-fidelis', name: 'Fidelis Care', origin: OPS_ORIGIN },
    ],
    appointments: [
      {
        id: 'appt-bv-01',
        orgId: 'bayview',
        locationId: 'loc-bv-north',
        providerId: 'prv-bv-a',
        payerId: 'payer-healthfirst',
        eligibilityId: 'elg-bv-01',
        slotLabel: 'Morning clinic block',
        scheduledAt: '2026-10-31T14:00:00.000Z',
        status: 'scheduled',
        origin: OPS_ORIGIN,
      },
      {
        id: 'appt-bv-02',
        orgId: 'bayview',
        locationId: 'loc-bv-south',
        providerId: 'prv-bv-b',
        payerId: 'payer-aetna',
        eligibilityId: 'elg-bv-02',
        slotLabel: 'Procedure block',
        scheduledAt: '2026-11-02T15:00:00.000Z',
        status: 'blocked',
        origin: OPS_ORIGIN,
      },
      {
        id: 'appt-cg-01',
        orgId: 'cedar-grove',
        locationId: 'loc-cg-main',
        providerId: 'prv-cg-a',
        payerId: 'payer-healthfirst',
        eligibilityId: 'elg-cg-01',
        slotLabel: 'Morning clinic block',
        scheduledAt: '2026-10-31T14:30:00.000Z',
        status: 'scheduled',
        origin: OPS_ORIGIN,
      },
      {
        id: 'appt-asc-01',
        orgId: 'metro-asc',
        locationId: 'loc-asc-or',
        providerId: 'prv-asc-a',
        payerId: 'payer-uhc',
        eligibilityId: 'elg-asc-01',
        slotLabel: 'Procedure block',
        scheduledAt: '2026-11-03T13:00:00.000Z',
        status: 'scheduled',
        origin: OPS_ORIGIN,
      },
    ],
    eligibility: [
      eligibility(
        'elg-bv-01',
        'bayview',
        'appt-bv-01',
        'payer-healthfirst',
        '271_active',
        'Coverage snapshot on file for this slot',
      ),
      eligibility(
        'elg-bv-02',
        'bayview',
        'appt-bv-02',
        'payer-aetna',
        'needs_review',
        'Confirm plan-level coverage before service',
      ),
      eligibility(
        'elg-cg-01',
        'cedar-grove',
        'appt-cg-01',
        'payer-healthfirst',
        '270_submitted',
        'Await 271 response',
      ),
      eligibility(
        'elg-asc-01',
        'metro-asc',
        'appt-asc-01',
        'payer-uhc',
        '271_active',
        'Coverage snapshot on file for this slot',
      ),
    ],
    auths: [
      auth('auth-bv-01', 'bayview', 'appt-bv-01', 'payer-healthfirst', 'not_required', 'No auth required'),
      auth(
        'auth-bv-02',
        'bayview',
        'appt-bv-02',
        'payer-aetna',
        'pending',
        'Submit missing authorization packet',
      ),
      auth('auth-cg-01', 'cedar-grove', 'appt-cg-01', 'payer-healthfirst', 'not_required', 'No auth required'),
      auth('auth-asc-01', 'metro-asc', 'appt-asc-01', 'payer-uhc', 'approved', 'Authorization on file'),
    ],
    encounters: [
      {
        id: 'enc-bv-01',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-01',
        providerId: 'prv-bv-a',
        locationId: 'loc-bv-north',
        occurredAt: '2026-10-01T14:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-bv-02',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-02',
        providerId: 'prv-bv-b',
        locationId: 'loc-bv-south',
        occurredAt: '2026-09-15T15:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-bv-03',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-03',
        providerId: 'prv-bv-c',
        locationId: 'loc-bv-north',
        occurredAt: '2026-09-20T14:00:00.000Z',
        status: 'closed',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-bv-04',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-04',
        providerId: 'prv-bv-a',
        locationId: 'loc-bv-north',
        occurredAt: '2026-10-22T14:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-bv-05',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-05',
        providerId: 'prv-bv-b',
        locationId: 'loc-bv-south',
        occurredAt: '2026-10-24T15:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-bv-06',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-06',
        providerId: 'prv-bv-a',
        locationId: 'loc-bv-north',
        occurredAt: '2026-10-18T14:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-bv-07',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-07',
        providerId: 'prv-bv-c',
        locationId: 'loc-bv-south',
        occurredAt: '2026-10-28T14:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-bv-08',
        orgId: 'bayview',
        appointmentId: 'appt-hist-bv-08',
        providerId: 'prv-bv-a',
        locationId: 'loc-bv-north',
        occurredAt: '2026-10-10T14:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-cg-01',
        orgId: 'cedar-grove',
        appointmentId: 'appt-hist-cg-01',
        providerId: 'prv-cg-a',
        locationId: 'loc-cg-main',
        occurredAt: '2026-09-22T14:30:00.000Z',
        status: 'closed',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-cg-02',
        orgId: 'cedar-grove',
        appointmentId: 'appt-hist-cg-02',
        providerId: 'prv-cg-a',
        locationId: 'loc-cg-main',
        occurredAt: '2026-10-21T14:30:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-cg-03',
        orgId: 'cedar-grove',
        appointmentId: 'appt-hist-cg-03',
        providerId: 'prv-cg-a',
        locationId: 'loc-cg-main',
        occurredAt: '2026-10-08T14:30:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-asc-01',
        orgId: 'metro-asc',
        appointmentId: 'appt-hist-asc-01',
        providerId: 'prv-asc-a',
        locationId: 'loc-asc-or',
        occurredAt: '2026-10-05T13:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-asc-02',
        orgId: 'metro-asc',
        appointmentId: 'appt-hist-asc-02',
        providerId: 'prv-asc-a',
        locationId: 'loc-asc-or',
        occurredAt: '2026-10-25T13:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
      {
        id: 'enc-asc-03',
        orgId: 'metro-asc',
        appointmentId: 'appt-hist-asc-03',
        providerId: 'prv-asc-a',
        locationId: 'loc-asc-or',
        occurredAt: '2026-09-10T13:00:00.000Z',
        status: 'coded',
        origin: OPS_ORIGIN,
      },
    ],
    charges: claims.map((item) => ({
      id: `chg-${item.id}`,
      orgId: item.orgId,
      encounterId: item.encounterId,
      claimId: item.id,
      serviceAlias: item.lines[0]?.serviceAlias ?? 'established-visit',
      amountCents: item.billedAmountCents,
      status: 'billed' as const,
      origin: OPS_ORIGIN,
    })),
    claims,
    denials,
    arItems: [
      ar('clm-bv-1001', 'bayview', 125000, '2026-10-01T14:00:00.000Z', 'open'),
      ar('clm-bv-1002', 'bayview', 240000, '2026-09-15T15:00:00.000Z', 'open'),
      ar('clm-bv-1003', 'bayview', 0, '2026-09-20T14:00:00.000Z', 'closed'),
      ar('clm-bv-1004', 'bayview', 110000, '2026-10-22T14:00:00.000Z', 'open'),
      ar('clm-bv-1005', 'bayview', 132000, '2026-10-24T15:00:00.000Z', 'open'),
      ar('clm-bv-1006', 'bayview', 88000, '2026-10-18T14:00:00.000Z', 'open'),
      ar('clm-bv-1007', 'bayview', 76000, '2026-10-28T14:00:00.000Z', 'open'),
      ar('clm-bv-1008', 'bayview', 154000, '2026-10-10T14:00:00.000Z', 'open'),
      ar('clm-cg-2001', 'cedar-grove', 0, '2026-09-22T14:30:00.000Z', 'closed'),
      ar('clm-cg-2002', 'cedar-grove', 64000, '2026-10-21T14:30:00.000Z', 'open'),
      ar('clm-cg-2003', 'cedar-grove', 81000, '2026-10-08T14:30:00.000Z', 'open'),
      ar('clm-asc-3001', 'metro-asc', 410000, '2026-10-05T13:00:00.000Z', 'open'),
      ar('clm-asc-3002', 'metro-asc', 365000, '2026-10-25T13:00:00.000Z', 'open'),
      ar('clm-asc-3003', 'metro-asc', 288000, '2026-09-10T13:00:00.000Z', 'open'),
    ],
    credentialingApplications,
    tasks,
    notifications,
    auditEvents,
    entitlements: [
      entitlement('cedar-grove', 'Free'),
      entitlement('bayview', 'Managed'),
      entitlement('metro-asc', 'Growth'),
      entitlement('root-internal', 'Managed'),
    ],
  };

  return snapshot;
}
