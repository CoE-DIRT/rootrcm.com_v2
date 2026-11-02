'use client';

import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { priceCatalog } from '@/content/catalog';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

const filters = ['all', 'entry', 'diagnostic', 'managed', 'projects', 'bundles'] as const;
type Filter = (typeof filters)[number];

function isFilter(value: string | null): value is Filter {
  return Boolean(value && (filters as readonly string[]).includes(value));
}

function PricingCatalogInner({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get('band') ?? searchParams.get('tab');
  const filter: Filter = isFilter(requested) ? requested : 'all';
  const offers = priceCatalog.filter((offer) => filter === 'all' || offer.band === filter);

  function selectFilter(next: Filter) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'all') params.delete('band');
    else params.set('band', next);
    params.delete('tab');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="mt-8" data-testid="pricing-catalog" id="pricing-catalog">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t.plans.title}>
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            data-active={filter === item}
            aria-pressed={filter === item}
            onClick={() => selectFilter(item)}
          >
            {t.plans.filters[item]}
          </button>
        ))}
      </div>
      {offers.length === 0 ? (
        <p className="surface mt-4 p-4 text-sm">{t.plans.bundlesEmpty}</p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              title={offer.name[locale]}
              body={offer.summary[locale]}
              kicker={offer.priceLabel[locale]}
              href={localizedPath(locale, offer.href)}
              nodeId={offer.figmaNodeId}
            />
          ))}
        </div>
      )}
      <p className="surface mt-4 p-4 text-sm">{t.plans.sow}</p>
      <p className="muted mt-3 text-sm">{t.plans.catalogGap}</p>
    </div>
  );
}

export function PricingCatalog({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<div className="surface mt-8 p-5 text-sm" aria-hidden="true" />}>
      <PricingCatalogInner locale={locale} />
    </Suspense>
  );
}
