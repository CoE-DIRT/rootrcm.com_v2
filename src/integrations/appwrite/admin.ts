import { DisabledIntegrationError } from '../disabled.ts';

function denyLiveAdmin(): never {
  throw new DisabledIntegrationError(
    'appwrite',
    'Appwrite Admin SDK is not wired. Do not reuse the V1 project or create chargeable resources from this repository.',
  );
}

/**
 * Production-shaped admin facade. Every method throws DisabledIntegrationError.
 * No Users/Teams/TablesDB mutations are issued.
 */
export function createAppwriteAdminClient() {
  return {
    users: {
      list: denyLiveAdmin,
      get: denyLiveAdmin,
      create: denyLiveAdmin,
    },
    teams: {
      list: denyLiveAdmin,
      create: denyLiveAdmin,
      createMembership: denyLiveAdmin,
    },
    tables: {
      listRows: denyLiveAdmin,
      getRow: denyLiveAdmin,
      createRow: denyLiveAdmin,
      updateRow: denyLiveAdmin,
    },
  };
}
