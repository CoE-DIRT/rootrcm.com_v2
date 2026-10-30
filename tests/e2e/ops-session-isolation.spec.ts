import { expect, test, type APIRequestContext, type APIResponse } from '@playwright/test';

/**
 * Issue #29 acceptance (Agent 3 / hosting). Agent 1 owns the ops engine fix.
 * On 1f4f3b2 these stay skip-free: the global `let live` store and
 * request-body persona still leak mutations across visitors. Tests fail
 * until per-session isolation and server-authorized staff controls land.
 */

const DENIABLE_CLAIM = 'clm-bv-1001';
const ACTIONS = '/api/v1/ops/actions';

type Claim = { id: string; status: string };
type View = {
  persona?: string;
  claims?: Claim[];
  preview?: { persona?: string };
};
type Envelope = { data: View | null; error: { code: string; message: string } | null };

async function parseEnvelope(response: APIResponse): Promise<Envelope> {
  return (await response.json()) as Envelope;
}

function statePath(persona: 'client' | 'staff') {
  return `/api/v1/ops/state?orgId=bayview&persona=${persona}`;
}

async function openSession(request: APIRequestContext, persona: 'client' | 'staff' = 'client') {
  return request.get(statePath(persona));
}

async function claimStatus(request: APIRequestContext, persona: 'client' | 'staff' = 'client') {
  const response = await request.get(statePath(persona));
  expect(response.ok(), `GET ops state HTTP ${response.status()}`).toBeTruthy();
  const body = await parseEnvelope(response);
  return body.data?.claims?.find((row) => row.id === DENIABLE_CLAIM)?.status ?? null;
}

test('two demo sessions do not share operator mutations', async ({ playwright, baseURL }) => {
  const sessionA = await playwright.request.newContext({ baseURL });
  const sessionB = await playwright.request.newContext({ baseURL });
  try {
    expect((await openSession(sessionA)).ok()).toBeTruthy();
    expect((await openSession(sessionB)).ok()).toBeTruthy();

    const deny = await sessionA.post(ACTIONS, {
      data: {
        type: 'deny_claim',
        orgId: 'bayview',
        persona: 'client',
        claimId: DENIABLE_CLAIM,
      },
    });
    expect(deny.ok(), `session A deny_claim HTTP ${deny.status()}`).toBeTruthy();
    expect(await claimStatus(sessionA)).toMatch(/den/i);
    expect(
      await claimStatus(sessionB),
      'session B must not observe session A mutations (issue #29 global live store)',
    ).not.toMatch(/den/i);
  } finally {
    await sessionA.dispose();
    await sessionB.dispose();
  }
});

test('reset restores only the calling presentation session', async ({ playwright, baseURL }) => {
  const sessionA = await playwright.request.newContext({ baseURL });
  const sessionB = await playwright.request.newContext({ baseURL });
  try {
    expect((await openSession(sessionA)).ok()).toBeTruthy();
    expect((await openSession(sessionB)).ok()).toBeTruthy();

    const deny = await sessionA.post(ACTIONS, {
      data: {
        type: 'deny_claim',
        orgId: 'bayview',
        persona: 'client',
        claimId: DENIABLE_CLAIM,
      },
    });
    expect(deny.ok(), `session A deny_claim HTTP ${deny.status()}`).toBeTruthy();
    expect(await claimStatus(sessionA)).toMatch(/den/i);

    const reset = await sessionB.post(ACTIONS, {
      data: { type: 'reset', orgId: 'bayview', persona: 'client' },
    });
    expect(reset.ok(), `session B reset HTTP ${reset.status()}`).toBeTruthy();
    expect(
      await claimStatus(sessionA),
      'session B reset must not wipe session A (issue #29)',
    ).toMatch(/den/i);
  } finally {
    await sessionA.dispose();
    await sessionB.dispose();
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
    expect(
      response.status(),
      'request-body persona must not mint staff membership (issue #29)',
    ).toBeGreaterThanOrEqual(401);
    expect(response.status()).toBeLessThan(500);
    const body = await parseEnvelope(response);
    expect(body.data).toBeNull();
  } finally {
    await anonymous.dispose();
  }
});

test('client-scoped session cannot escalate via request-body persona', async ({
  playwright,
  baseURL,
}) => {
  const client = await playwright.request.newContext({ baseURL });
  try {
    expect((await openSession(client, 'client')).ok()).toBeTruthy();
    const escalate = await client.post(ACTIONS, {
      data: { type: 'set_persona', orgId: 'bayview', persona: 'staff' },
    });
    expect([401, 403]).toContain(escalate.status());
    const body = await parseEnvelope(escalate);
    expect(body.data).toBeNull();
    expect(body.data?.persona ?? body.data?.preview?.persona ?? 'client').not.toBe('staff');
  } finally {
    await client.dispose();
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
  playwright,
  baseURL,
}) => {
  const session = await playwright.request.newContext({ baseURL });
  try {
    expect((await openSession(session)).ok()).toBeTruthy();
    const deny = await session.post(ACTIONS, {
      data: {
        type: 'deny_claim',
        orgId: 'bayview',
        persona: 'client',
        claimId: DENIABLE_CLAIM,
      },
    });
    expect(deny.ok(), `deny_claim HTTP ${deny.status()}`).toBeTruthy();
    const denied = await parseEnvelope(deny);
    expect(denied.data?.claims?.find((row) => row.id === DENIABLE_CLAIM)?.status).toMatch(/den/i);
    expect(await claimStatus(session)).toMatch(/den/i);
  } finally {
    await session.dispose();
  }
});
