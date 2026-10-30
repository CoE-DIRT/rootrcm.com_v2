import { expect, test } from '@playwright/test';
import { dismissCookieBanner, noHorizontalOverflow } from './helpers';

test.describe('commercial journey parity', () => {
  test.beforeEach(async ({ page }) => {
    await dismissCookieBanner(page);
  });

  test('consultation, diagnostic, account, custom and plans controls stay truthful', async ({ page }) => {
    await page.goto('/en/consultation');
    await expect(page.getByTestId('business-inquiry-form').locator('#concern')).toHaveValue('consultation');
    await expect(page.getByTestId('commercial-next-actions')).toBeVisible();

    await page.goto('/en/diagnostic');
    await expect(page.getByTestId('business-inquiry-form').locator('#concern')).toHaveValue('diagnostic');
    const checkout = page.getByTestId('checkout-request');
    await expect(checkout.getByRole('button', { name: 'Request checkout' })).toBeEnabled();
    const checkoutResponse = page.waitForResponse((response) => response.url().includes('/api/v1/billing/checkout'));
    await checkout.getByRole('button', { name: 'Request checkout' }).click();
    expect((await checkoutResponse).status()).toBe(503);
    await expect(checkout.getByText('Checkout is not active')).toBeVisible();

    await page.goto('/en/account');
    await expect(page.getByTestId('business-inquiry-form').locator('#concern')).toHaveValue('consultation');
    await expect(page.getByTestId('checkout-request')).toHaveCount(0);

    await page.goto('/en/custom');
    await expect(page.getByTestId('business-inquiry-form').locator('#concern')).toHaveValue('managed');
    await expect(page.getByTestId('checkout-request')).toBeVisible();

    await page.goto('/en/plans');
    await expect(page.getByTestId('commercial-entitlement-wall')).toBeVisible();
    await expect(page.getByTestId('entitlement-offer-free-account-consultation')).toContainText('Free');
    await expect(page.getByTestId('entitlement-offer-managed-rcm')).toContainText('Paid catalog offer');
    await expect(page.getByTestId('commercial-entitlement-wall')).toContainText('There is no Enterprise SKU');
    await expect(page.locator('[data-testid="entitlement-offer-enterprise"]')).toHaveCount(0);
  });

  test('sales preview keeps adapters disabled and Spanish walls localized', async ({ page }) => {
    await page.goto('/en/preview/sales');
    await expect(page.getByTestId('sales-adapter-handoff')).toContainText('Typed HubSpot, Apollo, Stripe and Appwrite adapters stay disabled');
    await page.goto('/es/plans');
    await expect(page.getByTestId('commercial-entitlement-wall')).toContainText('Capacidades gratuitas y de pago');
    await expect(page.getByTestId('entitlement-offer-free-account-consultation')).toContainText('Gratis');
  });

  test('case-study and certification slots remain unpublished empty states', async ({ page }) => {
    await page.goto('/en/resources');
    await expect(page.getByTestId('proof-slot-case-study')).toContainText('Unpublished');
    await expect(page.getByTestId('proof-slot-certification')).toContainText('Unpublished');
    await expect(page.getByText(/recovered \d|HIPAA certified|SOC 2/i)).toHaveCount(0);
    await page.goto('/en/company');
    await expect(page.getByTestId('proof-slot-case-study')).toBeVisible();
  });

  test('cookie preference banner and form persist locally without enabling pixels', async ({ page, context }) => {
    await context.clearCookies();
    await page.addInitScript(() => window.localStorage.removeItem('root-cookie-preferences'));
    await page.goto('/en');
    const banner = page.getByTestId('cookie-consent-banner');
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Necessary only' }).click();
    await expect(banner).toHaveCount(0);
    const stored = await page.evaluate(() => window.localStorage.getItem('root-cookie-preferences'));
    expect(stored).toContain('"analytics":false');
    await page.goto('/en/cookies');
    await expect(page.getByTestId('cookie-preferences-form')).toBeVisible();
    await expect(page.getByTestId('cookie-runtime-status')).toHaveText('analytics=false · marketing=false');
    await page.getByTestId('cookie-preferences-form').getByRole('checkbox').nth(1).check();
    await page.getByRole('button', { name: 'Save preferences' }).click();
    await expect(page.getByText('Preferences saved in this browser')).toBeVisible();
    await expect(page.getByTestId('cookie-runtime-status')).toHaveText('analytics=false · marketing=false');
  });

  test('Spanish cookie banner and mobile drawer remain usable', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.removeItem('root-cookie-preferences'));
    await page.setViewportSize({ width: 375, height: 760 });
    await page.goto('/es');
    await expect(page.getByTestId('cookie-consent-banner')).toContainText('Solo necesarias');
    await page.getByTestId('cookie-consent-banner').getByRole('button', { name: 'Solo necesarias' }).click();
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    const drawer = page.getByTestId('root-mobile-mega-menu');
    await expect(drawer).toBeVisible();
    await drawer.locator('a.btn-primary').click();
    await expect(page).toHaveURL(/\/es\/consultation/);
    await noHorizontalOverflow(page);
  });
});
