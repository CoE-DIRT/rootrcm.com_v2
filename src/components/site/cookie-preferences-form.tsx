'use client';

import { useState, type FormEvent } from 'react';
import { useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBanner } from '@/components/ui/status';
import { copy } from '@/content/messages';
import {
  cookiePreferencesServerSnapshot,
  isAnalyticsRuntimeEnabled,
  isMarketingRuntimeEnabled,
  readCookiePreferences,
  subscribeCookiePreferences,
  writeCookiePreferences,
} from '@/domain/cookie-preferences';
import type { Locale } from '@/i18n/locales';

export function CookiePreferencesForm({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const stored = useSyncExternalStore(
    subscribeCookiePreferences,
    readCookiePreferences,
    cookiePreferencesServerSnapshot,
  );
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);
  const analyticsValue = touched ? analytics : Boolean(stored?.analytics);
  const marketingValue = touched ? marketing : Boolean(stored?.marketing);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    writeCookiePreferences({
      v: 1,
      necessary: true,
      analytics: analyticsValue,
      marketing: marketingValue,
      decidedAt: new Date().toISOString(),
    });
    setSaved(true);
  }

  return (
    <form
      className="surface mt-8 grid max-w-xl gap-4 p-6"
      onSubmit={onSubmit}
      data-testid="cookie-preferences-form"
    >
      <fieldset className="grid gap-2 rounded-xl bg-[var(--surface-2)] p-4">
        <legend className="font-bold">{t.legal.cookiesNecessary}</legend>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked disabled className="mt-1" />
          <span>
            {t.legal.cookiesAlwaysOn}. {t.legal.cookiesNecessaryBody}
          </span>
        </label>
      </fieldset>
      <fieldset className="grid gap-2 rounded-xl bg-[var(--surface-2)] p-4">
        <legend className="font-bold">{t.legal.cookiesAnalytics}</legend>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="analytics"
            checked={analyticsValue}
            onChange={(event) => {
              setTouched(true);
              setAnalytics(event.target.checked);
            }}
            className="mt-1"
          />
          <span>{t.legal.cookiesAnalyticsBody}</span>
        </label>
      </fieldset>
      <fieldset className="grid gap-2 rounded-xl bg-[var(--surface-2)] p-4">
        <legend className="font-bold">{t.legal.cookiesMarketing}</legend>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="marketing"
            checked={marketingValue}
            onChange={(event) => {
              setTouched(true);
              setMarketing(event.target.checked);
            }}
            className="mt-1"
          />
          <span>{t.legal.cookiesMarketingBody}</span>
        </label>
      </fieldset>
      <p className="muted text-sm">{t.legal.cookiesRuntimeOff}</p>
      <p className="muted text-xs" data-testid="cookie-runtime-status">
        analytics={String(isAnalyticsRuntimeEnabled(stored))} · marketing=
        {String(isMarketingRuntimeEnabled(stored))}
      </p>
      <Button type="submit">{t.legal.cookiesSave}</Button>
      {saved ? <StatusBanner tone="warning">{t.legal.cookiesSaved}</StatusBanner> : null}
    </form>
  );
}
