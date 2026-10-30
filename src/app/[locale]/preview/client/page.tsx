import { AppShell } from '@/components/app-shell/app-shell';
import { OperationsCommandCenter } from '@/components/app-shell/operations-command-center';
import { Card } from '@/components/ui/card';
import { copy } from '@/content/messages';
import { clientQueue, previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function ClientPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const org = previewOrgs[1];
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={org.name} title={t.workspace.clientTitle}>
        <p className="muted">
          {org.name} · {org.plan} · {t.preview}
        </p>
        <div className="mt-6"><OperationsCommandCenter locale={locale} role="client" /></div>
        <h2 className="mt-8 text-xl font-extrabold">{t.workspace.requests}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {clientQueue.map((item) => (
            <Card
              key={item.id}
              title={item.title[locale]}
              body={`${item.owner[locale]} · ${item.state[locale]}`}
              kicker={item.id}
            />
          ))}
        </div>
      </AppShell>
    </main>
  );
}
