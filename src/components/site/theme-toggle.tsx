'use client';

import { SunMoon } from 'lucide-react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

/** Compact, accessible light/dark control shared by desktop and mobile chrome. */
export function ThemeToggle({ locale }: { locale: Locale }) {
  const t = copy(locale);

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('root-theme', next);
    } catch {
      // A blocked storage API must never prevent the visual theme switch.
    }
  }

  return (
    <button
      type="button"
      className="btn-ghost group inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 shadow-sm transition-[border-color,background-color,transform] duration-200 hover:border-[var(--cyan)] hover:-translate-y-0.5 focus-visible:outline-offset-4 motion-reduce:transform-none"
      onClick={toggle}
      aria-label={t.theme.toggle}
      title={t.theme.toggle}
      data-testid="root-theme-switch"
    >
      <SunMoon aria-hidden="true" className="size-4 shrink-0 transition-transform duration-300 group-hover:rotate-12 motion-reduce:transform-none" />
      <span className="text-xs font-extrabold tracking-wide">{t.theme.short}</span>
    </button>
  );
}
