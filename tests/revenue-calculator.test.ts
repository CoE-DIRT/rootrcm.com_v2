import test from 'node:test';
import assert from 'node:assert/strict';
import { messages } from '../src/content/messages.ts';
import {
  CALCULATOR_DEFAULTS,
  CALCULATOR_QUERY_SOURCE,
  RECOVERY_RATE,
  buildCalculatorQuery,
  calculatorQueryString,
  computeLeakage,
  parseCalculatorSearchParams,
} from '../src/lib/revenue-calculator.ts';

test('default leakage math matches recovery assumption', () => {
  const output = computeLeakage({
    monthlyCollections: CALCULATOR_DEFAULTS.monthlyCollections,
    denialRate: CALCULATOR_DEFAULTS.denialRate,
    practiceType: CALCULATOR_DEFAULTS.practiceType,
  });
  const expectedLost = Math.round(850_000 * 12 * 0.085);
  assert.equal(output.annualLost, expectedLost);
  assert.equal(output.recoverable, Math.round(expectedLost * RECOVERY_RATE));
  assert.equal(output.cleanClaim, 91.5);
});

test('onboarding query contract round-trips', () => {
  const input = {
    monthlyCollections: 1_200_000,
    denialRate: 10,
    practiceType: 'asc' as const,
  };
  const qs = calculatorQueryString(input);
  const parsed = parseCalculatorSearchParams(new URLSearchParams(qs));
  assert.equal(parsed.source, CALCULATOR_QUERY_SOURCE);
  assert.equal(parsed.monthlyCollections, 1_200_000);
  assert.equal(parsed.denialRate, 10);
  assert.equal(parsed.practiceType, 'asc');
  assert.equal(parsed.annualLost, 1_440_000);
  assert.equal(parsed.recoverable, Math.round(1_440_000 * RECOVERY_RATE));
  assert.equal(parsed.cleanClaim, 90);
  const built = buildCalculatorQuery(input);
  assert.equal(built.source, CALCULATOR_QUERY_SOURCE);
});

test('dictionary bilingual parity for services specialties pricing portal', () => {
  const en = messages.en.dictionary;
  const es = messages.es.dictionary;
  assert.equal(Object.keys(en.services).length, 16);
  assert.equal(Object.keys(es.services).length, 16);
  assert.equal(Object.keys(en.specialties).length, 24);
  assert.equal(Object.keys(es.specialties).length, 24);
  assert.equal(en.pricing.rules.length, 14);
  assert.equal(es.pricing.rules.length, 14);
  for (const key of Object.keys(en.services) as (keyof typeof en.services)[]) {
    assert.equal(en.services[key].steps.length, 4);
    assert.equal(es.services[key].steps.length, 4);
    assert.ok(es.services[key].name.length > 0);
  }
  assert.ok(es.portal.agingBands['0-30'].includes('días'));
  assert.ok(messages.es.calculator.cta.toLowerCase().includes('diagnóstico'));
  assert.ok(messages.en.calculator.cta.toLowerCase().includes('diagnostic'));
});
