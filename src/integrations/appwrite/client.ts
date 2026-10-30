import { disabledAdapter, type DisabledAdapterResult } from '../disabled.ts';
import type {
  AppwriteTablesGetParams,
  AppwriteTablesListParams,
  AppwriteTablesWriteParams,
} from './types.ts';

/**
 * Typed Appwrite Auth/Teams/TablesDB surface. No network, no SDK install.
 * Live calls are not wired; do not reuse the V1 project from this client.
 */
export type AppwriteAuthClient = {
  getSession(): Promise<DisabledAdapterResult>;
  createEmailPasswordSession(_email: string, _password: string): Promise<DisabledAdapterResult>;
  deleteSession(): Promise<DisabledAdapterResult>;
};

export type AppwriteTeamsClient = {
  listMemberships(_teamId: string): Promise<DisabledAdapterResult>;
  create(_teamId: string, _name: string): Promise<DisabledAdapterResult>;
  createMembership(_teamId: string, _email: string, _roles: string[]): Promise<DisabledAdapterResult>;
};

export type AppwriteTablesClient = {
  listRows(_params: AppwriteTablesListParams): Promise<DisabledAdapterResult>;
  getRow(_params: AppwriteTablesGetParams): Promise<DisabledAdapterResult>;
  createRow(_params: AppwriteTablesWriteParams): Promise<DisabledAdapterResult>;
  updateRow(_params: AppwriteTablesWriteParams): Promise<DisabledAdapterResult>;
};

function deny(): Promise<DisabledAdapterResult> {
  return Promise.resolve(disabledAdapter('appwrite'));
}

export function createAppwriteAuthClient(): AppwriteAuthClient {
  return {
    getSession: deny,
    createEmailPasswordSession: deny,
    deleteSession: deny,
  };
}

export function createAppwriteTeamsClient(): AppwriteTeamsClient {
  return {
    listMemberships: deny,
    create: deny,
    createMembership: deny,
  };
}

export function createAppwriteTablesClient(): AppwriteTablesClient {
  return {
    listRows: deny,
    getRow: deny,
    createRow: deny,
    updateRow: deny,
  };
}
