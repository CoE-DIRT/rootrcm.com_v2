import { MarqueeRow } from '@/components/commercial/marquee-row';
import { SectionHeader } from '@/components/commercial/section-header';
import { copy } from '@/content/messages';
import { platformRows } from '@/content/ecosystem';
import type { Locale } from '@/i18n/locales';

export function EcosystemMarquees({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return (
    <section className="commercial-section" aria-labelledby="ecosystem-heading">
      <SectionHeader
        id="ecosystem-heading"
        eyebrow={t.commercial.ecosystemEyebrow}
        title={t.commercial.ecosystemTitle}
        body={t.commercial.ecosystemBody}
      />
      <div className="mt-8 grid gap-8">
        {platformRows.map((row) => (
          <MarqueeRow key={row.id} row={row.id} locale={locale} />
        ))}
      </div>
      <p className="muted mt-6 text-sm">{t.commercial.ecosystemDisclaimer}</p>
    </section>
  );
}
