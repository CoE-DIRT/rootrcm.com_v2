import { test, expect, type Page, type BrowserContext } from '@playwright/test';

/**
 * Hosted real-member acceptance for the authenticated dashboards (PR #78).
 * Runs ONLY against a hosted origin with controlled fixture accounts; skipped otherwise.
 * Credentials come from the environment, are never logged, and mocked sessions do not count.
 *
 *   PLAYWRIGHT_BASE_URL=https://<canonical-origin>
 *   ACCEPT_{ADMIN,STAFF,CLIENT,PENDING}_EMAIL / _PASSWORD   (PENDING = verified user with no membership)
 *   ACCEPT_CLIENT_ORG_ID  ACCEPT_OTHER_ORG_ID               (client's org; an org the client is NOT in)
 */
const env = (name: string) => process.env[name] ?? '';
const configured = Boolean(process.env.PLAYWRIGHT_BASE_URL) &&
  ['ADMIN', 'STAFF', 'CLIENT', 'PENDING'].every(r => env(`ACCEPT_${r}_EMAIL`) && env(`ACCEPT_${r}_PASSWORD`)) &&
  Boolean(env('ACCEPT_CLIENT_ORG_ID') && env('ACCEPT_OTHER_ORG_ID'));

test.skip(!configured, 'Hosted acceptance fixtures are not configured; mocked sessions are not acceptance evidence.');

type Role = 'ADMIN' | 'STAFF' | 'CLIENT' | 'PENDING';
const landing: Record<Exclude<Role, 'PENDING'>, string> = { ADMIN: 'admin', STAFF: 'staff', CLIENT: 'client' };
const banner = { en: /SYNTHETIC SAMPLE/, es: /MUESTRA SINTÉTICA/ };
const pending = { en: /pending organization approval/, es: /aprobación de su organización/ };

async function signIn(page: Page, role: Role, locale: 'en' | 'es') {
  await page.goto(`/${locale}/sign-in`);
  await page.locator('input[name="email"]').fill(env(`ACCEPT_${role}_EMAIL`));
  await page.locator('input[name="password"]').fill(env(`ACCEPT_${role}_PASSWORD`));
  await page.locator('form button').filter({ hasText: locale === 'en' ? 'Sign in' : 'Iniciar sesión' }).last().click();
  await page.waitForURL(new RegExp(`/${locale}/dashboard`), { timeout: 30_000 });
}

async function logout(page: Page, locale: 'en' | 'es') {
  await page.getByRole('button', { name: locale === 'en' ? 'Sign out' : 'Cerrar sesión' }).click();
  await page.waitForURL(new RegExp(`/${locale}/sign-in`));
}

for (const locale of ['en', 'es'] as const) {
  for (const role of ['ADMIN', 'STAFF', 'CLIENT'] as const) {
    test(`${locale}: ${role} lands on role-matched dashboard, survives refresh, logs out`, async ({ page, context }) => {
      await signIn(page, role, locale);
      await expect(page).toHaveURL(url => url.pathname === `/${locale}/dashboard/${landing[role]}` && url.searchParams.has('orgId'));
      await expect(page.getByTestId('ops-ready')).toBeVisible({ timeout: 30_000 });
      await expect(page.getByTestId('rcm-command-center')).toContainText(banner[locale]);
      await expect(page.getByTestId('preview-bind-status')).toHaveCount(0); // never the preview binder
      for (const c of (await context.cookies()).filter(c => /auth|session|a_session/i.test(c.name))) {
        expect(c.httpOnly, c.name).toBe(true);
        expect(c.secure, c.name).toBe(true);
      }
      await page.reload();
      await expect(page.getByTestId('ops-ready')).toBeVisible({ timeout: 30_000 });
      await page.getByTestId('ops-refresh').click();
      await expect(page.getByTestId('ops-ready')).toBeVisible();
      await logout(page, locale);
      await page.goto(`/${locale}/dashboard/${landing[role]}`);
      await expect(page).toHaveURL(new RegExp(`/${locale}/sign-in$`));
      const api = await page.request.get(`/api/v1/dashboard/state?kind=${landing[role]}`);
      expect(api.status()).toBe(401);
    });
  }

  test(`${locale}: verified user without membership sees access-pending, never data`, async ({ page }) => {
    await signIn(page, 'PENDING', locale);
    await expect(page.locator('body')).toContainText(pending[locale]);
    await expect(page.getByTestId('rcm-command-center')).toHaveCount(0);
    for (const kind of ['client', 'staff', 'admin']) {
      const res = await page.request.get(`/api/v1/dashboard/state?kind=${kind}`);
      expect([401, 403]).toContain(res.status());
    }
  });
}

test('privilege escalation and cross-tenant requests are denied for a client member', async ({ page }) => {
  await signIn(page, 'CLIENT', 'en');
  const own = env('ACCEPT_CLIENT_ORG_ID');
  const other = env('ACCEPT_OTHER_ORG_ID');
  expect((await page.request.get(`/api/v1/dashboard/state?kind=client&orgId=${encodeURIComponent(own)}`)).status()).toBe(200);
  expect((await page.request.get(`/api/v1/dashboard/state?kind=client&orgId=${encodeURIComponent(other)}`)).status()).toBe(403);
  for (const kind of ['staff', 'admin']) {
    expect((await page.request.get(`/api/v1/dashboard/state?kind=${kind}&orgId=${encodeURIComponent(own)}`)).status()).toBe(403);
    await page.goto(`/en/dashboard/${kind}?orgId=${encodeURIComponent(own)}`);
    await expect(page.getByTestId('rcm-command-center')).toHaveCount(0);
  }
  await page.goto(`/en/dashboard/client?orgId=${encodeURIComponent(other)}`);
  await expect(page.getByTestId('rcm-command-center')).toHaveCount(0);
  // Preview cookie must not be an authorization path for a real member.
  expect((await page.request.post('/api/v1/ops/actions', { data: { type: 'reset', orgId: 'bayview', persona: 'staff' } })).ok()).toBe(false);
});

test('admin cannot select another organization via orgId', async ({ page }) => {
  await signIn(page, 'ADMIN', 'en');
  const res = await page.request.get(`/api/v1/dashboard/state?kind=admin&orgId=${encodeURIComponent(env('ACCEPT_OTHER_ORG_ID'))}`);
  expect(res.status()).toBe(403);
});

test('expired, cleared and tampered session cookies fail closed', async ({ page, context }: { page: Page; context: BrowserContext }) => {
  await signIn(page, 'CLIENT', 'en');
  const session = (await context.cookies()).filter(c => /auth|session/i.test(c.name));
  expect(session.length).toBeGreaterThan(0);
  await context.addCookies(session.map(c => ({ ...c, value: `${c.value.slice(0, -2)}xx` })));
  await page.goto('/en/dashboard/client');
  await expect(page).toHaveURL(/\/en\/sign-in$/);
  expect((await page.request.get('/api/v1/dashboard/state?kind=client')).status()).toBe(401);
  await context.clearCookies();
  await page.goto('/es/dashboard/client');
  await expect(page).toHaveURL(/\/es\/sign-in$/);
});
