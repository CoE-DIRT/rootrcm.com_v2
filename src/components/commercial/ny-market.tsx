import { SectionHeader } from '@/components/commercial/section-header';
import { copy } from '@/content/messages';
import { nyBoroughs, nyMarketMeta, nyPayers, type ProgramType } from '@/content/markets/ny-payers';
import type { Locale } from '@/i18n/locales';

function programLabel(type: ProgramType, locale: Locale) {
  return copy(locale).commercial.programType[type];
}

export function NyMarket({ locale, variant }: { locale: Locale; variant: 'state' | 'city' }) {
  const t = copy(locale);
  const title = variant === 'city' ? t.commercial.nycTitle : t.commercial.nyPageTitle;
  const body = variant === 'city' ? t.commercial.nycBody : t.commercial.nyPageBody;

  return (
    <div className="mt-10 grid gap-10">
      <SectionHeader eyebrow={t.commercial.nyEyebrow} title={title} body={body} headingLevel={1} />
      <section aria-labelledby="boroughs-heading">
        <h2 id="boroughs-heading" className="text-xl font-bold">
          {t.commercial.boroughsLabel}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {nyBoroughs.map((borough) => (
            <li key={borough.id} className="surface-2 px-4 py-2 font-bold">
              {borough.name[locale]}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="payer-directory-heading">
        <h2 id="payer-directory-heading" className="text-xl font-bold">
          {t.commercial.nyDirectoryTitle}
        </h2>
        <p className="muted mt-2 text-sm">{t.commercial.nyNoContract}</p>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {nyPayers.map((payer) => (
            <li key={payer.id} className="surface p-5">
              <p className="eyebrow">{programLabel(payer.programType, locale)}</p>
              <h3 className="mt-2 text-lg font-bold">{payer.name}</h3>
              <p className="muted mt-2 text-sm">
                {t.commercial.lastReviewed}: {payer.lastReviewed}
              </p>
              <p className="mt-3 text-sm">
                <span className="muted">{t.commercial.source}: </span>
                <a className="underline" href={payer.sourceUrl} rel="noreferrer">
                  {payer.sourceLabel[locale]}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>
      <p className="muted text-sm">
        {t.commercial.nyNoOffice} {nyMarketMeta.noOfficeClaim ? t.commercial.nyNoOfficeConfirm : ''}
      </p>
    </div>
  );
}
