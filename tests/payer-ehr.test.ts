import test from 'node:test';
import assert from 'node:assert/strict';
import { connectPayer, describePayerConnection } from '../src/integrations/payer/client.ts';
import { connectEhr, describeEhrConnection } from '../src/integrations/ehr/client.ts';

test('payer connection adapter is disabled and does not claim a partnership', () => {
  const request = {
    orgId: 'sample-solo',
    payerCode: 'operational.clearinghouse.eligibility',
    capabilities: ['eligibility_inquiry' as const],
  };
  const result = connectPayer(request);
  const described = describePayerConnection(request);
  assert.equal(result.status, 'disabled');
  assert.equal(described.live, false);
  assert.equal(described.claimedPartnership, false);
  assert.equal(described.approvedIntegration, false);
});

test('EHR connection adapter is disabled and is not a familiarity catalog', () => {
  const request = {
    orgId: 'sample-group',
    systemCode: 'operational.ehr.charge_export',
    capabilities: ['charge_export' as const],
  };
  const result = connectEhr(request);
  const described = describeEhrConnection(request);
  assert.equal(result.status, 'disabled');
  assert.equal(described.live, false);
  assert.equal(described.approvedIntegration, false);
  assert.equal(described.systemCode.startsWith('operational.'), true);
});
