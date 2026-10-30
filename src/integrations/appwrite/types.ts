import type { Role } from '../../domain/identity/roles.ts';

export type AppwriteSessionSnapshot = {
  userId: string;
  email: string;
  expire: string;
};

export type AppwriteTeamMembership = {
  teamId: string;
  userId: string;
  roles: Role[];
};

export type AppwriteTablesListParams = {
  databaseId?: string;
  tableId: string;
  queries?: string[];
};

export type AppwriteTablesGetParams = {
  databaseId?: string;
  tableId: string;
  rowId: string;
};

export type AppwriteTablesWriteParams = AppwriteTablesGetParams & {
  data: Record<string, unknown>;
};
