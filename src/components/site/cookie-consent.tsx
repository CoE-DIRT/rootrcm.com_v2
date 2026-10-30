'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { copy } from '@/content/messages';
import {
  acceptAllPreferences,
  clientReadyServerSnapshot,
  clientReadySnapshot,
  cookiePreferencesServerSnapshot,
  isAnalyticsRuntimeEnabled,
  isMarketingRuntimeEnabled,
  necessaryOnlyPreferences,
  readCookiePreferences,
  subscribeClientReady,
  subscribeCookiePreferences,
  writeCookiePreferences,
  type CookiePreferenceRecord,
} from '@/domain/cookie-preferences';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function CookieConsent({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const ready = useSyncExternalStore(subscribeClientReady, clientReadySnapshot, clientReadyServerSnapshot);
  const preferences = useSyncExternalStore(
    subscribeCookiePreferences,
    readCookiePreferences,
    cookiePreferencesServerSnapshot,
  );

  if (!ready || preferences?.decidedAt) return null;

  function save(next: CookiePreferenceRecord) {
    writeCookiePreferences(next);
    void isAnalyticsRuntimeEnabled(next);
    void isMarketingRuntimeEnabled(next);
  }

  return (
    <div
      className="fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-3 z-[50] w-[min(420px,calc(100vw-96px))] rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--text)] shadow-[var(--shadow)]"
      role="region"
      aria-labelledby="cookie-consent-title"
      data-testid="cookie-consent-banner"
    >
      <h2 id="cookie-consent-title" className="text-base font-extrabold">
        {t.legal.cookiesBannerTitle}
      </h2>
      <p className="muted mt-2 text-sm">{t.legal.cookiesBannerBody}</p>
      <p className="muted mt-2 text-xs">{t.legal.cookiesRuntimeOff}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => save(necessaryOnlyPreferences())}>
          {t.legal.cookiesNecessaryOnly}
        </button>
        <button type="button" className="btn-secondary" onClick={() => save(acceptAllPreferences())}>
          {t.legal.cookiesAcceptAll}
        </button>
        <Link className="btn-ghost" href={localizedPath(locale, '/cookies')}>
          {t.legal.cookiesCustomize}
        </Link>
      </div>
    </div>
  );
}
