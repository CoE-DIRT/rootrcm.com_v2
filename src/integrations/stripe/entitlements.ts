import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { getFeatureFlags } from '../../lib/flags.ts';
import { verifyStripeWebhookSignature } from './webhooks.ts';

export type TestEntitlement = {
  orgId: string;
  featureCode: string;
  state: 'active';
  source: 'stripe_test_webhook';
  eventId: string;
  livemode: false;
};

export type StripeTestCheckout =
  | { status: 'disabled' }
  | { status: 'rejected'; reason: 'livemode' | 'missing_idempotency' }
  | { status: 'duplicate'; id: string }
  | { status: 'test_prepared'; id: string; livemode: false };

type CheckoutTransportResult = { id: string; livemode: boolean };

/**
 * Test-mode checkout intent. Disabled unless billing is enabled and a transport is injected.
 * A live-mode transport result is rejected and not stored.
 */
export async function createStripeTestCheckout(
  input: { orgId: string; offerId: string; idempotencyKey: string },
  options: {
    transport?: (idempotencyKey: string) => Promise<CheckoutTransportResult>;
    seen?: Map<string, string>;
  } = {},
): Promise<StripeTestCheckout> {
  if (!input.idempotencyKey.trim()) return { status: 'rejected', reason: 'missing_idempotency' };
  const prior = options.seen?.get(input.idempotencyKey);
  if (prior) return { status: 'duplicate', id: prior };
  if (!getFeatureFlags().billing || !options.transport) return { status: 'disabled' };
  const created = await options.transport(input.idempotencyKey);
  if (created.livemode !== false) return { status: 'rejected', reason: 'livemode' };
  options.seen?.set(input.idempotencyKey, created.id);
  return { status: 'test_prepared', id: created.id, livemode: false };
}

export type StripeEntitlementResult =
  | { status: 'disabled' }
  | { status: 'rejected'; reason: string }
  | { status: 'ignored'; reason: string }
  | { status: 'duplicate'; entitlement: TestEntitlement }
  | { status: 'applied'; entitlement: TestEntitlement };

type LedgerFile = { events: Record<string, TestEntitlement> };

export class FileEntitlementLedger {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  read(eventId: string): TestEntitlement | null {
    return this.load().events[eventId] ?? null;
  }

  write(record: TestEntitlement): { duplicate: boolean; entitlement: TestEntitlement } {
    const current = this.load();
    const existing = current.events[record.eventId];
    if (existing) return { duplicate: true, entitlement: existing };
    current.events[record.eventId] = record;
    this.store(current);
    return { duplicate: false, entitlement: record };
  }

  private load(): LedgerFile {
    try {
      const parsed = JSON.parse(readFileSync(this.filePath, 'utf8')) as LedgerFile;
      return { events: parsed.events ?? {} };
    } catch {
      return { events: {} };
    }
  }

  private store(data: LedgerFile): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    const temp = `${this.filePath}.tmp`;
    writeFileSync(temp, JSON.stringify(data), { encoding: 'utf8' });
    rmSync(this.filePath, { force: true });
    renameSync(temp, this.filePath);
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/**
 * Apply a verified Stripe test webhook to a server-side entitlement file.
 * Success-page redirects cannot call this. Live mode never activates a grant.
 */
export function applyVerifiedStripeTestWebhook(input: {
  payload: string;
  signatureHeader: string | null | undefined;
  secret: string;
  ledger: FileEntitlementLedger;
  nowMs?: number;
}): StripeEntitlementResult {
  if (!getFeatureFlags().billing) return { status: 'disabled' };
  const verified = verifyStripeWebhookSignature({
    payload: input.payload,
    signatureHeader: input.signatureHeader,
    secret: input.secret,
    nowMs: input.nowMs,
  });
  if (!verified.ok) return { status: 'rejected', reason: verified.code };

  let parsed: unknown;
  try {
    parsed = JSON.parse(input.payload) as unknown;
  } catch {
    return { status: 'rejected', reason: 'malformed_payload' };
  }
  const event = asRecord(parsed);
  const eventId = typeof event?.id === 'string' ? event.id : '';
  const type = typeof event?.type === 'string' ? event.type : '';
  const data = asRecord(event?.data);
  const object = asRecord(data?.object);
  if (!eventId || !object) return { status: 'rejected', reason: 'malformed_payload' };
  if (object.livemode !== false) return { status: 'rejected', reason: 'livemode' };
  const accepted = type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded';
  if (!accepted) return { status: 'ignored', reason: 'event_type' };
  if (object.payment_status !== 'paid') return { status: 'ignored', reason: 'unpaid' };
  const metadata = asRecord(object.metadata);
  const orgId = typeof metadata?.orgId === 'string' ? metadata.orgId : '';
  const featureCode = typeof metadata?.featureCode === 'string' ? metadata.featureCode : '';
  if (!/^[a-z0-9-]{1,64}$/.test(orgId) || !/^[a-z0-9-]{1,64}$/.test(featureCode)) {
    return { status: 'rejected', reason: 'metadata' };
  }
  const entitlement: TestEntitlement = {
    orgId,
    featureCode,
    state: 'active',
    source: 'stripe_test_webhook',
    eventId,
    livemode: false,
  };
  const written = input.ledger.write(entitlement);
  return written.duplicate
    ? { status: 'duplicate', entitlement: written.entitlement }
    : { status: 'applied', entitlement: written.entitlement };
}

export function entitlementFingerprint(record: TestEntitlement): string {
  return createHash('sha256')
    .update(`${record.eventId}|${record.orgId}|${record.featureCode}`)
    .digest('hex');
}
