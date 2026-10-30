import { expect, test } from '@playwright/test';

async function readyDashboard(page: import('@playwright/test').Page) {
  const dashboard = page.getByTestId('rcm-command-center');
  await expect(dashboard).toBeVisible();
  await expect(dashboard.getByTestId('ops-loading')).toHaveCount(0);
  const error = dashboard.getByTestId('ops-error');
  await expect(error, (await error.textContent()) ?? 'operations API failed').toHaveCount(0);
  await expect(dashboard.getByTestId('ops-ready')).toBeVisible();
  return dashboard;
}

test('client dashboard exposes end-to-end RCM and credentialing from the landing view', async ({ page }) => {
  await page.goto('/en/preview/client');
  const dashboard = await readyDashboard(page);
  await expect(dashboard.getByText('SYNTHETIC PREVIEW', { exact: false })).toBeVisible();
  await expect(dashboard.getByRole('tab', { name: 'Credentialing' })).toBeVisible();
  await expect(dashboard.getByTestId('credentialing-card')).toHaveCount(2);
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  await expect(dashboard.getByText('Claim submission', { exact: true })).toBeVisible();
  await dashboard.getByRole('tab', { name: 'Practice operations' }).click();
  await expect(dashboard.getByTestId('practice-schedule')).toBeVisible();
});

test('credentialing workspace exposes payer-specific milestones, owners and next actions', async ({ page }) => {
  await page.goto('/en/preview/credentialing');
  const dashboard = await readyDashboard(page);
  await expect(dashboard.getByRole('tab', { name: 'Credentialing' })).toHaveAttribute('aria-selected', 'true');
  await expect(dashboard.getByTestId('credentialing-card').first()).toBeVisible();
  await expect(dashboard.getByText('Last externally verified').first()).toBeVisible();
});

test('Spanish credentialing is localized and stays explicitly synthetic', async ({ page }) => {
  await page.goto('/es/preview/credentialing');
  const dashboard = await readyDashboard(page);
  await expect(dashboard.getByRole('tab', { name: 'Credencialización' })).toBeVisible();
  await expect(dashboard.getByText('Sin verificación — solo demostración').first()).toBeVisible();
});

test('command center remains usable without horizontal page overflow on touch-sized screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/preview/client');
  await expect(page.getByTestId('rcm-command-center')).toBeVisible();
  const delta = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(delta).toBeLessThanOrEqual(1);
});
