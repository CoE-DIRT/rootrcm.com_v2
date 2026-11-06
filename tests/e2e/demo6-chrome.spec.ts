import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

test('six-category primary navigation supports links and keyboard access', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 850 });
  await page.goto('/en');
  const nav = page.getByTestId('root-primary-nav');
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link')).toHaveCount(6);
  const services = nav.getByRole('link', { name: 'Services' });
  await services.focus();
  await expect(services).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/en\/services$/);
});

test('footer retains four navigation columns, real contact routes and safe newsletter fallback', async ({ page }) => {
  await page.goto('/en');
  const footer = page.getByTestId('root-rich-footer');
  await expect(footer).toBeVisible();
  for (const heading of ['Services', 'Platform', 'Resources', 'Company']) {
    await expect(footer.getByRole('heading', { name: heading })).toBeVisible();
  }
  await expect(footer.getByRole('link', { name: /496-5648/ })).toHaveAttribute('href', 'tel:+13024965648');
  await expect(footer.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/13025064685');
  await expect(footer.getByTestId('root-newsletter').getByRole('button', { name: 'Prepare newsletter request' })).toBeVisible();
  await expect(footer.getByText(/site does not store addresses/i)).toBeVisible();
});

for (const width of [375, 768, 1366, 2560]) {
  test('floating ROOT guide remains clickable and fits ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.goto('/en');
    const launch = page.getByTestId('root-guide-launch');
    await expect(launch).toBeVisible();
    await launch.click();
    const panel = page.getByTestId('root-guide-panel');
    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'Credentialing' }).click();
    await expect(panel.getByText(/payer-specific applications/i)).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Open related page' })).toHaveAttribute('href', '/en/preview/credentialing');
    await noHorizontalOverflow(page);
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
  });
}

test('Spanish public navigation, footer and ROOT guide use Spanish strings', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByTestId('root-rich-footer').getByRole('heading', { name: 'Plataforma' })).toBeVisible();
  await expect(page.getByTestId('root-primary-nav').getByRole('link', { name: 'Servicios' })).toBeVisible();
  await page.getByTestId('root-guide-launch').click();
  const guide = page.getByTestId('root-guide-panel');
  await expect(guide.getByText('Guía ROOT')).toBeVisible();
  await guide.getByRole('button', { name: 'Mantener mi EHR' }).click();
  await expect(guide.getByText(/Partimos de su EHR/)).toBeVisible();
  await expect(guide.getByRole('link', { name: 'Abrir página relacionada' })).toHaveAttribute('href', '/es/technology');
});

test('mobile navigation shows correct destinations and restores keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 760 });
  await page.goto('/en');
  const open = page.getByRole('button', { name: 'Open menu' });
  await open.click();
  const drawer = page.getByTestId('root-mobile-drawer');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('navigation', { name: 'Mobile menu' }).getByRole('link', { name: 'Technology' })).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Book a consultation' })).toHaveAttribute('href', '/en/consultation#book');
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(open).toBeFocused();
});
