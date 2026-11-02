export const webhookProviders = ['stripe', 'hubspot', 'appwrite', 'apollo'] as const;

export type WebhookProvider = (typeof webhookProviders)[number];

export const webhookProcessStatuses = [
  'received',
  'ignored_disabled',
  'duplicate',
  'failed',
] as const;

export type WebhookProcessStatus = (typeof webhookProcessStatuses)[number];

/**
 * Durable inbox envelope. `provider` + `providerEventId` is the idempotency pair.
 * `signatureVerified` must be false unless a verifier returned ok.
 */
export type WebhookEnvelope<T = unknown> = {
  provider: WebhookProvider;
  providerEventId: string;
  signatureVerified: boolean;
  receivedAt: string;
  processStatus: WebhookProcessStatus;
  payload: T;
};
