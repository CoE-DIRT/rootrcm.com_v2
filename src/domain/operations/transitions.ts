/**
 * Pure snapshot transitions. Submission is never treated as an effective date.
 * Audit events are append-only; callers must not mutate prior entries.
 */
import { createSeedSnapshot } from './seed.ts';
import {
  cloneSnapshot,
  credentialingNextAction,
  nextCredentialingOutcome,
  OPS_ORIGIN,
  type OpsAuditEvent,
  type OpsNotification,
  type OpsOrgId,
  type OpsPersona,
  type OpsSnapshot,
  type OpsTask,
  type PreviewTier,
  previewTiers,
} from './types.ts';

export type TransitionErrorCode = 'not_found' | 'wrong_tenant' | 'terminal' | 'invalid';

export type TransitionResult = {
  snapshot: OpsSnapshot;
  changed: boolean;
  error?: TransitionErrorCode;
};

function nextId(prefix: string, count: number): string {
  return `${prefix}-${String(count + 1).padStart(4, '0')}`;
}

function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function addDays(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * 86_400_000).toISOString();
}

export function appendAudit(
  snapshot: OpsSnapshot,
  partial: Omit<OpsAuditEvent, 'id' | 'version' | 'origin'>,
): OpsSnapshot {
  const version = snapshot.auditEvents.length + 1;
  const event: OpsAuditEvent = Object.freeze({
    id: nextId('aud', snapshot.auditEvents.length),
    origin: OPS_ORIGIN,
    version,
    ...partial,
  });
  snapshot.auditEvents.push(event);
  return snapshot;
}

function nextTaskId(snapshot: OpsSnapshot): string {
  return nextId('task', snapshot.tasks.length);
}

function nextNotificationId(snapshot: OpsSnapshot): string {
  return nextId('ntf', snapshot.notifications.length);
}

function nextDenialId(snapshot: OpsSnapshot): string {
  return nextId('den', snapshot.denials.length);
}

function actorFor(persona: OpsPersona): string {
  return persona === 'staff' ? 'preview-staff' : 'preview-client';
}

export function reset(): OpsSnapshot {
  return createSeedSnapshot();
}

/**
 * Move one enrollment along the happy path (or off a branch state).
 * `submitted` / `approved_pending_effective` never write effectiveDate.
 * Only `effective` receives a payer-style effective date, distinct from submission.
 */
export function advanceCredentialing(
  input: OpsSnapshot,
  params: { orgId: OpsOrgId; applicationId: string; persona: OpsPersona },
): TransitionResult {
  const snapshot = cloneSnapshot(input);
  const app = snapshot.credentialingApplications.find((row) => row.id === params.applicationId);
  if (!app) return { snapshot: input, changed: false, error: 'not_found' };
  if (app.orgId !== params.orgId) return { snapshot: input, changed: false, error: 'wrong_tenant' };

  const next = nextCredentialingOutcome(app.status);
  if (!next) return { snapshot: input, changed: false, error: 'terminal' };

  const fromStatus = app.status;
  app.status = next;
  app.nextAction = credentialingNextAction(next);
  app.version += 1;
  app.synchronizedAt = snapshot.clock;
  app.ownerId = actorFor(params.persona);

  if (next === 'submitted' && !app.submissionReceipt) {
    app.submissionReceipt = `SUB-${app.id}-${dateOnly(snapshot.clock)}`;
  }
  if (next === 'effective') {
    // Effective date is evidence of payer activation, not the submission timestamp.
    app.effectiveDate = dateOnly(snapshot.clock);
  }

  const relatedTasks = snapshot.tasks.filter(
    (row) => row.relatedType === 'credentialing' && row.relatedId === app.id,
  );
  for (const item of relatedTasks) {
    item.status = next === 'effective' || next === 'rejected' || next === 'withdrawn' ? 'done' : 'open';
    item.nextAction = app.nextAction;
  }
  if (relatedTasks.length === 0 && next !== 'effective') {
    const created: OpsTask = {
      id: nextTaskId(snapshot),
      orgId: app.orgId,
      kind: 'credentialing',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'credentialing',
      relatedId: app.id,
      title: `Enrollment follow-up ${app.id}`,
      nextAction: app.nextAction,
      origin: OPS_ORIGIN,
    };
    snapshot.tasks.push(created);
  }

  const notice: OpsNotification = {
    id: nextNotificationId(snapshot),
    orgId: app.orgId,
    audience: 'staff',
    title: 'Credentialing status advanced',
    body: `${app.id} moved from ${fromStatus} to ${next}.`,
    relatedId: app.id,
    createdAt: snapshot.clock,
    read: false,
    origin: OPS_ORIGIN,
  };
  snapshot.notifications.push(notice);

  appendAudit(snapshot, {
    orgId: app.orgId,
    actorId: actorFor(params.persona),
    action: 'advance_credentialing',
    resourceType: 'credentialing',
    resourceId: app.id,
    fromStatus,
    toStatus: next,
    at: snapshot.clock,
  });

  return { snapshot, changed: true };
}

export function denyClaim(
  input: OpsSnapshot,
  params: { orgId: OpsOrgId; claimId: string; persona: OpsPersona },
): TransitionResult {
  const snapshot = cloneSnapshot(input);
  const claim = snapshot.claims.find((row) => row.id === params.claimId);
  if (!claim) return { snapshot: input, changed: false, error: 'not_found' };
  if (claim.orgId !== params.orgId) return { snapshot: input, changed: false, error: 'wrong_tenant' };

  if (claim.status === 'denied') {
    return { snapshot: input, changed: false };
  }

  const fromStatus = claim.status;
  claim.status = 'denied';
  claim.lastTransaction = '276/277';
  claim.nextAction = 'Review payer response and prepare appeal';
  claim.version += 1;
  claim.synchronizedAt = snapshot.clock;
  claim.ownerId = actorFor(params.persona);

  let denial = snapshot.denials.find((row) => row.claimId === claim.id);
  if (!denial) {
    denial = {
      id: nextDenialId(snapshot),
      orgId: claim.orgId,
      claimId: claim.id,
      reasonCode: 'CO-16',
      reasonLabel: 'Claim lacks required attachment',
      status: 'open',
      origin: OPS_ORIGIN,
    };
    snapshot.denials.push(denial);
  } else {
    denial.status = 'open';
  }

  const existingTask = snapshot.tasks.find(
    (row) => row.relatedType === 'claim' && row.relatedId === claim.id && row.kind === 'denial',
  );
  if (existingTask) {
    existingTask.status = 'open';
    existingTask.nextAction = claim.nextAction ?? 'Review denial';
  } else {
    const created: OpsTask = {
      id: nextTaskId(snapshot),
      orgId: claim.orgId,
      kind: 'denial',
      status: 'open',
      assignedPersona: 'staff',
      relatedType: 'claim',
      relatedId: claim.id,
      title: `Denial review ${claim.id}`,
      nextAction: claim.nextAction ?? 'Review denial',
      origin: OPS_ORIGIN,
    };
    snapshot.tasks.push(created);
  }

  snapshot.notifications.push({
    id: nextNotificationId(snapshot),
    orgId: claim.orgId,
    audience: 'staff',
    title: 'Claim denied',
    body: `${claim.id} moved from ${fromStatus} to denied.`,
    relatedId: claim.id,
    createdAt: snapshot.clock,
    read: false,
    origin: OPS_ORIGIN,
  });

  appendAudit(snapshot, {
    orgId: claim.orgId,
    actorId: actorFor(params.persona),
    action: 'deny_claim',
    resourceType: 'claim',
    resourceId: claim.id,
    fromStatus,
    toStatus: 'denied',
    at: snapshot.clock,
  });

  return { snapshot, changed: true };
}

/** Advance the synthetic clock. Does not fabricate payer outcomes. */
export function advanceTimeline(input: OpsSnapshot, params: { orgId: OpsOrgId; persona: OpsPersona }): TransitionResult {
  const snapshot = cloneSnapshot(input);
  const fromClock = snapshot.clock;
  snapshot.clock = addDays(snapshot.clock, 7);
  appendAudit(snapshot, {
    orgId: params.orgId,
    actorId: actorFor(params.persona),
    action: 'advance_timeline',
    resourceType: 'clock',
    resourceId: 'preview-clock',
    fromStatus: fromClock,
    toStatus: snapshot.clock,
    at: snapshot.clock,
  });
  return { snapshot, changed: true };
}

export function setPersona(
  input: OpsSnapshot,
  params: { orgId: OpsOrgId; persona: OpsPersona },
): TransitionResult {
  const snapshot = cloneSnapshot(input);
  const from = snapshot.preview.persona;
  snapshot.preview = { ...snapshot.preview, orgId: params.orgId, persona: params.persona };
  appendAudit(snapshot, {
    orgId: params.orgId,
    actorId: actorFor(params.persona),
    action: 'set_persona',
    resourceType: 'preview',
    resourceId: 'preview-session',
    fromStatus: from,
    toStatus: params.persona,
    at: snapshot.clock,
  });
  return { snapshot, changed: from !== params.persona || input.preview.orgId !== params.orgId };
}

function nextTier(current: PreviewTier): PreviewTier {
  const index = previewTiers.indexOf(current);
  return previewTiers[(index + 1) % previewTiers.length] ?? 'Free';
}

/** Preview catalog label only. Never writes a Stripe entitlement. */
export function setTier(
  input: OpsSnapshot,
  params: { orgId: OpsOrgId; persona: OpsPersona },
): TransitionResult {
  const snapshot = cloneSnapshot(input);
  const grant = snapshot.entitlements.find((row) => row.orgId === params.orgId);
  if (!grant) return { snapshot: input, changed: false, error: 'not_found' };
  if (grant.source !== 'preview') return { snapshot: input, changed: false, error: 'invalid' };

  const from = grant.tier;
  const to = nextTier(from);
  grant.tier = to;
  grant.source = 'preview';
  snapshot.preview = { ...snapshot.preview, orgId: params.orgId, persona: params.persona, tier: to };

  appendAudit(snapshot, {
    orgId: params.orgId,
    actorId: actorFor(params.persona),
    action: 'set_tier',
    resourceType: 'entitlement',
    resourceId: params.orgId,
    fromStatus: from,
    toStatus: to,
    at: snapshot.clock,
  });
  return { snapshot, changed: true };
}
