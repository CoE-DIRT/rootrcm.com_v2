import { expect, test } from '@playwright/test';
import { dismissCookieBanner } from './helpers';

test.beforeEach(async ({ page }) => {
  await dismissCookieBanner(page);
});

test('Demo 6 six-category mega menu is keyboard, mouse and touch accessible', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 850 });
  await page.goto('/en');
  const nav = page.getByTestId('root-mega-nav');
  await expect(nav).toBeVisible();
  await expect(nav.locator('button[aria-expanded]')).toHaveCount(6);
  const services = nav.getByRole('button', { name: 'Show Services options' });
  await services.click();
  await expect(services).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: /Credentialing workflows/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(services).toHaveAttribute('aria-expanded', 'false');
});

test('Demo 6 footer includes four navigation columns, working contacts and safe newsletter fallback', async ({ page }) => {
  await page.goto('/en');
  const footer = page.getByTestId('root-rich-footer');
  await expect(footer).toBeVisible();
  for (const heading of ['Explore ROOT', 'Platform', 'Resources', 'Company']) {
    await expect(footer.getByRole('heading', { name: heading })).toBeVisible();
  }
  await expect(footer.getByRole('link', { name: 'info@rootrcm.com' })).toHaveAttribute('href', 'mailto:info@rootrcm.com');
  await expect(footer.getByRole('link', { name: /496-5648/ })).toHaveAttribute('href', 'tel:+13024965648');
  await expect(footer.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/13025064685');
  await expect(footer.getByTestId('root-newsletter').getByRole('button')).toBeVisible();
  await expect(footer.getByText(/no address is stored or sent by this site/i)).toBeVisible();
});

for (const width of [375, 768, 1366, 2560]) {
  test(`floating ROOT guide works without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.goto('/en');
    const launch = page.getByTestId('root-guide-launch');
    await expect(launch).toBeVisible();
    await launch.click();
    const panel = page.getByTestId('root-guide-panel');
    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'Credentialing' }).click();
    await expect(panel.getByText(/payer-specific applications/)).toBeVisible();
    await expect(panel.getByRole('link', { name: /Open related page/ })).toHaveAttribute('href', '/en/preview/credentialing');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
  });
}

test('Spanish navigation/footer/guide texts are localized', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 850 });
  await page.goto('/es');
  await expect(page.getByTestId('root-rich-footer').getByRole('heading', { name: 'Plataforma' })).toBeVisible();
  await page.getByTestId('root-guide-launch').click();
  const guide = page.getByTestId('root-guide-panel');
  await expect(guide.getByText('Guía ROOT')).toBeVisible();
  await guide.getByRole('button', { name: 'Mantener mi EHR' }).click();
  await expect(guide.getByText(/Partimos de su EHR/)).toBeVisible();
  await expect(guide.getByRole('link', { name: 'Abrir página relacionada' })).toHaveAttribute('href', '/es/technology');
});


test('mobile drawer exposes grouped destinations with usable touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 760 });
  await page.goto('/en');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const drawer = page.getByTestId('root-mobile-mega-menu');
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Show Technology options' }).click();
  await expect(drawer.getByRole('link', { name: /Client workspace/ })).toBeVisible();
  await expect(drawer.getByRole('link', { name: /Revenue analytics/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});
