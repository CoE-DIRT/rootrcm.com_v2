import { createHmac, timingSafeEqual } from 'node:crypto';
import type { StripeWebhookVerifyResult } from './types.ts';

const DEFAULT_TOLERANCE_SECONDS = 300;

function readSecret(explicit?: string | null): string | null {
  if (typeof explicit === 'string') {
    const trimmed = explicit.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  const env = process.env.STRIPE_WEBHOOK_SECRET;
  if (typeof env !== 'string') return null;
  const trimmed = env.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseSignatureHeader(header: string): { timestamp: number; signatures: string[] } | null {
  const timestampPart = header
    .split(',')
    .map((part) => part.trim())
    .find((part) => part.startsWith('t='));
  const signatures = header
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.slice(3));
  if (!timestampPart || signatures.length === 0) return null;
  const timestamp = Number(timestampPart.slice(2));
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null;
  if (signatures.some((value) => !/^[a-f0-9]+$/i.test(value))) return null;
  return { timestamp, signatures };
}

function digestEqual(expectedHex: string, providedHex: string): boolean {
  const expected = Buffer.from(expectedHex, 'hex');
  const provided = Buffer.from(providedHex, 'hex');
  if (expected.length === 0 || expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

/**
 * Fail-closed Stripe signature verifier. Missing `STRIPE_WEBHOOK_SECRET` never succeeds.
 * No network. Does not activate entitlements.
 */
export function verifyStripeWebhookSignature(input: {
  payload: string;
  signatureHeader: string | null | undefined;
  secret?: string | null;
  toleranceSeconds?: number;
  nowMs?: number;
}): StripeWebhookVerifyResult {
  const secret = readSecret(input.secret);
  if (!secret) return { ok: false, code: 'missing_secret' };

  const header = input.signatureHeader?.trim() ?? '';
  if (!header) return { ok: false, code: 'missing_header' };

  const parsed = parseSignatureHeader(header);
  if (!parsed) return { ok: false, code: 'malformed_header' };

  const signedPayload = `${parsed.timestamp}.${input.payload}`;
  const expected = createHmac('sha256', secret).update(signedPayload).digest('hex');
  const matched = parsed.signatures.find((signature) => digestEqual(expected, signature));
  if (!matched) return { ok: false, code: 'bad_signature' };

  const nowMs = input.nowMs ?? Date.now();
  const toleranceMs = (input.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS) * 1000;
  if (Math.abs(nowMs - parsed.timestamp * 1000) > toleranceMs) {
    return { ok: false, code: 'timestamp_expired' };
  }

  return { ok: true, timestamp: parsed.timestamp, signature: matched };
}
