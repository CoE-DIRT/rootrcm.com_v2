import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
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
  return publicPageMetadata(locale, t.services.title, t.services.body);
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.services.title}
      body={t.services.body}
      cta={t.services.cta}
      ctaHref={localizedPath(locale, '/diagnostic')}
      tiles={t.services.tiles}
      bands={t.services.bands}
      nodeId="4:40"
    />
  );
}
