import type { Role } from './roles.ts';

export const organizationLifecycleStates = [
  'preview',
  'onboarding',
  'active',
  'suspended',
  'closed',
] as const;

export type OrganizationLifecycleState = (typeof organizationLifecycleStates)[number];

export const invitationStates = ['invited', 'active', 'revoked'] as const;

export type InvitationState = (typeof invitationStates)[number];

/** Tenant record. `id` is the only org key privileged routes may trust after PDP. */
export type Organization = {
  id: string;
  legalName: string;
  lifecycleState: OrganizationLifecycleState;
  teamId: string;
};

export type OrgMembershipRecord = {
  orgId: string;
  userId: string;
  role: Role;
  invitationState: InvitationState;
};

export type OrgScopedRef = {
  orgId: string;
};
