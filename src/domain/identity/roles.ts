/**
 * Canonical ROOT V2 roles (CTO spec). Seed JSON maps onto this enum.
 * Appwrite Team role strings must use these values — do not reintroduce the
 * legacy guest/client_viewer/root_employee names in server code.
 */
export const roles = [
  'GUEST',
  'CLIENT_MEMBER',
  'CLIENT_FINANCE',
  'CLIENT_ADMIN',
  'CLIENT_OWNER',
  'AUDITOR_READ_ONLY',
  'ROOT_SPECIALIST',
  'ROOT_ACCOUNT_MANAGER',
  'ROOT_SUPERADMIN',
] as const;

export type Role = (typeof roles)[number];

export const permissions = [
  'public.read',
  'organization.read',
  'organization.write',
  'members.invite',
  'requests.create',
  'requests.read',
  'billing.read',
  'assigned_work.read',
  'assigned_work.update',
  'audit.read',
  'root_admin.manage',
] as const;

export type Permission = (typeof permissions)[number];

const matrix: Record<Role, readonly Permission[]> = {
  GUEST: ['public.read'],
  CLIENT_MEMBER: ['public.read', 'organization.read'],
  CLIENT_FINANCE: ['public.read', 'organization.read', 'billing.read', 'requests.read'],
  CLIENT_ADMIN: ['public.read', 'organization.read', 'requests.create', 'requests.read'],
  CLIENT_OWNER: [
    'public.read',
    'organization.read',
    'organization.write',
    'members.invite',
    'requests.create',
    'requests.read',
    'billing.read',
  ],
  AUDITOR_READ_ONLY: ['public.read', 'organization.read', 'audit.read', 'assigned_work.read'],
  ROOT_SPECIALIST: ['public.read', 'assigned_work.read', 'assigned_work.update', 'requests.read'],
  ROOT_ACCOUNT_MANAGER: [
    'public.read',
    'organization.read',
    'assigned_work.read',
    'assigned_work.update',
    'requests.read',
    'requests.create',
  ],
  ROOT_SUPERADMIN: [...permissions],
};

/** Historical seed names → canonical enum. */
export const legacyRoleMap = {
  guest: 'GUEST',
  client_viewer: 'CLIENT_MEMBER',
  client_admin: 'CLIENT_ADMIN',
  client_owner: 'CLIENT_OWNER',
  root_employee: 'ROOT_SPECIALIST',
  root_operations: 'ROOT_ACCOUNT_MANAGER',
  root_admin: 'ROOT_SUPERADMIN',
} as const;

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (roles as readonly string[]).includes(value);
}

export function roleHas(role: Role, permission: Permission): boolean {
  return matrix[role].includes(permission);
}

export function permissionsFor(role: Role): readonly Permission[] {
  return matrix[role];
}
