import { createHash } from 'node:crypto';
import { deliverHubSpotContact, type HubSpotAttempt } from '../../integrations/hubspot/deliver.ts';
import {
  assembleBusinessLead,
  businessLeadPayloadHash,
  type LeadAssembly,
} from '../../domain/lead-handling.ts';
import { FileInquiryStore, INQUIRY_TTL_MS, type DurableInquiryRecord, type InquiryDeliveryStatus } from './file-inquiry-store.ts';

export type DurableInquiryResult =
  | { ok: false; reason: 'validation'; fieldErrors: Extract<LeadAssembly, { ok: false }>['fieldErrors'] }
  | { ok: true; duplicate: boolean; record: DurableInquiryRecord; delivery: InquiryDeliveryStatus };

/**
 * Persist a consented business inquiry and track delivery.
 * Not used by the public HTTP route. Live HubSpot stays disabled without a transport.
 */
export async function recordDurableInquiry(
  value: unknown,
  store: FileInquiryStore,
  options: {
    correlationId?: string;
    now?: number;
    transport?: (idempotencyKey: string, attempt: number) => Promise<HubSpotAttempt>;
    alreadyDelivered?: ReadonlySet<string>;
  } = {},
): Promise<DurableInquiryResult> {
  const correlationId = options.correlationId ?? crypto.randomUUID();
  const assembled = assembleBusinessLead(value, correlationId);
  if (!assembled.ok) return assembled;
  const lead = assembled.lead;
  const idempotencyKey = `inq_${createHash('sha256')
    .update(`${lead.dedupKey}|${lead.consentAt.slice(0, 10)}`)
    .digest('hex')
    .slice(0, 32)}`;
  const now = options.now ?? Date.now();
  const draft: DurableInquiryRecord = {
    idempotencyKey,
    dedupKey: lead.dedupKey,
    payloadHash: businessLeadPayloadHash(lead),
    correlationId,
    organization: lead.contact.organization,
    email: lead.contact.email,
    contactName: lead.contact.name,
    summary: lead.summary ?? '',
    status: 'pending',
    attempts: 0,
    remoteId: null,
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
    expiresAt: now + INQUIRY_TTL_MS,
  };
  const saved = store.save(draft);
  if (saved.duplicate) {
    return { ok: true, duplicate: true, record: saved.record, delivery: saved.record.status };
  }
  const delivery = await deliverHubSpotContact(
    { idempotencyKey },
    { transport: options.transport, alreadyDelivered: options.alreadyDelivered },
  );
  const status: InquiryDeliveryStatus =
    delivery.status === 'delivered' ? 'delivered' : delivery.status === 'failed' ? 'failed' : 'suppressed';
  const record: DurableInquiryRecord = {
    ...draft,
    status,
    attempts: delivery.attempts,
    remoteId: delivery.status === 'delivered' ? delivery.remoteId : null,
    updatedAt: new Date(now).toISOString(),
  };
  store.update(record);
  return { ok: true, duplicate: false, record, delivery: status };
}
