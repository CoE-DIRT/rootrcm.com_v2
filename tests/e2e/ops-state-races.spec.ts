import { expect, test, type Page, type Route } from '@playwright/test';

async function readyDashboard(page: Page) {
  const dashboard = page.getByTestId('rcm-command-center');
  await expect(dashboard).toBeVisible();
  await expect(dashboard.getByTestId('ops-ready')).toBeVisible({ timeout: 20_000 });
  return dashboard;
}

async function flushPaint(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

test('staff operations wait for preview bind before the first read and authorized action', async ({ page }) => {
  let releaseBind: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    releaseBind = resolve;
  });
  let stateCalls = 0;
  const actionStatuses: number[] = [];

  await page.route('**/api/v1/ops/preview-bind', async (route) => {
    await gate;
    await route.continue();
  });
  await page.route('**/api/v1/ops/state**', async (route) => {
    stateCalls += 1;
    await route.continue();
  });
  page.on('response', (response) => {
    if (response.url().includes('/api/v1/ops/actions') && response.request().method() === 'POST') {
      actionStatuses.push(response.status());
    }
  });

  try {
    await page.goto('/en/preview/staff');
    await expect(page.getByTestId('preview-bind-status')).toHaveAttribute('data-status', 'binding');
    await expect(page.getByTestId('ops-ready')).toHaveCount(0);
    expect(stateCalls).toBe(0);
    releaseBind();
    const dashboard = await readyDashboard(page);
    expect(stateCalls).toBeGreaterThan(0);
    await expect(dashboard).toHaveAttribute('data-persona', 'staff');
    await expect(dashboard.getByTestId('demo-operator')).toBeVisible();
    const card = dashboard.getByTestId('credentialing-card').first();
    await expect(card).toBeVisible();
    const before = (await card.innerText()).trim();
    await card.getByTestId('advance-credentialing').click();
    await expect
      .poll(async () => (await card.innerText()).trim(), { timeout: 10_000 })
      .not.toBe(before);
    expect(actionStatuses[0]).toBe(200);
  } finally {
    releaseBind();
  }
});

test('a failed preview bind stays visible, blocks operations, and retry recovers', async ({ page }) => {
  let fail = true;
  await page.route('**/api/v1/ops/preview-bind', async (route) => {
    if (fail) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: '{"data":null}' });
      return;
    }
    await route.continue();
  });
  await page.goto('/en/preview/staff');
  const alert = page.getByTestId('preview-bind-error');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('could not be confirmed');
  await expect(page.getByTestId('ops-ready')).toHaveCount(0);
  await expect(page.getByTestId('preview-bind-status')).toHaveAttribute('data-status', 'error');
  fail = false;
  await page.getByTestId('preview-bind-retry').click();
  await readyDashboard(page);
  await expect(page.getByTestId('demo-operator')).toBeVisible();

  fail = true;
  await page.goto('/es/preview/staff');
  await expect(page.getByTestId('preview-bind-error')).toContainText('No se pudo confirmar');
});

test('practice switch drops a late denial and keeps the new practice on screen', async ({ page }) => {
  await page.goto('/en/preview/staff');
  const dashboard = await readyDashboard(page);
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  const bayview = dashboard.locator('[data-claim-id="clm-bv-1001"]');
  await expect(bayview).toBeVisible();

  let held: Route | null = null;
  await page.route('**/api/v1/ops/actions', async (route) => {
    const body = route.request().postDataJSON() as { type?: string };
    if (body.type === 'deny_claim' && !held) {
      held = route;
      return;
    }
    await route.continue();
  });

  await bayview.getByTestId('deny-claim').click();
  await expect.poll(() => held !== null).toBe(true);
  await dashboard.getByTestId('select-practice').selectOption('cedar-grove');
  await expect(dashboard).toHaveAttribute('data-org', 'cedar-grove');
  await expect(dashboard.locator('[data-claim-id="clm-cg-2001"]')).toBeVisible();

  await held!.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      data: {
        claims: [{ id: 'clm-stale-should-not-render', status: 'denied', payerId: 'payer-healthfirst' }],
      },
      error: null,
    }),
  });
  await flushPaint(page);
  await expect(dashboard).toHaveAttribute('data-org', 'cedar-grove');
  await expect(dashboard.locator('[data-claim-id="clm-cg-2001"]')).toBeVisible();
  await expect(dashboard.locator('[data-claim-id="clm-cg-2001"]')).toHaveAttribute('data-status', '835_posted');
  await expect(page.getByText('clm-stale-should-not-render')).toHaveCount(0);
});

test('persona switch while an action is pending ignores the old response', async ({ page }) => {
  await page.goto('/en/preview/staff');
  const dashboard = await readyDashboard(page);
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  let held: Route | null = null;
  await page.route('**/api/v1/ops/actions', async (route) => {
    const body = route.request().postDataJSON() as { type?: string };
    if (body.type === 'deny_claim' && !held) {
      held = route;
      return;
    }
    await route.continue();
  });
  await dashboard.locator('[data-claim-id="clm-bv-1001"]').getByTestId('deny-claim').click();
  await expect.poll(() => held !== null).toBe(true);
  const switched = page.waitForResponse((response) => (response.request().postData() ?? '').includes('"set_persona"'));
  await dashboard.getByTestId('set-persona').click();
  expect((await switched).ok()).toBeTruthy();
  await expect(dashboard).toHaveAttribute('data-persona', 'client');
  await held!.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      data: { claims: [{ id: 'clm-persona-stale', status: 'denied' }] },
      error: null,
    }),
  });
  await flushPaint(page);
  await expect(dashboard).toHaveAttribute('data-persona', 'client');
  await expect(page.getByText('clm-persona-stale')).toHaveCount(0);
  await expect(dashboard.locator('[data-claim-id="clm-bv-1001"]')).toBeVisible();
});

test('a fallback state fetch arriving after a practice change does not replace the screen', async ({ page }) => {
  await page.goto('/en/preview/staff');
  const dashboard = await readyDashboard(page);
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  let releaseState: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    releaseState = resolve;
  });
  let holdBayview = false;
  await page.route('**/api/v1/ops/actions', async (route) => {
    const body = route.request().postDataJSON() as { type?: string };
    if (body.type === 'advance_timeline') {
      holdBayview = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { accepted: true }, error: null }),
      });
      return;
    }
    await route.continue();
  });
  await page.route('**/api/v1/ops/state**', async (route) => {
    const orgId = new URL(route.request().url()).searchParams.get('orgId');
    if (holdBayview && orgId === 'bayview') {
      holdBayview = false;
      await gate;
    }
    await route.continue();
  });

  try {
    await dashboard.getByTestId('advance-timeline').click();
    await dashboard.getByTestId('select-practice').selectOption('cedar-grove');
    await expect(dashboard.locator('[data-claim-id="clm-cg-2001"]')).toBeVisible();
    releaseState();
    await flushPaint(page);
    await expect(dashboard).toHaveAttribute('data-org', 'cedar-grove');
    await expect(dashboard.locator('[data-claim-id="clm-cg-2001"]')).toHaveAttribute('data-status', '835_posted');
    await expect(dashboard.locator('[data-claim-id="clm-bv-1001"]')).toHaveCount(0);
  } finally {
    releaseState();
  }
});

test('reset during an in-flight denial keeps the restored demo on screen', async ({ page }) => {
  await page.goto('/en/preview/staff');
  const dashboard = await readyDashboard(page);
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  const claim = dashboard.locator('[data-claim-id="clm-bv-1001"]');
  await expect(claim).toHaveAttribute('data-status', 'payer_processing');
  let held: Route | null = null;
  await page.route('**/api/v1/ops/actions', async (route) => {
    const body = route.request().postDataJSON() as { type?: string };
    if (body.type === 'deny_claim' && !held) {
      held = route;
      return;
    }
    await route.continue();
  });
  await claim.getByTestId('deny-claim').click();
  await expect.poll(() => held !== null).toBe(true);
  const reset = page.waitForResponse((response) => {
    return response.url().includes('/api/v1/ops/actions') && (response.request().postData() ?? '').includes('"reset"');
  });
  await dashboard.getByTestId('reset-demo').click();
  expect((await reset).ok()).toBeTruthy();
  await expect(claim).toHaveAttribute('data-status', 'payer_processing');
  await held!.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      data: { claims: [{ id: 'clm-bv-1001', status: 'denied', payerId: 'payer-healthfirst' }] },
      error: null,
    }),
  });
  await flushPaint(page);
  await expect(claim).toHaveAttribute('data-status', 'payer_processing');
});

test('two tabs share one preview session and a reload shows the mutation', async ({ browser }) => {
  const context = await browser.newContext();
  const first = await context.newPage();
  const second = await context.newPage();
  try {
    await first.goto('/en/preview/staff');
    await second.goto('/en/preview/staff');
    const dashA = await readyDashboard(first);
    const dashB = await readyDashboard(second);
    await dashA.getByRole('tab', { name: 'Revenue cycle' }).click();
    await dashB.getByRole('tab', { name: 'Revenue cycle' }).click();
    const claimA = dashA.locator('[data-claim-id="clm-bv-1001"]');
    await claimA.getByTestId('deny-claim').click();
    await expect(claimA).toHaveAttribute('data-status', /den/i);
    await second.reload();
    const reloaded = await readyDashboard(second);
    await reloaded.getByRole('tab', { name: 'Revenue cycle' }).click();
    await expect(reloaded.locator('[data-claim-id="clm-bv-1001"]')).toHaveAttribute('data-status', /den/i);
    await expect(reloaded.getByTestId('demo-operator')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('fresh navigation, reload, and back/forward keep staff controls and an authorized action', async ({ page }) => {
  await page.goto('/en/sign-in');
  await page.getByRole('link', { name: 'Preview staff workspace' }).click();
  await page.waitForURL(/\/preview\/staff/);
  let dashboard = await readyDashboard(page);
  await expect(dashboard.getByTestId('demo-operator')).toBeVisible();
  await expect(dashboard).toHaveAttribute('data-persona', 'staff');
  await page.reload();
  dashboard = await readyDashboard(page);
  await expect(dashboard.getByTestId('advance-credentialing').first()).toBeEnabled();
  const action = page.waitForResponse(
    (response) => response.url().includes('/api/v1/ops/actions') && response.request().method() === 'POST',
  );
  await dashboard.getByTestId('advance-credentialing').first().click();
  expect((await action).status()).toBe(200);

  await page.goto('/en/preview/client');
  await readyDashboard(page);
  await page.goBack();
  await page.waitForURL(/\/preview\/staff/);
  dashboard = await readyDashboard(page);
  await expect(dashboard.getByTestId('demo-operator')).toBeVisible();
  await expect(dashboard).toHaveAttribute('data-persona', 'staff');
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  const again = page.waitForResponse(
    (response) => response.url().includes('/api/v1/ops/actions') && response.request().method() === 'POST',
  );
  await dashboard.getByTestId('deny-claim').first().click();
  expect((await again).status()).toBe(200);
  await expect(dashboard.locator('[data-testid="claim-row"]').first()).toHaveAttribute('data-status', /den/i);
});
