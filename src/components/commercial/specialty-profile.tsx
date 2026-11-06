import { PageIntro } from '@/components/site/page-intro';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { copy } from '@/content/messages';
import { specialtyLabel, type Specialty } from '@/content/specialties';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function SpecialtyProfile({ locale, specialty }: { locale: Locale; specialty: Specialty }) {
  const t = copy(locale);
  const title = specialtyLabel(specialty, locale);
  return (
    <main id="main">
      <PageIntro locale={locale} eyebrow={t.commercial.specialtyKicker} title={title} body={specialty.summary[locale]} />
      <Container>
        <div className="page-body">
          <p className="prose-muted">{specialty.body[locale]}</p>
          <ul className="ui-grid" data-min="sm">
            {specialty.focus[locale].map((item) => (
              <li key={item}>
                <Card title={item} surface="raised" />
              </li>
            ))}
          </ul>
          <p className="prose-muted">{t.commercial.codeDisclaimer}</p>
          <div className="cluster">
            <Button variant="primary" size="lg" href={localizedPath(locale, '/diagnostic')}>
              {t.home.primaryCta}
            </Button>
            <Button variant="secondary" size="lg" href={localizedPath(locale, '/consultation#book')}>
              {t.commercial.conversionCta}
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
