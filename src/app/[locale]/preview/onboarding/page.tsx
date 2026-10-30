import Link from 'next/link';
import { AppShell } from '@/components/app-shell/app-shell';
import { StepList } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export default async function OnboardingPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={previewOrgs[0].name} title={t.workspace.onboardingTitle}>
        <p className="muted">{t.workspace.onboardingNote}</p>
        <StepList steps={t.account.steps} />
        <Link className="btn-secondary mt-6 inline-flex min-h-11 items-center" href={localizedPath(locale, '/preview/sales')}>
          {locale === 'es' ? 'Explorar el proceso comercial e incorporación' : 'Explore the interactive sales-to-onboarding journey'}
        </Link>
      </AppShell>
    </main>
  );
}
