import { expect, test } from '@playwright/test';

test('sales journey progresses coherently and resets', async ({ page }) => {
  await page.goto('/en/preview/sales');
  const simulator = page.getByTestId('sales-journey-simulator');
  await expect(simulator).toBeVisible();
  await expect(simulator.getByText('No CRM records, signatures, payments or customer accounts are created', { exact: false })).toBeVisible();
  await expect(simulator.getByTestId('sales-stage-visitor')).toHaveAttribute('aria-current', 'step');
  await simulator.getByTestId('sales-advance').click();
  await expect(simulator.getByTestId('sales-stage-inquiry')).toHaveAttribute('aria-current', 'step');
  await simulator.getByRole('button', { name: 'Simulate blocker' }).click();
  await expect(simulator.getByTestId('sales-advance')).toBeDisabled();
  await simulator.getByRole('button', { name: 'Resolve blocker' }).click();
  await simulator.getByTestId('sales-advance').click();
  await expect(simulator.getByTestId('sales-stage-qualified')).toHaveAttribute('aria-current', 'step');
  await simulator.getByRole('button', { name: 'Reset journey' }).click();
  await expect(simulator.getByTestId('sales-stage-visitor')).toHaveAttribute('aria-current', 'step');
});

test('sales tier selection updates feature scope and Spanish presentation', async ({ page }) => {
  await page.goto('/es/preview/sales');
  const simulator = page.getByTestId('sales-journey-simulator');
  await expect(simulator.getByText('Recorrido comercial', { exact: true }).first()).toBeVisible();
  await expect(simulator.getByText('Cardiología y medicina interna')).toBeVisible();
  await simulator.getByLabel('Servicio').selectOption('managed-rcm');
  await expect(simulator.getByText('Seguimiento de credencialización')).toBeVisible();
  await expect(simulator.getByText('Incluido').first()).toBeVisible();
});

test('sales journey supports narrow screens without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/en/preview/sales');
  await expect(page.getByTestId('sales-journey-simulator')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
