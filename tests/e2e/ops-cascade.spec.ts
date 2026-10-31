import { expect, test, type APIRequestContext, type APIResponse, type Browser } from '@playwright/test';

/**
 * API-level cascade for the locked operations preview.
 * Mutations require the signed staff-preview cookie (PR #30), not a JSON persona.
 * Serial because each presentation session has its own in-memory snapshot.
 */

const STATE = '/api/v1/ops/state';
const ACTIONS = '/api/v1/ops/actions';
const ORG = 'bayview';
const PERSONA = 'client';
const CRED_BOTTLENECK = 'cred-bv-004';
const DENIED_SEED_CLAIM = 'clm-bv-1002';
const ADJUDICATED = new Set(['denied', 'appealed', '835_posted', '276_277_adjudicated']);
const CLOSED_ENROLLMENTS = new Set(['effective', 'rejected', 'withdrawn']);

type Ratio = { numerator: number; denominator: number; value: number };

type OpsView = {
  origin: string;
  orgId: string;
  persona: string;
  metrics: {
    denialRate: Ratio;
    openEnrollments: number;
    exceptionCount: number;
    claimCountsByStage: Record<string, number>;
    daysInAr: Ratio;
    asOf: string;
  };
  claims: Array<{ id: string; status: string; origin: string; orgId: string }>;
  denials: Array<{ id: string; claimId: string; orgId: string }>;
  credentialingApplications: Array<{ id: string; status: string; origin: string; orgId: string }>;
  tasks: Array<{
    id: string;
    relatedId: string;
    kind: string;
    status: string;
    orgId: string;
  }>;
  notifications: Array<{ id: string; relatedId: string; title: string; orgId: string }>;
  auditEvents: Array<{
    id: string;
    action: string;
    resourceId: string;
    fromStatus: string | null;
    toStatus: string | null;
    orgId: string;
  }>;
};

type Envelope<T> = {
  data: T | null;
  meta: { correlationId: string };
  error: { code: string; message: string } | null;
};

test.describe.configure({ mode: 'serial' });

async function readJson<T>(response: APIResponse): Promise<Envelope<T>> {
  return (await response.json()) as Envelope<T>;
}

async function getState(
  request: APIRequestContext,
  orgId: string,
  persona: string,
): Promise<APIResponse> {
  return request.get(STATE, { params: { orgId, persona } });
}

async function postAction(
  request: APIRequestContext,
  body: Record<string, unknown>,
): Promise<APIResponse> {
  return request.post(ACTIONS, { data: body });
}

async function operatorRequest(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.goto('/en/preview/staff');
  return { context, request: context.request };
}

async function resetBayview(request: APIRequestContext): Promise<OpsView> {
  const response = await postAction(request, { type: 'reset', orgId: ORG, persona: PERSONA });
  expect(response.status(), 'reset must return 200').toBe(200);
  const body = await readJson<OpsView>(response);
  expect(body.error).toBeNull();
  expect(body.data).toBeTruthy();
  return body.data as OpsView;
}

function expectRatio(metric: Ratio, numerator: number, denominator: number) {
  expect(metric.numerator).toBe(numerator);
  expect(metric.denominator).toBe(denominator);
  expect(typeof metric.value).toBe('number');
  expect(metric.value).toBe(denominator === 0 ? 0 : numerator / denominator);
}

function expectMetricsReconcile(view: OpsView) {
  const denied = view.claims.filter((claim) => claim.status === 'denied').length;
  const adjudicated = view.claims.filter((claim) => ADJUDICATED.has(claim.status)).length;
  expectRatio(view.metrics.denialRate, denied, adjudicated);

  const openApps = view.credentialingApplications.filter(
    (app) => !CLOSED_ENROLLMENTS.has(app.status),
  ).length;
  expect(view.metrics.openEnrollments).toBe(openApps);

  const exceptions = view.tasks.filter(
    (task) => task.orgId === view.orgId && (task.status === 'open' || task.status === 'blocked'),
  ).length;
  expect(view.metrics.exceptionCount).toBe(exceptions);

  const stageSum = Object.values(view.metrics.claimCountsByStage).reduce(
    (sum, count) => sum + count,
    0,
  );
  expect(stageSum).toBe(view.claims.length);
}

test.describe('ops cascade API', () => {
  test('GET state 422 without orgId or persona', async ({ request }) => {
    const missingBoth = await request.get(STATE);
    expect(missingBoth.status()).toBe(422);
    const bothBody = await readJson<null>(missingBoth);
    expect(bothBody.data).toBeNull();
    expect(bothBody.error?.code).toBe('invalid_request');

    const missingPersona = await request.get(STATE, { params: { orgId: ORG } });
    expect(missingPersona.status()).toBe(422);
    expect((await readJson<null>(missingPersona)).error?.code).toBe('invalid_request');

    const missingOrg = await request.get(STATE, { params: { persona: PERSONA } });
    expect(missingOrg.status()).toBe(422);
    expect((await readJson<null>(missingOrg)).error?.code).toBe('invalid_request');
  });

  test('GET bayview+client 200 with synthetic origin and denialRate ratio', async ({
    browser,
    baseURL,
  }) => {
    const session = await operatorRequest(browser, baseURL);
    try {
    await resetBayview(session.request);
    const response = await getState(session.request, ORG, PERSONA);
    expect(response.status()).toBe(200);
    const view = (await readJson<OpsView>(response)).data as OpsView;
    expect(view.origin).toBe('synthetic');
    expect(view.orgId).toBe(ORG);
    expect(view.persona).toBe(PERSONA);
    expect(view.claims.every((claim) => claim.origin === 'synthetic')).toBe(true);
    expect(view.credentialingApplications.every((app) => app.origin === 'synthetic')).toBe(true);
    expect(view.metrics.denialRate).toEqual(
      expect.objectContaining({
        numerator: expect.any(Number),
        denominator: expect.any(Number),
        value: expect.any(Number),
      }),
    );
    expectMetricsReconcile(view);
    expect(view.claims.some((claim) => claim.id === DENIED_SEED_CLAIM)).toBe(true);
    expect(view.credentialingApplications.some((app) => app.id === CRED_BOTTLENECK)).toBe(true);
    } finally {
      await session.context.close();
    }
  });

  test('POST reset then GET returns a consistent snapshot', async ({ browser, baseURL }) => {
    const session = await operatorRequest(browser, baseURL);
    try {
    const resetView = await resetBayview(session.request);
    const getResponse = await getState(session.request, ORG, PERSONA);
    expect(getResponse.status()).toBe(200);
    const getView = (await readJson<OpsView>(getResponse)).data as OpsView;
    expect(getView.origin).toBe(resetView.origin);
    expect(getView.orgId).toBe(resetView.orgId);
    expect(getView.persona).toBe(resetView.persona);
    expect(getView.metrics.asOf).toBe(resetView.metrics.asOf);
    expect(getView.claims.map((row) => row.id).sort()).toEqual(
      resetView.claims.map((row) => row.id).sort(),
    );
    expect(getView.credentialingApplications.map((row) => row.id).sort()).toEqual(
      resetView.credentialingApplications.map((row) => row.id).sort(),
    );
    expectMetricsReconcile(getView);
    } finally {
      await session.context.close();
    }
  });

  test('POST advance_credentialing for cred-bv-004 cascades status, task, notification, audit, metrics', async ({
    browser,
    baseURL,
  }) => {
    const session = await operatorRequest(browser, baseURL);
    try {
    const before = await resetBayview(session.request);
    const appBefore = before.credentialingApplications.find((row) => row.id === CRED_BOTTLENECK);
    expect(appBefore?.status).toBe('additional_information');
    const taskBefore = before.tasks.find((row) => row.relatedId === CRED_BOTTLENECK);
    expect(taskBefore?.status).toBe('blocked');
    const relatedNoticesBefore = before.notifications.filter(
      (row) => row.relatedId === CRED_BOTTLENECK,
    ).length;
    const auditBefore = before.auditEvents.length;
    const openBefore = before.metrics.openEnrollments;

    const response = await postAction(session.request, {
      type: 'advance_credentialing',
      orgId: ORG,
      persona: PERSONA,
      applicationId: CRED_BOTTLENECK,
    });
    expect(response.status()).toBe(200);
    const view = (await readJson<OpsView>(response)).data as OpsView;

    const app = view.credentialingApplications.find((row) => row.id === CRED_BOTTLENECK);
    expect(app?.status).toBe('payer_review');

    const task = view.tasks.find((row) => row.id === taskBefore?.id);
    expect(task?.status).toBe('open');
    expect(task?.status).not.toBe(taskBefore?.status);

    expect(
      view.notifications.some(
        (row) =>
          row.relatedId === CRED_BOTTLENECK &&
          row.title.toLowerCase().includes('credentialing') &&
          !before.notifications.some((prior) => prior.id === row.id),
      ),
    ).toBe(true);
    expect(view.notifications.filter((row) => row.relatedId === CRED_BOTTLENECK).length).toBeGreaterThan(
      relatedNoticesBefore,
    );

    expect(view.auditEvents.length).toBe(auditBefore + 1);
    const newest = view.auditEvents.at(-1);
    expect(newest?.action).toBe('advance_credentialing');
    expect(newest?.resourceId).toBe(CRED_BOTTLENECK);
    expect(newest?.fromStatus).toBe('additional_information');
    expect(newest?.toStatus).toBe('payer_review');
    expect(view.auditEvents.slice(0, auditBefore).map((event) => event.id)).toEqual(
      before.auditEvents.map((event) => event.id),
    );

    expect(view.metrics.openEnrollments).toBe(openBefore);
    expectMetricsReconcile(view);

    const healthcare = await session.request.get('/api/v1/ops/healthcare', {
      params: { kind: 'credentialing', orgId: ORG, persona: PERSONA },
    });
    const healthcareBody = (await healthcare.json()) as {
      data: {
        mode?: string;
        ledger?: string;
        data?: Array<{ applicationId?: string; phase?: string }>;
      } | null;
      error: { code: string } | null;
    };
    if (healthcare.status() === 200) {
      expect(healthcareBody.data?.mode).toBe('synthetic');
      expect(healthcareBody.data?.ledger).toBe('operations');
      expect(
        healthcareBody.data?.data?.find((row) => row.applicationId === CRED_BOTTLENECK)?.phase,
      ).toBe('payer_review');
    } else {
      expect(healthcare.status()).toBe(503);
      expect(healthcareBody.data?.mode ?? 'unavailable').toBe('unavailable');
    }
    } finally {
      await session.context.close();
    }
  });

  test('POST deny_claim for clm-bv-1002 keeps denial, task, notification, audit, and metrics together', async ({
    browser,
    baseURL,
  }) => {
    const session = await operatorRequest(browser, baseURL);
    try {
    const seed = await resetBayview(session.request);
    expect(seed.claims.find((row) => row.id === DENIED_SEED_CLAIM)?.status).toBe('denied');
    const denialsBefore = seed.denials.filter((row) => row.claimId === DENIED_SEED_CLAIM).length;
    const tasksBefore = seed.tasks.filter(
      (row) => row.relatedId === DENIED_SEED_CLAIM && row.kind === 'denial',
    ).length;
    const noticesBefore = seed.notifications.filter((row) => row.relatedId === DENIED_SEED_CLAIM)
      .length;
    const auditBefore = seed.auditEvents.length;
    const rateBefore = seed.metrics.denialRate;

    const response = await postAction(session.request, {
      type: 'deny_claim',
      orgId: ORG,
      persona: PERSONA,
      claimId: DENIED_SEED_CLAIM,
    });
    expect(response.status()).toBe(200);
    const view = (await readJson<OpsView>(response)).data as OpsView;

    expect(view.claims.find((row) => row.id === DENIED_SEED_CLAIM)?.status).toBe('denied');
    expect(view.denials.filter((row) => row.claimId === DENIED_SEED_CLAIM).length).toBeGreaterThanOrEqual(
      denialsBefore,
    );
    expect(
      view.tasks.filter((row) => row.relatedId === DENIED_SEED_CLAIM && row.kind === 'denial').length,
    ).toBeGreaterThanOrEqual(tasksBefore);
    expect(view.notifications.filter((row) => row.relatedId === DENIED_SEED_CLAIM).length).toBeGreaterThanOrEqual(
      noticesBefore,
    );
    expect(view.auditEvents.length).toBeGreaterThanOrEqual(auditBefore);
    expect(view.metrics.denialRate.numerator).toBe(rateBefore.numerator);
    expect(view.metrics.denialRate.denominator).toBe(rateBefore.denominator);
    expectMetricsReconcile(view);
    } finally {
      await session.context.close();
    }
  });

  test('POST client persona against root-internal is 403', async ({ request }) => {
    const response = await postAction(request, {
      type: 'advance_timeline',
      orgId: 'root-internal',
      persona: 'client',
    });
    expect(response.status()).toBe(403);
    const body = await readJson<null>(response);
    expect(body.data).toBeNull();
    expect(body.error?.code).toBe('forbidden');
  });

  test('POST unknown action type is 422', async ({ request }) => {
    const response = await postAction(request, {
      type: 'launch_missiles',
      orgId: ORG,
      persona: PERSONA,
    });
    expect(response.status()).toBe(422);
    const body = await readJson<null>(response);
    expect(body.data).toBeNull();
    expect(body.error?.code).toBe('unknown_action');
  });

  test('POST reset restores the same seed IDs and statuses', async ({ browser, baseURL }) => {
    const session = await operatorRequest(browser, baseURL);
    try {
    await resetBayview(session.request);
    await postAction(session.request, {
      type: 'advance_credentialing',
      orgId: ORG,
      persona: PERSONA,
      applicationId: CRED_BOTTLENECK,
    });

    const mutated = (await readJson<OpsView>(await getState(session.request, ORG, PERSONA))).data as OpsView;
    expect(mutated.credentialingApplications.find((row) => row.id === CRED_BOTTLENECK)?.status).toBe(
      'payer_review',
    );

    const restored = await resetBayview(session.request);
    expect(restored.claims.find((row) => row.id === DENIED_SEED_CLAIM)?.status).toBe('denied');
    expect(restored.credentialingApplications.find((row) => row.id === CRED_BOTTLENECK)?.status).toBe(
      'additional_information',
    );
    expect(restored.tasks.some((row) => row.id === 'task-bv-cred-004')).toBe(true);
    expect(restored.tasks.some((row) => row.id === 'task-bv-denial-1002')).toBe(true);
    expect(restored.denials.some((row) => row.claimId === DENIED_SEED_CLAIM)).toBe(true);
    expectMetricsReconcile(restored);
    } finally {
      await session.context.close();
    }
  });
});
