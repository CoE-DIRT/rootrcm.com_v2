import { expect, test, type Page } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

async function requireOpsApi(page: Page, orgId = 'bayview', persona = 'staff') {
  const response = await page.request.get(
    `/api/v1/ops/state?orgId=${encodeURIComponent(orgId)}&persona=${encodeURIComponent(persona)}`,
  );
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `GET /api/v1/ops/state?orgId=${orgId}&persona=${persona} returned HTTP ${response.status()}: ${body}`,
    );
  }
  return response.json();
}

async function readyDashboard(page: Page) {
  const dashboard = page.getByTestId('rcm-command-center');
  await expect(dashboard).toBeVisible();
  const ready = dashboard.getByTestId('ops-ready');
  const error = dashboard.getByTestId('ops-error');
  await expect(ready.or(error)).toBeVisible({ timeout: 20000 });
  if (await error.isVisible()) {
    throw new Error((await error.innerText()) || 'operations API failed');
  }
  await expect(ready).toBeVisible();
  return dashboard;
}

test('staff command center switches tabs, filters claims, and stays product-like for clients', async ({ page }) => {
  await requireOpsApi(page);
  await page.goto('/en/preview/staff');
  const dashboard = await readyDashboard(page);
  await expect(dashboard.getByTestId('demo-operator')).toBeVisible();

  await dashboard.getByRole('tab', { name: 'Overview' }).click();
  await expect(dashboard.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  await expect(dashboard.getByTestId('dirt-metrics')).toBeVisible();

  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  await expect(dashboard.getByRole('tab', { name: 'Revenue cycle' })).toHaveAttribute('aria-selected', 'true');
  const rows = dashboard.getByTestId('claim-row');
  await expect(rows.first()).toBeVisible();
  const payer = (await rows.first().getAttribute('data-payer')) ?? '';
  expect(payer.length).toBeGreaterThan(0);
  await dashboard.getByTestId('claims-search').fill(payer);
  await expect(rows.first()).toBeVisible();
  await expect(rows.first()).toContainText(payer);

  await dashboard.getByRole('tab', { name: 'Practice operations' }).click();
  await expect(dashboard.getByTestId('practice-schedule')).toBeVisible();

  await page.goto('/en/preview/client');
  const client = await readyDashboard(page);
  await expect(client.getByTestId('demo-operator')).toHaveCount(0);
  await expect(client.getByText('LIVE DATA OFF')).toBeVisible();
});

test('advance credentialing changes timeline, history and notifications', async ({ page }) => {
  await requireOpsApi(page);
  await page.goto('/en/preview/staff');
  const dashboard = await readyDashboard(page);
  await dashboard.getByRole('tab', { name: 'Credentialing' }).click();
  const card = dashboard.getByTestId('credentialing-card').first();
  await expect(card).toBeVisible();
  const applicationId = (await card.getAttribute('data-application-id')) ?? '';
  expect(applicationId.length).toBeGreaterThan(0);
  const before = (await card.innerText()).trim();
  const notificationsBefore = await dashboard.getByTestId('notification-item').count();
  const auditBefore = await dashboard.getByTestId('audit-event').count();

  await card.getByTestId('advance-credentialing').click();
  await expect(dashboard.getByTestId('ops-error')).toHaveCount(0);
  const updated = dashboard.locator(
    `[data-testid="credentialing-card"][data-application-id="${applicationId}"]`,
  );
  await expect
    .poll(async () => (await updated.innerText()).trim(), { timeout: 10_000 })
    .not.toBe(before);

  await updated.getByRole('button').first().click();
  const drawer = page.getByTestId('record-drawer');
  await expect(drawer).toBeVisible();
  const history = drawer.getByTestId('record-history');
  if (await history.count()) {
    await expect(history.locator('li').first()).toBeVisible();
  } else {
    await expect
      .poll(async () => dashboard.getByTestId('audit-event').count())
      .toBeGreaterThan(auditBefore);
  }

  await expect
    .poll(async () => dashboard.getByTestId('notification-item').count())
    .toBeGreaterThan(notificationsBefore);
});

test('deny claim updates status and denial queue, and reset restores the demo', async ({ page }) => {
  await requireOpsApi(page);
  await page.goto('/en/preview/staff');
  const dashboard = await readyDashboard(page);
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  const row = dashboard.getByTestId('claim-row').first();
  await expect(row).toBeVisible();
  const claimId = (await row.getAttribute('data-claim-id')) ?? '';
  expect(claimId.length).toBeGreaterThan(0);
  const queueBefore = (await dashboard.getByTestId('denial-queue').innerText()).trim();

  await row.getByTestId('deny-claim').click();
  await expect(dashboard.getByTestId('ops-error')).toHaveCount(0);
  const updated = dashboard.locator(`[data-testid="claim-row"][data-claim-id="${claimId}"]`);
  await expect.poll(async () => (await updated.getAttribute('data-status')) ?? '').toMatch(/den/i);
  await expect.poll(async () => (await dashboard.getByTestId('denial-queue').innerText()).trim()).not.toBe(
    queueBefore,
  );

  await dashboard.getByTestId('reset-demo').click();
  await expect(dashboard.getByTestId('ops-error')).toHaveCount(0);
  await expect.poll(async () => (await dashboard.getByTestId('denial-queue').innerText()).trim()).toBe(
    queueBefore,
  );
});

test('command center does not overflow horizontally at 375', async ({ page }) => {
  await requireOpsApi(page, 'bayview', 'client');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/preview/client');
  await readyDashboard(page);
  await page.getByTestId('rcm-command-center').getByRole('tab', { name: 'Credentialing' }).click();
  await noHorizontalOverflow(page);
  await page.getByTestId('rcm-command-center').getByRole('tab', { name: 'Revenue cycle' }).click();
  await noHorizontalOverflow(page);
});

test('Spanish credentialing tab stays localized', async ({ page }) => {
  await requireOpsApi(page, 'bayview', 'client');
  await page.goto('/es/preview/credentialing');
  const dashboard = await readyDashboard(page);
  await expect(dashboard.getByRole('tab', { name: 'Credencialización' })).toHaveAttribute('aria-selected', 'true');
  await expect(dashboard.getByText('Sin verificación — solo demostración').first()).toBeVisible();
  await expect(dashboard.getByTestId('credentialing-card').first()).toBeVisible();
  await expect(dashboard.getByText('Solicitar el estado de revisión del pagador').first()).toBeVisible();
});

test('client cookie cannot reset the demo by spoofing staff persona', async ({ page }) => {
  await page.goto('/en/preview/client');
  await readyDashboard(page);
  const response = await page.request.post('/api/v1/ops/actions', {
    data: { type: 'reset', orgId: 'bayview', persona: 'staff' },
  });
  expect(response.status(), await response.text()).toBe(403);
});

test('two browser sessions do not share synthetic mutations', async ({ browser }) => {
  const first = await browser.newContext();
  const second = await browser.newContext();
  const pageA = await first.newPage();
  const pageB = await second.newPage();
  try {
    await pageA.goto('/en/preview/staff');
    await pageB.goto('/en/preview/staff');
    const dashA = await readyDashboard(pageA);
    const dashB = await readyDashboard(pageB);
    await dashA.getByRole('tab', { name: 'Revenue cycle' }).click();
    await dashB.getByRole('tab', { name: 'Revenue cycle' }).click();
    const rowA = dashA.getByTestId('claim-row').first();
    const claimId = (await rowA.getAttribute('data-claim-id')) ?? '';
    expect(claimId.length).toBeGreaterThan(0);
    const beforeB = await dashB.locator(`[data-testid="claim-row"][data-claim-id="${claimId}"]`).getAttribute('data-status');
    await rowA.getByTestId('deny-claim').click();
    await expect
      .poll(async () => dashA.locator(`[data-testid="claim-row"][data-claim-id="${claimId}"]`).getAttribute('data-status'))
      .toMatch(/den/i);
    await expect
      .poll(async () => dashB.locator(`[data-testid="claim-row"][data-claim-id="${claimId}"]`).getAttribute('data-status'))
      .toBe(beforeB);
  } finally {
    await first.close();
    await second.close();
  }
});
