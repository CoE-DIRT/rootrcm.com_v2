import { expect, test, type Page } from '@playwright/test';

async function visibleCaption(page: Page) {
  const caption = page.locator('[data-testid="root-editorial-caption"]:visible').first();
  await expect(caption).toBeVisible();
  return caption;
}

async function expectCaptionReadable(page: Page, text: string) {
  const caption = await visibleCaption(page);
  await expect(caption).toHaveText(text);
  await caption.evaluate((element) => element.scrollIntoView({ block: 'end', inline: 'nearest' }));
  const overlap = await page.evaluate(() => {
    const captionEl = [...document.querySelectorAll('[data-testid="root-editorial-caption"]')].find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    const launch = document.querySelector('[data-testid="root-guide-launch"]');
    if (!captionEl || !launch) return true;
    const range = document.createRange();
    range.selectNodeContents(captionEl);
    const launchRect = launch.getBoundingClientRect();
    return [...range.getClientRects()].some((rect) => {
      const clear =
        rect.right <= launchRect.left ||
        rect.left >= launchRect.right ||
        rect.bottom <= launchRect.top ||
        rect.top >= launchRect.bottom;
      return !clear;
    });
  });
  expect(overlap).toBe(false);
  const hitsCaption = await caption.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const rect = range.getBoundingClientRect();
    const target = document.elementFromPoint(rect.left + Math.min(12, rect.width / 2), rect.top + rect.height / 2);
    return Boolean(target && element.contains(target));
  });
  expect(hitsCaption).toBe(true);
}

async function expectLauncherUsable(page: Page) {
  const launch = page.getByTestId('root-guide-launch');
  await expect(launch).toBeVisible();
  await launch.click();
  const close = page.getByTestId('root-guide-close');
  await expect(close).toBeVisible();
  const hit = await close.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return Boolean(target && element.contains(target));
  });
  expect(hit).toBe(true);
  await close.click();
  await expect(page.getByTestId('root-guide-panel')).toHaveCount(0);
}

test('Spanish and English captions stay clear of Ask ROOT at 375 and in short landscape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/es');
  await expectCaptionReadable(page, 'Fotografía editorial. No es personal de ROOT.');
  await expectLauncherUsable(page);
  await page.getByRole('button', { name: 'Cambiar tema' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expectCaptionReadable(page, 'Fotografía editorial. No es personal de ROOT.');
  await page.getByRole('link', { name: 'Cambiar idioma' }).click();
  await page.waitForURL(/\/en/);
  await expectCaptionReadable(page, 'Editorial photograph. Not ROOT staff.');
  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expectCaptionReadable(page, 'Editorial photograph. Not ROOT staff.');

  await page.setViewportSize({ width: 812, height: 375 });
  await expectCaptionReadable(page, 'Editorial photograph. Not ROOT staff.');
  await expectLauncherUsable(page);
  await page.getByRole('link', { name: 'Switch language' }).click();
  await page.waitForURL(/\/es/);
  await expectCaptionReadable(page, 'Fotografía editorial. No es personal de ROOT.');
  await expectLauncherUsable(page);
});
