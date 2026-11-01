import { AppShell } from '@/components/app-shell/app-shell';
import { Card } from '@/components/ui/card';
import { copy } from '@/content/messages';
import { dirtMetrics, previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function DirtPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={previewOrgs[1].name} title={t.workspace.dirtPreviewTitle}>
        <div className="grid gap-3 md:grid-cols-3">
          {dirtMetrics.map((metric) => (
            <Card
              key={metric.label.en}
              title={metric.label[locale]}
              body={`${metric.value} · ${metric.note[locale]}`}
            />
          ))}
        </div>
      </AppShell>
    </main>
  );
}
