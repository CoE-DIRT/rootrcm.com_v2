import type { EhrConnection, EhrConnectionRequest } from '../../domain/integrations/ehr.ts';
import { disabledAdapter, type DisabledAdapterResult } from '../disabled.ts';

export function connectEhr(input: EhrConnectionRequest): DisabledAdapterResult {
  void input;
  return disabledAdapter('ehr');
}

export function describeEhrConnection(input: EhrConnectionRequest): EhrConnection {
  return {
    orgId: input.orgId,
    systemCode: input.systemCode,
    status: 'disabled',
    live: false,
    approvedIntegration: false,
  };
}

export function createEhrClient() {
  return {
    connect: connectEhr,
    describe: describeEhrConnection,
  };
}
