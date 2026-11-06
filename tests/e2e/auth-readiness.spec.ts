import { test, expect } from '@playwright/test';

// Browser plugin not available; use the repository Playwright runner.
for (const locale of ['en', 'es']) {
  test(`${locale}: missing or forged session redirects protected routes to localized sign-in`, async ({ page, context }) => {
    for (const route of ['/dashboard', '/dashboard/admin?orgId=root_internal', '/dashboard/staff?orgId=root_internal', '/dashboard/client?orgId=unrelated']) {
      await page.goto(`/${locale}${route}`);
      await expect(page).toHaveURL(new RegExp(`/${locale}/sign-in$`));
      await expect(page.locator('form input[name="email"]')).toBeVisible();
    }
    await context.addCookies([{ name: 'root_v2_auth', value: 'synthetic-forged', url: new URL(page.url()).origin }]);
    await page.goto(`/${locale}/dashboard/admin?orgId=root_internal`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/sign-in$`));
    await page.getByRole('button', { name: locale === 'en' ? 'Create account' : 'Crear cuenta', exact: true }).click();
    await expect(page.locator('form input[name="password"]')).toHaveAttribute('autocomplete', 'new-password');
  });
}
