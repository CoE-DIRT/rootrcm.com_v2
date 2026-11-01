import test from 'node:test';
import assert from 'node:assert/strict';
import { commercialNextPath, salesAdapterIntents } from '../src/domain/sales-pipeline.ts';
import { salesMilestones } from '../src/domain/sales-simulator.ts';
import {
  executeSalesPipelineStep,
  parseSalesPipelineRequest,
} from '../src/server/sales/execute-pipeline.ts';

test('every commercial stage has typed adapter intents that are never live', () => {
  for (const milestone of salesMilestones) {
    const intents = salesAdapterIntents(milestone, 'managed-rcm');
    for (const intent of intents) {
      assert.equal(intent.live, false);
    }
  }
  assert.equal(salesAdapterIntents('visitor', 'managed-rcm').length, 0);
  assert.ok(salesAdapterIntents('inquiry', 'managed-rcm').some((item) => item.integration === 'hubspot'));
  assert.ok(salesAdapterIntents('qualified', 'managed-rcm').some((item) => item.integration === 'apollo'));
  assert.ok(salesAdapterIntents('contract', 'revenue-diagnostic').some((item) => item.operation === 'create_checkout'));
  assert.ok(salesAdapterIntents('contract', 'managed-rcm').some((item) => item.operation === 'create_subscription'));
  assert.equal(
    salesAdapterIntents('contract', 'free-account-consultation').some((item) => item.integration === 'stripe'),
    false,
  );
});

test('commercial next paths stay on existing public and preview routes', () => {
  assert.equal(commercialNextPath('visitor', 'managed-rcm'), '/plans');
  assert.equal(commercialNextPath('inquiry', 'managed-rcm'), '/consultation');
  assert.equal(commercialNextPath('proposal', 'revenue-diagnostic'), '/diagnostic');
  assert.equal(commercialNextPath('contract', 'managed-rcm'), '/preview/billing');
  assert.equal(commercialNextPath('active', 'custom-mso'), '/preview/client');
});

test('seeded pipeline execution hits disabled HubSpot, Apollo and Stripe adapters', async () => {
  const parsed = parseSalesPipelineRequest({
    scenarioId: 'bayview',
    milestone: 'qualified',
    offer: 'managed-rcm',
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  const execution = await executeSalesPipelineStep(parsed.request);
  assert.equal(execution.simulated, true);
  assert.equal(execution.results.length, execution.intents.length);
  assert.ok(execution.results.length >= 2);
  for (const result of execution.results) {
    assert.equal(result.status, 'disabled');
    assert.equal(result.ok, false);
  }
  assert.ok(execution.results.some((item) => item.integration === 'hubspot'));
  assert.ok(execution.results.some((item) => item.integration === 'apollo'));
});

test('pipeline parser rejects unknown offers, including a fake Enterprise plan', () => {
  const enterprise = parseSalesPipelineRequest({
    scenarioId: 'bayview',
    milestone: 'proposal',
    offer: 'enterprise',
  });
  assert.equal(enterprise.ok, false);

  const contactBody = parseSalesPipelineRequest({
    name: 'Jordan Lee',
    email: 'jordan@example.invalid',
  });
  assert.equal(contactBody.ok, false);
});

test('contract stage for diagnostic stays on the disabled Stripe checkout adapter', async () => {
  const execution = await executeSalesPipelineStep({
    scenarioId: 'cedar-grove',
    milestone: 'contract',
    offer: 'revenue-diagnostic',
  });
  assert.ok(execution.results.some((item) => item.integration === 'stripe'));
  assert.ok(execution.results.every((item) => item.status === 'disabled'));
});
