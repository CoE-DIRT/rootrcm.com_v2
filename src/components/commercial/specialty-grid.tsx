import { SectionHeader } from '@/components/commercial/section-header';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { copy } from '@/content/messages';
import { catalogSpecialties, featuredSpecialties, specialtyLabel } from '@/content/specialties';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { Button } from '@/components/ui/Button';

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
    <Section labelledBy="specialties-heading">
      <SectionHeader
        id="specialties-heading"
        eyebrow={t.commercial.specialtiesEyebrow}
        title={featured ? t.commercial.specialtiesTitle : t.commercial.specialtiesIndexTitle}
        body={featured ? t.commercial.specialtiesBody : t.commercial.specialtiesIndexBody}
        headingLevel={featured ? 2 : 1}
      />
      <ul className="ui-grid" data-min="sm">
        {items.map((specialty) => (
          <li key={specialty.slug} className="min-w-0">
            <Card
              accent={Boolean(specialty.dedicatedPage)}
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
        <p className="cluster section-actions">
          <Button variant="secondary" href={localizedPath(locale, '/specialties')}>
            {t.commercial.specialtiesCta} →
          </Button>
        </p>
      ) : null}
    </Section>
  );
}
