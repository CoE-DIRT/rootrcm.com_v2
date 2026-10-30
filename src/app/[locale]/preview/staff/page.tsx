import { AppShell } from '@/components/app-shell/app-shell';
import { OperationsCommandCenter } from '@/components/app-shell/operations-command-center';
import { Card } from '@/components/ui/card';
import { copy } from '@/content/messages';
import { staffQueue } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function StaffPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main">
      <AppShell locale={locale} role="staff" orgName={t.workspace.staffOrg} title={t.workspace.staffTitle}>
        <div className="grid gap-3 md:grid-cols-2">
          {staffQueue.map((item) => (
            <Card
              key={item.id}
              title={item.task[locale]}
              body={`${item.org} · ${item.state[locale]}`}
              kicker={item.id}
            />
          ))}
        </div>
        <div className="mt-6"><OperationsCommandCenter locale={locale} role="staff" initialTab="credentialing" /></div>
      </AppShell>
    </main>
  );
}
