import { SectionHeader } from '@/components/commercial/section-header';
import { EmptyState } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { proofSlots } from '@/content/credibility';
import type { Locale } from '@/i18n/locales';

export function ProofUnpublished({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return (
    <section className="commercial-section" aria-labelledby="proof-heading">
      <SectionHeader
        id="proof-heading"
        eyebrow={t.commercial.proofEyebrow}
        title={t.commercial.proofTitle}
        body={t.commercial.proofBody}
      />
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {proofSlots.map((slot) => (
          <li key={slot.id} data-testid={`proof-slot-${slot.id}`}>
            {slot.editorialStatus === 'published' && slot.quote ? (
              <blockquote className="surface p-6">
                <p className="eyebrow">{slot.role[locale]}</p>
                <p className="mt-3 text-lg font-bold">“{slot.quote[locale]}”</p>
                {slot.attribution ? (
                  <footer className="muted mt-3 text-sm">{slot.attribution[locale]}</footer>
                ) : null}
              </blockquote>
            ) : (
              <EmptyState
                title={`${slot.role[locale]} · ${t.commercial.proofEmptyTitle}`}
                body={t.commercial.proofEmptyBody}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
