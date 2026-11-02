/**
 * Presentation-session persistence for the synthetic operations demo.
 *
 * Interface is (session id from the signed cookie) + snapshot. This is not
 * Appwrite Auth and is not a live KV client.
 *
 * Backend selection (`ROOT_DEMO_SESSION_BACKEND`):
 * - unset, empty, or `memory` → process-local Map (single Node instance only)
 * - `file` plus `ROOT_DEMO_SESSION_DIR` → one JSON file per session on local disk
 * - any other value, including `appwrite` or `kv` → fail-closed stub
 *
 * The file driver survives a process restart on one host with a persistent
 * directory. It does not share snapshots across machines. Do not invent
 * cloud credentials here.
 */
import { mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { cloneSnapshot, type OpsSnapshot } from '../../domain/operations/types.ts';
import { isSafeOpsSessionId } from './session.ts';

export type DemoSessionBackendKind = 'memory' | 'file' | 'durable_stub';

export type DemoSessionRecord = {
  sessionId: string;
  snapshot: OpsSnapshot;
  expiresAt: number;
  actionTimes: number[];
};

export interface DemoSessionPersistence {
  readonly kind: DemoSessionBackendKind;
  /** Memory may write. The durable stub cannot until a reviewed driver exists. */
  readonly writable: boolean;
  load(sessionId: string): DemoSessionRecord | null;
  save(record: DemoSessionRecord): void;
  clear(sessionId: string): void;
  prune(now?: number): void;
}

/** Process-local cap. Expired rows are removed before the soonest expiry is evicted. */
export const MAX_DEMO_SESSIONS = 128;

export class MemoryDemoSessionStore implements DemoSessionPersistence {
  readonly kind = 'memory' as const;
  readonly writable = true;
  private readonly slots = new Map<string, DemoSessionRecord>();

  load(sessionId: string): DemoSessionRecord | null {
    return this.slots.get(sessionId) ?? null;
  }

  save(record: DemoSessionRecord): void {
    this.prune();
    if (!this.slots.has(record.sessionId) && this.slots.size >= MAX_DEMO_SESSIONS) {
      let oldestId: string | null = null;
      let oldest = Number.POSITIVE_INFINITY;
      for (const [id, existing] of this.slots) {
        if (existing.expiresAt < oldest) {
          oldest = existing.expiresAt;
          oldestId = id;
        }
      }
      if (oldestId) this.slots.delete(oldestId);
    }
    this.slots.set(record.sessionId, record);
  }

  clear(sessionId: string): void {
    this.slots.delete(sessionId);
  }

  prune(now = Date.now()): void {
    for (const [id, record] of this.slots) {
      if (record.expiresAt <= now) this.slots.delete(id);
    }
  }

  clearAll(): void {
    this.slots.clear();
  }
}

/**
 * Fail-closed placeholder for a future Appwrite/KV driver.
 * load always misses. save/clear/prune are no-ops. No network, no credentials.
 */
export class DurableStubDemoSessionStore implements DemoSessionPersistence {
  readonly kind = 'durable_stub' as const;
  readonly writable = false;

  load(_sessionId: string): null {
    void _sessionId;
    return null;
  }

  save(_record: DemoSessionRecord): void {
    void _record;
  }

  clear(_sessionId: string): void {
    void _sessionId;
  }

  prune(_now?: number): void {
    void _now;
  }
}

function sessionFileName(sessionId: string): string | null {
  if (!isSafeOpsSessionId(sessionId)) return null;
  return `${sessionId}.json`;
}

/**
 * Disk-backed demo sessions. Expired rows are removed. The directory is capped
 * at MAX_DEMO_SESSIONS. A new process reading the same directory sees prior writes.
 */
export class FileDemoSessionStore implements DemoSessionPersistence {
  readonly kind = 'file' as const;
  readonly writable = true;
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = resolve(directory);
    mkdirSync(this.directory, { recursive: true });
  }

  private pathFor(sessionId: string): string | null {
    const name = sessionFileName(sessionId);
    if (!name) return null;
    return join(/* turbopackIgnore: true */ this.directory, name);
  }

  load(sessionId: string): DemoSessionRecord | null {
    const path = this.pathFor(sessionId);
    if (!path) return null;
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf8')) as DemoSessionRecord;
      if (!parsed || parsed.sessionId !== sessionId || !parsed.snapshot) return null;
      return {
        sessionId: parsed.sessionId,
        snapshot: cloneSnapshot(parsed.snapshot),
        expiresAt: parsed.expiresAt,
        actionTimes: Array.isArray(parsed.actionTimes) ? [...parsed.actionTimes] : [],
      };
    } catch {
      return null;
    }
  }

  save(record: DemoSessionRecord): void {
    const path = this.pathFor(record.sessionId);
    // Fail closed: refuse unsafe ids without throwing (avoids 500 on demo APIs).
    if (!path) return;
    this.prune();
    const names = this.listNames();
    if (!names.includes(`${record.sessionId}.json`) && names.length >= MAX_DEMO_SESSIONS) {
      this.dropSoonest();
    }
    const body = JSON.stringify({
      sessionId: record.sessionId,
      snapshot: cloneSnapshot(record.snapshot),
      expiresAt: record.expiresAt,
      actionTimes: [...record.actionTimes],
    });
    const temp = `${path}.tmp`;
    writeFileSync(temp, body, { encoding: 'utf8' });
    rmSync(path, { force: true });
    renameSync(temp, path);
  }

  clear(sessionId: string): void {
    const path = this.pathFor(sessionId);
    if (!path) return;
    rmSync(path, { force: true });
  }

  prune(now = Date.now()): void {
    for (const name of this.listNames()) {
      const id = name.slice(0, -'.json'.length);
      const record = this.load(id);
      if (!record || record.expiresAt <= now) this.clear(id);
    }
  }

  private listNames(): string[] {
    return readdirSync(this.directory).filter((name) => name.endsWith('.json'));
  }

  private dropSoonest(): void {
    let oldestId: string | null = null;
    let oldest = Number.POSITIVE_INFINITY;
    for (const name of this.listNames()) {
      const id = name.slice(0, -'.json'.length);
      const record = this.load(id);
      if (!record) continue;
      if (record.expiresAt < oldest) {
        oldest = record.expiresAt;
        oldestId = id;
      }
    }
    if (oldestId) this.clear(oldestId);
  }
}

const memoryBackend = new MemoryDemoSessionStore();
const durableStub = new DurableStubDemoSessionStore();
const fileBackends = new Map<string, FileDemoSessionStore>();

export function configuredDemoSessionBackend(): string {
  return process.env.ROOT_DEMO_SESSION_BACKEND?.trim() ?? '';
}

/**
 * `memory` (or unset) is process-local. `file` is durable only when
 * ROOT_DEMO_SESSION_DIR is set. `appwrite`, `kv`, and every other value stay
 * on the fail-closed stub.
 */
export function getDemoSessionBackend(): DemoSessionPersistence {
  const configured = configuredDemoSessionBackend();
  if (!configured || configured === 'memory') return memoryBackend;
  if (configured === 'file') {
    const directory = process.env.ROOT_DEMO_SESSION_DIR?.trim() ?? '';
    if (!directory) return durableStub;
    const key = resolve(/* turbopackIgnore: true */ directory);
    let store = fileBackends.get(key);
    if (!store) {
      store = new FileDemoSessionStore(key);
      fileBackends.set(key, store);
    }
    return store;
  }
  return durableStub;
}

export function cloneDemoSessionRecord(record: DemoSessionRecord): DemoSessionRecord {
  return {
    sessionId: record.sessionId,
    snapshot: cloneSnapshot(record.snapshot),
    expiresAt: record.expiresAt,
    actionTimes: [...record.actionTimes],
  };
}

/** Test helper: drop in-memory slots. Does not create a live store. */
export function resetDemoSessionPersistence(): void {
  memoryBackend.clearAll();
}
