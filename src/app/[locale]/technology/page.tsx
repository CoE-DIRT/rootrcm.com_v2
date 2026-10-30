import type { Metadata } from 'next';
import { EcosystemMarquees } from '@/components/commercial/ecosystem-marquees';
import { GoHealthcarePreview } from '@/components/commercial/go-healthcare-preview';
import { MarketingPage } from '@/components/site/marketing-page';
import { StatusBanner } from '@/components/ui/status';
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
  return publicPageMetadata(locale, t.technology.title, t.technology.body);
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.technology.title}
      body={t.technology.body}
      cta={t.technology.cta}
      ctaHref={localizedPath(locale, '/preview/dirt')}
      sections={t.technology.sections}
      nodeId="6:22"
    >
      <div className="mt-8">
        <StatusBanner tone="warning">{t.preview}</StatusBanner>
      </div>
      <EcosystemMarquees locale={locale} />
      <GoHealthcarePreview locale={locale} />
    </MarketingPage>
  );
}
