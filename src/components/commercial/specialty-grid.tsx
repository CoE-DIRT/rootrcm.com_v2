import Link from 'next/link';
import { SectionHeader } from '@/components/commercial/section-header';
import { Card } from '@/components/ui/card';
import { copy } from '@/content/messages';
import { catalogSpecialties, featuredSpecialties, specialtyLabel } from '@/content/specialties';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function SpecialtyGrid({
  locale,
  variant = 'featured',
}: {
  locale: Locale;
  variant?: 'featured' | 'catalog';
}) {
  const t = copy(locale);
  const items = variant === 'featured' ? featuredSpecialties() : catalogSpecialties();
  const featured = variant === 'featured';

  return (
    <section className="commercial-section" aria-labelledby="specialties-heading">
      <SectionHeader
        id="specialties-heading"
        eyebrow={t.commercial.specialtiesEyebrow}
        title={featured ? t.commercial.specialtiesTitle : t.commercial.specialtiesIndexTitle}
        body={featured ? t.commercial.specialtiesBody : t.commercial.specialtiesIndexBody}
        headingLevel={featured ? 2 : 1}
      />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map((specialty) => (
          <li key={specialty.slug}>
            <Card
              className={specialty.dedicatedPage ? 'ring-1 ring-[var(--cyan)]' : ''}
              title={specialtyLabel(specialty, locale, featured)}
              body={specialty.summary[locale]}
              kicker={
                specialty.dedicatedPage ? t.commercial.idKicker : t.commercial.specialtyKicker
              }
              href={localizedPath(locale, `/specialties/${specialty.slug}`)}
            />
          </li>
        ))}
      </ul>
      {featured ? (
        <p className="mt-6">
          <Link className="btn-secondary" href={localizedPath(locale, '/specialties')}>
            {t.commercial.specialtiesCta} →
          </Link>
        </p>
      ) : null}
    </section>
  );
}
