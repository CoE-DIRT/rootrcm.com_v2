import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const MAX_INQUIRY_RECORDS = 500;
export const INQUIRY_TTL_MS = 180 * 24 * 60 * 60 * 1000;

export type InquiryDeliveryStatus = 'pending' | 'suppressed' | 'delivered' | 'failed';

/** Business contact only. Callers must reject PHI before enqueue. */
export type DurableInquiryRecord = {
  idempotencyKey: string;
  dedupKey: string;
  payloadHash: string;
  correlationId: string;
  organization: string;
  email: string;
  contactName: string;
  summary: string;
  status: InquiryDeliveryStatus;
  attempts: number;
  remoteId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: number;
};

function fileName(key: string): string {
  return `${createHash('sha256').update(key).digest('hex')}.json`;
}

/**
 * Restart-safe business-inquiry ledger. One host directory. Not a CRM write.
 */
export class FileInquiryStore {
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = resolve(directory);
    mkdirSync(this.directory, { recursive: true });
  }

  get(idempotencyKey: string): DurableInquiryRecord | null {
    const path = join(this.directory, fileName(idempotencyKey));
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf8')) as DurableInquiryRecord;
      if (parsed.idempotencyKey !== idempotencyKey) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  findByDedup(dedupKey: string): DurableInquiryRecord | null {
    for (const name of this.names()) {
      try {
        const parsed = JSON.parse(readFileSync(join(this.directory, name), 'utf8')) as DurableInquiryRecord;
        if (parsed.dedupKey === dedupKey) return parsed;
      } catch {
        /* skip unreadable rows */
      }
    }
    return null;
  }

  save(record: DurableInquiryRecord): { record: DurableInquiryRecord; duplicate: boolean } {
    const existing = this.get(record.idempotencyKey) ?? this.findByDedup(record.dedupKey);
    if (existing) return { record: existing, duplicate: true };
    this.prune();
    if (this.names().length >= MAX_INQUIRY_RECORDS) this.dropSoonest();
    this.write(record);
    return { record, duplicate: false };
  }

  update(record: DurableInquiryRecord): void {
    this.write(record);
  }

  prune(now = Date.now()): void {
    for (const name of this.names()) {
      try {
        const parsed = JSON.parse(readFileSync(join(this.directory, name), 'utf8')) as DurableInquiryRecord;
        if (parsed.expiresAt <= now) rmSync(join(this.directory, name), { force: true });
      } catch {
        rmSync(join(this.directory, name), { force: true });
      }
    }
  }

  private write(record: DurableInquiryRecord): void {
    const path = join(this.directory, fileName(record.idempotencyKey));
    const temp = `${path}.tmp`;
    writeFileSync(temp, JSON.stringify(record), { encoding: 'utf8' });
    rmSync(path, { force: true });
    renameSync(temp, path);
  }

  private names(): string[] {
    return readdirSync(this.directory).filter((name) => name.endsWith('.json'));
  }

  private dropSoonest(): void {
    let oldestName: string | null = null;
    let oldest = Number.POSITIVE_INFINITY;
    for (const name of this.names()) {
      try {
        const parsed = JSON.parse(readFileSync(join(this.directory, name), 'utf8')) as DurableInquiryRecord;
        if (parsed.expiresAt < oldest) {
          oldest = parsed.expiresAt;
          oldestName = name;
        }
      } catch {
        oldestName = name;
        break;
      }
    }
    if (oldestName) rmSync(join(this.directory, oldestName), { force: true });
  }
}
