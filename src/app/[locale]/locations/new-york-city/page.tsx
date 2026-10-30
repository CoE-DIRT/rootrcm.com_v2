import type { Metadata } from 'next';
import Link from 'next/link';
import { NyMarket } from '@/components/commercial/ny-market';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';
import { localizedPath } from '@/lib/paths';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return publicPageMetadata(locale, t.commercial.nycTitle, t.commercial.nycBody);
}

export default async function NewYorkCityPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main" className="page-width pb-16 pt-6">
      <Breadcrumb
        items={[
          { href: localizedPath(locale), label: t.brand },
          { href: localizedPath(locale, '/locations/new-york'), label: t.nav.locations },
          { label: t.commercial.nycTitle },
        ]}
      />
      <NyMarket locale={locale} variant="city" />
      <p className="mt-8">
        <Link className="btn-secondary" href={localizedPath(locale, '/locations/new-york')}>
          {t.commercial.nyPageTitle} →
        </Link>
      </p>
    </main>
  );
}
