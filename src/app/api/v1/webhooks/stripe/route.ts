import { getFeatureFlags } from '@/lib/flags';
import { verifyStripeWebhookSignature } from '@/integrations/stripe/webhooks';
import { jsonError } from '@/server/http/errors';

export const runtime = 'nodejs';

/**
 * Stripe webhook inbox is not durable yet. Fail closed: no body parse, no
 * entitlement mutation, no event storage while billing is disabled or the
 * webhook secret is unset.
 */
export async function POST(request: Request) {
  const flags = getFeatureFlags();
  const verified = verifyStripeWebhookSignature({
    payload: '',
    signatureHeader: request.headers.get('stripe-signature'),
    secret: process.env.STRIPE_WEBHOOK_SECRET ?? null,
  });

  if (!flags.billing || !verified.ok) {
    return jsonError(
      503,
      'stripe_webhook_unavailable',
      'Stripe webhooks are not active. No event was stored or applied.',
    );
  }

  return jsonError(
    503,
    'stripe_webhook_unavailable',
    'Stripe webhooks are not active. No event was stored or applied.',
  );
}
