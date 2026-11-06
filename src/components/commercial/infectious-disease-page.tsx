import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/site/page-intro';
import { Illustration } from '@/components/site/media';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { copy } from '@/content/messages';
import { specialtyBySlug } from '@/content/specialties';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function InfectiousDiseasePage({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const specialty = specialtyBySlug('infectious-disease');
  return (
    <main id="main">
      <PageIntro locale={locale} eyebrow={t.commercial.idKicker} title={t.commercial.idHeadline} body={t.commercial.idLead} />
      <Container>
        <div className="page-body">
          <div className="split">
            <div className="stack">
              <p className="prose-muted">{t.commercial.idClinicalDisclaimer}</p>
              {specialty ? (
                <ul className="check-list">
                  {specialty.focus[locale].map((item) => (
                    <li key={item}>
                      <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <Illustration name="claim-lifecycle" locale={locale} />
          </div>
          <ul className="ui-grid">
            {t.commercial.idSections.map((section) => (
              <li key={section.title}>
                <Card title={section.title} body={section.body} headingLevel={2} />
              </li>
            ))}
          </ul>
          <p className="prose-muted">{t.commercial.codeDisclaimer}</p>
          <div className="cluster">
            <Button variant="primary" size="lg" href={localizedPath(locale, '/consultation#book')}>
              {t.commercial.conversionCta}
            </Button>
            <Button variant="secondary" size="lg" href={localizedPath(locale, '/specialties')}>
              {t.commercial.specialtiesCta}
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
