import { AppShell } from '@/components/app-shell/app-shell';
import { Card } from '@/components/ui/card';
import { staffQueue } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function StaffPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  return (
    <main id="main">
      <AppShell locale={locale} role="staff" orgName="ROOT operations" title="Your assigned work, in context.">
        <div className="grid gap-3 md:grid-cols-2">
          {staffQueue.map((item) => (
            <Card key={item.id} title={item.task} body={`${item.org} · ${item.state}`} kicker={item.id} />
          ))}
        </div>
      </AppShell>
    </main>
  );
}
