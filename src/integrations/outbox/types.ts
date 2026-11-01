export const outboxTopics = ['inquiry.business_contact'] as const;

export type OutboxTopic = (typeof outboxTopics)[number];

export const outboxStatuses = ['pending', 'suppressed'] as const;

export type OutboxStatus = (typeof outboxStatuses)[number];

export type OutboxRecord = {
  id: string;
  topic: OutboxTopic;
  /** Hash only — never persist raw inquiry bodies from this interface. */
  payloadHash: string;
  status: OutboxStatus;
  createdAt: string;
};

export type OutboxDraft = {
  topic: OutboxTopic;
  payloadHash: string;
};

export interface InquiryOutbox {
  enqueue(draft: OutboxDraft): Promise<OutboxRecord>;
}
