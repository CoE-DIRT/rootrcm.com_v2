import Link from 'next/link';
import { SectionHeader } from '@/components/commercial/section-header';
import { copy } from '@/content/messages';
import { nyPayers, type ProgramType } from '@/content/markets/ny-payers';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

function programLabel(type: ProgramType, locale: Locale) {
  return copy(locale).commercial.programType[type];
}

export function PayerStrip({ locale, compact = true }: { locale: Locale; compact?: boolean }) {
  const t = copy(locale);
  return (
    <section className="commercial-section" aria-labelledby="ny-payers-heading">
      <SectionHeader
        id="ny-payers-heading"
        eyebrow={t.commercial.nyEyebrow}
        title={t.commercial.nyTitle}
        body={t.commercial.nyBody}
      />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {nyPayers.map((payer) => (
          <li key={payer.id} className="surface p-4">
            <p className="eyebrow">{programLabel(payer.programType, locale)}</p>
            <p className="mt-2 font-bold">{payer.name}</p>
            {!compact ? (
              <p className="muted mt-2 text-xs">
                {t.commercial.lastReviewed}: {payer.lastReviewed}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="muted mt-4 text-sm">{t.commercial.nyNoContract}</p>
      <p className="mt-6">
        <Link className="btn-secondary" href={localizedPath(locale, '/locations/new-york')}>
          {t.commercial.nyCta} →
        </Link>
      </p>
    </section>
  );
}
