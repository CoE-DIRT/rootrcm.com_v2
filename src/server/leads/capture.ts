import { createHash, createHmac } from 'node:crypto';
import { validateBusinessContact, type FieldErrors } from '../../lib/validation/business-contact.ts';
import { BUSINESS_CONSENT_VERSION, createLeadDedupKey } from '../../domain/lead-handling.ts';
import { LEAD_TABLES, LEAD_VALUES } from './lead-config.ts';
import type { LeadStore } from './lead-store.ts';

export type CaptureMeta = {
  /** First hop of x-forwarded-for, or empty. Used only for limiting; never stored raw. */
  ip: string;
  locale: 'en' | 'es';
  correlationId: string;
  now?: number;
  salt?: string;
};

export type CaptureResult =
  | { ok: true; accepted: true; duplicate: boolean; honeypot?: boolean }
  | { ok: false; reason: 'validation'; fieldErrors: FieldErrors }
  | { ok: false; reason: 'rate_limited' | 'store_unavailable' };

/** Honeypot field name; real users never see or fill it. */
export const HONEYPOT_FIELD = 'companyWebsite';

const WINDOW_MS = 10 * 60_000;
const MAX_PER_IP = 8;
const MAX_PER_EMAIL = 3;
const hits = new Map<string, number[]>();

export function resetLeadRateLimit() {
  hits.clear();
}

/** Per-process backstop ONLY. Live activation additionally requires a shared edge limit (lead-config). */
function allow(key: string, max: number, now: number): boolean {
  if (hits.size > 20000) hits.clear();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

const sha = (value: string) => createHash('sha256').update(value).digest('hex');

export function hashIp(ip: string, salt: string): string {
  return ip && salt ? createHmac('sha256', salt).update(ip).digest('hex').slice(0, 32) : '';
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

/**
 * Validate, rate-limit, dedupe and durably persist a consented business inquiry
 * across the existing tables:
 *   crm_companies → crm_contacts → consent_records → crm_sync_jobs (hubspot, internal) → audit_events → lead_submissions
 * Every row has a deterministic id and every create is idempotent (409 = exists), so a retry
 * re-runs the whole chain and REPAIRS any records missing after an earlier partial failure.
 * lead_submissions is written LAST: its existence implies all dependents exist, and success
 * (202) is returned only after every row exists. No CRM/email call is made inline.
 * Free text (message) is PHI-screened and then deliberately NOT stored: no live column exists for it.
 * Consent is service-contact acknowledgement only (consentType service_contact), never marketing opt-in.
 */
export async function captureLead(value: unknown, store: LeadStore, meta: CaptureMeta): Promise<CaptureResult> {
  const now = meta.now ?? Date.now();
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  if (typeof record[HONEYPOT_FIELD] === 'string' && record[HONEYPOT_FIELD] !== '') {
    return { ok: true, accepted: true, duplicate: false, honeypot: true };
  }

  const validated = validateBusinessContact(value);
  if (!validated.ok) return { ok: false, reason: 'validation', fieldErrors: validated.fieldErrors };
  const { name, email, organization, concern } = validated.data;
  const emailNorm = email.trim().toLowerCase();

  const ipHash = hashIp(meta.ip, meta.salt ?? '');
  if (!allow(`ip:${ipHash || 'unknown'}`, MAX_PER_IP, now) || !allow(`em:${sha(emailNorm)}`, MAX_PER_EMAIL, now)) {
    return { ok: false, reason: 'rate_limited' };
  }

  const at = new Date(now).toISOString();
  const dedupKey = createLeadDedupKey(email, organization);
  const day = sha(`${dedupKey}|${at.slice(0, 10)}`).slice(0, 32);
  const companyId = `co_${sha(organization.trim().toLowerCase().replace(/\s+/g, ' ')).slice(0, 32)}`;
  const contactId = `ct_${sha(emailNorm).slice(0, 32)}`;
  const leadId = `ld_${day}`;
  const jobs = [
    { id: `jb_hs_${day}`, provider: 'hubspot', operation: 'upsert_contact', objectType: 'contact', localId: contactId },
    { id: `jb_nt_${day}`, provider: 'internal', operation: 'notify_new_lead', objectType: 'lead_submission', localId: leadId },
  ];

  try {
    await store.create(LEAD_TABLES.companies, companyId, {
      name: organization,
      lifecycleStage: LEAD_VALUES.lifecycleStage,
      status: LEAD_VALUES.companyStatus,
    });
    await store.create(LEAD_TABLES.contacts, contactId, {
      ...splitName(name),
      email,
      emailNormalized: emailNorm,
      companyId,
      lifecycleStage: LEAD_VALUES.lifecycleStage,
      leadStatus: LEAD_VALUES.leadStatus,
    });
    await store.create(LEAD_TABLES.consent, `cs_${day}`, {
      subjectType: 'contact',
      subjectId: contactId,
      consentType: LEAD_VALUES.consentType,
      granted: true,
      recordedAt: at,
      policyVersion: BUSINESS_CONSENT_VERSION,
      source: LEAD_VALUES.source,
    });
    for (const job of jobs) {
      await store.create(LEAD_TABLES.syncJobs, job.id, {
        idempotencyKey: job.id,
        provider: job.provider,
        operation: job.operation,
        objectType: job.objectType,
        status: 'pending',
        localId: job.localId,
        attempts: 0,
        nextAttemptAt: at,
        createdAt: at,
      });
    }
    await store.create(LEAD_TABLES.audit, `au_${day}`, {
      eventId: `au_${day}`,
      action: 'lead.captured',
      occurredAt: at,
      actorUserId: 'anonymous',
      targetType: 'lead_submission',
      targetId: leadId,
      result: 'allow',
      requestId: meta.correlationId,
    });
    const created = await store.create(LEAD_TABLES.submissions, leadId, {
      idempotencyKey: leadId,
      dedupKey,
      source: LEAD_VALUES.source,
      status: 'new',
      capturedAt: at,
      contactId,
      companyId,
      sourceRef: (concern ?? '').slice(0, 64),
      landingPath: meta.locale === 'es' ? '/es/consultation' : '/en/consultation',
      consentGiven: true,
    });
    return { ok: true, accepted: true, duplicate: created === 'exists' };
  } catch {
    // Never claim success when any required record could not be confirmed.
    return { ok: false, reason: 'store_unavailable' };
  }
}
