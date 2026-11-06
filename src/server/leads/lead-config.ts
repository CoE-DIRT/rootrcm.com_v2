/**
 * Durable lead capture configuration. Server-only.
 *
 * Capture is OFF unless ROOT_ENABLE_LEAD_CAPTURE === 'true' AND every activation
 * precondition holds (see leadActivationBlockers). The dedicated least-privilege key
 * (APPWRITE_LEADS_API_KEY: rows.read/rows.write on the tables below only) is never
 * the auth key. Existing tables are used as-is; this module never creates schema.
 */
export const LEAD_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';

/** Existing row-secure tables in root_v2_core (schema verified in the PR #82 audit comment). */
export const LEAD_TABLES = {
  submissions: 'lead_submissions',
  consent: 'consent_records',
  syncJobs: 'crm_sync_jobs',
  audit: 'audit_events',
  contacts: 'crm_contacts',
  companies: 'crm_companies',
} as const;

/**
 * Values for required enum-like columns. If a live column defines a closed element
 * list these must match it; confirm in the isolated hosted smoke test before enabling.
 */
export const LEAD_VALUES = {
  lifecycleStage: 'lead',
  leadStatus: 'new',
  companyStatus: 'prospect',
  source: 'web_inquiry',
  /** Service-contact acknowledgement only. Never implies marketing opt-in. */
  consentType: 'service_contact',
} as const;

export type LeadStoreConfig = {
  endpoint: string;
  projectId: string;
  databaseId: string;
  apiKey: string;
};

const validId = (id: string | undefined): id is string => !!id && /^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(id);

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

/** Why live capture cannot activate. Empty when every precondition is configured. */
export function leadActivationBlockers(env: NodeJS.ProcessEnv = process.env): string[] {
  const blockers: string[] = [];
  if (leadStoreConfig(env) === null) blockers.push('store_config');
  if ((env.ROOT_LEAD_HASH_SALT ?? '').length < 16) blockers.push('hash_salt');
  // Attestation that a shared/distributed edge limit fronts this route; the in-process limiter is only a backstop.
  if (env.ROOT_LEAD_SHARED_RATE_LIMIT !== 'true') blockers.push('shared_rate_limit');
  if (leadAllowedOrigin(env) === null) blockers.push('allowed_origin');
  return blockers;
}

export function leadCaptureEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.ROOT_ENABLE_LEAD_CAPTURE === 'true' && leadActivationBlockers(env).length === 0;
}
