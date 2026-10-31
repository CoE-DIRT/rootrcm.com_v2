import { expect, test } from '@playwright/test';

test('prefetch does not set a preview cookie and staff navigation does', async ({ page }) => {
  const prefetch = await page.request.get('/en/preview/staff', {
    headers: { 'next-router-prefetch': '1', purpose: 'prefetch' },
  });
  expect(prefetch.ok()).toBeTruthy();
  expect(prefetch.headers()['set-cookie'] ?? '').not.toContain('root_ops_cap');

  await page.goto('/en/sign-in');
  await page.getByRole('link', { name: 'Preview staff workspace' }).click();
  await page.waitForURL(/\/preview\/staff/);
  await expect.poll(async () => {
    const cookie = (await page.context().cookies()).find((item) => item.name === 'root_ops_cap');
    return cookie?.value ?? '';
  }).toMatch(/^operator\./);

  await page.goto('/en/preview/credentialing');
  const shared = (await page.context().cookies()).find((cookie) => cookie.name === 'root_ops_cap');
  expect(shared?.value.startsWith('operator.')).toBe(true);

  await page.goto('/en/preview/client');
  const retained = (await page.context().cookies()).find((cookie) => cookie.name === 'root_ops_cap');
  expect(retained?.value.startsWith('operator.')).toBe(true);
});

test('Ask ROOT close control stays reachable in a short landscape viewport', async ({ page }) => {
  await page.setViewportSize({ width: 812, height: 375 });
  await page.goto('/en');
  await page.getByTestId('root-guide-launch').click();
  const close = page.getByTestId('root-guide-close');
  await expect(close).toBeVisible();
  const box = await close.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(375);
  const hit = await close.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return element.contains(target);
  });
  expect(hit).toBe(true);
});
