'use client';

import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

export function ThemeToggle({ locale }: { locale: Locale }) {
  const t = copy(locale);

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('root-theme', next);
  }

  return (
    <button type="button" className="btn-ghost" onClick={toggle} aria-label={t.theme.toggle}>
      {t.theme.short}
    </button>
  );
}
