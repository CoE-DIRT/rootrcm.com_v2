import type { BusinessLead } from '../../domain/lead.ts';

export type HubSpotIdempotencyKey = string & { readonly __brand: 'HubSpotIdempotencyKey' };

export type HubSpotContactUpsert = {
  email: string;
  firstName?: string;
  lastName?: string;
  companyName: string;
  consentAt: string;
  consentVersion: string;
  idempotencyKey: HubSpotIdempotencyKey;
  correlationId: string;
  source: BusinessLead['source'];
};

export type HubSpotCompanyUpsert = {
  companyName: string;
  domain?: string;
  idempotencyKey: HubSpotIdempotencyKey;
  correlationId: string;
};

export type HubSpotIdempotencyInput = {
  email: string;
  event: string;
  occurredAt: string;
};
