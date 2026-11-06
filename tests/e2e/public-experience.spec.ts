import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

test.describe('public information architecture', () => {
  test('skip link and primary navigation lead to real pages', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCount(1);
    await expect(page.getByTestId('hero-console').getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByTestId('root-primary-nav').getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL(/\/en\/services$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByTestId('root-primary-nav').getByRole('link', { name: 'Why ROOT' }).click();
    await expect(page).toHaveURL(/\/en\/why-root$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('approved diagnostic pricing remains visible', async ({ page }) => {
    await page.goto('/en/plans');
    await expect(page.getByRole('heading', { name: /Revenue Diagnostic/i })).toBeVisible();
    await expect(page.getByText('$2,500').first()).toBeVisible();
  });

  test('locale toggle preserves path and changes document language', async ({ page }) => {
    await page.goto('/en/plans');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.getByRole('link', { name: /Switch language/i }).first().click();
    await expect(page).toHaveURL(/\/es\/plans$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByText('$2,500').first()).toBeVisible();
  });

  test('Spanish billing preview remains synthetic and explicitly limited', async ({ page }) => {
    await page.goto('/es/preview/billing');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Esta vista previa no otorga acceso a servicios').first()).toBeVisible();
  });

  test('mobile navigation opens and closes without trapping the page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 844 });
    await page.goto('/en');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.click();
    const drawer = page.getByTestId('root-mobile-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('navigation', { name: 'Mobile menu' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    await noHorizontalOverflow(page);
  });

  test('light and dark themes toggle using the shared control', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Toggle color theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Toggle color theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('consultation shows usable booking, safe inquiry fallback and direct contact', async ({ page }) => {
    await page.goto('/en/consultation');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#book')).toBeVisible();
    await expect(page.locator('main a[href="tel:+13024965648"]').first()).toBeVisible();
    await expect(page.locator('main a[href^="mailto:info@rootrcm.com"]').first()).toBeVisible();
    await expect(page.locator('main a[href="https://wa.me/13025064685"]').first()).toBeVisible();
    await expect(page.locator('main form')).toHaveCount(0);
  });

  test('skip link works with keyboard', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeVisible();
  });

  test('primary CTA maintains on-cyan foreground contrast in dark mode', async ({ page }) => {
    await page.goto('/en');
    const cta = page.locator('a.ui-btn[data-variant="primary"]').first();
    await expect(cta).toBeVisible();
    expect(await cta.evaluate((element) => getComputedStyle(element).color)).toBe('rgb(6, 18, 37)');
  });

  test('Spanish sample workspaces retain localized page content', async ({ page }) => {
    await page.goto('/es/preview/client');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/es/preview/credentialing');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/es/preview/staff');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('responsive public header', () => {
  test('Spanish desktop navigation fits without hiding primary actions', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/es');
    const nav = page.getByTestId('root-primary-nav');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Por qué ROOT' })).toBeVisible();
    const action = page.locator('header a[href="/es/diagnostic"]');
    await expect(action).toBeVisible();
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual(1366);
  });

  test('1024px renders a reachable navigation system inside the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/es');
    const menu = page.getByRole('button', { name: 'Abrir menú' });
    const primary = page.getByTestId('root-primary-nav');
    if (await menu.isVisible()) {
      await menu.click();
      await expect(page.getByTestId('root-mobile-drawer')).toBeVisible();
    } else {
      await expect(primary).toBeVisible();
    }
    await noHorizontalOverflow(page);
  });
});

for (const width of [375, 768, 1366, 2560]) {
  test('home has no horizontal overflow at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 2560 ? 1440 : 844 });
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await noHorizontalOverflow(page);
  });
}
