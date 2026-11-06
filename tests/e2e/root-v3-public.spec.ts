import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

test.describe('ROOT V3 Public Transformation', () => {
  test('one localized hero H1 is rendered in each language', async ({ page }) => {
    for (const locale of ['en', 'es']) {
      await page.goto('/' + locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('hero-console').getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('revenue control room remains synthetic, readable and linked to an actual preview', async ({ page }) => {
    await page.goto('/en');
    const hero = page.getByTestId('hero-console');
    await expect(hero.locator('.hero-stage')).toBeVisible();
    await expect(hero.locator('.hero-claim')).toHaveCount(5);
    await expect(hero.locator('.hero-queue__row')).toHaveCount(3);
    expect(await hero.locator('.hero-console__trust li').count()).toBeGreaterThanOrEqual(3);
    await expect(hero.locator('a[href="/en/preview/client"]')).toBeVisible();
  });

  test('bilingual FAQs are discoverable and expandable', async ({ page }) => {
    await page.goto('/en');
    const faq = page.locator('section[aria-labelledby="faq-section-heading"]');
    await expect(faq.getByRole('heading')).toBeVisible();
    const first = faq.locator('summary').first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(faq.getByText(/ROOT works inside the EHR/i)).toBeVisible();
    await page.goto('/es');
    const faqEs = page.locator('section[aria-labelledby="faq-section-heading"]');
    await expect(faqEs.locator('summary').first()).toContainText('¿Puedo conservar mi software?');
  });

  test('Calendly is intentionally loaded after visitor action and offers telephone fallback', async ({ page }) => {
    await page.goto('/en/consultation');
    const section = page.locator('#book');
    await expect(section).toBeVisible();
    await expect(section.getByRole('link', { name: /Direct Calendly link/i })).toHaveAttribute('href', 'https://calendly.com/rootrcm-info/30min');
    await expect(section.locator('a[href="tel:+13024965648"]')).toBeVisible();
    await expect(section.locator('iframe')).toHaveCount(0);
    await section.getByRole('button', { name: 'Show available times' }).click();
    await expect(section.locator('iframe')).toHaveAttribute('src', /calendly\.com\/rootrcm-info\/30min/);
  });

  test('mobile dock is visible on phones, hidden on desktop, and uses real destinations', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 800 });
    await page.goto('/en');
    const dock = page.getByTestId('mobile-conversion-dock');
    await expect(dock).toBeHidden();
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(dock).toBeVisible();
    await expect(dock.getByRole('link', { name: /Call/i })).toHaveAttribute('href', 'tel:+13024965648');
    await expect(dock.getByRole('link', { name: /Book consultation/i })).toHaveAttribute('href', '/en/consultation#book');
    await noHorizontalOverflow(page);
  });

  test('English auth routes have distinct genuine forms, legal links and recovery flow', async ({ page }) => {
    await page.goto('/en/login');
    await expect(page.getByRole('heading', { level: 1, name: 'Log in to ROOT' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Microsoft/i })).toBeVisible();
    await expect(page.locator('#main input[type="email"]')).toBeVisible();
    await expect(page.locator('#main input[type="password"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /Forgot password/i })).toHaveAttribute('href', '/en/forgot-password');
    await expect(page.getByRole('link', { name: /Create an account/i })).toHaveAttribute('href', '/en/signup');

    await page.goto('/en/signup');
    await expect(page.getByRole('heading', { level: 1, name: 'Create your practice account' })).toBeVisible();
    await expect(page.locator('#main input[type="checkbox"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /Terms of Service/i })).toHaveAttribute('href', '/en/terms');
    await expect(page.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/en/privacy');

    await page.goto('/en/forgot-password');
    await expect(page.getByRole('heading', { level: 1, name: 'Forgot your password?' })).toBeVisible();
    await expect(page.locator('#main input[type="email"]')).toBeVisible();

    await page.goto('/en/reset-password?userId=test-id&secret=test-secret');
    await expect(page.getByRole('heading', { level: 1, name: 'Choose a new password' })).toBeVisible();

    await page.goto('/en/contact');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Where is revenue getting stuck?');
    await expect(page.locator('#main a[href="tel:+13024965648"]').first()).toBeVisible();
  });

  test('Spanish login, signup and contact routes render localized H1s', async ({ page }) => {
    await page.goto('/es/login');
    await expect(page.getByRole('heading', { level: 1, name: 'Inicie sesión en ROOT' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continuar con Google/i })).toBeVisible();
    await page.goto('/es/signup');
    await expect(page.getByRole('heading', { level: 1, name: 'Cree su cuenta de práctica' })).toBeVisible();
    await page.goto('/es/contact');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('¿Dónde se atascan sus ingresos?');
  });
});
