/**
 * Operations preview access. Reuses membership + entitlement shapes.
 * Demo override is preview-only: never Stripe, never a live Appwrite session.
 */
import { roleHas, type Permission } from '../../domain/identity/roles.ts';
import {
  isClientOpsOrgId,
  isOpsOrgId,
  isOpsPersona,
  type OpsOrgId,
  type OpsPersona,
} from '../../domain/operations/types.ts';
import type { EntitlementGrant, PolicyDecision } from '../auth/policy.ts';
import { syntheticPreviewContext } from '../auth/policy.ts';
import type { OpsCapability } from './session.ts';

export type OpsAccessRequest = {
  orgId: string;
  persona: string;
  capability?: OpsCapability;
};

export type OpsAccessOk = {
  allow: true;
  orgId: OpsOrgId;
  persona: OpsPersona;
  grant: EntitlementGrant;
};

export type OpsAccessDenied = {
  allow: false;
  decision: Extract<PolicyDecision, { allow: false }>;
};

const PREVIEW_FEATURE = 'operations_workspace';

function previewRole(persona: OpsPersona) {
  return persona === 'staff' ? ('ROOT_ACCOUNT_MANAGER' as const) : ('CLIENT_OWNER' as const);
}

function previewPermission(persona: OpsPersona): Permission {
  return persona === 'staff' ? 'assigned_work.read' : 'organization.read';
}

function previewGrant(orgId: OpsOrgId): EntitlementGrant {
  return { orgId, featureCode: PREVIEW_FEATURE, state: 'active' };
}

/**
 * Tenant PDP for the synthetic operations engine.
 * Browser persona/orgId are selectors. Capability comes from the signed
 * presentation cookie, never from the JSON body.
 * Entitlement source is always preview — Stripe is never consulted.
 */
export function authorizeOpsPreview(request: OpsAccessRequest): OpsAccessOk | OpsAccessDenied {
  const capability = request.capability ?? 'operator';
  const requestedPersona = capability === 'client' ? 'client' : request.persona;
  if (!isOpsPersona(requestedPersona)) {
    return { allow: false, decision: { allow: false, code: 'forbidden' } };
  }
  if (!isOpsOrgId(request.orgId)) {
    return { allow: false, decision: { allow: false, code: 'not_a_member' } };
  }

  const persona = requestedPersona;
  const orgId = request.orgId;

  if (persona === 'client' && !isClientOpsOrgId(orgId)) {
    return { allow: false, decision: { allow: false, code: 'forbidden' } };
  }

  const role = previewRole(persona);
  const permission = previewPermission(persona);
  const ctx =
    persona === 'staff'
      ? {
          session: { userId: 'preview-staff', email: 'preview@example.invalid' },
          memberships: [
            { orgId: 'cedar-grove' as const, role },
            { orgId: 'bayview' as const, role },
            { orgId: 'metro-asc' as const, role },
            { orgId: 'root-internal' as const, role },
          ],
        }
      : syntheticPreviewContext(orgId, role);

  const membership = ctx.memberships.find((item) => item.orgId === orgId);
  if (!membership) {
    return { allow: false, decision: { allow: false, code: 'not_a_member' } };
  }
  if (!roleHas(membership.role, permission)) {
    return { allow: false, decision: { allow: false, code: 'forbidden' } };
  }

  const grant = previewGrant(orgId);
  if (grant.orgId !== orgId || grant.state !== 'active') {
    return { allow: false, decision: { allow: false, code: 'entitlement_inactive' } };
  }

  return { allow: true, orgId, persona, grant };
}
