import { SectionHeader } from '@/components/commercial/section-header';
import { copy } from '@/content/messages';
import { platformRows, platformsInRow, type Platform, type PlatformRow } from '@/content/ecosystem';
import type { Locale } from '@/i18n/locales';

function Tile({ platform }: { platform: Platform }) {
  const initials = platform.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <li className="ecosystem-tile">
      <span className="ecosystem-glyph" aria-hidden="true">
        {initials}
      </span>
      <strong>{platform.name}</strong>
    </li>
  );
}

function MarqueeRow({ row, locale }: { row: PlatformRow; locale: Locale }) {
  const t = copy(locale);
  const items = platformsInRow(row);
  const heading = platformRows.find((item) => item.id === row);
  const label = heading ? heading.heading[locale] : row;
  const listId = `marquee-list-${row}`;

  return (
    <div className="marquee-row">
      <p className="eyebrow">{label}</p>
      <div className="marquee-viewport" tabIndex={0} aria-hidden="true" data-row={row}>
        <div className="marquee-track">
          <ul className="marquee-group">
            {items.map((platform) => (
              <Tile key={`${platform.id}-a`} platform={platform} />
            ))}
          </ul>
          <ul className="marquee-group">
            {items.map((platform) => (
              <Tile key={`${platform.id}-b`} platform={platform} />
            ))}
          </ul>
        </div>
      </div>
      <ul id={listId} className="marquee-static-list">
        {items.map((platform) => (
          <Tile key={platform.id} platform={platform} />
        ))}
      </ul>
      <p className="sr-only">
        {label}: {items.map((platform) => platform.name).join(', ')}.{' '}
        {t.commercial.ecosystemDisclaimer}
      </p>
    </div>
  );
}

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
