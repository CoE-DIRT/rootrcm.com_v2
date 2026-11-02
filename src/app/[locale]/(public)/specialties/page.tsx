import type { Metadata } from 'next';
import { SpecialtyGrid } from '@/components/commercial/specialty-grid';
import { SpecialtyPlanner } from '@/components/commercial/specialty-planner';
import { Breadcrumb } from '@/components/ui/breadcrumb';
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
  return publicPageMetadata(
    locale,
    t.commercial.specialtiesIndexTitle,
    t.commercial.specialtiesIndexBody,
  );
}

export default async function SpecialtiesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <main id="main" className="page-width pb-16 pt-6">
      <Breadcrumb
        items={[{ href: localizedPath(locale), label: t.brand }, { label: t.nav.specialties }]}
      />
      <SpecialtyPlanner locale={locale} />
      <SpecialtyGrid locale={locale} variant="catalog" />
    </main>
  );
}
