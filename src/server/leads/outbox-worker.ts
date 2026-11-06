import type { LeadStore } from './lead-store.ts';
import { LEAD_TABLES } from './lead-config.ts';

export type JobOutcome = { ok: true; externalId?: string } | { ok: false; error: string; permanent?: boolean };

/**
 * A transport per provider. It MUST be idempotent on `idempotencyKey`: the Appwrite store has no
 * compare-and-set, so two workers can occasionally claim one job. A provider with no enabled
 * transport is never attempted and consumes no attempts.
 */
export type JobTransport = (job: { id: string; idempotencyKey: string; localId: string; operation: string; attempts: number }) => Promise<JobOutcome>;
export type JobTransports = Partial<Record<'hubspot' | 'internal', JobTransport>>;

export const MAX_JOB_ATTEMPTS = 6;
export const LEASE_MS = 5 * 60_000;
const BASE_DELAY_MS = 60_000;
const MAX_DELAY_MS = 6 * 3_600_000;

export function nextDelayMs(attempt: number): number {
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** Math.max(0, attempt - 1));
}

export type DrainSummary = { delivered: number; retried: number; dead: number; skipped: number; contended: number };

/**
 * Drain due jobs: lease → transport → delivered | retry (exponential backoff) | dead.
 * Expired leases (crashed worker) become due again. Error codes are stored short (lastErrorCode).
 */
export async function drainOutbox(
  store: LeadStore,
  transports: JobTransports,
  options: { now?: number; limit?: number } = {},
): Promise<DrainSummary> {
  const now = options.now ?? Date.now();
  const nowIso = new Date(now).toISOString();
  const summary: DrainSummary = { delivered: 0, retried: 0, dead: 0, skipped: 0, contended: 0 };
  const jobs = await store.dueJobs(nowIso, options.limit ?? 25);
  for (const job of jobs) {
    const provider = String(job.data.provider) as 'hubspot' | 'internal';
    const transport = transports[provider];
    if (!transport) {
      summary.skipped += 1;
      continue;
    }
    const claim = await store.claimJob(job.id, nowIso, new Date(now + LEASE_MS).toISOString());
    if (!claim) {
      summary.contended += 1;
      continue;
    }
    let outcome: JobOutcome;
    try {
      outcome = await transport({
        id: job.id,
        idempotencyKey: String(job.data.idempotencyKey),
        localId: String(job.data.localId ?? ''),
        operation: String(job.data.operation),
        attempts: claim.attempts,
      });
    } catch {
      outcome = { ok: false, error: 'transport_exception' };
    }
    if (outcome.ok) {
      await store.update(LEAD_TABLES.syncJobs, job.id, { status: 'delivered', lastErrorCode: '', externalId: outcome.externalId ?? '' });
      summary.delivered += 1;
    } else if (outcome.permanent || claim.attempts >= MAX_JOB_ATTEMPTS) {
      await store.update(LEAD_TABLES.syncJobs, job.id, { status: 'dead', lastErrorCode: outcome.error.slice(0, 64) });
      summary.dead += 1;
    } else {
      await store.update(LEAD_TABLES.syncJobs, job.id, {
        status: 'retry',
        lastErrorCode: outcome.error.slice(0, 64),
        nextAttemptAt: new Date(now + nextDelayMs(claim.attempts)).toISOString(),
      });
      summary.retried += 1;
    }
  }
  return summary;
}
