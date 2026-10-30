import Link from 'next/link';
import { priceCatalog, type OfferId } from '@/content/catalog';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function CommercialNextActions({
  locale,
  offerId,
}: {
  locale: Locale;
  offerId?: OfferId;
}) {
  const t = copy(locale);
  const offer = offerId ? priceCatalog.find((item) => item.id === offerId) : undefined;
  return (
    <aside className="mt-8 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5" data-testid="commercial-next-actions">
      <p className="eyebrow">{t.commercial.journeyCta}</p>
      <p className="muted mt-2 max-w-3xl text-sm">{t.commercial.journeyCtaBody}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link className="btn-secondary" href={localizedPath(locale, '/preview/sales')}>
          {t.commercial.journeyCta} →
        </Link>
        <Link className="btn-secondary" href={localizedPath(locale, '/plans')}>
          {t.commercial.comparePlans} →
        </Link>
        {offer ? (
          <Link className="btn-secondary" href={localizedPath(locale, offer.href)}>
            {offer.name[locale]} →
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
