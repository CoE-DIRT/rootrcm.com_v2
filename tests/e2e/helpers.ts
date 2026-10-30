import { expect, type Page } from '@playwright/test';

/** Horizontal overflow allowance for subpixel rounding. */
export async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

/** Matches the shipped EcosystemMarquees markup, not a speculative class. */
export const MARQUEE_LOCATOR = '[data-marquee], .marquee-viewport';
export const MARQUEE_TRACK_LOCATOR = '[data-marquee-track], .marquee-track';

/** Persist a decided preference so the banner does not cover controls. */
export async function dismissCookieBanner(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'root-cookie-preferences',
      JSON.stringify({
        v: 1,
        necessary: true,
        analytics: false,
        marketing: false,
        decidedAt: '2026-10-31T00:00:00.000Z',
      }),
    );
  });
}
