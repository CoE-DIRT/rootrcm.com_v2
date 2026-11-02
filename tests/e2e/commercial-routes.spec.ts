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

  test('home shows one featured specialty grid and the infectious disease link', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    const section = page.locator('section[aria-labelledby="specialties-heading"]');
    await expect(section).toHaveCount(1);
    await expect(section.getByRole('link')).toHaveCount(11);
    await expect(section.getByRole('link', { name: /Infectious Disease/i })).toHaveAttribute(
      'href',
      '/en/specialties/infectious-disease',
    );
    await noHorizontalOverflow(page);
  });

  test('/en/company shows typed leadership with Aliah and portrait placeholders', async ({ page }) => {
    await page.goto('/en/company', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Khurram Zaffar Siddiqui' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aliah Siddiqui' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kashif Ali' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aftab Shaukat' })).toBeVisible();
    await expect(page.getByText('Chief Commercial Officer (CCO)')).toBeVisible();
    await expect(page.getByText('Director of Strategy & Planning')).toBeVisible();
    await expect(page.getByText('Approved portrait pending').first()).toBeVisible();
    await expect(page.getByText('Aliya Siddiqui')).toHaveCount(0);
    await noHorizontalOverflow(page);
  });

  test('/es/company keeps Spanish leadership roles', async ({ page }) => {
    await page.goto('/es/company', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Aliah Siddiqui' })).toBeVisible();
    await expect(page.getByText('Directora de estrategia y planificación')).toBeVisible();
    await expect(page.getByText('Retrato aprobado pendiente').first()).toBeVisible();
  });

  test('/en/specialties does not overflow at 2560px', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    const response = await page.goto('/en/specialties', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await noHorizontalOverflow(page);
  });
});
