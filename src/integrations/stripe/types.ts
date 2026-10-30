export type StripeCheckoutMode = 'payment' | 'subscription';

export type StripeCheckoutSessionRequest = {
  orgId: string;
  offerId: string;
  mode: StripeCheckoutMode;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
  correlationId: string;
};

export type StripeSubscriptionCheckoutRequest = StripeCheckoutSessionRequest & {
  mode: 'subscription';
};

export type StripeWebhookVerifyFailureCode =
  | 'missing_secret'
  | 'missing_header'
  | 'malformed_header'
  | 'bad_signature'
  | 'timestamp_expired';

export type StripeWebhookVerifyResult =
  | { ok: true; timestamp: number; signature: string }
  | { ok: false; code: StripeWebhookVerifyFailureCode };
