/**
 * Member dashboard access + synthetic sample projection.
 *
 * This is deliberately separate from the signed preview-cookie ops API
 * (signed demo capability). Authorization here comes only from a verified
 * Appwrite session + active membership (`getAuthContext` / `requireMembership`).
 * Browser `orgId` is a selector that must match a membership; it never picks data.
 *
 * No durable operational persistence or org linkage exists yet, so the payload is
 * a fresh synthetic fixture projection, labeled sample and read-only. Fixture
 * org ids (bayview, root-internal…) are never real tenants and are never derived
 * from the caller's orgId.
 */
import type { Permission } from '../../domain/identity/roles.ts';
import { createSeedSnapshot } from '../../domain/operations/seed.ts';
import type { OpsOrgId, OpsPersona, OpsStateView } from '../../domain/operations/types.ts';
import { requireMembership, type AuthContext, type Membership, type PolicyDecision } from '../auth/policy.ts';
import { projectOpsView } from './store.ts';

export const memberDashboardKinds = ['client', 'staff', 'admin'] as const;
export type MemberDashboardKind = (typeof memberDashboardKinds)[number];

export function isMemberDashboardKind(value: unknown): value is MemberDashboardKind {
  return typeof value === 'string' && (memberDashboardKinds as readonly string[]).includes(value);
}

export const kindPermission: Record<MemberDashboardKind, Permission> = {
  admin: 'root_admin.manage',
  staff: 'assigned_work.update',
  client: 'organization.read',
};

const kindOrder: readonly MemberDashboardKind[] = ['admin', 'staff', 'client'];

export type MemberAccess =
  | { allow: true; kind: MemberDashboardKind; membership: Membership }
  | { allow: false; decision: Extract<PolicyDecision, { allow: false }> };

/** Requested orgId must be one of the caller's own memberships holding the permission. */
export function authorizeMemberDashboard(
  ctx: AuthContext,
  kind: MemberDashboardKind,
  requestedOrgId?: string | null,
): MemberAccess {
  const permission = kindPermission[kind];
  // Surfaces auth_disabled / unauthenticated before membership lookup.
  const gate = requireMembership(ctx, requestedOrgId ?? '', permission);
  if (!gate.allow && (gate.code === 'auth_disabled' || gate.code === 'unauthenticated')) {
    return { allow: false, decision: gate };
  }
  if (requestedOrgId) {
    return gate.allow
      ? { allow: true, kind, membership: gate.membership }
      : { allow: false, decision: gate };
  }
  for (const m of ctx.memberships) {
    const decision = requireMembership(ctx, m.orgId, permission);
    if (decision.allow) return { allow: true, kind, membership: decision.membership };
  }
  return { allow: false, decision: { allow: false, code: ctx.memberships.length ? 'forbidden' : 'not_a_member' } };
}

/** Highest-privilege role-matched entry for post-login routing. */
export function defaultMemberDashboard(ctx: AuthContext): { kind: MemberDashboardKind; orgId: string } | null {
  for (const kind of kindOrder) {
    const access = authorizeMemberDashboard(ctx, kind);
    if (access.allow) return { kind, orgId: access.membership.orgId };
  }
  return null;
}

const FIXTURE: Record<MemberDashboardKind, { orgId: OpsOrgId; persona: OpsPersona }> = {
  client: { orgId: 'bayview', persona: 'client' },
  staff: { orgId: 'root-internal', persona: 'staff' },
  admin: { orgId: 'root-internal', persona: 'staff' },
};

export type MemberSampleView = OpsStateView & {
  member: { kind: MemberDashboardKind; orgId: string; role: string };
  sample: true;
  readOnly: true;
};

/** Fresh fixture per call: no session store, no writes, nothing shared between callers. */
export function buildMemberSample(access: Extract<MemberAccess, { allow: true }>): MemberSampleView {
  const fixture = FIXTURE[access.kind];
  const view = projectOpsView(createSeedSnapshot(), fixture.orgId, fixture.persona);
  return {
    ...view,
    member: { kind: access.kind, orgId: access.membership.orgId, role: access.membership.role },
    sample: true,
    readOnly: true,
  };
}
