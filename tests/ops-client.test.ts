import test from 'node:test';
import assert from 'node:assert/strict';
import { asPair, formatMetric, formatRatio, normalizeOpsState } from '../src/lib/ops-client.ts';
import { compareValues, matchesQuery } from '../src/lib/ops-query.ts';

test('normalizeOpsState maps collection aliases without inventing metrics', () => {
  const state = normalizeOpsState(
    {
      orgId: 'bayview',
      payers: [{ id: 'payer-hf', name: 'Healthfirst' }],
      providers: [{ id: 'prv-bv-a', alias: 'Sample Clinician A' }],
      credentialingApplications: [
        {
          id: 'cred-bv-001',
          payerId: 'payer-hf',
          providerId: 'prv-bv-a',
          status: 'payer_review',
          nextAction: 'Request payer review status',
          enrollmentType: 'initial',
        },
      ],
      claims: [{ id: 'clm-bv-1001', payerId: 'payer-hf', status: 'denied', nextAction: 'Prepare appeal' }],
      notifications: [{ id: 'n1', title: 'Enrollment moved' }],
      auditEvents: [
        {
          id: 'a1',
          action: 'advance_credentialing',
          resourceId: 'cred-bv-001',
          fromStatus: 'submitted',
          toStatus: 'payer_acknowledged',
        },
      ],
      metrics: {
        denialRate: { numerator: 1, denominator: 4, value: 0.25 },
        openEnrollments: 6,
        exceptionCount: 3,
      },
    },
    'bayview',
    'staff',
  );
  assert.equal(state.applications.length, 1);
  assert.equal(state.applications[0].id, 'cred-bv-001');
  assert.equal(state.applications[0].payer, 'Healthfirst');
  assert.equal(state.applications[0].providerAlias.en, 'Sample Clinician A');
  assert.equal(state.claims[0].status, 'denied');
  assert.equal(state.claims[0].payer, 'Healthfirst');
  assert.equal(state.metrics.denialRate, 0.25);
  assert.equal(state.metrics.denialRateRatio?.numerator, 1);
  assert.equal(state.metrics.daysInAr, null);
  assert.equal(state.metrics.exceptionCount, 3);
  assert.equal(state.notifications.length, 1);
  assert.equal(state.auditEvents[0].from, 'submitted');
  assert.equal(formatMetric(null), '—');
  assert.equal(formatMetric(6), '6');
});

test('workspaceDemoText EN and ES expose the same keys', async () => {
  const { workspaceDemoText } = await import('../src/content/operations-demo.ts');
  assert.deepEqual(Object.keys(workspaceDemoText.en).sort(), Object.keys(workspaceDemoText.es).sort());
});

test('asPair and query helpers keep locale and filter behavior honest', () => {
  assert.deepEqual(asPair('Follow up'), { en: 'Follow up', es: 'Follow up' });
  assert.equal(asPair('Request payer review status').es, 'Solicitar el estado de revisión del pagador');
  assert.notEqual(asPair('Request payer review status').es, asPair('Request payer review status').en);
  assert.deepEqual(asPair({ en: 'Owner', es: 'Responsable' }), { en: 'Owner', es: 'Responsable' });
  assert.equal(asPair('denied').es, 'Denegado');
  assert.equal(asPair('payer_processing').es, 'Procesamiento del pagador');
  assert.notEqual(asPair('payer_processing').es, asPair('payer_processing').en);
  assert.equal(asPair('Morning clinic block').es, 'Bloque matutino de consulta');
  assert.equal(asPair('preview-staff').es, 'Personal ROOT (vista previa)');
  assert.match(asPair('cred-bv-001 moved from submitted to payer_acknowledged.').es, /pasó de/);
  assert.equal(matchesQuery('cred', ['DEMO-CRED-001', 'Healthfirst']), true);
  assert.equal(matchesQuery('zzz', ['DEMO-CRED-001']), false);
  assert.ok(compareValues('DEMO-2', 'DEMO-10', 'asc') < 0);
});

test('formatMetric shows computed days in A/R instead of ratio weights', () => {
  assert.equal(formatMetric(32.5), '32.5');
  assert.equal(formatRatio({ numerator: 650, denominator: 20, value: 32.5 }, 32.5), '650/20');
  assert.notEqual(formatMetric(32.5), formatRatio({ numerator: 650, denominator: 20, value: 32.5 }, 32.5));
});
