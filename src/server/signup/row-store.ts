import { contractViolations, LEAD_SCHEMA } from '../leads/lead-schema.ts';

export type Row = Record<string, string | number | boolean | null>;
export type CreateResult = 'created' | 'exists';

export type ProvisionConfig = { endpoint: string; projectId: string; databaseId: string; apiKey: string };

/** Deterministic-id, idempotent row writer (409 = exists). */
export interface RowWriter {
  create(table: string, rowId: string, data: Row): Promise<CreateResult>;
  /** Read one row by id (null if absent). */
  read(table: string, rowId: string): Promise<Row | null>;
  /** Overwrite fields of an existing row. Used only for pre-membership identity rows, never for consent. */
  update(table: string, rowId: string, data: Row): Promise<void>;
}

export class RowWriteError extends Error {
  readonly status: number;
  constructor(status: number) {
    super('row_write_error');
    this.status = status;
  }
}

const validId = (id: string | undefined): id is string => !!id && /^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(id);

/**
 * Signup provisioning uses its OWN least-privilege key (rows.read/write on organizations, memberships,
 * crm_companies, crm_contacts, consent_records, audit_events). The auth key (sessions/rows.read) is never reused.
 */
export function provisionConfig(env: NodeJS.ProcessEnv = process.env): ProvisionConfig | null {
  const projectId = env.APPWRITE_AUTH_PROJECT_ID;
  const databaseId = env.APPWRITE_DATABASE_ID;
  const apiKey = env.APPWRITE_PROVISION_API_KEY?.trim();
  if (!validId(projectId) || !validId(databaseId) || !apiKey) return null;
  return { endpoint: 'https://nyc.cloud.appwrite.io/v1', projectId, databaseId, apiKey };
}

export function signupProvisioningEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.ROOT_ENABLE_SIGNUP_PROVISIONING === 'true' && env.ROOT_ENABLE_LIVE_AUTH === 'true' && provisionConfig(env) !== null;
}

export class AppwriteRowWriter implements RowWriter {
  private readonly config: ProvisionConfig;
  private readonly fetchImpl: typeof fetch;
  constructor(config: ProvisionConfig, fetchImpl: typeof fetch = fetch) {
    this.config = config;
    this.fetchImpl = fetchImpl;
  }

  private base(table: string): string {
    return `${this.config.endpoint}/tablesdb/${encodeURIComponent(this.config.databaseId)}/tables/${table}/rows`;
  }

  async create(table: string, rowId: string, data: Row): Promise<CreateResult> {
    const response = await this.fetchImpl(this.base(table), {
      method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { 'content-type': 'application/json', 'X-Appwrite-Project': this.config.projectId, 'X-Appwrite-Key': this.config.apiKey },
      body: JSON.stringify({ rowId, data }),
    });
    if (response.status === 409) return 'exists';
    if (!response.ok) throw new RowWriteError(response.status);
    return 'created';
  }

  async update(table: string, rowId: string, data: Row): Promise<void> {
    const response = await this.fetchImpl(`${this.base(table)}/${encodeURIComponent(rowId)}`, {
      method: 'PATCH', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { 'content-type': 'application/json', 'X-Appwrite-Project': this.config.projectId, 'X-Appwrite-Key': this.config.apiKey },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) throw new RowWriteError(response.status);
  }

  async read(table: string, rowId: string): Promise<Row | null> {
    const response = await this.fetchImpl(`${this.base(table)}/${encodeURIComponent(rowId)}`, {
      method: 'GET', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { 'X-Appwrite-Project': this.config.projectId, 'X-Appwrite-Key': this.config.apiKey },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new RowWriteError(response.status);
    const body = (await response.json()) as Record<string, unknown>;
    const row: Row = {};
    for (const [key, value] of Object.entries(body)) {
      if (key.startsWith('$')) continue;
      if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) row[key] = value as string | number | boolean | null;
    }
    return row;
  }
}

export class MemoryRowWriter implements RowWriter {
  /** Enforce the verified live column contract for the tables it covers (organizations/memberships are not in it). */
  enforceContract = true;
  readonly rows = new Map<string, Row>();
  failOnCalls = new Set<number>();
  calls = 0;
  /** Optional async gate to force request interleaving in concurrency tests. */
  beforeCreate?: (table: string) => Promise<void>;

  async create(table: string, rowId: string, data: Row): Promise<CreateResult> {
    if (this.beforeCreate) await this.beforeCreate(table);
    this.calls += 1;
    if (this.failOnCalls.has(this.calls)) throw new RowWriteError(500);
    if (this.enforceContract && table in LEAD_SCHEMA && contractViolations(table, data).length) throw new RowWriteError(400);
    const key = `${table}/${rowId}`;
    if (this.rows.has(key)) return 'exists';
    this.rows.set(key, { ...data });
    return 'created';
  }

  async update(table: string, rowId: string, data: Row): Promise<void> {
    this.calls += 1;
    if (this.failOnCalls.has(this.calls)) throw new RowWriteError(500);
    if (this.enforceContract && table in LEAD_SCHEMA && contractViolations(table, data).length) throw new RowWriteError(400);
    const key = `${table}/${rowId}`;
    if (!this.rows.has(key)) throw new RowWriteError(404);
    this.rows.set(key, { ...this.rows.get(key), ...data });
  }

  async read(table: string, rowId: string): Promise<Row | null> {
    return this.rows.get(`${table}/${rowId}`) ?? null;
  }

  all(table: string): Row[] {
    return [...this.rows].filter(([k]) => k.startsWith(`${table}/`)).map(([, v]) => v);
  }
}
