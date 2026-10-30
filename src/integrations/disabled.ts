export type IntegrationName =
  | 'appwrite'
  | 'hubspot'
  | 'stripe'
  | 'apollo'
  | 'payer'
  | 'ehr'
  | 'outbox';

export type DisabledAdapterResult = {
  ok: false;
  status: 'disabled';
  integration: IntegrationName;
  message: string;
};

export class DisabledIntegrationError extends Error {
  readonly status = 'disabled' as const;
  readonly integration: IntegrationName;

  constructor(integration: IntegrationName, message?: string) {
    super(
      message ??
        `${integration} adapter is typed and disabled until environment confirmation and owner approval.`,
    );
    this.name = 'DisabledIntegrationError';
    this.integration = integration;
  }
}

export function disabledAdapter(integration: IntegrationName): DisabledAdapterResult {
  return {
    ok: false,
    status: 'disabled',
    integration,
    message: `${integration} adapter is typed and disabled until environment confirmation and owner approval.`,
  };
}

export const appwriteAdapter = () => disabledAdapter('appwrite');
export const hubspotAdapter = () => disabledAdapter('hubspot');
export const stripeAdapter = () => disabledAdapter('stripe');
export const apolloAdapter = () => disabledAdapter('apollo');
export const payerAdapter = () => disabledAdapter('payer');
export const ehrAdapter = () => disabledAdapter('ehr');
export const outboxAdapter = () => disabledAdapter('outbox');
