import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function WhyRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return <MarketingPage locale={locale} title={t.why.title} body={t.why.body} tiles={t.why.tiles} nodeId="5:24" />;
}
