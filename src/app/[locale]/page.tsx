import type { Metadata } from 'next';
import { HomeJourney } from '@/components/commercial/journey-sections';
import { HeroConsole } from '@/components/home/HeroConsole';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return publicPageMetadata(locale, t.home.title, t.home.body, 'home');
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);

  return (
    <main id="main" data-node-id="4:153">
      <HeroConsole
        locale={locale}
        eyebrow={t.home.eyebrow}
        title={t.home.title}
        body={t.home.body}
        primaryCta={t.home.primaryCta}
        secondaryCta={t.home.secondaryCta}
        trust={t.home.trust}
      />
      <HomeJourney locale={locale} />
    </main>
  );
}
