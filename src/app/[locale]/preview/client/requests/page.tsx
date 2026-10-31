import { AppShell } from '@/components/app-shell/app-shell';
import { EmptyState } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { clientQueue, previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function RequestsPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const org = previewOrgs[1];
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={org.name} title={t.workspace.requestsTitle}>
        {clientQueue.length ? (
          <ul className="grid gap-3">
            {clientQueue.map((item) => (
              <li id={item.id} key={item.id} className="surface scroll-mt-24 p-4">
                <p className="font-bold">{item.title[locale]}</p>
                <p className="muted text-sm">
                  {item.id} · {item.state[locale]}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title={t.workspace.requestsEmptyTitle} body={t.workspace.requestsEmptyBody} />
        )}
      </AppShell>
    </main>
  );
}
