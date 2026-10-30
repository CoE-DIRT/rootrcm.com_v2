import { expect, test, type Browser, type APIResponse } from '@playwright/test';

/**
 * Issue #29: presentation sessions are isolated. Operator mutations require the
 * signed staff-preview cookie, not a JSON `persona` field.
 */

const DENIABLE_CLAIM = 'clm-bv-1001';
const ACTIONS = '/api/v1/ops/actions';

type Claim = { id: string; status: string };
type View = { persona?: string; claims?: Claim[]; preview?: { persona?: string } };
type Envelope = { data: View | null; error: { code: string; message: string } | null };

async function parseEnvelope(response: APIResponse): Promise<Envelope> {
  return (await response.json()) as Envelope;
}

async function operatorRequest(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.goto('/en/preview/staff');
  return { context, request: context.request };
}

async function clientRequest(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.goto('/en/preview/client');
  return { context, request: context.request };
}

async function claimStatus(request: { get: (url: string) => Promise<APIResponse> }) {
  const response = await request.get('/api/v1/ops/state?orgId=bayview&persona=staff');
  expect(response.ok(), `GET ops state HTTP ${response.status()}`).toBeTruthy();
  const body = await parseEnvelope(response);
  return body.data?.claims?.find((row) => row.id === DENIABLE_CLAIM)?.status ?? null;
}

test('two demo sessions do not share operator mutations', async ({ browser, baseURL }) => {
  const sessionA = await operatorRequest(browser, baseURL);
  const sessionB = await operatorRequest(browser, baseURL);
  try {
    const deny = await sessionA.request.post(ACTIONS, {
      data: { type: 'deny_claim', orgId: 'bayview', persona: 'staff', claimId: DENIABLE_CLAIM },
    });
    expect(deny.ok(), `session A deny_claim HTTP ${deny.status()}`).toBeTruthy();
    expect(await claimStatus(sessionA.request)).toMatch(/den/i);
    expect(
      await claimStatus(sessionB.request),
      'session B must not observe session A mutations',
    ).not.toMatch(/den/i);
  } finally {
    await sessionA.context.close();
    await sessionB.context.close();
  }
});

test('reset restores only the calling presentation session', async ({ browser, baseURL }) => {
  const sessionA = await operatorRequest(browser, baseURL);
  const sessionB = await operatorRequest(browser, baseURL);
  try {
    const deny = await sessionA.request.post(ACTIONS, {
      data: { type: 'deny_claim', orgId: 'bayview', persona: 'staff', claimId: DENIABLE_CLAIM },
    });
    expect(deny.ok(), `session A deny_claim HTTP ${deny.status()}`).toBeTruthy();
    expect(await claimStatus(sessionA.request)).toMatch(/den/i);

    const reset = await sessionB.request.post(ACTIONS, {
      data: { type: 'reset', orgId: 'bayview', persona: 'staff' },
    });
    expect(reset.ok(), `session B reset HTTP ${reset.status()}`).toBeTruthy();
    expect(await claimStatus(sessionA.request), 'session B reset must not wipe session A').toMatch(
      /den/i,
    );
  } finally {
    await sessionA.context.close();
    await sessionB.context.close();
  }
});

test('staff operator POST is rejected without a server-authorized presentation session', async ({
  playwright,
  baseURL,
}) => {
  const anonymous = await playwright.request.newContext({ baseURL });
  try {
    const response = await anonymous.post(ACTIONS, {
      data: { type: 'set_persona', orgId: 'bayview', persona: 'staff' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(401);
    expect(response.status()).toBeLessThan(500);
    const body = await parseEnvelope(response);
    expect(body.data).toBeNull();
  } finally {
    await anonymous.dispose();
  }
});

test('client-scoped session cannot escalate via request-body persona', async ({
  browser,
  baseURL,
}) => {
  const client = await clientRequest(browser, baseURL);
  try {
    const escalate = await client.request.post(ACTIONS, {
      data: { type: 'set_persona', orgId: 'bayview', persona: 'staff' },
    });
    expect([401, 403]).toContain(escalate.status());
    const body = await parseEnvelope(escalate);
    expect(body.data).toBeNull();
  } finally {
    await client.context.close();
  }
});

test('client preview hides staff operator controls', async ({ page }) => {
  await page.goto('/en/preview/client');
  const dashboard = page.getByTestId('rcm-command-center');
  await expect(dashboard).toBeVisible();
  const ready = dashboard.getByTestId('ops-ready');
  const error = dashboard.getByTestId('ops-error');
  await expect(ready.or(error)).toBeVisible({ timeout: 20_000 });
  if (await error.isVisible()) {
    throw new Error((await error.innerText()) || 'operations API failed');
  }
  await expect(dashboard.getByTestId('demo-operator')).toHaveCount(0);
  await expect(dashboard.getByTestId('reset-demo')).toHaveCount(0);
  await expect(dashboard.getByTestId('set-persona')).toHaveCount(0);
});

test('a valid mutation is visible on the next read in the same session', async ({
  browser,
  baseURL,
}) => {
  const session = await operatorRequest(browser, baseURL);
  try {
    const deny = await session.request.post(ACTIONS, {
      data: { type: 'deny_claim', orgId: 'bayview', persona: 'staff', claimId: DENIABLE_CLAIM },
    });
    expect(deny.ok(), `deny_claim HTTP ${deny.status()}`).toBeTruthy();
    const denied = await parseEnvelope(deny);
    expect(denied.data?.claims?.find((row) => row.id === DENIABLE_CLAIM)?.status).toMatch(/den/i);
    expect(await claimStatus(session.request)).toMatch(/den/i);
  } finally {
    await session.context.close();
  }
});
