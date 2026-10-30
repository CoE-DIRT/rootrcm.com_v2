import { disabledAdapter, type DisabledAdapterResult } from '../disabled.ts';
import type { StripeCheckoutSessionRequest, StripeSubscriptionCheckoutRequest } from './types.ts';

export function createCheckoutSession(input: StripeCheckoutSessionRequest): DisabledAdapterResult {
  void input;
  return disabledAdapter('stripe');
}

export function createSubscriptionCheckout(
  input: StripeSubscriptionCheckoutRequest,
): DisabledAdapterResult {
  void input;
  return disabledAdapter('stripe');
}

export function createStripeClient() {
  return {
    createCheckoutSession,
    createSubscriptionCheckout,
  };
}
