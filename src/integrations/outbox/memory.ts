import type { InquiryOutbox, OutboxDraft, OutboxRecord } from './types.ts';

/**
 * In-memory outbox for contract tests. Delivery is always `suppressed`.
 * Public inquiry route must not import this until founder activation.
 */
export class MemoryInquiryOutbox implements InquiryOutbox {
  readonly records: OutboxRecord[] = [];

  async enqueue(draft: OutboxDraft): Promise<OutboxRecord> {
    const record: OutboxRecord = {
      id: crypto.randomUUID(),
      topic: draft.topic,
      payloadHash: draft.payloadHash,
      status: 'suppressed',
      createdAt: new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }
}
