import type { LeadRow, LeadStore } from './lead-store.ts';
import { LEAD_TABLES } from './lead-config.ts';

export type JobOutcome = { ok: true } | { ok: false; error: string; permanent?: boolean };

/** A transport per target. A target without an enabled transport is never attempted. */
export type JobTransport = (job: { id: string; leadId: string; attempts: number }) => Promise<JobOutcome>;
export type JobTransports = Partial<Record<'hubspot' | 'notify', JobTransport>>;

export const MAX_JOB_ATTEMPTS = 6;
const BASE_DELAY_MS = 60_000;
const MAX_DELAY_MS = 6 * 3_600_000;

export function nextDelayMs(attempt: number): number {
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** Math.max(0, attempt - 1));
}

export type DrainSummary = { delivered: number; retried: number; dead: number; skipped: number };

/**
 * Drain due outbox jobs with exponential backoff. Jobs whose target has no enabled
 * transport are left untouched (no attempt consumed), so enabling HubSpot later
 * delivers the backlog instead of losing it. Errors are stored as short codes only.
 */
export async function drainOutbox(
  store: LeadStore,
  transports: JobTransports,
  options: { now?: number; limit?: number } = {},
): Promise<DrainSummary> {
  const now = options.now ?? Date.now();
  const summary: DrainSummary = { delivered: 0, retried: 0, dead: 0, skipped: 0 };
  const jobs = await store.dueJobs(new Date(now).toISOString(), options.limit ?? 25);
  for (const job of jobs) {
    const target = String(job.data.target) as 'hubspot' | 'notify';
    const transport = transports[target];
    if (!transport) {
      summary.skipped += 1;
      continue;
    }
    const attempts = Number(job.data.attempts ?? 0) + 1;
    let outcome: JobOutcome;
    try {
      outcome = await transport({ id: job.id, leadId: String(job.data.leadId), attempts });
    } catch {
      outcome = { ok: false, error: 'transport_exception' };
    }
    const patch: LeadRow = { attempts };
    if (outcome.ok) {
      Object.assign(patch, { status: 'delivered', lastError: '' });
      summary.delivered += 1;
    } else if (outcome.permanent || attempts >= MAX_JOB_ATTEMPTS) {
      Object.assign(patch, { status: 'dead', lastError: outcome.error.slice(0, 120) });
      summary.dead += 1;
    } else {
      Object.assign(patch, {
        status: 'retry',
        lastError: outcome.error.slice(0, 120),
        nextAttemptAt: new Date(now + nextDelayMs(attempts)).toISOString(),
      });
      summary.retried += 1;
    }
    await store.update(LEAD_TABLES.syncJobs, job.id, patch);
  }
  return summary;
}
