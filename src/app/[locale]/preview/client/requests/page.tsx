import { AppShell } from '@/components/app-shell/app-shell';
import { EmptyState } from '@/components/ui/status';
import { clientQueue, previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function RequestsPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const org = previewOrgs[1];
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={org.name} title="Service requests">
        {clientQueue.length ? (
          <ul className="grid gap-3">
            {clientQueue.map((item) => (
              <li key={item.id} className="surface p-4">
                <p className="font-bold">{item.title}</p>
                <p className="muted text-sm">
                  {item.id} · {item.state}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No requests" body="Synthetic queue is empty." />
        )}
      </AppShell>
    </main>
  );
}
