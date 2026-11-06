/**
 * Live column contract for the existing root_v2_core tables (verified read-only in the
 * PR #82 audit comment). Appwrite rejects unknown columns and missing required ones, so
 * MemoryLeadStore enforces this contract in tests and the audit script reads it.
 */
export type TableContract = { required: readonly string[]; optional: readonly string[] };

export const LEAD_SCHEMA: Record<string, TableContract> = {
  lead_submissions: {
    required: ['idempotencyKey', 'dedupKey', 'source', 'status', 'capturedAt'],
    optional: ['contactId', 'companyId', 'landingPath', 'campaign', 'medium', 'sourceRef', 'consentGiven', 'processedAt', 'errorCode'],
  },
  consent_records: {
    required: ['subjectType', 'subjectId', 'consentType', 'granted', 'recordedAt'],
    optional: ['policyVersion', 'source'],
  },
  crm_sync_jobs: {
    required: ['idempotencyKey', 'provider', 'operation', 'objectType', 'status'],
    optional: ['localId', 'externalId', 'attempts', 'nextAttemptAt', 'lastAttemptAt', 'lastErrorCode', 'createdAt'],
  },
  audit_events: {
    required: ['eventId', 'action', 'occurredAt'],
    optional: ['actorUserId', 'orgId', 'targetType', 'targetId', 'result', 'requestId'],
  },
  crm_contacts: {
    required: ['lifecycleStage', 'leadStatus'],
    optional: ['firstName', 'lastName', 'email', 'emailNormalized', 'companyId'],
  },
  crm_companies: {
    required: ['name', 'lifecycleStage', 'status'],
    optional: [],
  },
};

/** Returns the contract violations for a row create (empty = compatible). */
export function contractViolations(table: string, data: Record<string, unknown>): string[] {
  const contract = LEAD_SCHEMA[table];
  if (!contract) return [`unknown_table:${table}`];
  const keys = Object.keys(data);
  const allowed = new Set([...contract.required, ...contract.optional]);
  return [
    ...contract.required.filter((k) => data[k] === undefined || data[k] === null || data[k] === '').map((k) => `missing:${k}`),
    ...keys.filter((k) => !allowed.has(k)).map((k) => `unsupported:${k}`),
  ];
}
