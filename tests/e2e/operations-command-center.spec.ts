import { expect, test } from '@playwright/test';

test('client dashboard exposes end-to-end RCM and credentialing from the landing view', async ({ page }) => {
  await page.goto('/en/preview/client');
  const dashboard = page.getByTestId('rcm-command-center');
  await expect(dashboard).toBeVisible();
  await expect(dashboard.getByText('SYNTHETIC PREVIEW', { exact: false })).toBeVisible();
  await expect(dashboard.getByRole('tab', { name: 'Credentialing' })).toBeVisible();
  await expect(dashboard.getByTestId('credentialing-card')).toHaveCount(2);
  await dashboard.getByRole('tab', { name: 'Revenue cycle' }).click();
  await expect(dashboard.getByText('Claim submission', { exact: true })).toBeVisible();
  await expect(dashboard.getByText('Eligibility & benefits')).toBeVisible();
  await dashboard.getByRole('tab', { name: 'Practice operations' }).click();
  await expect(dashboard.getByText('Morning clinic block')).toBeVisible();
});

test('credentialing workspace exposes payer-specific milestones, owners and next actions', async ({ page }) => {
  await page.goto('/en/preview/credentialing');
  const dashboard = page.getByTestId('rcm-command-center');
  await expect(dashboard.getByRole('tab', { name: 'Credentialing' })).toHaveAttribute('aria-selected', 'true');
  await expect(dashboard.getByTestId('credentialing-card')).toHaveCount(3);
  await expect(dashboard.getByText('Payer review & follow-up', { exact: true }).first()).toBeVisible();
  await expect(dashboard.getByText('Last externally verified').first()).toBeVisible();
});

test('Spanish credentialing is localized and stays explicitly synthetic', async ({ page }) => {
  await page.goto('/es/preview/credentialing');
  const dashboard = page.getByTestId('rcm-command-center');
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
