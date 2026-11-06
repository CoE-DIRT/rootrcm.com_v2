/**
 * Durable lead capture configuration. Server-only.
 *
 * Capture is OFF unless ROOT_ENABLE_LEAD_CAPTURE === 'true' AND a dedicated,
 * least-privilege key (APPWRITE_LEADS_API_KEY: rows.read/rows.write on the lead
 * tables only) is configured. The auth key is never reused for lead writes.
 * Existing tables are used as-is; this module never creates schema.
 */
export const LEAD_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';

/** Existing row-secure tables in root_v2_core. Verified by scripts/ROOT_V2_Audit_Lead_Tables.ps1. */
export const LEAD_TABLES = {
  submissions: 'lead_submissions',
  consent: 'consent_records',
  syncJobs: 'crm_sync_jobs',
  audit: 'audit_events',
} as const;

export type LeadStoreConfig = {
  endpoint: string;
  projectId: string;
  databaseId: string;
  apiKey: string;
};

const validId = (id: string | undefined): id is string => !!id && /^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(id);

export function leadCaptureEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.ROOT_ENABLE_LEAD_CAPTURE === 'true' && leadStoreConfig(env) !== null;
}

export function leadStoreConfig(env: NodeJS.ProcessEnv = process.env): LeadStoreConfig | null {
  const projectId = env.APPWRITE_AUTH_PROJECT_ID;
  const databaseId = env.APPWRITE_DATABASE_ID;
  const apiKey = env.APPWRITE_LEADS_API_KEY?.trim();
  if (!validId(projectId) || !validId(databaseId) || !apiKey) return null;
  return { endpoint: LEAD_ENDPOINT, projectId, databaseId, apiKey };
}

/** Browser origin allowed to POST. Same canonical origin as auth. */
export function leadAllowedOrigin(env: NodeJS.ProcessEnv = process.env): string | null {
  const origin = env.ROOT_AUTH_ORIGIN;
  if (!origin) return null;
  try {
    return new URL(origin).origin === origin ? origin : null;
  } catch {
    return null;
  }
}
