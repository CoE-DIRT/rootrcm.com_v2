import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { allFaqItems, faqGroups } from '@/content/faq';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

/** Homepage FAQ teaser (first five answers) with a link to the full /faq page. */
export function PracticeFaqSection({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const items = allFaqItems().slice(0, 5);
  return (
    <Section labelledBy="faq-section-heading" width="narrow">
      <SectionHeading
        id="faq-section-heading"
        eyebrow={es ? 'Preguntas frecuentes' : 'Questions'}
        title={es ? '¿Qué preguntan los líderes de práctica antes de cambiar?' : 'What do practice leaders ask before switching?'}
        body={es ? 'Respuestas directas sobre software, responsables, visibilidad y costos.' : 'Straight answers about software, ownership, visibility and cost.'}
      />
      <div>
        {items.map((item) => (
          <Accordion key={item.q.en} title={item.q[locale]}>
            {item.a[locale]}
          </Accordion>
        ))}
      </div>
      <div className="cluster section-actions">
        <Button href={localizedPath(locale, '/faq')} variant="secondary">
          {es ? 'Ver todas las preguntas' : 'See all questions'}
        </Button>
      </div>
    </Section>
  );
}

/** Full FAQ, grouped. Used by /[locale]/faq. */
export function FaqDirectory({ locale }: { locale: Locale }) {
  return (
    <div className="stack-lg">
      {faqGroups.map((group) => (
        <section key={group.id} aria-labelledby={`faq-${group.id}`} className="stack">
          <h2 id={`faq-${group.id}`} className="faq-group__title">
            {group.title[locale]}
          </h2>
          <div>
            {group.items.map((item) => (
              <Accordion key={item.q.en} title={item.q[locale]}>
                {item.a[locale]}
              </Accordion>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
