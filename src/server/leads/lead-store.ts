import { LEAD_TABLES, type LeadStoreConfig } from './lead-config.ts';
import { contractViolations } from './lead-schema.ts';

export type LeadRowTable = (typeof LEAD_TABLES)[keyof typeof LEAD_TABLES];
export type LeadRow = Record<string, string | number | boolean | null>;

export type CreateResult = 'created' | 'exists';

export type StoredJob = { id: string; data: LeadRow };

/**
 * Minimal durable-row port. Deterministic row ids make every create idempotent:
 * a second create with the same id reports 'exists' and is never duplicated.
 */
export interface LeadStore {
  create(table: LeadRowTable, rowId: string, data: LeadRow): Promise<CreateResult>;
  update(table: LeadRowTable, rowId: string, data: LeadRow): Promise<void>;
  /** Jobs due for work: status pending/retry/processing with nextAttemptAt <= now (processing = expired lease). */
  dueJobs(now: string, limit: number): Promise<StoredJob[]>;
  /**
   * Take a lease on a due job. Returns false if another worker holds it.
   * Memory store is atomic; the Appwrite adapter is best-effort (no CAS), so
   * transports MUST also be idempotent on the job's idempotencyKey.
   */
  claimJob(id: string, now: string, leaseUntil: string): Promise<{ attempts: number } | null>;
}

export class LeadStoreError extends Error {
  readonly status: number;
  constructor(status: number) {
    super('lead_store_error');
    this.status = status;
  }
}

export class MemoryLeadStore implements LeadStore {
  readonly rows = new Map<string, LeadRow>();
  /** Fail the create/update whose 1-based call number is in this set. */
  failOnCalls = new Set<number>();
  calls = 0;
  /** Enforce the live column contract (default true). */
  enforceContract = true;
  private key = (table: string, id: string) => `${table}/${id}`;

  private tick() {
    this.calls += 1;
    if (this.failOnCalls.has(this.calls)) throw new LeadStoreError(500);
  }

  async create(table: LeadRowTable, rowId: string, data: LeadRow): Promise<CreateResult> {
    this.tick();
    if (this.enforceContract) {
      const violations = contractViolations(table, data);
      if (violations.length) throw new LeadStoreError(400);
    }
    const key = this.key(table, rowId);
    if (this.rows.has(key)) return 'exists';
    this.rows.set(key, { ...data });
    return 'created';
  }

  async update(table: LeadRowTable, rowId: string, data: LeadRow): Promise<void> {
    this.tick();
    const key = this.key(table, rowId);
    const row = this.rows.get(key);
    if (!row) throw new LeadStoreError(404);
    this.rows.set(key, { ...row, ...data });
  }

  private due(now: string): StoredJob[] {
    const jobs: StoredJob[] = [];
    for (const [key, data] of this.rows) {
      if (!key.startsWith(`${LEAD_TABLES.syncJobs}/`)) continue;
      if (['pending', 'retry', 'processing'].includes(String(data.status)) && String(data.nextAttemptAt) <= now) {
        jobs.push({ id: key.slice(LEAD_TABLES.syncJobs.length + 1), data });
      }
    }
    return jobs;
  }

  async dueJobs(now: string, limit: number): Promise<StoredJob[]> {
    return this.due(now).slice(0, limit);
  }

  async claimJob(id: string, now: string, leaseUntil: string) {
    const job = this.due(now).find((j) => j.id === id);
    if (!job) return null;
    const attempts = Number(job.data.attempts ?? 0) + 1;
    this.rows.set(this.key(LEAD_TABLES.syncJobs, id), {
      ...job.data,
      status: 'processing',
      attempts,
      lastAttemptAt: now,
      nextAttemptAt: leaseUntil,
    });
    return { attempts };
  }

  all(table: LeadRowTable): LeadRow[] {
    return [...this.rows].filter(([k]) => k.startsWith(`${table}/`)).map(([, v]) => v);
  }
}

/** Appwrite TablesDB REST adapter (server key, no browser exposure, errors never echoed). */
export class AppwriteLeadStore implements LeadStore {
  private readonly config: LeadStoreConfig;
  private readonly fetchImpl: typeof fetch;
  constructor(config: LeadStoreConfig, fetchImpl: typeof fetch = fetch) {
    this.config = config;
    this.fetchImpl = fetchImpl;
  }

  private request(method: string, path: string, body?: unknown): Promise<Response> {
    return this.fetchImpl(`${this.config.endpoint}/tablesdb/${encodeURIComponent(this.config.databaseId)}${path}`, {
      method,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
      headers: {
        'content-type': 'application/json',
        'X-Appwrite-Project': this.config.projectId,
        'X-Appwrite-Key': this.config.apiKey,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  }

  async create(table: LeadRowTable, rowId: string, data: LeadRow): Promise<CreateResult> {
    const response = await this.request('POST', `/tables/${table}/rows`, { rowId, data });
    if (response.status === 409) return 'exists';
    if (!response.ok) throw new LeadStoreError(response.status);
    return 'created';
  }

  async update(table: LeadRowTable, rowId: string, data: LeadRow): Promise<void> {
    const response = await this.request('PATCH', `/tables/${table}/rows/${encodeURIComponent(rowId)}`, { data });
    if (!response.ok) throw new LeadStoreError(response.status);
  }

  private static toJob(row: Record<string, unknown>): StoredJob {
    const data: LeadRow = {};
    for (const [k, v] of Object.entries(row)) {
      if (k.startsWith('$')) continue;
      if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) data[k] = v as string | number | boolean | null;
    }
    return { id: String(row.$id), data };
  }

  async dueJobs(now: string, limit: number): Promise<StoredJob[]> {
    const query = new URLSearchParams();
    query.append('queries[]', JSON.stringify({ method: 'equal', attribute: 'status', values: ['pending', 'retry', 'processing'] }));
    query.append('queries[]', JSON.stringify({ method: 'lessThanEqual', attribute: 'nextAttemptAt', values: [now] }));
    query.append('queries[]', JSON.stringify({ method: 'limit', values: [limit] }));
    const response = await this.request('GET', `/tables/${LEAD_TABLES.syncJobs}/rows?${query}`);
    if (!response.ok) throw new LeadStoreError(response.status);
    const body = (await response.json()) as { rows?: Array<Record<string, unknown>> };
    return (body.rows ?? []).map(AppwriteLeadStore.toJob);
  }

  async claimJob(id: string, now: string, leaseUntil: string) {
    const read = await this.request('GET', `/tables/${LEAD_TABLES.syncJobs}/rows/${encodeURIComponent(id)}`);
    if (!read.ok) throw new LeadStoreError(read.status);
    const job = AppwriteLeadStore.toJob((await read.json()) as Record<string, unknown>);
    const live = ['pending', 'retry', 'processing'].includes(String(job.data.status)) && String(job.data.nextAttemptAt) <= now;
    if (!live) return null;
    const attempts = Number(job.data.attempts ?? 0) + 1;
    await this.update(LEAD_TABLES.syncJobs, id, { status: 'processing', attempts, lastAttemptAt: now, nextAttemptAt: leaseUntil });
    return { attempts };
  }
}
