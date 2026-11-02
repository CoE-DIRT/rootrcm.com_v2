/**
 * Tables for an isolated V2 project. This module does not call Appwrite.
 * Row security is required. Role.any() writes are forbidden.
 */
export type AppwriteColumn = {
  key: string;
  type: 'string' | 'boolean' | 'integer';
  required: boolean;
};

export type AppwriteTablePlan = {
  id: string;
  purpose: string;
  rowSecurity: true;
  anyWrite: false;
  columns: readonly AppwriteColumn[];
};

export const appwriteTablePlan: readonly AppwriteTablePlan[] = [
  {
    id: 'organizations',
    purpose: 'Tenant root. Appwrite owns the org record.',
    rowSecurity: true,
    anyWrite: false,
    columns: [
      { key: 'legalName', type: 'string', required: true },
      { key: 'status', type: 'string', required: true },
    ],
  },
  {
    id: 'memberships',
    purpose: 'User, org, and role. Server-checked on every privileged action.',
    rowSecurity: true,
    anyWrite: false,
    columns: [
      { key: 'userId', type: 'string', required: true },
      { key: 'orgId', type: 'string', required: true },
      { key: 'role', type: 'string', required: true },
    ],
  },
  {
    id: 'business_inquiries',
    purpose: 'Business contacts only, with idempotency and delivery status.',
    rowSecurity: true,
    anyWrite: false,
    columns: [
      { key: 'idempotencyKey', type: 'string', required: true },
      { key: 'dedupKey', type: 'string', required: true },
      { key: 'deliveryStatus', type: 'string', required: true },
    ],
  },
  {
    id: 'entitlements',
    purpose: 'Server-side grants. Checkout redirects cannot insert a row.',
    rowSecurity: true,
    anyWrite: false,
    columns: [
      { key: 'orgId', type: 'string', required: true },
      { key: 'featureCode', type: 'string', required: true },
      { key: 'state', type: 'string', required: true },
      { key: 'source', type: 'string', required: true },
    ],
  },
];

export function migrationIsRowSecure(plan: readonly AppwriteTablePlan[] = appwriteTablePlan): boolean {
  return plan.every((table) => table.rowSecurity && table.anyWrite === false && table.columns.length > 0);
}
