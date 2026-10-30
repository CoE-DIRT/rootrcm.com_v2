import type { PayerConnection, PayerConnectionRequest } from '../../domain/integrations/payer.ts';
import { disabledAdapter, type DisabledAdapterResult } from '../disabled.ts';

export function connectPayer(input: PayerConnectionRequest): DisabledAdapterResult {
  void input;
  return disabledAdapter('payer');
}

export function describePayerConnection(input: PayerConnectionRequest): PayerConnection {
  return {
    orgId: input.orgId,
    payerCode: input.payerCode,
    status: 'disabled',
    live: false,
    claimedPartnership: false,
    approvedIntegration: false,
  };
}

export function createPayerClient() {
  return {
    connect: connectPayer,
    describe: describePayerConnection,
  };
}
