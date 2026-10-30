import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSeedSnapshot, SEED_CLOCK, SEED_IDS } from '../src/domain/operations/seed.ts';
import { computeMetrics } from '../src/domain/operations/metrics.ts';
import {
  advanceCredentialing,
  denyClaim,
  reset,
} from '../src/domain/operations/transitions.ts';
import { claimStatusStates } from '../src/domain/operations/types.ts';
import { authorizeOpsPreview } from '../src/server/operations/policy.ts';
import {
  applyOpsAction,
  projectOpsView,
  readOpsState,
  resetOpsStore,
} from '../src/server/operations/store.ts';
import type { OpsSessionContext } from '../src/server/operations/session.ts';

const PHI_HINT = /\b(npi|dob|date of birth|mrn|ssn|social security)\b/i;

function uniqueIds(ids: string[]): void {
  assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids.join(',')}`);
}

test('seed integrity: relational graph, stable ids, no PHI, origin synthetic', () => {
  const seed = createSeedSnapshot();
  const serialized = JSON.stringify(seed);
  assert.equal(seed.clock, SEED_CLOCK);
  assert.equal(seed.preview.orgId, 'bayview');
  assert.ok(!PHI_HINT.test(serialized));
  assert.ok(!serialized.includes('patient'));

  uniqueIds(seed.organizations.map((row) => row.id));
  uniqueIds(seed.locations.map((row) => row.id));
  uniqueIds(seed.providers.map((row) => row.id));
  uniqueIds(seed.payers.map((row) => row.id));
  uniqueIds(seed.appointments.map((row) => row.id));
  uniqueIds(seed.eligibility.map((row) => row.id));
  uniqueIds(seed.auths.map((row) => row.id));
  uniqueIds(seed.encounters.map((row) => row.id));
  uniqueIds(seed.charges.map((row) => row.id));
  uniqueIds(seed.claims.map((row) => row.id));
  uniqueIds(seed.denials.map((row) => row.id));
  uniqueIds(seed.arItems.map((row) => row.id));
  uniqueIds(seed.credentialingApplications.map((row) => row.id));
  uniqueIds(seed.tasks.map((row) => row.id));
  uniqueIds(seed.notifications.map((row) => row.id));
  uniqueIds(seed.auditEvents.map((row) => row.id));

  assert.ok(seed.claims.length >= 8 && seed.claims.length <= 15);
  assert.equal(seed.credentialingApplications.length, 6);
  assert.ok(seed.organizations.some((row) => row.id === 'cedar-grove' && row.kind === 'solo'));
  assert.ok(seed.organizations.some((row) => row.id === 'bayview' && row.kind === 'multi'));
  assert.ok(seed.organizations.some((row) => row.id === 'metro-asc' && row.kind === 'complex'));
  assert.ok(seed.organizations.some((row) => row.id === 'root-internal' && row.kind === 'internal'));

  const eligibilityById = new Map(seed.eligibility.map((row) => [row.id, row]));
  for (const appointment of seed.appointments) {
    const check = eligibilityById.get(appointment.eligibilityId);
    assert.ok(check, `appointment ${appointment.id} missing eligibility`);
    assert.equal(check?.orgId, appointment.orgId);
    assert.equal(check?.appointmentId, appointment.id);
  }

  const encounterById = new Map(seed.encounters.map((row) => [row.id, row]));
  const providerById = new Map(seed.providers.map((row) => [row.id, row]));
  const locationById = new Map(seed.locations.map((row) => [row.id, row]));
  for (const claim of seed.claims) {
    assert.equal(claim.origin, 'synthetic');
    assert.equal(claim.id, claim.resourceId);
    assert.ok(encounterById.has(claim.encounterId));
    assert.equal(providerById.get(claim.providerId)?.orgId, claim.orgId);
    assert.equal(locationById.get(claim.locationId)?.orgId, claim.orgId);
    assert.equal(
      claim.lines.reduce((sum, line) => sum + line.amountCents, 0),
      claim.billedAmountCents,
    );
    for (const line of claim.lines) {
      assert.equal(line.claimId, claim.id);
      assert.equal(line.orgId, claim.orgId);
    }
  }

  for (const app of seed.credentialingApplications) {
    assert.equal(app.origin, 'synthetic');
    assert.equal(providerById.get(app.providerId)?.orgId, app.orgId);
    assert.equal(locationById.get(app.locationId)?.orgId, app.orgId);
    assert.equal(app.verifiedAt, null);
    assert.equal(app.sourceReference, null);
  }

  const denial = seed.denials.find((row) => row.claimId === SEED_IDS.denialClaim);
  const deniedClaim = seed.claims.find((row) => row.id === SEED_IDS.denialClaim);
  assert.ok(denial);
  assert.equal(deniedClaim?.status, 'denied');
  assert.ok(seed.tasks.some((row) => row.relatedId === SEED_IDS.denialClaim && row.kind === 'denial'));

  const bottleneck = seed.credentialingApplications.find(
    (row) => row.id === SEED_IDS.bottleneckApplication,
  );
  assert.equal(bottleneck?.status, 'additional_information');
  assert.ok(seed.tasks.some((row) => row.relatedId === bottleneck?.id && row.status === 'blocked'));

  const submitted = seed.credentialingApplications.find(
    (row) => row.id === SEED_IDS.submittedApplication,
  );
  assert.equal(submitted?.status, 'submitted');
  assert.ok(submitted?.submissionReceipt);
  assert.equal(submitted?.effectiveDate, null);

  const pendingEffective = seed.credentialingApplications.find(
    (row) => row.id === SEED_IDS.pendingEffectiveApplication,
  );
  assert.ok(pendingEffective?.submissionReceipt);
  assert.equal(pendingEffective?.effectiveDate, null);
  assert.notEqual(pendingEffective?.submissionReceipt?.slice(-10), seed.clock.slice(0, 10));

  for (const grant of seed.entitlements) {
    assert.equal(grant.source, 'preview');
    assert.notEqual(grant.source, 'stripe');
  }
});

test('metric reconciliation from seed records (bayview tenant)', () => {
  const seed = createSeedSnapshot();
  const claims = seed.claims.filter((row) => row.orgId === 'bayview');
  const apps = seed.credentialingApplications.filter((row) => row.orgId === 'bayview');
  const tasks = seed.tasks.filter((row) => row.orgId === 'bayview');
  const arItems = seed.arItems.filter((row) => row.orgId === 'bayview');
  const metrics = computeMetrics({
    claims,
    credentialingApplications: apps,
    tasks,
    arItems,
    clock: seed.clock,
  });

  const adjudicated = claims.filter((claim) =>
    ['denied', 'appealed', '835_posted', '276_277_adjudicated'].includes(claim.status),
  );
  const denied = claims.filter((claim) => claim.status === 'denied');
  assert.equal(metrics.denialRate.numerator, denied.length);
  assert.equal(metrics.denialRate.denominator, adjudicated.length);
  assert.equal(metrics.denialRate.value, denied.length / adjudicated.length);

  const openApps = apps.filter(
    (app) => app.status !== 'effective' && app.status !== 'rejected' && app.status !== 'withdrawn',
  );
  assert.equal(metrics.openEnrollments, openApps.length);

  const stageSum = Object.values(metrics.claimCountsByStage).reduce((sum, count) => sum + count, 0);
  assert.equal(stageSum, claims.length);
  for (const state of claimStatusStates) {
    assert.equal(
      metrics.claimCountsByStage[state],
      claims.filter((claim) => claim.status === state).length,
    );
  }

  const exceptions = tasks.filter((task) => task.status === 'open' || task.status === 'blocked');
  assert.equal(metrics.exceptionCount, exceptions.length);

  let weighted = 0;
  let weight = 0;
  for (const item of arItems) {
    if (item.status !== 'open' || item.balanceCents <= 0) continue;
    const days = Math.floor(
      (Date.parse(seed.clock) - Date.parse(item.openedAt)) / 86_400_000,
    );
    weighted += days * item.balanceCents;
    weight += item.balanceCents;
  }
  assert.equal(metrics.daysInAr.numerator, weighted);
  assert.equal(metrics.daysInAr.denominator, weight);
  assert.equal(metrics.daysInAr.value, weighted / weight);
  assert.equal(metrics.asOf, seed.clock);
});

test('advance_credentialing cascade: app + task + notification + audit + metric', () => {
  resetOpsStore();
  const before = readOpsState('metro-asc', 'staff');
  assert.equal(before.ok, true);
  if (!before.ok) return;
  const priorAudit = before.view.auditEvents.map((event) => ({ ...event }));
  const openBefore = before.view.metrics.openEnrollments;
  const exceptionsBefore = before.view.metrics.exceptionCount;

  const result = applyOpsAction({
    type: 'advance_credentialing',
    orgId: 'metro-asc',
    persona: 'staff',
    applicationId: SEED_IDS.pendingEffectiveApplication,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const app = result.view.credentialingApplications.find(
    (row) => row.id === SEED_IDS.pendingEffectiveApplication,
  );
  assert.equal(app?.status, 'effective');
  assert.equal(app?.effectiveDate, SEED_CLOCK.slice(0, 10));
  assert.equal(app?.submissionReceipt, 'SUB-cred-asc-001-2026-09-01');
  assert.notEqual(app?.effectiveDate, app?.submissionReceipt?.slice(-10));

  const relatedTasks = result.view.tasks.filter(
    (row) => row.relatedId === SEED_IDS.pendingEffectiveApplication,
  );
  assert.ok(relatedTasks.length >= 1);
  assert.ok(relatedTasks.every((row) => row.status === 'done'));

  assert.ok(
    result.view.notifications.some(
      (row) => row.relatedId === SEED_IDS.pendingEffectiveApplication && row.title.includes('Credentialing'),
    ),
  );

  assert.equal(result.view.auditEvents.length, priorAudit.length + 1);
  assert.deepEqual(
    result.view.auditEvents.slice(0, priorAudit.length).map((event) => ({
      id: event.id,
      action: event.action,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
    })),
    priorAudit.map((event) => ({
      id: event.id,
      action: event.action,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
    })),
  );
  const newest = result.view.auditEvents.at(-1);
  assert.equal(newest?.action, 'advance_credentialing');
  assert.equal(newest?.fromStatus, 'approved_pending_effective');
  assert.equal(newest?.toStatus, 'effective');

  assert.equal(result.view.metrics.openEnrollments, openBefore - 1);
  assert.equal(result.view.metrics.exceptionCount, exceptionsBefore - 1);
});

test('submission is not an effective date when advancing a submitted application', () => {
  const seed = createSeedSnapshot();
  const result = advanceCredentialing(seed, {
    orgId: 'bayview',
    persona: 'staff',
    applicationId: SEED_IDS.submittedApplication,
  });
  assert.equal(result.changed, true);
  const app = result.snapshot.credentialingApplications.find(
    (row) => row.id === SEED_IDS.submittedApplication,
  );
  assert.equal(app?.status, 'payer_acknowledged');
  assert.ok(app?.submissionReceipt);
  assert.equal(app?.effectiveDate, null);
  assert.notEqual(seed.credentialingApplications[2]?.status, 'payer_acknowledged');
});

test('deny_claim cascade: claim + denial + task + notification + audit + metric', () => {
  resetOpsStore();
  const before = readOpsState('bayview', 'staff');
  assert.equal(before.ok, true);
  if (!before.ok) return;
  const rateBefore = before.view.metrics.denialRate;
  const exceptionsBefore = before.view.metrics.exceptionCount;
  const denialsBefore = before.view.denials.length;
  const auditBefore = before.view.auditEvents.length;

  const result = applyOpsAction({
    type: 'deny_claim',
    orgId: 'bayview',
    persona: 'staff',
    claimId: SEED_IDS.deniableClaim,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const claim = result.view.claims.find((row) => row.id === SEED_IDS.deniableClaim);
  assert.equal(claim?.status, 'denied');
  assert.equal(result.view.denials.length, denialsBefore + 1);
  assert.ok(result.view.denials.some((row) => row.claimId === SEED_IDS.deniableClaim));
  assert.ok(
    result.view.tasks.some(
      (row) => row.relatedId === SEED_IDS.deniableClaim && row.kind === 'denial' && row.status === 'open',
    ),
  );
  assert.ok(result.view.notifications.some((row) => row.relatedId === SEED_IDS.deniableClaim));
  assert.equal(result.view.auditEvents.length, auditBefore + 1);
  assert.equal(result.view.auditEvents.at(-1)?.action, 'deny_claim');
  assert.equal(result.view.metrics.denialRate.numerator, rateBefore.numerator + 1);
  assert.equal(result.view.metrics.denialRate.denominator, rateBefore.denominator + 1);
  assert.equal(result.view.metrics.exceptionCount, exceptionsBefore + 1);

  const untouched = denyClaim(createSeedSnapshot(), {
    orgId: 'bayview',
    persona: 'staff',
    claimId: SEED_IDS.deniableClaim,
  });
  const original = createSeedSnapshot().claims.find((row) => row.id === SEED_IDS.deniableClaim);
  assert.equal(original?.status, 'payer_processing');
  assert.equal(untouched.snapshot.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'denied');
});

test('reset restores seed after mutations', () => {
  resetOpsStore();
  applyOpsAction({
    type: 'deny_claim',
    orgId: 'bayview',
    persona: 'staff',
    claimId: SEED_IDS.deniableClaim,
  });
  applyOpsAction({
    type: 'advance_timeline',
    orgId: 'bayview',
    persona: 'staff',
  });
  const mutated = readOpsState('bayview', 'client');
  assert.equal(mutated.ok, true);
  if (!mutated.ok) return;
  assert.equal(mutated.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'denied');
  assert.notEqual(mutated.view.metrics.asOf, SEED_CLOCK);

  const resetResult = applyOpsAction({ type: 'reset', orgId: 'bayview', persona: 'client' });
  assert.equal(resetResult.ok, true);
  if (!resetResult.ok) return;
  const seed = createSeedSnapshot();
  assert.equal(resetResult.view.metrics.asOf, SEED_CLOCK);
  assert.equal(resetResult.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'payer_processing');
  assert.equal(resetResult.view.claims.length, seed.claims.filter((row) => row.orgId === 'bayview').length);
  assert.deepEqual(reset(), createSeedSnapshot());
});

test('tenant isolation: client own-org only; staff assigned work; 403 cross-tenant', () => {
  resetOpsStore();
  const clientCedar = readOpsState('cedar-grove', 'client');
  assert.equal(clientCedar.ok, true);
  if (!clientCedar.ok) return;
  assert.ok(clientCedar.view.claims.every((row) => row.orgId === 'cedar-grove'));
  assert.ok(clientCedar.view.tasks.every((row) => row.orgId === 'cedar-grove'));
  assert.equal(clientCedar.view.claims.some((row) => row.id.startsWith('clm-bv-')), false);
  assert.equal(clientCedar.view.organizations.length, 1);
  assert.equal(clientCedar.view.organizations[0]?.id, 'cedar-grove');

  const staffBayview = readOpsState('bayview', 'staff');
  assert.equal(staffBayview.ok, true);
  if (!staffBayview.ok) return;
  assert.ok(staffBayview.view.claims.every((row) => row.orgId === 'bayview'));
  assert.ok(staffBayview.view.tasks.some((row) => row.orgId === 'cedar-grove' && row.assignedPersona === 'staff'));
  assert.ok(staffBayview.view.tasks.some((row) => row.orgId === 'metro-asc' && row.assignedPersona === 'staff'));
  assert.ok(staffBayview.view.metrics.denialRate.numerator >= 1);
  const bayviewClaimCount = createSeedSnapshot().claims.filter((row) => row.orgId === 'bayview').length;
  const stageSum = Object.values(staffBayview.view.metrics.claimCountsByStage).reduce(
    (sum, count) => sum + count,
    0,
  );
  assert.equal(stageSum, bayviewClaimCount);

  const clientInternal = authorizeOpsPreview({ orgId: 'root-internal', persona: 'client' });
  assert.equal(clientInternal.allow, false);
  if (!clientInternal.allow) assert.equal(clientInternal.decision.code, 'forbidden');

  const unknownOrg = authorizeOpsPreview({ orgId: 'acme-health', persona: 'client' });
  assert.equal(unknownOrg.allow, false);
  if (!unknownOrg.allow) assert.equal(unknownOrg.decision.code, 'not_a_member');

  const staffInternal = authorizeOpsPreview({ orgId: 'root-internal', persona: 'staff' });
  assert.equal(staffInternal.allow, true);

  const cross = applyOpsAction({
    type: 'deny_claim',
    orgId: 'cedar-grove',
    persona: 'client',
    claimId: SEED_IDS.deniableClaim,
  });
  assert.equal(cross.ok, false);
  if (!cross.ok) {
    assert.equal(cross.kind, 'denied');
    if (cross.kind === 'denied') assert.equal(cross.decision.code, 'not_a_member');
  }
  const stillOpen = readOpsState('bayview', 'client');
  assert.equal(stillOpen.ok, true);
  if (!stillOpen.ok) return;
  assert.equal(stillOpen.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'payer_processing');
});

test('unknown action is 422-shaped; preview entitlement never uses Stripe', () => {
  resetOpsStore();
  const unknown = applyOpsAction({
    type: 'launch_missiles' as never,
    orgId: 'bayview',
    persona: 'client',
  });
  assert.equal(unknown.ok, false);
  if (!unknown.ok) assert.equal(unknown.kind, 'unknown_action');

  const tier = applyOpsAction({ type: 'set_tier', orgId: 'bayview', persona: 'client' });
  assert.equal(tier.ok, true);
  if (!tier.ok) return;
  assert.equal(tier.view.entitlements[0]?.source, 'preview');
  assert.notEqual(tier.view.entitlements[0]?.source, 'stripe');
  assert.equal(tier.view.preview.tier, 'Free');

  const persona = applyOpsAction({ type: 'set_persona', orgId: 'bayview', persona: 'staff' });
  assert.equal(persona.ok, true);
  if (!persona.ok) return;
  assert.equal(persona.view.persona, 'staff');
  assert.equal(persona.view.preview.persona, 'staff');
});

test('ops routes fail closed on cache, unknown action, and PHI-shaped keys', () => {
  const stateRoute = readFileSync('src/app/api/v1/ops/state/route.ts', 'utf8');
  const actionRoute = readFileSync('src/app/api/v1/ops/actions/route.ts', 'utf8');
  const errors = readFileSync('src/server/http/errors.ts', 'utf8');
  assert.match(errors, /Cache-Control': 'no-store'/);
  assert.match(stateRoute, /jsonApi/);
  assert.match(stateRoute, /policyDenied/);
  assert.match(actionRoute, /unknown_action/);
  assert.match(actionRoute, /ACTION_KEYS/);
  assert.match(actionRoute, /applicationId/);
  assert.match(actionRoute, /readOpsSessionFromRequest/);
  assert.match(actionRoute, /rate_limited/);
  assert.match(stateRoute, /readOpsSessionFromRequest/);
  assert.equal(actionRoute.includes('ssn'), false);
  assert.equal(actionRoute.includes('patient'), false);
  assert.match(actionRoute, /policyDenied/);
});

test('demo sessions isolate mutations; client capability cannot operate; org tier is projected', () => {
  const alpha: OpsSessionContext = { id: 'sess-alpha', capability: 'operator' };
  const beta: OpsSessionContext = { id: 'sess-beta', capability: 'operator' };
  const viewer: OpsSessionContext = { id: 'sess-viewer', capability: 'client' };
  resetOpsStore(alpha);
  resetOpsStore(beta);

  const denied = applyOpsAction(
    { type: 'deny_claim', orgId: 'bayview', persona: 'staff', claimId: SEED_IDS.deniableClaim },
    alpha,
  );
  assert.equal(denied.ok, true);

  const betaView = readOpsState('bayview', 'staff', beta);
  assert.equal(betaView.ok, true);
  if (!betaView.ok) return;
  assert.equal(betaView.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'payer_processing');

  const alphaView = readOpsState('bayview', 'staff', alpha);
  assert.equal(alphaView.ok, true);
  if (!alphaView.ok) return;
  assert.equal(alphaView.view.claims.find((row) => row.id === SEED_IDS.deniableClaim)?.status, 'denied');

  const spoofed = applyOpsAction(
    { type: 'reset', orgId: 'bayview', persona: 'staff' },
    viewer,
  );
  assert.equal(spoofed.ok, false);
  if (!spoofed.ok) {
    assert.equal(spoofed.kind, 'denied');
    if (spoofed.kind === 'denied') assert.equal(spoofed.decision.code, 'forbidden');
  }

  const asClient = readOpsState('bayview', 'staff', viewer);
  assert.equal(asClient.ok, true);
  if (!asClient.ok) return;
  assert.equal(asClient.view.persona, 'client');

  const cedar = readOpsState('cedar-grove', 'staff', alpha);
  assert.equal(cedar.ok, true);
  if (!cedar.ok) return;
  assert.equal(cedar.view.preview.tier, 'Free');
  assert.equal(cedar.view.preview.orgId, 'cedar-grove');
});

test('client projection never mixes another tenant into metrics', () => {
  const seed = createSeedSnapshot();
  const view = projectOpsView(seed, 'cedar-grove', 'client');
  const expected = computeMetrics({
    claims: seed.claims.filter((row) => row.orgId === 'cedar-grove'),
    credentialingApplications: seed.credentialingApplications.filter((row) => row.orgId === 'cedar-grove'),
    tasks: seed.tasks.filter((row) => row.orgId === 'cedar-grove'),
    arItems: seed.arItems.filter((row) => row.orgId === 'cedar-grove'),
    clock: seed.clock,
  });
  assert.deepEqual(view.metrics, expected);
  assert.ok(view.claims.every((row) => row.orgId === 'cedar-grove'));
  assert.equal(view.preview.tier, 'Free');
  assert.equal(view.preview.orgId, 'cedar-grove');
});
