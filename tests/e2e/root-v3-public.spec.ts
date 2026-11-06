import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

test.describe('ROOT V3 Public Transformation', () => {
  test('homepage has exactly ONE H1 element and no duplicate heroes in DOM', async ({ page }) => {
    await page.goto('/en');
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toContainText('Handing Over the Keys');

    await page.goto('/es');
    const h1sEs = page.locator('h1');
    await expect(h1sEs).toHaveCount(1);
    await expect(h1sEs).toContainText('Entregar las llaves');
  });

  test('Revenue Control Room and Trust Bullets are present', async ({ page }) => {
    await page.goto('/en');
    const controlRoom = page.getByTestId('revenue-control-room');
    await expect(controlRoom).toBeVisible();
    await expect(controlRoom.getByText(/No forced EHR replacement/i)).toBeVisible();
    await expect(controlRoom.getByText(/Named exception owners/i)).toBeVisible();
    await expect(controlRoom.getByText(/Weekly cash reconciliation/i)).toBeVisible();
    await expect(controlRoom.getByText(/HIPAA-aligned safeguards/i)).toBeVisible();
    await expect(controlRoom.getByText(/Active Exception Work Queue/i)).toBeVisible();
    await expect(controlRoom.getByRole('link', { name: /Explore Sample Workspace/i })).toHaveAttribute(
      'href',
      '/en/preview/client'
    );
  });

  test('Bilingual FAQs are discoverable and expandable', async ({ page }) => {
    await page.goto('/en');
    const faqSection = page.locator('section[aria-labelledby="faq-section-heading"]');
    await expect(faqSection).toBeVisible();
    await expect(faqSection.getByRole('heading', { name: /Operational clarity/i })).toBeVisible();

    const firstQuestion = faqSection.locator('summary', { hasText: /How does ROOT connect to our current EHR/i });
    await expect(firstQuestion).toBeVisible();
    await firstQuestion.click();
    await expect(faqSection.getByText(/Athenahealth, Epic, eClinicalWorks/i)).toBeVisible();
  });

  test('Calendly booking is mounted at /consultation#book with external fallback', async ({ page }) => {
    await page.goto('/en/consultation');
    const bookingSection = page.locator('#book');
    await expect(bookingSection).toBeVisible();
    await expect(bookingSection.getByRole('heading', { name: /Book a strategy session/i })).toBeVisible();
    await expect(bookingSection.getByRole('link', { name: /Direct Calendly link/i })).toHaveAttribute(
      'href',
      'https://calendly.com/rootrcm-info/30min'
    );
    await expect(bookingSection.getByRole('link', { name: /\+1 \(302\) 496-5648/i })).toHaveAttribute(
      'href',
      'tel:+13024965648'
    );
    const iframe = bookingSection.locator('iframe');
    await expect(iframe).toHaveAttribute('src', /calendly\.com\/rootrcm-info\/30min/);
  });

  test('Mobile conversion dock is visible on mobile and hidden on desktop', async ({ page }) => {
    // Desktop: should be hidden
    await page.setViewportSize({ width: 1366, height: 800 });
    await page.goto('/en');
    const dock = page.getByTestId('mobile-conversion-dock');
    await expect(dock).toBeHidden();

    // Mobile: should be visible
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(dock).toBeVisible();
    await expect(dock.getByRole('link', { name: /Call/i })).toHaveAttribute('href', 'tel:+13024965648');
    await expect(dock.getByRole('link', { name: /Book consultation/i })).toHaveAttribute(
      'href',
      '/en/consultation#book'
    );
    await noHorizontalOverflow(page);
  });

  test('Dedicated Auth routes render distinct UI shells', async ({ page }) => {
    // /login
    await page.goto('/en/login');
    await expect(page.getByRole('heading', { level: 1, name: /Sign in to Practice Portal/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Microsoft/i })).toBeVisible();
    await expect(page.locator('#main input[type="email"]')).toBeVisible();
    await expect(page.locator('#main input[type="password"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /Forgot password\?/i })).toHaveAttribute('href', '/en/forgot-password');
    await expect(page.getByRole('link', { name: /Create an account/i })).toHaveAttribute('href', '/en/signup');

    // /signup
    await page.goto('/en/signup');
    await expect(page.getByRole('heading', { level: 1, name: /Register Practice Account/i })).toBeVisible();
    await expect(page.locator('#main input[type="checkbox"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /Terms of Service/i })).toHaveAttribute('href', '/en/terms');
    await expect(page.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/en/privacy');

    // /forgot-password
    await page.goto('/en/forgot-password');
    await expect(page.getByRole('heading', { level: 1, name: /Reset your password/i })).toBeVisible();
    await expect(page.locator('#main input[type="email"]')).toBeVisible();

    // /reset-password
    await page.goto('/en/reset-password?userId=test-id&secret=test-secret');
    await expect(page.getByRole('heading', { level: 1, name: /Create new password/i })).toBeVisible();
    await expect(page.locator('#main input#new-password')).toBeVisible();
    await expect(page.locator('#main input#confirm-password')).toBeVisible();

    // /contact
    await page.goto('/en/contact');
    await expect(page.getByRole('heading', { level: 1, name: /Contact ROOT/i })).toBeVisible();
    await expect(page.locator('#main').getByRole('link', { name: /\+1 \(302\) 496-5648/i })).toHaveAttribute('href', 'tel:+13024965648');
  });

  test('Spanish dedicated Auth routes are localized', async ({ page }) => {
    await page.goto('/es/login');
    await expect(page.getByRole('heading', { level: 1, name: /Acceso al portal de práctica/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continuar con Google/i })).toBeVisible();

    await page.goto('/es/signup');
    await expect(page.getByRole('heading', { level: 1, name: /Crear cuenta de práctica/i })).toBeVisible();

    await page.goto('/es/contact');
    await expect(page.getByRole('heading', { level: 1, name: /Contáctenos/i })).toBeVisible();
  });
});
