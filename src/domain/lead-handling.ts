import type { BusinessLead, LeadDedupKey, LeadOwnership, LeadSource } from './lead.ts';
import { leadSources } from './lead.ts';
import {
  validateBusinessContact,
  type FieldErrors,
} from '../lib/validation/business-contact.ts';

export const BUSINESS_CONSENT_VERSION = 'business-inquiry.v1';

/** Public inquiry has no durable delivery path yet. Always fail closed. */
export function isDurableInquiryDeliveryEnabled(): false {
  return false;
}

export function mayPersistPublicInquiry(): false {
  return false;
}

export function createLeadDedupKey(email: string, organization: string): LeadDedupKey {
  const emailNorm = email.trim().toLowerCase();
  const orgNorm = organization.trim().toLowerCase().replace(/\s+/g, ' ');
  return `lead_v1:${emailNorm}|${orgNorm}` as LeadDedupKey;
}

export function defaultLeadOwnership(): LeadOwnership {
  return { team: 'unassigned', assigneeId: null, sourceOfTruth: 'hubspot' };
}

function sourceFromConcern(concern: string | undefined): LeadSource {
  if (concern === 'diagnostic') return 'diagnostic';
  if (concern === 'managed') return 'account';
  if (concern === 'custom') return 'custom';
  if (concern === 'consultation') return 'consultation';
  return leadSources.includes(concern as LeadSource) ? (concern as LeadSource) : 'other';
}

export type LeadAssembly =
  | { ok: false; reason: 'validation'; fieldErrors: FieldErrors }
  | { ok: true; lead: BusinessLead; delivery: 'unavailable' };

/**
 * Assemble a consented business-only lead. Does not persist, enqueue, or call CRM.
 * Delivery is always `unavailable` until a reviewed durable path exists.
 */
export function assembleBusinessLead(
  value: unknown,
  correlationId = crypto.randomUUID(),
): LeadAssembly {
  const validated = validateBusinessContact(value);
  if (!validated.ok) {
    return { ok: false, reason: 'validation', fieldErrors: validated.fieldErrors };
  }
  const { name, email, organization, message, concern } = validated.data;
  const lead: BusinessLead = {
    source: sourceFromConcern(concern),
    contact: { name, email, organization },
    consent: true,
    consentVersion: BUSINESS_CONSENT_VERSION,
    consentAt: new Date().toISOString(),
    summary: message,
    correlationId,
    dedupKey: createLeadDedupKey(email, organization),
    ownership: defaultLeadOwnership(),
    delivery: 'unavailable',
  };
  return { ok: true, lead, delivery: 'unavailable' };
}
