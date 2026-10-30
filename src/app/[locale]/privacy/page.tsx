import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return <MarketingPage locale={locale} title={t.legal.privacyTitle} body={t.legal.body} nodeId="6:166" />;
}
