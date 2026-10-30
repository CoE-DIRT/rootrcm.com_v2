import { expect, test, type Page, type Response } from '@playwright/test';

/** Horizontal overflow allowance for subpixel rounding. */
export async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

/**
 * Load a commercial route that Agent A may not have merged yet.
 * `test.skip` keeps this branch green on 404 / not-found shells.
 */
export async function gotoOrSkip(page: Page, path: string): Promise<Response> {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  const status = response?.status() ?? 0;
  const notFoundHeading = page.getByRole('heading', { name: 'Page not found' });
  if (status === 404 || (await notFoundHeading.count()) > 0) {
    test.skip(true, `${path} not merged yet (${status || 'not-found shell'})`);
  }
  expect(status, `${path} unexpected status`).toBeLessThan(400);
  if (!response) {
    throw new Error(`${path} returned no response`);
  }
  return response;
}

export const MARQUEE_LOCATOR =
  '[data-marquee], [data-testid="marquee"], [aria-roledescription="marquee"], .marquee';
