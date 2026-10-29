export type IntegrationName = 'appwrite' | 'hubspot' | 'stripe' | 'apollo';

export type DisabledAdapterResult = {
  ok: false;
  status: 'disabled';
  integration: IntegrationName;
  message: string;
};

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
