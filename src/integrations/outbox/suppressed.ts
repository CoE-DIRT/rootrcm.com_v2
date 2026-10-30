import type { InquiryOutbox, OutboxRecord } from './types.ts';

export type SuppressedOutboxWrite = OutboxRecord & {
  delivered: false;
  claimedSent: false;
};

/**
 * Record a business-only inquiry hash without claiming delivery.
 * Public HTTP inquiry must not import this until durable delivery exists.
 */
export async function enqueueSuppressedBusinessContact(
  outbox: InquiryOutbox,
  payloadHash: string,
): Promise<SuppressedOutboxWrite> {
  const record = await outbox.enqueue({
    topic: 'inquiry.business_contact',
    payloadHash,
  });
  return {
    ...record,
    status: 'suppressed',
    delivered: false,
    claimedSent: false,
  };
}
