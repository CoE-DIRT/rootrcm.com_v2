import { AppShell } from '@/components/app-shell/app-shell';
import { Card } from '@/components/ui/card';
import { dirtMetrics, previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function DirtPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={previewOrgs[1].name} title="DIRT revenue intelligence preview">
        <div className="grid gap-3 md:grid-cols-3">
          {dirtMetrics.map((metric) => (
            <Card key={metric.label} title={metric.label} body={`${metric.value} · ${metric.note}`} />
          ))}
        </div>
      </AppShell>
    </main>
  );
}
