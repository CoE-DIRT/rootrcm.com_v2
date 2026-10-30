import { AppShell } from '@/components/app-shell/app-shell';
import { StatusBanner } from '@/components/ui/status';
import { priceCatalog } from '@/content/catalog';
import { copy } from '@/content/messages';
import { previewOrgs } from '@/content/preview-fixtures';
import { requireLocale } from '@/lib/locale';

export default async function BillingPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main">
      <AppShell locale={locale} role="client" orgName={previewOrgs[1].name} title={t.workspace.billingPreviewTitle}>
        <StatusBanner tone="warning">{t.adaptersOff}</StatusBanner>
        <ul className="mt-4 grid gap-3">
          {priceCatalog.map((offer) => (
            <li key={offer.id} className="surface p-4">
              <p className="font-bold">{offer.name[locale]}</p>
              <p className="muted text-sm">{offer.priceLabel[locale]} · {t.workspace.billingNoEntitlement}</p>
            </li>
          ))}
        </ul>
      </AppShell>
    </main>
  );
}
