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
  return publicPageMetadata(locale, t.why.title, t.why.body);
}

export default async function WhyRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.why.title}
      body={t.why.body}
      cta={t.nav.consultation}
      ctaHref={localizedPath(locale, '/consultation')}
      tiles={t.why.tiles}
      sections={t.why.sections}
      nodeId="5:24"
    />
  );
}
