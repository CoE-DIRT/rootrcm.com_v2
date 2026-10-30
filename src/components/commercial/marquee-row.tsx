'use client';

import { useId, useState } from 'react';
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

export function MarqueeRow({ row, locale }: { row: PlatformRow; locale: Locale }) {
  const t = copy(locale);
  const items = platformsInRow(row);
  const heading = platformRows.find((item) => item.id === row);
  const label = heading ? heading.heading[locale] : row;
  const listId = `marquee-list-${row}`;
  const pauseId = useId();
  const [paused, setPaused] = useState(false);

  return (
    <div className="marquee-row">
      <div className="marquee-controls">
        <p className="eyebrow">{label}</p>
        <button
          type="button"
          id={pauseId}
          className="btn-ghost marquee-pause"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? t.commercial.marqueePlay : t.commercial.marqueePause}
        </button>
      </div>
      <div
        className="marquee-viewport"
        tabIndex={0}
        aria-hidden="true"
        data-marquee=""
        data-row={row}
      >
        <div className={`marquee-track${paused ? ' is-paused' : ''}`} data-marquee-track="">
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
