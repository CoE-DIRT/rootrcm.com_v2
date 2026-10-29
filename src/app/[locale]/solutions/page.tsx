import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage
      locale={locale}
      title={t.solutions.title}
      body={t.solutions.body}
      cta={t.nav.consultation}
      ctaHref={localizedPath(locale, '/consultation')}
      tiles={t.home.tiles.slice(0, 3)}
    />
  );
}
