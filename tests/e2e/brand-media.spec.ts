import { expect, test } from '@playwright/test';

test('ROOT visual hero displays branded artwork and the real brand asset', async ({ page }) => {
  await page.goto('/en');
  const logo = page.locator('header').getByTestId('root-brand-lockup');
  await expect(logo).toBeVisible();
  await expect(logo.locator('img')).toHaveAttribute('src', /icon\.svg/);
  const hero = page.locator('[data-testid="root-visual-hero"]:visible').first();
  await expect(hero).toBeVisible();
  const media = hero.locator('img');
  await expect(media).toHaveAttribute('src', /root-revenue-hero\.svg/);
  await expect(hero.getByRole('link')).toHaveCount(1);
  await expect.poll(async () => media.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
});

for (const width of [375, 768, 1366, 2560]) {
  test(`visual hero preserves CTA and avoids horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 920 });
    await page.goto('/en');
    await expect(page.locator('[data-testid="root-visual-hero"]:visible').first()).toBeVisible();
    await expect(page.locator('[data-testid="root-visual-hero"]:visible').first().getByRole('link')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('DIRT imagery and bilingual hero are present in the commercial story', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 920 });
  await page.goto('/es');
  await expect(page.locator('[data-testid="root-visual-hero"]:visible').first()).toBeVisible();
  await expect(page.locator('img[src*="root-workflow-network.svg"]')).toBeVisible();
  await expect(page.locator('[data-testid="root-visual-hero"]:visible').first()).toContainText('Operaciones de ingresos · inteligencia conectada');
  await expect(page.locator('header').getByTestId('root-brand-lockup')).toContainText('Operaciones y resultados de ingresos');
});
