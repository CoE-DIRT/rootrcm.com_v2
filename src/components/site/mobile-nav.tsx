'use client';

import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '@/i18n/locales';
import { copy } from '@/content/messages';
import { localizedPath, publicNav } from '@/lib/paths';
import { rootMegaMenus } from './primary-nav';

export function MobileNav({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !open) return;
      setOpen(false);
      setExpanded(null);
      toggleRef.current?.focus();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const es = locale === 'es';
  function close() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div className="xl:hidden">
      <button
        ref={toggleRef}
        type="button"
        className="btn-ghost flex min-h-11 min-w-11 items-center justify-center"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-6" aria-hidden="true"/> : <Menu className="size-6" aria-hidden="true"/>}
      </button>
      {open && (
        <nav
          id={panelId}
          className="absolute inset-x-2 top-full z-40 max-h-[min(76dvh,680px)] overflow-y-auto overscroll-contain rounded-b-[22px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_25px_75px_rgba(3,16,33,.3)] backdrop-blur-xl"
          aria-label={es ? 'Navegación principal' : 'Primary navigation'}
          data-testid="root-mobile-mega-menu"
        >
          {publicNav.map((item, index) => {
            const menu = rootMegaMenus.find((m) => m.key === item.key);
            if (!menu) return null;
            const active = expanded === index;
            return (
              <div key={item.href} className="border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-1">
                  <Link href={localizedPath(locale, item.href)} onClick={close} className="min-h-12 flex-1 rounded-xl px-3 py-3 text-sm font-bold hover:bg-[var(--surface-2)]">{t.nav[item.key]}</Link>
                  <button
                    type="button"
                    aria-label={es ? `Opciones de ${t.nav[item.key]}` : `Show ${t.nav[item.key]} options`}
                    aria-expanded={active}
                    aria-controls={`${panelId}-group-${index}`}
                    onClick={() => setExpanded(active ? null : index)}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-[var(--surface-2)]">
                    <ChevronDown className={`size-4 transition-transform ${active ? 'rotate-180' : ''}`} aria-hidden="true"/>
                  </button>
                </div>
                {active && (
                  <div id={`${panelId}-group-${index}`} className="mb-3 grid gap-1 rounded-xl bg-[var(--surface-2)] px-2 py-2">
                    {menu.links.map((child) => (
                      <Link key={child.path} href={localizedPath(locale, child.path)} onClick={close} className="min-h-11 rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface)]">
                        <span className="block font-semibold">{es ? child.es : child.en}</span>
                        <span className="muted block text-xs">{es ? child.hintEs : child.hintEn}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="mt-4 grid gap-2">
            <Link href={localizedPath(locale, '/sign-in')} className="btn-secondary" onClick={close}>{t.nav.signIn}</Link>
            <Link href={localizedPath(locale, '/consultation')} className="btn-primary" onClick={close}>{t.nav.consultation} →</Link>
          </div>
        </nav>
      )}
    </div>
  );
}
