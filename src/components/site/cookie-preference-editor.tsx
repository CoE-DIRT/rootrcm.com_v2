'use client';

import { useSyncExternalStore } from 'react';
import { copy } from '@/content/messages';
import {
  cookiePreferencePersistence,
  cookiePreferencesSnapshot,
  necessaryOnlyPreferences,
  subscribeCookiePreferences,
  updateCookiePreferences,
} from '@/domain/cookie-preferences';
import type { Locale } from '@/i18n/locales';
import { Button } from '@/components/ui/Button';

const serverPreferences = necessaryOnlyPreferences('1970-01-01T00:00:00.000Z');

export function CookiePreferenceEditor({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const record = useSyncExternalStore(
    subscribeCookiePreferences,
    cookiePreferencesSnapshot,
    () => serverPreferences,
  );
  const memoryOnly = useSyncExternalStore(
    subscribeCookiePreferences,
    () => cookiePreferencePersistence() === 'memory',
    () => false,
  );

  return (
    <form
      className="surface mt-8 grid max-w-xl gap-4 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        updateCookiePreferences({ analytics: record.analytics, marketing: record.marketing });
      }}
    >
      <p className="text-sm">{t.legal.cookiesNecessary}</p>
      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={record.analytics}
          onChange={(event) => updateCookiePreferences({ analytics: event.target.checked })}
        />
        {t.legal.cookiesAnalytics}
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={record.marketing}
          onChange={(event) => updateCookiePreferences({ marketing: event.target.checked })}
        />
        {t.legal.cookiesMarketing}
      </label>
      <Button variant="secondary" type="submit">
        {t.legal.cookiesSave}
      </Button>
      {memoryOnly ? <p className="text-sm">{t.legal.cookiesMemory}</p> : null}
    </form>
  );
}
