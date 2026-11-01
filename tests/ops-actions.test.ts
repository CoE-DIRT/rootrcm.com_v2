import test from 'node:test';
import assert from 'node:assert/strict';
import { translateOpsAction } from '../src/content/ops-actions.ts';

test('credentialing audit output translates both stages without duplicated punctuation', () => {
  const result = translateOpsAction('cred-bv-001 moved from submitted to payer_acknowledged.');
  assert.equal(result.es, 'cred-bv-001 pasó de Enviada a Pagador acusó recibo.');
  assert.equal(result.en, 'cred-bv-001 moved from Submitted to Payer acknowledged.');
});

test('claim audit output retains exactly one terminating period', () => {
  const result = translateOpsAction('clm-bv-001 moved from payer_processing to denied.');
  assert.equal(result.es, 'clm-bv-001 pasó de Procesamiento del pagador a Denegado.');
});
