import { AppShell } from '@/components/app-shell/app-shell';
import { DirtLedgerPreview } from '@/components/operations/dirt-metrics-panel';
import { copy } from '@/content/messages';
import { previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function DirtPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={previewOrgs[1].name} title={t.workspace.dirtPreviewTitle}>
        <DirtLedgerPreview locale={locale} />
      </AppShell>
    </main>
  );
}
