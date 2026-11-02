import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return <MarketingPage locale={locale} title={t.legal.termsTitle} body={t.legal.body} nodeId="6:169" />;
}
