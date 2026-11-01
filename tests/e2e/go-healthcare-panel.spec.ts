import { expect, test } from '@playwright/test';

test('technology route provides an interactive Go healthcare API panel without claiming payer connectivity', async ({ page }) => {
  await page.goto('/en/technology');
  const panel = page.getByTestId('go-healthcare-preview');
  await expect(panel).toBeVisible();
  await expect(panel.getByText('Go healthcare API architecture')).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Eligibility 270/271' })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Claim status 276/277' })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Credentialing' })).toBeVisible();
  await panel.getByRole('button', { name: 'Credentialing' }).click();
  await expect(panel.getByRole('button', { name: 'Credentialing' })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByText('Synthetic data', { exact: false })).toBeVisible();
});

test('Spanish technology route includes all three Go workflow categories', async ({ page }) => {
  await page.goto('/es/technology');
  const panel = page.getByTestId('go-healthcare-preview');
  await expect(panel.getByRole('button', { name: 'Elegibilidad 270/271' })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Estado de reclamos 276/277' })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Credencialización' })).toBeVisible();
});
