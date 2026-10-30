'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath, publicNav } from '@/lib/paths';

export function MobileNav({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="btn-ghost text-2xl"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? '×' : '☰'}
      </button>
      {open ? (
        <nav
          id={panelId}
          className="surface absolute inset-x-4 top-16 z-20 flex flex-col gap-3 p-5"
          aria-label={t.workspace.primaryNav}
        >
          {publicNav.map((item) => (
            <Link key={item.href} href={localizedPath(locale, item.href)} onClick={() => setOpen(false)}>
              {t.nav[item.key]}
            </Link>
          ))}
          <Link href={localizedPath(locale, '/sign-in')} onClick={() => setOpen(false)}>
            {t.nav.signIn}
          </Link>
          <Link
            className="btn-primary"
            href={localizedPath(locale, '/consultation')}
            onClick={() => setOpen(false)}
          >
            {t.nav.consultation} →
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
