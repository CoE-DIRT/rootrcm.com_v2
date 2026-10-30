import { expect, test } from '@playwright/test';
import { dismissCookieBanner, noHorizontalOverflow } from './helpers';

test.describe('public IA', () => {
  test.beforeEach(async ({ page }) => {
    await dismissCookieBanner(page);
  });

  test('navigates primary routes and exposes a skip link', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Handing Over the Keys');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL(/\/en\/services$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Everything your practice needs');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Why ROOT' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Practice owners: control' })).toBeVisible();
  });

  test('pricing catalog stays canonical including the diagnostic fee', async ({ page }) => {
    await page.goto('/en/plans');
    await expect(page.getByRole('heading', { name: /Revenue Diagnostic/ })).toBeVisible();
    await expect(page.getByText('$2,500').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Managed RCM/ })).toBeVisible();
  });

  test('EN/ES locale switch preserves the current route', async ({ page }) => {
    await page.goto('/en/plans');
    await page.getByRole('link', { name: 'Switch language' }).click();
    await expect(page).toHaveURL(/\/es\/plans$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Alcance transparente');
    await expect(page.getByText('$2,500').first()).toBeVisible();
  });

  test('locale change updates the html language without a full reload', async ({ page }) => {
    await page.goto('/en/plans');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.getByRole('link', { name: 'Switch language' }).click();
    await expect(page).toHaveURL(/\/es\/plans$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('Spanish billing preview uses Spanish heading and entitlement disclaimer', async ({ page }) => {
    await page.goto('/es/preview/billing');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vista previa de gestión de suscripciones');
    await expect(page.getByText('Esta vista previa no otorga acceso a servicios').first()).toBeVisible();
  });

  test('mobile navigation is expanded navigation, not a broken modal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 844 });
    await page.goto('/en');
    await expect(page.locator('header span.hidden.lg\\:inline-flex')).toBeHidden();
    await expect(page.locator('header span.hidden.sm\\:inline-flex')).toBeHidden();
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('navigation', { name: 'Primary navigation' });
    await expect(menu).toBeVisible();
    await expect(menu).not.toHaveAttribute('aria-modal', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    await noHorizontalOverflow(page);
  });

  test('theme toggle switches light and dark', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Toggle color theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Toggle color theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('consultation form submits and fail-closes with 503', async ({ page }) => {
    await page.goto('/en/consultation');
    await expect(page.getByRole('heading', { level: 1, name: 'Talk with a revenue expert' })).toBeVisible();
    await expect(page.getByText('Online inquiries are not active yet')).toBeVisible();
    const form = page.getByTestId('business-inquiry-form');
    await expect(form.getByRole('button', { name: 'Send business inquiry' })).toBeEnabled();
    await form.getByLabel('Name').fill('Jordan Lee');
    await form.getByLabel('Business email').fill('jordan@example.invalid');
    await form.getByLabel('Organization').fill('Cedar Grove Family Practice');
    await form.getByLabel('I confirm this is a business inquiry', { exact: false }).check();
    const responsePromise = page.waitForResponse((response) => response.url().includes('/api/v1/public/inquiries'));
    await form.getByRole('button', { name: 'Send business inquiry' }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(503);
    await expect(form.getByText('No inquiry was sent or stored')).toBeVisible();
  });

  test('keyboard can reach skip link and primary CTA', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeVisible();
  });

  test('primary CTA keeps on-cyan contrast in dark theme', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const cta = page.locator('a.btn-primary').first();
    await expect(cta).toBeVisible();
    const color = await cta.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(6, 18, 37)');
  });

  test('Spanish preview workspaces use Spanish page-owned copy', async ({ page }) => {
    await page.goto('/es/preview/client');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Su práctica, bajo control');
    const clientNav = page.getByRole('navigation', { name: 'Navegación principal' });
    await expect(clientNav.getByRole('link', { name: 'Resumen' })).toBeVisible();
    await expect(clientNav.getByRole('link', { name: 'Solicitudes' })).toBeVisible();
    await page.goto('/es/preview/credentialing');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Preparación de credencialización');
    await expect(page.getByText('Fuente primaria')).toBeVisible();
    await page.goto('/es/preview/staff');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Su trabajo asignado, en contexto');
    await expect(page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Cola' })).toBeVisible();
  });
});

test.describe('responsive overflow', () => {
  for (const width of [375, 768, 1366, 2560]) {
    test(`${width}px home does not overflow horizontally`, async ({ page }) => {
      await page.setViewportSize({ width, height: width >= 2560 ? 1440 : 844 });
      await page.goto('/en');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await noHorizontalOverflow(page);
    });
  }
});
