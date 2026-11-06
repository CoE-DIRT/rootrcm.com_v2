import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

test('original ROOT mark and new synthetic hero are visible', async ({ page }) => {
  await page.goto('/en');
  const logo = page.locator('header').getByTestId('root-brand-lockup');
  await expect(logo).toBeVisible();
  const mark = logo.locator('img');
  await expect(mark).toHaveAttribute('src', /brand(?:%2F|\/)mark\.webp/);
  await expect.poll(async () => mark.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  const hero = page.getByTestId('hero-console');
  await expect(hero).toBeVisible();
  await expect(hero.locator('.hero-stage')).toBeVisible();
  await expect(hero.locator('.hero-claim')).toHaveCount(5);
  await expect(hero.locator('.hero-console__ctas a')).toHaveCount(2);
  await expect(hero.locator('a[href="/en/diagnostic"]')).toBeVisible();
  await expect(hero.locator('a[href="/en/preview/client"]')).toBeVisible();
});

for (const width of [375, 768, 1366, 2560]) {
  test('new revenue hero preserves CTAs and no horizontal overflow at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 920 });
    await page.goto('/en');
    const hero = page.getByTestId('hero-console');
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(hero.locator('a[href="/en/diagnostic"]')).toBeVisible();
    await noHorizontalOverflow(page);
  });
}

test('Spanish hero and modern DIRT illustrations remain localized and accessible', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByTestId('hero-console').getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.hero-stage__head')).toContainText('Sala de control de ingresos');
  await expect(page.locator('main img[src="/imagery/svg/payer-mix-dashboard.svg"]')).toHaveAttribute('alt', /pagadores/i);
  await expect(page.locator('header').getByTestId('root-brand-lockup')).toContainText('Operaciones y resultados de ingresos');
});
