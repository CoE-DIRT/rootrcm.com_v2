import { AppShell } from '@/components/app-shell/app-shell';
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
      <AppShell locale={locale} role="client" orgName={org.name} title="Your practice, in control.">
        <p className="muted">{org.name} · {org.plan} tier · {t.preview}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {clientQueue.map((item) => (
            <Card key={item.id} title={item.title} body={`${item.owner} · ${item.state}`} kicker={item.id} />
          ))}
        </div>
      </AppShell>
    </main>
  );
}
