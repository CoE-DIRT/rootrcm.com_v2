import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireLocale } from '@/lib/locale';
import { getAuthContext } from '@/server/auth/session';
import { defaultMemberDashboard } from '@/server/operations/member-dashboard';
import { MarketingPage } from '@/components/site/marketing-page';
import { AuthForm } from '@/components/forms/auth-form';
import { WorkspaceSetupForm } from '@/components/forms/workspace-setup-form';
import { signupProvisioningEnabled } from '@/server/signup/row-store';
import { authCopy } from '@/content/auth-messages';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' as const };

export default async function WorkspaceLanding({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const ctx = await getAuthContext((await cookies()).toString());
  if (!ctx.session) redirect('/' + locale + '/sign-in');
  const entry = defaultMemberDashboard(ctx);
  if (entry) redirect('/' + locale + '/dashboard/' + entry.kind + '?orgId=' + encodeURIComponent(entry.orgId));
  const t = authCopy[locale];
  // A verified account with no membership can create its FREE workspace when provisioning is enabled; a failed
  // membership lookup is NOT 'no membership', so it never shows the setup form.
  const canSetUp = !ctx.membershipsUnavailable && ctx.memberships.length === 0 && signupProvisioningEnabled();
  return (
    <MarketingPage
      locale={locale}
      title={t.client}
      body={canSetUp ? (locale === 'es' ? 'Cuenta verificada. Complete los datos de su práctica para crear su espacio gratuito.' : 'Account verified. Add your practice details to create your free workspace.') : t.denied}
      nodeId="5:138"
    >
      {canSetUp ? <WorkspaceSetupForm locale={locale} /> : null}
      <AuthForm locale={locale} logout />
    </MarketingPage>
  );
}
