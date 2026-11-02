import { AppShell } from '@/components/app-shell/app-shell';
import { StatusBanner } from '@/components/ui/status';
import { priceCatalog } from '@/content/catalog';
import { previewTierRows } from '@/domain/catalog-entitlement';
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
        <section className="mt-6 surface p-4" data-testid="preview-tier-map">
          <h2 className="font-bold">{t.workspace.tierMapTitle}</h2>
          <p className="muted mt-2 text-sm">{t.workspace.tierMapBody}</p>
          <ul className="mt-3 grid gap-2">
            {previewTierRows.map(({ tier, offerId }) => {
              const offer = priceCatalog.find((item) => item.id === offerId);
              return (
                <li key={tier} className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-semibold">{tier}</span>
                  <span>{offer?.name[locale]}</span>
                </li>
              );
            })}
          </ul>
        </section>
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
