import { createHash, createHmac } from 'node:crypto';
import { validateBusinessContact, type FieldErrors } from '../../lib/validation/business-contact.ts';
import { BUSINESS_CONSENT_VERSION, createLeadDedupKey } from '../../domain/lead-handling.ts';
import { LEAD_TABLES } from './lead-config.ts';
import type { LeadStore } from './lead-store.ts';

export type CaptureMeta = {
  /** First hop of x-forwarded-for, or empty. Only a salted hash is stored. */
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

/** Per-instance backstop. Deployment must additionally enforce a shared ingress limit. */
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

export function hashIp(ip: string, salt = ''): string {
  return ip ? createHmac('sha256', salt || 'root-lead').update(ip).digest('hex').slice(0, 32) : '';
}

function ids(dedupKey: string, day: string) {
  const h = sha(`${dedupKey}|${day}`).slice(0, 32);
  return { lead: `ld_${h}`, consent: `cs_${h}`, hubspot: `jb_hs_${h}`, notify: `jb_nt_${h}`, audit: `au_${h}` };
}

/**
 * Validate, rate-limit, dedupe and durably persist a consented business inquiry,
 * plus consent proof, outbox jobs and an audit event. Returns success ONLY after
 * the lead row is durably written. Never calls a CRM inline; the outbox worker does.
 * Free text is PHI-screened by validateBusinessContact. Duplicate submissions on the
 * same UTC day are acknowledged identically (no existence oracle) and create nothing new.
 */
export async function captureLead(value: unknown, store: LeadStore, meta: CaptureMeta): Promise<CaptureResult> {
  const now = meta.now ?? Date.now();
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  if (typeof record[HONEYPOT_FIELD] === 'string' && record[HONEYPOT_FIELD] !== '') {
    return { ok: true, accepted: true, duplicate: false, honeypot: true };
  }

  const validated = validateBusinessContact(value);
  if (!validated.ok) return { ok: false, reason: 'validation', fieldErrors: validated.fieldErrors };
  const { name, email, organization, message, concern } = validated.data;

  const ipHash = hashIp(meta.ip, meta.salt);
  if (!allow(`ip:${ipHash || 'unknown'}`, MAX_PER_IP, now) || !allow(`em:${sha(email.toLowerCase())}`, MAX_PER_EMAIL, now)) {
    return { ok: false, reason: 'rate_limited' };
  }

  const at = new Date(now).toISOString();
  const dedupKey = createLeadDedupKey(email, organization);
  const id = ids(dedupKey, at.slice(0, 10));
  try {
    const created = await store.create(LEAD_TABLES.submissions, id.lead, {
      idempotencyKey: id.lead,
      dedupKey,
      name,
      email: email.toLowerCase(),
      organization,
      message: message ?? '',
      concern: concern ?? '',
      locale: meta.locale,
      status: 'new',
      consentVersion: BUSINESS_CONSENT_VERSION,
      consentAt: at,
      correlationId: meta.correlationId,
      ipHash,
      createdAt: at,
    });
    if (created === 'exists') return { ok: true, accepted: true, duplicate: true };

    await store.create(LEAD_TABLES.consent, id.consent, {
      subjectEmail: email.toLowerCase(),
      purpose: 'business_inquiry',
      version: BUSINESS_CONSENT_VERSION,
      leadId: id.lead,
      grantedAt: at,
      ipHash,
      correlationId: meta.correlationId,
    });
    for (const [jobId, target] of [
      [id.hubspot, 'hubspot'],
      [id.notify, 'notify'],
    ] as const) {
      await store.create(LEAD_TABLES.syncJobs, jobId, {
        leadId: id.lead,
        target,
        status: 'pending',
        attempts: 0,
        nextAttemptAt: at,
        lastError: '',
        createdAt: at,
      });
    }
    await store.create(LEAD_TABLES.audit, id.audit, {
      action: 'lead.captured',
      actorUserId: 'anonymous',
      resourceId: id.lead,
      result: 'allow',
      correlationId: meta.correlationId,
      at,
    });
    return { ok: true, accepted: true, duplicate: false };
  } catch {
    // Never claim success when the durable write did not complete.
    return { ok: false, reason: 'store_unavailable' };
  }
}
