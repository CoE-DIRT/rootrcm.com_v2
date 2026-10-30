import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

const COMMERCIAL_ROUTES = [
  { path: '/en/specialties', hint: /specialt/i },
  { path: '/en/specialties/infectious-disease', hint: /infectious/i },
  { path: '/en/locations/new-york', hint: /new york/i },
  { path: '/en/locations/new-york-city', hint: /new york|nyc/i },
  { path: '/es/specialties', hint: /especialidad/i },
  { path: '/es/locations/new-york', hint: /nueva york/i },
] as const;

test.describe('commercial specialty and location routes', () => {
  for (const route of COMMERCIAL_ROUTES) {
    test(`${route.path} renders the commercial catalog`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `${route.path} must not 404`).toBeLessThan(400);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Page not found' })).toHaveCount(0);
      await expect(page.getByRole('link', { name: /Skip to content|Saltar al contenido/ })).toHaveCount(1);
      await expect(page.locator('#main')).toBeVisible();
      await expect(page.getByText(route.hint).first()).toBeVisible();
      await noHorizontalOverflow(page);
    });
  }

  test('/en/specialties does not overflow at 2560px', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    const response = await page.goto('/en/specialties', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await noHorizontalOverflow(page);
  });
});
