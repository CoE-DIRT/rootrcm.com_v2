import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SEED_IDS } from '../src/domain/operations/seed.ts';
import {
  healthcareIdentitiesFromSeed,
  healthcareOrgIds,
  isHealthcareOrgId,
} from '../src/domain/healthcare/identities.ts';
import { HEALTHCARE_IDENTITY_CATALOG } from '../src/domain/healthcare/types.ts';
import {
  fetchGoHealthcarePreview,
  probeGoHealthcare,
  resolveGoBaseUrl,
} from '../src/server/healthcare/go-client.ts';
import { projectHealthcareFromSnapshot, queryHealthcare } from '../src/server/healthcare/query.ts';
import {
  applyOpsAction,
  peekOpsSnapshot,
  resetOpsStore,
} from '../src/server/operations/store.ts';
import { connectStedi, describeStediConnection } from '../src/integrations/stedi/client.ts';
import { stediAdapter } from '../src/integrations/disabled.ts';
import { getFeatureFlags } from '../src/lib/flags.ts';

const PHI_HINT = /\b(npi|dob|date of birth|mrn|ssn|social security|memberid|patientName)\b/i;
const GO_IDENTITIES = readFileSync('services/healthcare-go/internal/seed/identities.go', 'utf8');
const GO_RECORDS = readFileSync('services/healthcare-go/internal/seed/records.go', 'utf8');
const GO_HANDLER = readFileSync('services/healthcare-go/internal/api/handler.go', 'utf8');

const isolatedSession = { id: 'healthcare-adapter-test', capability: 'operator' as const };

function syntheticFetch(path: string): Response {
  if (path === '/v1/capabilities' || path.endsWith('/v1/capabilities')) {
    return Response.json({
      mode: 'demonstration',
      source: 'synthetic',
      verifiedAt: null,
      data: { language: 'Go', live: false },
    });
  }
  if (path === '/healthz' || path.endsWith('/healthz')) {
    return Response.json({
      status: 'ok',
      service: 'root-healthcare-go',
      mode: 'demonstration',
      livePayerConnection: false,
    });
  }
  if (path.includes('/v1/claims/status')) {
    return Response.json({
      mode: 'demonstration',
      source: 'synthetic',
      orgId: 'bayview',
      data: [{ id: 'clm-bv-1001', payer: 'Healthfirst', stage: 'payer_processing' }],
    });
  }
  return new Response('not found', { status: 404 });
}

const loopbackGo = {
  baseUrl: 'http://127.0.0.1:8787',
  fetchImpl: async (url: URL) => syntheticFetch(url.pathname + url.search),
};

test('shared identities match operations seed and Go catalog', () => {
  const catalog = healthcareIdentitiesFromSeed();
  assert.equal(catalog.catalog, HEALTHCARE_IDENTITY_CATALOG);
  assert.deepEqual(catalog.organizations, [...healthcareOrgIds]);
  assert.ok(catalog.claimIds.includes(SEED_IDS.denialClaim));
  assert.ok(catalog.credentialingIds.includes(SEED_IDS.bottleneckApplication));
  assert.ok(catalog.claimIds.includes('clm-cg-2001'));
  assert.ok(catalog.claimIds.includes('clm-asc-3001'));
  assert.ok(!catalog.organizations.includes('root-internal'));
  assert.equal(isHealthcareOrgId('root-internal'), false);

  assert.match(GO_IDENTITIES, /ops-seed-v1/);
  for (const org of catalog.organizations) {
    assert.ok(GO_IDENTITIES.includes(`"${org}"`), `Go missing org ${org}`);
  }
  for (const id of catalog.claimIds) {
    assert.ok(GO_RECORDS.includes(`"${id}"`), `Go missing claim ${id}`);
  }
  for (const id of catalog.credentialingIds) {
    assert.ok(GO_RECORDS.includes(`"${id}"`), `Go missing application ${id}`);
  }
  for (const id of catalog.eligibilityIds) {
    assert.ok(GO_RECORDS.includes(`"${id}"`), `Go missing eligibility ${id}`);
  }
  assert.equal(GO_RECORDS.includes('DEMO-CLM'), false);
  assert.equal(GO_HANDLER.includes('DEMO-CRED'), false);
});

test('Go client rejects non-loopback URLs and credentialed URLs', () => {
  delete process.env.ROOT_GO_HEALTHCARE_PREVIEW_URL;
  assert.equal(resolveGoBaseUrl().ok, false);
  assert.equal(resolveGoBaseUrl('https://example.invalid/go').ok, false);
  assert.equal(resolveGoBaseUrl('http://10.0.0.8:8787').ok, false);
  assert.equal(resolveGoBaseUrl('http://user:secret@127.0.0.1:8787').ok, false);
  const ok = resolveGoBaseUrl('http://127.0.0.1:8787');
  assert.equal(ok.ok, true);
});

test('probe and public preview stay unavailable without a loopback Go service', async () => {
  delete process.env.ROOT_GO_HEALTHCARE_PREVIEW_URL;
  const probe = await probeGoHealthcare({ baseUrl: undefined });
  assert.equal(probe.ok, false);
  if (probe.ok) return;
  assert.equal(probe.mode, 'unavailable');
  assert.equal(probe.error.code, 'go_preview_not_connected');

  const preview = await fetchGoHealthcarePreview('claims', 'bayview', { baseUrl: undefined });
  assert.equal(preview.httpStatus, 503);
  assert.equal(preview.payload.mode, 'unavailable');
  assert.equal(preview.payload.source, 'synthetic');
});

test('public Go preview maps demonstration envelopes to synthetic mode', async () => {
  const result = await fetchGoHealthcarePreview('claims', 'bayview', loopbackGo);
  assert.equal(result.httpStatus, 200);
  assert.equal(result.payload.mode, 'synthetic');
  assert.equal(result.payload.source, 'synthetic');
  assert.equal(result.payload.identityCatalog, HEALTHCARE_IDENTITY_CATALOG);
  assert.equal(result.payload.ledger, 'operations');
});

test('queryHealthcare overlays the operations ledger after credentialing and claim mutations', async () => {
  resetOpsStore(isolatedSession);
  const go = loopbackGo;

  const before = await queryHealthcare({
    kind: 'credentialing',
    orgId: 'bayview',
    session: isolatedSession,
    go,
  });
  assert.equal(before.mode, 'synthetic');
  assert.equal(before.ledger, 'operations');
  const bottleneck = Array.isArray(before.data)
    ? before.data.find((row) => 'applicationId' in row && row.applicationId === SEED_IDS.bottleneckApplication)
    : null;
  assert.equal(bottleneck && 'phase' in bottleneck ? bottleneck.phase : null, 'additional_information');

  const advanced = applyOpsAction(
    {
      type: 'advance_credentialing',
      orgId: 'bayview',
      persona: 'staff',
      applicationId: SEED_IDS.bottleneckApplication,
    },
    isolatedSession,
  );
  assert.equal(advanced.ok, true);

  const afterCred = await queryHealthcare({
    kind: 'credentialing',
    orgId: 'bayview',
    session: isolatedSession,
    go,
  });
  const updated = Array.isArray(afterCred.data)
    ? afterCred.data.find((row) => 'applicationId' in row && row.applicationId === SEED_IDS.bottleneckApplication)
    : null;
  assert.equal(updated && 'phase' in updated ? updated.phase : null, 'payer_review');

  const events = await queryHealthcare({
    kind: 'events',
    orgId: 'bayview',
    session: isolatedSession,
    go,
  });
  assert.equal(events.mode, 'synthetic');
  assert.ok(
    Array.isArray(events.data) &&
      events.data.some(
        (row) =>
          row.resourceId === SEED_IDS.bottleneckApplication &&
          row.action === 'advance_credentialing' &&
          row.toStatus === 'payer_review',
      ),
  );

  const denied = applyOpsAction(
    {
      type: 'deny_claim',
      orgId: 'bayview',
      persona: 'staff',
      claimId: SEED_IDS.deniableClaim,
    },
    isolatedSession,
  );
  assert.equal(denied.ok, true);

  const claims = await queryHealthcare({
    kind: 'claims',
    orgId: 'bayview',
    session: isolatedSession,
    go,
  });
  const claim = Array.isArray(claims.data)
    ? claims.data.find((row) => 'id' in row && row.id === SEED_IDS.deniableClaim)
    : null;
  assert.equal(claim && 'stage' in claim ? claim.stage : null, 'denied');

  const snapshot = peekOpsSnapshot(isolatedSession);
  const projected = projectHealthcareFromSnapshot(snapshot, 'claims', 'bayview');
  const projectedClaim = Array.isArray(projected.data)
    ? projected.data.find((row) => 'id' in row && row.id === SEED_IDS.deniableClaim)
    : null;
  assert.equal(projectedClaim && 'stage' in projectedClaim ? projectedClaim.stage : null, 'denied');
  assert.equal(JSON.stringify(claims.data), JSON.stringify(projected.data));

  const serialized = JSON.stringify({ before, afterCred, events, claims, snapshot });
  assert.equal(PHI_HINT.test(serialized), false);
  assert.equal(serialized.includes('patient'), false);
});

test('queryHealthcare is unavailable when Go probe fails and does not fabricate live data', async () => {
  resetOpsStore(isolatedSession);
  applyOpsAction(
    {
      type: 'advance_credentialing',
      orgId: 'bayview',
      persona: 'staff',
      applicationId: SEED_IDS.bottleneckApplication,
    },
    isolatedSession,
  );
  const result = await queryHealthcare({
    kind: 'credentialing',
    orgId: 'bayview',
    session: isolatedSession,
    go: { baseUrl: undefined },
  });
  assert.equal(result.mode, 'unavailable');
  assert.equal(result.data, null);
  assert.equal(result.error?.code, 'go_preview_not_connected');

  const ledger = peekOpsSnapshot(isolatedSession);
  const app = ledger.credentialingApplications.find((row) => row.id === SEED_IDS.bottleneckApplication);
  assert.equal(app?.status, 'payer_review');
});

test('Stedi remains typed disabled planned primary and live claims stay hard false', () => {
  process.env.ROOT_ENABLE_LIVE_CLAIMS = 'true';
  const flags = getFeatureFlags();
  assert.equal(flags.liveClaims, false);

  const request = {
    orgId: 'bayview',
    payerCode: 'operational.clearinghouse.eligibility',
    transaction: '270/271' as const,
  };
  const connected = connectStedi(request);
  const described = describeStediConnection(request);
  assert.equal(connected.status, 'disabled');
  assert.equal(described.live, false);
  assert.equal(described.role, 'planned_primary');
  assert.equal(described.sandboxAuthorized, false);
  assert.equal(described.claimedPartnership, false);
  assert.equal(stediAdapter().status, 'disabled');
  delete process.env.ROOT_ENABLE_LIVE_CLAIMS;
});

test('capabilities advertise the operations ledger and disabled Stedi', async () => {
  resetOpsStore(isolatedSession);
  const result = await queryHealthcare({
    kind: 'capabilities',
    session: isolatedSession,
    go: loopbackGo,
  });
  assert.equal(result.mode, 'synthetic');
  assert.ok(result.data && !Array.isArray(result.data));
  if (!result.data || Array.isArray(result.data) || !('plannedPrimaryClearinghouse' in result.data)) {
    return;
  }
  assert.equal(result.data.plannedPrimaryClearinghouse, 'Stedi');
  assert.equal(result.data.ledger, 'operations');
  assert.equal(result.data.stedi.status, 'disabled');
  assert.equal(result.data.live, false);
  assert.deepEqual([...result.data.syntheticOrganizations], [...healthcareOrgIds]);
});
