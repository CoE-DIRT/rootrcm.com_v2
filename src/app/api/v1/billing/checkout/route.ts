import { createCheckoutSession } from '@/integrations/stripe/client';
import { jsonError } from '@/server/http/errors';

export const runtime = 'nodejs';

/**
 * Checkout factory stays disabled. This handler does not parse a body so an
 * untrusted orgId cannot be accepted, and browser success URLs cannot grant
 * entitlements.
 */
export async function POST() {
  createCheckoutSession({
    orgId: '',
    offerId: '',
    mode: 'payment',
    successUrl: '',
    cancelUrl: '',
    idempotencyKey: 'disabled',
    correlationId: crypto.randomUUID(),
  });

  return jsonError(
    503,
    'checkout_unavailable',
    'Checkout is not active. No Stripe session was created.',
  );
}
