import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { requireLocale } from '@/lib/locale';
import { getAuthContextFromSessionSecret, SESSION_COOKIE_NAME } from '@/server/auth/session';
import { requireMembership } from '@/server/auth/policy';
import { MarketingPage } from '@/components/site/marketing-page';
import { AuthForm } from '@/components/forms/auth-form';
import { authCopy } from '@/content/auth-messages';
export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function Dashboard({ params, searchParams }: { params: Promise<{ locale: string; kind: string }>; searchParams: Promise<{ orgId?: string }> }) {
  const locale = await requireLocale(params);
  const { kind } = await params;
  if (kind !== 'client' && kind !== 'admin') notFound();
  const ctx = await getAuthContextFromSessionSecret((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!ctx.session) redirect(`/${locale}/sign-in`);
  const requested = (await searchParams).orgId;
  const permission = kind === 'admin' ? 'root_admin.manage' : 'organization.read';
  const membership = ctx.memberships.find(m => (!requested || m.orgId === requested) && requireMembership(ctx, m.orgId, permission).allow);
  const t = authCopy[locale];
  return <MarketingPage locale={locale} title={t[kind]} body={membership ? t.empty : t.denied} nodeId={kind === 'client' ? '5:138' : '5:195'}>
    {membership && <p>{membership.orgId} · {membership.role}</p>}
    <AuthForm locale={locale} logout />
  </MarketingPage>;
}
