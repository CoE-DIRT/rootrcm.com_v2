import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

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
