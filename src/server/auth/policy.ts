import { type Permission, type Role, roleHas } from '../../domain/identity/roles';
import { getFeatureFlags } from '../../lib/flags';

export type SessionPrincipal = {
  userId: string;
  email: string;
};

export type Membership = {
  orgId: string;
  role: Role;
};

export type AuthContext = {
  session: SessionPrincipal | null;
  memberships: Membership[];
};

export type PolicyDecision =
  | { allow: true; membership: Membership }
  | { allow: false; code: 'unauthenticated' | 'auth_disabled' | 'not_a_member' | 'forbidden' };

export function requireSession(ctx: AuthContext): PolicyDecision {
  const flags = getFeatureFlags();
  if (!flags.auth) return { allow: false, code: 'auth_disabled' };
  if (!ctx.session) return { allow: false, code: 'unauthenticated' };
  return {
    allow: true,
    membership: { orgId: '', role: 'GUEST' },
  };
}

/**
 * Tenant PDP. Membership on orgId is mandatory for every privileged org action.
 * ROOT_SUPERADMIN does not bypass tenant membership — that would be an IDOR hole.
 */
export function requireMembership(ctx: AuthContext, orgId: string, permission: Permission): PolicyDecision {
  const flags = getFeatureFlags();
  if (!flags.auth) return { allow: false, code: 'auth_disabled' };
  if (!ctx.session) return { allow: false, code: 'unauthenticated' };
  const membership = ctx.memberships.find((item) => item.orgId === orgId);
  if (!membership) return { allow: false, code: 'not_a_member' };
  if (!roleHas(membership.role, permission)) return { allow: false, code: 'forbidden' };
  return { allow: true, membership };
}

export function requireOrgRole(ctx: AuthContext, orgId: string, allowed: Role[]): PolicyDecision {
  const flags = getFeatureFlags();
  if (!flags.auth) return { allow: false, code: 'auth_disabled' };
  if (!ctx.session) return { allow: false, code: 'unauthenticated' };
  const membership = ctx.memberships.find((item) => item.orgId === orgId);
  if (!membership) return { allow: false, code: 'not_a_member' };
  if (!allowed.includes(membership.role)) return { allow: false, code: 'forbidden' };
  return { allow: true, membership };
}

export function syntheticPreviewContext(orgId: string, role: Role): AuthContext {
  return {
    session: { userId: 'synthetic-preview', email: 'preview@example.invalid' },
    memberships: [{ orgId, role }],
  };
}
