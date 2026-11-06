import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { requireLocale } from '@/lib/locale';
import { getAuthContext } from '@/server/auth/session';
import { authorizeMemberDashboard, defaultMemberDashboard, isMemberDashboardKind } from '@/server/operations/member-dashboard';
import { MarketingPage } from '@/components/site/marketing-page';
import { OperationsCommandCenter } from '@/components/app-shell/operations-command-center';
import { AuthForm } from '@/components/forms/auth-form';
import { authCopy } from '@/content/auth-messages';
import { localizedPath } from '@/lib/paths';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' as const };

/**
 * Real Appwrite session + membership gate. The synthetic command center is mounted
 * read-only in member mode; it never uses the signed preview cookie (/api/v1/ops/*).
 */
export default async function Dashboard({ params, searchParams }: { params: Promise<{ locale: string; kind: string }>; searchParams: Promise<{ orgId?: string }> }) {
  const locale = await requireLocale(params);
  const { kind } = await params;
  if (!isMemberDashboardKind(kind)) notFound();
  const ctx = await getAuthContext((await cookies()).toString());
  if (!ctx.session) redirect(`/${locale}/sign-in`);
  const requested = (await searchParams).orgId;
  const access = authorizeMemberDashboard(ctx, kind, requested);
  const t = authCopy[locale];
  const nodeId = kind === 'client' ? '5:138' : '5:195';
  if (!access.allow) {
    const own = defaultMemberDashboard(ctx);
    return <MarketingPage locale={locale} title={t[kind]} body={t.denied} nodeId={nodeId}>
      {own ? <p><Link className="underline" href={localizedPath(locale, `/dashboard/${own.kind}?orgId=${encodeURIComponent(own.orgId)}`)}>{t[own.kind]}</Link></p> : null}
      <AuthForm locale={locale} logout />
    </MarketingPage>;
  }
  const { membership } = access;
  return <MarketingPage locale={locale} title={t[kind]} body={t.empty} nodeId={nodeId}>
    <p data-testid="member-context">{membership.orgId} · {membership.role}</p>
    <div className="mt-6">
      <OperationsCommandCenter
        locale={locale}
        role={kind === 'client' ? 'client' : 'staff'}
        orgId={membership.orgId}
        initialTab={kind === 'client' ? 'overview' : 'credentialing'}
        member={{ kind, orgId: membership.orgId }}
      />
    </div>
    <AuthForm locale={locale} logout />
  </MarketingPage>;
}
