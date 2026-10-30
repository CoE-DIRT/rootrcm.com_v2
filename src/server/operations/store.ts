/**
 * Presentation-session store cloned from the synthetic seed.
 * Each signed demo session has its own snapshot. Reset restores that session
 * only. Browser persona is a selector, not authorization.
 */
import { computeMetrics } from '../../domain/operations/metrics.ts';
import { createSeedSnapshot } from '../../domain/operations/seed.ts';
import {
  advanceCredentialing,
  advanceTimeline,
  denyClaim,
  reset as resetSnapshot,
  setPersona,
  setTier,
} from '../../domain/operations/transitions.ts';
import {
  cloneSnapshot,
  OPS_ORIGIN,
  type OpsActionRequest,
  type OpsNotification,
  type OpsOrgId,
  type OpsPersona,
  type OpsSnapshot,
  type OpsStateView,
  type OpsTask,
} from '../../domain/operations/types.ts';
import { authorizeOpsPreview } from './policy.ts';
import {
  OPS_ACTION_LIMIT,
  OPS_ACTION_WINDOW_MS,
  OPS_SESSION_TTL_MS,
  TEST_OPS_SESSION,
  type OpsSessionContext,
} from './session.ts';

type SessionSlot = {
  snapshot: OpsSnapshot;
  expiresAt: number;
  actionTimes: number[];
};

const sessions = new Map<string, SessionSlot>();

function pruneSessions(now = Date.now()): void {
  for (const [id, slot] of sessions) {
    if (slot.expiresAt <= now) sessions.delete(id);
  }
}

function slotFor(session: OpsSessionContext, now = Date.now()): SessionSlot {
  pruneSessions(now);
  let slot = sessions.get(session.id);
  if (!slot || slot.expiresAt <= now) {
    slot = {
      snapshot: createSeedSnapshot(),
      expiresAt: now + OPS_SESSION_TTL_MS,
      actionTimes: [],
    };
    sessions.set(session.id, slot);
  } else {
    slot.expiresAt = now + OPS_SESSION_TTL_MS;
  }
  return slot;
}

export function peekOpsSnapshot(session: OpsSessionContext = TEST_OPS_SESSION): OpsSnapshot {
  return slotFor(session).snapshot;
}

export function resetOpsStore(session: OpsSessionContext = TEST_OPS_SESSION): OpsSnapshot {
  const snapshot = resetSnapshot();
  sessions.set(session.id, {
    snapshot,
    expiresAt: Date.now() + OPS_SESSION_TTL_MS,
    actionTimes: [],
  });
  return snapshot;
}

function byOrg<T extends { orgId: string }>(rows: readonly T[], orgId: OpsOrgId): T[] {
  return rows.filter((row) => row.orgId === orgId);
}

function mergeUniqueById<T extends { id: string }>(primary: T[], extra: T[]): T[] {
  const seen = new Set(primary.map((row) => row.id));
  const merged = [...primary];
  for (const row of extra) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      merged.push(row);
    }
  }
  return merged;
}

function staffAssignedTasks(snapshot: OpsSnapshot, orgId: OpsOrgId): OpsTask[] {
  return snapshot.tasks.filter(
    (task) => task.orgId !== orgId && task.assignedPersona === 'staff',
  );
}

function staffAssignedNotifications(snapshot: OpsSnapshot, orgId: OpsOrgId): OpsNotification[] {
  return snapshot.notifications.filter(
    (item) => item.orgId !== orgId && item.audience === 'staff',
  );
}

function referencedPayerIds(view: {
  claims: { payerId: string }[];
  eligibility: { payerId: string }[];
  auths: { payerId: string }[];
  credentialingApplications: { payerId: string }[];
  appointments: { payerId: string }[];
}): Set<string> {
  const ids = new Set<string>();
  for (const row of view.claims) ids.add(row.payerId);
  for (const row of view.eligibility) ids.add(row.payerId);
  for (const row of view.auths) ids.add(row.payerId);
  for (const row of view.credentialingApplications) ids.add(row.payerId);
  for (const row of view.appointments) ids.add(row.payerId);
  return ids;
}

export function projectOpsView(
  snapshot: OpsSnapshot,
  orgId: OpsOrgId,
  persona: OpsPersona,
): OpsStateView {
  const orgClaims = byOrg(snapshot.claims, orgId);
  const orgApps = byOrg(snapshot.credentialingApplications, orgId);
  const orgTasks = byOrg(snapshot.tasks, orgId);
  const orgAr = byOrg(snapshot.arItems, orgId);
  const metrics = computeMetrics({
    claims: orgClaims,
    credentialingApplications: orgApps,
    tasks: orgTasks,
    arItems: orgAr,
    clock: snapshot.clock,
  });

  const tasks =
    persona === 'staff' ? mergeUniqueById(orgTasks, staffAssignedTasks(snapshot, orgId)) : orgTasks;
  const notifications =
    persona === 'staff'
      ? mergeUniqueById(
          byOrg(snapshot.notifications, orgId),
          staffAssignedNotifications(snapshot, orgId),
        )
      : byOrg(snapshot.notifications, orgId);

  const organizations =
    persona === 'staff' ? snapshot.organizations : snapshot.organizations.filter((row) => row.id === orgId);

  const appointments = byOrg(snapshot.appointments, orgId);
  const eligibility = byOrg(snapshot.eligibility, orgId);
  const auths = byOrg(snapshot.auths, orgId);
  const claims = orgClaims;
  const credentialingApplications = orgApps;
  const payerIds = referencedPayerIds({
    claims,
    eligibility,
    auths,
    credentialingApplications,
    appointments,
  });

  const entitlement = snapshot.entitlements.find((row) => row.orgId === orgId);
  return {
    origin: OPS_ORIGIN,
    orgId,
    persona,
    preview: {
      orgId,
      persona,
      tier: entitlement?.tier ?? snapshot.preview.tier,
    },
    metrics,
    organizations,
    locations: byOrg(snapshot.locations, orgId),
    providers: byOrg(snapshot.providers, orgId),
    payers: snapshot.payers.filter((payer) => payerIds.has(payer.id)),
    appointments,
    eligibility,
    auths,
    encounters: byOrg(snapshot.encounters, orgId),
    charges: byOrg(snapshot.charges, orgId),
    claims,
    denials: byOrg(snapshot.denials, orgId),
    arItems: orgAr,
    credentialingApplications,
    tasks,
    notifications,
    auditEvents: byOrg(snapshot.auditEvents, orgId),
    entitlements: byOrg(snapshot.entitlements, orgId),
  };
}

export type OpsReadResult =
  | { ok: true; view: OpsStateView }
  | { ok: false; kind: 'denied'; decision: Extract<import('../auth/policy.ts').PolicyDecision, { allow: false }> };

export function readOpsState(
  orgId: string,
  persona: string,
  session: OpsSessionContext = TEST_OPS_SESSION,
): OpsReadResult {
  const access = authorizeOpsPreview({ orgId, persona, capability: session.capability });
  if (!access.allow) return { ok: false, kind: 'denied', decision: access.decision };
  return { ok: true, view: projectOpsView(slotFor(session).snapshot, access.orgId, access.persona) };
}

export type OpsWriteResult =
  | { ok: true; view: OpsStateView; changed: boolean }
  | { ok: false; kind: 'denied'; decision: Extract<import('../auth/policy.ts').PolicyDecision, { allow: false }> }
  | { ok: false; kind: 'unknown_action' }
  | { ok: false; kind: 'unknown_resource' }
  | { ok: false; kind: 'invalid_request' }
  | { ok: false; kind: 'rate_limited' };

function rateLimited(slot: SessionSlot, now = Date.now()): boolean {
  slot.actionTimes = slot.actionTimes.filter((stamp) => now - stamp < OPS_ACTION_WINDOW_MS);
  if (slot.actionTimes.length >= OPS_ACTION_LIMIT) return true;
  slot.actionTimes.push(now);
  return false;
}

export function applyOpsAction(
  request: OpsActionRequest,
  session: OpsSessionContext = TEST_OPS_SESSION,
): OpsWriteResult {
  if (session.capability !== 'operator') {
    return { ok: false, kind: 'denied', decision: { allow: false, code: 'forbidden' } };
  }
  const access = authorizeOpsPreview({
    orgId: request.orgId,
    persona: request.persona,
    capability: session.capability,
  });
  if (!access.allow) return { ok: false, kind: 'denied', decision: access.decision };

  const slot = slotFor(session);
  if (rateLimited(slot)) return { ok: false, kind: 'rate_limited' };

  const { orgId, persona } = access;

  switch (request.type) {
    case 'reset': {
      slot.snapshot = resetSnapshot();
      return { ok: true, view: projectOpsView(slot.snapshot, orgId, persona), changed: true };
    }
    case 'advance_credentialing': {
      if (!request.applicationId) return { ok: false, kind: 'invalid_request' };
      const result = advanceCredentialing(slot.snapshot, {
        orgId,
        persona,
        applicationId: request.applicationId,
      });
      if (result.error === 'wrong_tenant') {
        return { ok: false, kind: 'denied', decision: { allow: false, code: 'not_a_member' } };
      }
      if (result.error === 'not_found' || result.error === 'terminal') {
        return { ok: false, kind: 'unknown_resource' };
      }
      slot.snapshot = result.snapshot;
      return { ok: true, view: projectOpsView(slot.snapshot, orgId, persona), changed: result.changed };
    }
    case 'deny_claim': {
      if (!request.claimId) return { ok: false, kind: 'invalid_request' };
      const result = denyClaim(slot.snapshot, { orgId, persona, claimId: request.claimId });
      if (result.error === 'wrong_tenant') {
        return { ok: false, kind: 'denied', decision: { allow: false, code: 'not_a_member' } };
      }
      if (result.error === 'not_found') return { ok: false, kind: 'unknown_resource' };
      slot.snapshot = result.snapshot;
      return { ok: true, view: projectOpsView(slot.snapshot, orgId, persona), changed: result.changed };
    }
    case 'advance_timeline': {
      const result = advanceTimeline(slot.snapshot, { orgId, persona });
      slot.snapshot = result.snapshot;
      return { ok: true, view: projectOpsView(slot.snapshot, orgId, persona), changed: result.changed };
    }
    case 'set_persona': {
      const result = setPersona(slot.snapshot, { orgId, persona });
      slot.snapshot = result.snapshot;
      return { ok: true, view: projectOpsView(slot.snapshot, orgId, persona), changed: result.changed };
    }
    case 'set_tier': {
      const result = setTier(slot.snapshot, { orgId, persona });
      if (result.error === 'not_found' || result.error === 'invalid') {
        return { ok: false, kind: 'unknown_resource' };
      }
      slot.snapshot = result.snapshot;
      return { ok: true, view: projectOpsView(slot.snapshot, orgId, persona), changed: result.changed };
    }
    default:
      return { ok: false, kind: 'unknown_action' };
  }
}

/** Test helper: replace session state without going through actions. */
export function replaceOpsStore(
  snapshot: OpsSnapshot,
  session: OpsSessionContext = TEST_OPS_SESSION,
): void {
  sessions.set(session.id, {
    snapshot: cloneSnapshot(snapshot),
    expiresAt: Date.now() + OPS_SESSION_TTL_MS,
    actionTimes: [],
  });
}
