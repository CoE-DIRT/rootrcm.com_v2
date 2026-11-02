import { expect, test } from '@playwright/test';

test('ROOT visual hero displays branded artwork and the real brand asset', async ({ page }) => {
  await page.goto('/en');
  const logo = page.locator('header').getByTestId('root-brand-lockup');
  await expect(logo).toBeVisible();
  await expect(logo.locator('img')).toHaveAttribute('src', /brand(?:%2F|\/)mark\.webp/);
  await expect
    .poll(async () =>
      logo.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBeTruthy();
  const hero = page.locator('[data-testid="root-visual-hero"]:visible').first();
  await expect(hero).toBeVisible();
  const media = hero.locator('img[src*="root-revenue-hero"]');
  await expect(media).toHaveAttribute('src', /root-revenue-hero\.svg/);
  const editorial = hero.getByTestId('root-editorial-photo');
  await expect(editorial).toBeVisible();
  await expect(editorial).toContainText('Not ROOT staff');
  const photo = editorial.locator('img');
  await expect(photo).toHaveAttribute('src', /practice-doctor-laptop\.webp/);
  await expect(photo).toHaveAttribute('width', '1600');
  await expect(photo).toHaveAttribute('height', '1067');
  await expect(hero.getByRole('link')).toHaveCount(1);
  const mark = logo.locator('img');
  const ratio = await mark.evaluate((img: HTMLImageElement) => img.clientWidth / img.clientHeight);
  expect(Math.abs(ratio - 250 / 243)).toBeLessThan(0.06);
  await expect
    .poll(async () =>
      media.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBeTruthy();
  await expect
    .poll(async () =>
      photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBeTruthy();
});

for (const width of [375, 768, 1366, 2560]) {
  test(`visual hero preserves CTA and avoids horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 920 });
    await page.goto('/en');
    await expect(page.locator('[data-testid="root-visual-hero"]:visible').first()).toBeVisible();
    await expect(
      page.locator('[data-testid="root-visual-hero"]:visible').first().getByRole('link'),
    ).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('DIRT imagery and bilingual hero are present in the commercial story', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 920 });
  await page.goto('/es');
  await expect(page.locator('[data-testid="root-visual-hero"]:visible').first()).toBeVisible();
  await expect(page.locator('img[src*="root-workflow-network.svg"]')).toBeVisible();
  await expect(page.locator('[data-testid="root-visual-hero"]:visible').first()).toContainText(
    'Operaciones de ingresos · inteligencia conectada',
  );
  await expect(page.locator('header').getByTestId('root-brand-lockup')).toContainText(
    'Operaciones y resultados de ingresos',
  );
});
