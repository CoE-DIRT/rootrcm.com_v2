import { MarketingPage } from '@/components/site/marketing-page';
import { StatusBanner } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.technology.title}
      body={t.technology.body}
      cta="DIRT preview"
      ctaHref={localizedPath(locale, '/preview/dirt')}
      nodeId="6:22"
    >
      <div className="mt-8">
        <StatusBanner tone="warning">{t.preview}</StatusBanner>
      </div>
    </MarketingPage>
  );
}
