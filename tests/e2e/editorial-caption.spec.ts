import { expect, test } from '@playwright/test';
import { noHorizontalOverflow } from './helpers';

for (const dimensions of [{ width: 375, height: 812 }, { width: 812, height: 375 }]) {
  test('licensed public imagery and ROOT guide remain accessible at ' + dimensions.width + '×' + dimensions.height, async ({ page }) => {
    await page.setViewportSize(dimensions);
    await page.goto('/en');
    const image = page.locator('main img[src*="analytics-review"]').first();
    await expect(image).toHaveAttribute('alt', /Hands on a laptop beside printed charts/i);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    const launch = page.getByTestId('root-guide-launch');
    await launch.click();
    const close = page.getByTestId('root-guide-close');
    await expect(close).toBeVisible();
    const hit = await close.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const target = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(target && el.contains(target));
    });
    expect(hit).toBe(true);
    await close.click();
    await expect(page.getByTestId('root-guide-panel')).toHaveCount(0);
    await noHorizontalOverflow(page);
  });
}

test('Spanish editorial alt text is localized without pretending imagery is ROOT staff', async ({ page }) => {
  await page.goto('/es');
  const image = page.locator('main img[src*="analytics-review"]').first();
  await expect(image).toHaveAttribute('alt', /Manos sobre un portátil/i);
  await expect(page.locator('main img[alt=""]')).toHaveCount(0);
});
