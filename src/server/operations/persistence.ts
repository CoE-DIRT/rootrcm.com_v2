/**
 * Presentation-session persistence for the synthetic operations demo.
 *
 * Interface is (session id from the signed cookie) + snapshot. This is not
 * Appwrite Auth and is not a live KV client.
 *
 * Backend selection (`ROOT_DEMO_SESSION_BACKEND`):
 * - unset, empty, or `memory` → process-local Map (single Node instance only)
 * - any other value → durable stub that fails closed (no-op writes, empty loads)
 *
 * Issue #29: the memory Map is still per-process. Multi-instance hosts will not
 * share demo snapshots until a reviewed driver is provisioned. Do not invent
 * Appwrite project IDs, API keys, or KV credentials here.
 */
import { cloneSnapshot, type OpsSnapshot } from '../../domain/operations/types.ts';

export type DemoSessionBackendKind = 'memory' | 'durable_stub';

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

export class MemoryDemoSessionStore implements DemoSessionPersistence {
  readonly kind = 'memory' as const;
  readonly writable = true;
  private readonly slots = new Map<string, DemoSessionRecord>();

  load(sessionId: string): DemoSessionRecord | null {
    return this.slots.get(sessionId) ?? null;
  }

  save(record: DemoSessionRecord): void {
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

const memoryBackend = new MemoryDemoSessionStore();
const durableStub = new DurableStubDemoSessionStore();

export function configuredDemoSessionBackend(): string {
  return process.env.ROOT_DEMO_SESSION_BACKEND?.trim() ?? '';
}

/**
 * Only `memory` (or unset) is an implemented driver. Any other configured
 * value — including `appwrite` or `kv` — selects the fail-closed stub.
 */
export function getDemoSessionBackend(): DemoSessionPersistence {
  const configured = configuredDemoSessionBackend();
  if (!configured || configured === 'memory') return memoryBackend;
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
