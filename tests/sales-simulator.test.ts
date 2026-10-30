import test from 'node:test';
import assert from 'node:assert/strict';
import { createSalesState, qualificationScore, salesMilestones, salesEntitlements, salesScenarios, transitionSales } from '../src/domain/sales-simulator.ts';

test('journey covers every commercial and onboarding stage in the correct order', () => {
  assert.deepEqual(salesMilestones, [
    'visitor', 'inquiry', 'qualified', 'consultation', 'proposal', 'contract',
    'organization', 'onboarding', 'active',
  ]);
});

test('all scenarios reset deterministically and calculate explainable qualification', () => {
  for (const scenario of salesScenarios) {
    const state = createSalesState(scenario.id);
    assert.equal(state.events.length, 0);
    assert.equal(state.version, 0);
    assert.equal(state.milestone, 'visitor');
    assert.equal(state.offer, scenario.offer);
    assert.ok(qualificationScore(state).score >= 0 && qualificationScore(state).score <= 100);
  }
});

test('every stage advances with immutable, ordered synthetic events', () => {
  let state = createSalesState();
  const original = state;
  for (let i = 1; i < salesMilestones.length; i++) {
    const result = transitionSales(state, 'advance');
    assert.equal(result.ok, true);
    if (!result.ok) break;
    state = result.state;
    assert.equal(state.milestone, salesMilestones[i]);
    assert.equal(state.events.length, i);
    assert.equal(state.events[i - 1].simulated, true);
    assert.equal(state.events[i - 1].from, salesMilestones[i - 1]);
    assert.equal(state.events[i - 1].to, salesMilestones[i]);
  }
  assert.equal(original.events.length, 0);
  assert.equal(transitionSales(state, 'advance').ok, false);
});

test('blocked state prevents advancement until resolved, then reset clears state', () => {
  let state = createSalesState();
  const locked = transitionSales(state, 'toggle_blocker');
  assert.equal(locked.ok, true);
  if (!locked.ok) return;
  state = locked.state;
  assert.equal(transitionSales(state, 'advance').ok, false);
  const unlocked = transitionSales(state, 'toggle_blocker');
  assert.equal(unlocked.ok, true);
  if (!unlocked.ok) return;
  const advanced = transitionSales(unlocked.state, 'advance');
  assert.equal(advanced.ok, true);
  if (!advanced.ok) return;
  const reset = transitionSales(advanced.state, 'reset');
  assert.equal(reset.ok, true);
  if (reset.ok) assert.deepEqual(reset.state, createSalesState());
});

test('free and managed entitlements are distinct and invalid offers fail safely', () => {
  assert.equal(salesEntitlements('free-account-consultation').includes('rcm_dashboard'), false);
  assert.equal(salesEntitlements('managed-rcm').includes('credentialing_tracker'), true);
  assert.equal(salesEntitlements('custom-mso').includes('multi_location'), true);
  assert.equal(transitionSales(createSalesState(), 'select_offer', 'fake' ).ok, false);
});
