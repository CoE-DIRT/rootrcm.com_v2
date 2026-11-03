import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireLocale } from '@/lib/locale';
import { getAuthContext } from '@/server/auth/session';
import { requireMembership } from '@/server/auth/policy';
import { MarketingPage } from '@/components/site/marketing-page';
import { AuthForm } from '@/components/forms/auth-form';
import { authCopy } from '@/content/auth-messages';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' as const };

export default async function WorkspaceLanding({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const ctx = await getAuthContext((await cookies()).toString());
  if (!ctx.session) redirect('/' + locale + '/sign-in');
  const admin = ctx.memberships.find(m => requireMembership(ctx, m.orgId, 'root_admin.manage').allow);
  if (admin) redirect('/' + locale + '/dashboard/admin?orgId=' + encodeURIComponent(admin.orgId));
  const client = ctx.memberships.find(m => requireMembership(ctx, m.orgId, 'organization.read').allow);
  if (client) redirect('/' + locale + '/dashboard/client?orgId=' + encodeURIComponent(client.orgId));
  const t = authCopy[locale];
  return (
    <MarketingPage locale={locale} title={t.client} body={t.denied} nodeId="5:138">
      <AuthForm locale={locale} logout />
    </MarketingPage>
  );
}
