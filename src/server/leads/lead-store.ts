import { LEAD_TABLES, type LeadStoreConfig } from './lead-config.ts';

export type LeadRowTable = (typeof LEAD_TABLES)[keyof typeof LEAD_TABLES];
export type LeadRow = Record<string, string | number | boolean | null>;

export type CreateResult = 'created' | 'exists';

export type StoredJob = { id: string; data: LeadRow };

/**
 * Minimal durable-row port. Deterministic row ids give idempotency:
 * a second create with the same id is reported as 'exists', never duplicated.
 */
export interface LeadStore {
  create(table: LeadRowTable, rowId: string, data: LeadRow): Promise<CreateResult>;
  update(table: LeadRowTable, rowId: string, data: LeadRow): Promise<void>;
  /** Jobs due for work: status pending/retry and nextAttemptAt <= now. */
  dueJobs(now: string, limit: number): Promise<StoredJob[]>;
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
  failNext = false;
  private key = (table: string, id: string) => `${table}/${id}`;

  async create(table: LeadRowTable, rowId: string, data: LeadRow): Promise<CreateResult> {
    if (this.failNext) {
      this.failNext = false;
      throw new LeadStoreError(500);
    }
    const key = this.key(table, rowId);
    if (this.rows.has(key)) return 'exists';
    this.rows.set(key, { ...data });
    return 'created';
  }

  async update(table: LeadRowTable, rowId: string, data: LeadRow): Promise<void> {
    const key = this.key(table, rowId);
    const row = this.rows.get(key);
    if (!row) throw new LeadStoreError(404);
    this.rows.set(key, { ...row, ...data });
  }

  async dueJobs(now: string, limit: number): Promise<StoredJob[]> {
    const jobs: StoredJob[] = [];
    for (const [key, data] of this.rows) {
      if (!key.startsWith(`${LEAD_TABLES.syncJobs}/`)) continue;
      if ((data.status === 'pending' || data.status === 'retry') && String(data.nextAttemptAt) <= now) {
        jobs.push({ id: key.slice(LEAD_TABLES.syncJobs.length + 1), data });
      }
    }
    return jobs.slice(0, limit);
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

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const response = await this.fetchImpl(`${this.config.endpoint}/tablesdb/${encodeURIComponent(this.config.databaseId)}${path}`, {
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
    return response;
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

  async dueJobs(now: string, limit: number): Promise<StoredJob[]> {
    const query = new URLSearchParams();
    query.append('queries[]', JSON.stringify({ method: 'equal', attribute: 'status', values: ['pending', 'retry'] }));
    query.append('queries[]', JSON.stringify({ method: 'lessThanEqual', attribute: 'nextAttemptAt', values: [now] }));
    query.append('queries[]', JSON.stringify({ method: 'limit', values: [limit] }));
    const response = await this.request('GET', `/tables/${LEAD_TABLES.syncJobs}/rows?${query}`);
    if (!response.ok) throw new LeadStoreError(response.status);
    const body = (await response.json()) as { rows?: Array<Record<string, unknown>> };
    return (body.rows ?? []).map((row) => {
      const { $id, ...rest } = row;
      const data: LeadRow = {};
      for (const [k, v] of Object.entries(rest)) {
        if (k.startsWith('$')) continue;
        if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) data[k] = v as string | number | boolean | null;
      }
      return { id: String($id), data };
    });
  }
}
