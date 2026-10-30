import { AppShell } from '@/components/app-shell/app-shell';
import { copy } from '@/content/messages';
import { credentialingStages, previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function CredentialingPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={previewOrgs[0].name} title={t.workspace.credentialingTitle}>
        <ol className="grid gap-3 md:grid-cols-5">
          {credentialingStages.map((stage, index) => (
            <li key={stage.en} className="surface p-4">
              <p className="eyebrow">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-2 font-bold">{stage[locale]}</p>
            </li>
          ))}
        </ol>
      </AppShell>
    </main>
  );
}
