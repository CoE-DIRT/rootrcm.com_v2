import { createHash } from 'node:crypto';
import { disabledAdapter, type DisabledAdapterResult } from '../disabled.ts';
import type {
  HubSpotCompanyUpsert,
  HubSpotContactUpsert,
  HubSpotDealUpsert,
  HubSpotIdempotencyInput,
  HubSpotIdempotencyKey,
} from './types.ts';

const KEY_PREFIX = 'hs_v1_';

/** Local idempotency key. Does not call HubSpot. */
export function createHubSpotIdempotencyKey(input: HubSpotIdempotencyInput): HubSpotIdempotencyKey {
  const digest = createHash('sha256')
    .update(`${input.email.toLowerCase()}|${input.event}|${input.occurredAt}`)
    .digest('hex')
    .slice(0, 32);
  return `${KEY_PREFIX}${digest}` as HubSpotIdempotencyKey;
}

export async function upsertHubSpotContact(input: HubSpotContactUpsert): Promise<DisabledAdapterResult> {
  void input;
  return disabledAdapter('hubspot');
}

export async function upsertHubSpotCompany(input: HubSpotCompanyUpsert): Promise<DisabledAdapterResult> {
  void input;
  return disabledAdapter('hubspot');
}

export async function upsertHubSpotDeal(input: HubSpotDealUpsert): Promise<DisabledAdapterResult> {
  void input;
  return disabledAdapter('hubspot');
}

export function createHubSpotClient() {
  return {
    upsertContact: upsertHubSpotContact,
    upsertCompany: upsertHubSpotCompany,
    upsertDeal: upsertHubSpotDeal,
  };
}
