'use client';

import { useSyncExternalStore } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

type ThemeMode = 'dark' | 'light';

function readTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function subscribe(onStoreChange: () => void) {
  if (typeof document === 'undefined') return () => undefined;
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('storage', onStoreChange);
  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStoreChange);
  };
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'dark' as ThemeMode);

  function toggle() {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('root-theme', next);
    } catch {
      /* private mode */
    }
  }

  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={toggle}
      aria-label={t.theme.toggle}
      aria-pressed={theme === 'light'}
      data-testid="theme-toggle"
    >
      {theme === 'dark' ? t.theme.light : t.theme.dark}
    </button>
  );
}
