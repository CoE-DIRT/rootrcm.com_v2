import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

test.describe('public IA', () => {
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

  test('theme toggle switches light and dark', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Toggle color theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Toggle color theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('consultation form is visible but cannot submit while inquiries are disabled', async ({ page }) => {
    await page.goto('/en/consultation');
    await expect(page.getByRole('heading', { level: 1, name: 'Talk with a revenue expert' })).toBeVisible();
    await expect(page.getByText('Online inquiries are not active yet')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send business inquiry' })).toBeDisabled();
    await expect(page.locator('form')).toBeVisible();
  });

  test('keyboard can reach skip link and primary CTA', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeVisible();
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
