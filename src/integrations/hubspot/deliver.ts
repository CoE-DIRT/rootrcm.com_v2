import { getFeatureFlags } from '../../lib/flags.ts';

export type HubSpotAttempt =
  | { ok: true; remoteId: string }
  | { ok: false; retryable: boolean; code: string };

export type HubSpotDelivery =
  | { status: 'disabled'; attempts: 0 }
  | { status: 'duplicate'; attempts: number; idempotencyKey: string }
  | { status: 'delivered'; attempts: number; remoteId: string }
  | { status: 'failed'; attempts: number; code: string };

/**
 * Retry and dedupe a HubSpot upsert. No transport means disabled — never delivered.
 * CRM flag must be exactly true before a test transport is allowed to run.
 */
export async function deliverHubSpotContact(
  input: { idempotencyKey: string },
  options: {
    transport?: (idempotencyKey: string, attempt: number) => Promise<HubSpotAttempt>;
    maxAttempts?: number;
    sleep?: (ms: number) => Promise<void>;
    alreadyDelivered?: ReadonlySet<string>;
  } = {},
): Promise<HubSpotDelivery> {
  if (options.alreadyDelivered?.has(input.idempotencyKey)) {
    return { status: 'duplicate', attempts: 0, idempotencyKey: input.idempotencyKey };
  }
  if (!getFeatureFlags().crm || !options.transport) {
    return { status: 'disabled', attempts: 0 };
  }
  const transport = options.transport;
  const max = options.maxAttempts ?? 3;
  const sleep = options.sleep ?? (async () => undefined);
  let lastCode = 'unknown';
  for (let attempt = 1; attempt <= max; attempt += 1) {
    const result = await transport(input.idempotencyKey, attempt);
    if (result.ok) return { status: 'delivered', attempts: attempt, remoteId: result.remoteId };
    lastCode = result.code;
    if (result.code === 'duplicate') {
      return { status: 'duplicate', attempts: attempt, idempotencyKey: input.idempotencyKey };
    }
    if (!result.retryable || attempt === max) {
      return { status: 'failed', attempts: attempt, code: result.code };
    }
    await sleep(0);
  }
  return { status: 'failed', attempts: max, code: lastCode };
}
