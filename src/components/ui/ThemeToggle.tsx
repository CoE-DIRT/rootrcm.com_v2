'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { IconButton } from './IconButton';

export type ThemeToggleProps = { locale: Locale };

/** Both icons render; CSS shows the one matching [data-theme] so SSR and client markup match. */
export function ThemeToggle({ locale }: ThemeToggleProps) {
  const t = copy(locale);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setIsLight(document.documentElement.getAttribute('data-theme') === 'light'), 0);
    return () => window.clearTimeout(id);
  }, []);

  function toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('root-theme', next);
    } catch {
      /* storage unavailable: theme applies to this tab only */
    }
    setIsLight(next === 'light');
  }

  return (
    <span className="ui-theme-toggle">
      <IconButton
        aria-label={t.theme.toggle}
        aria-pressed={isLight}
        onClick={toggle}
        icon={
          <>
            <Sun className="ui-theme-toggle__sun" size={20} strokeWidth={1.75} aria-hidden="true" />
            <Moon className="ui-theme-toggle__moon" size={20} strokeWidth={1.75} aria-hidden="true" />
          </>
        }
      />
    </span>
  );
}
