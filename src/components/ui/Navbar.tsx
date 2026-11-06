'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogIn, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

export type NavbarProps = { locale: Locale };

export const navLinks = [
  { path: '/why-root', en: 'Why ROOT', es: 'Por qué ROOT' },
  { path: '/services', en: 'Services', es: 'Servicios' },
  { path: '/specialties', en: 'Specialties', es: 'Especialidades' },
  { path: '/technology', en: 'Technology', es: 'Tecnología' },
  { path: '/plans', en: 'Pricing', es: 'Precios' },
  { path: '/faq', en: 'FAQ', es: 'Preguntas' },
] as const;

export function Brand({ locale }: { locale: Locale }) {
  return (
    <span className="ui-brand" data-testid="root-brand-lockup">
      <Image
        src="/brand/mark.webp"
        width={250}
        height={243}
        alt=""
        aria-hidden="true"
        className="ui-brand__mark"
        priority
      />
      <span className="ui-brand__word">
        ROOT<span className="ui-brand__dot">.</span>
      </span>
      <span className="sr-only">
        {locale === 'es' ? 'Operaciones y resultados de ingresos' : 'Revenue operations & outcomes'}
      </span>
    </span>
  );
}

export function Navbar({ locale }: NavbarProps) {
  const t = copy(locale);
  const es = locale === 'es';
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const drawerId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const cta = es ? 'Revisión gratuita' : 'Free revenue review';
  const ctaHref = localizedPath(locale, '/diagnostic');

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Body scroll lock + ESC close + focus first link while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const first = drawerRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }
    function onResize() {
      if (window.matchMedia('(min-width: 1024px)').matches) close(false);
    }
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open, close]);

  // Desktop: hide on scroll down past 80px, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const desktop = window.matchMedia('(min-width: 1024px)');
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (!desktop.matches || y < 80) setHidden(false);
        else if (y > last + 4) setHidden(true);
        else if (y < last - 4) setHidden(false);
        last = y;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const isActive = (path: string) => {
    const href = localizedPath(locale, path);
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className="ui-nav"
        data-hidden={hidden && !open ? 'true' : undefined}
        data-open={open ? 'true' : undefined}
        data-node-id="4:3"
      >
        <div className="ui-nav__bar">
          <Link
            href={localizedPath(locale)}
            className="ui-nav__logo"
            aria-label={es ? 'ROOT — inicio' : 'ROOT — home'}
          >
            <Brand locale={locale} />
          </Link>

          <nav
            aria-label={es ? 'Principal' : 'Primary'}
            className="ui-nav__links"
            data-testid="root-primary-nav"
          >
            <ul>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={localizedPath(locale, link.path)}
                    className="ui-nav__link"
                    aria-current={isActive(link.path) ? 'page' : undefined}
                  >
                    {es ? link.es : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ui-nav__cluster">
            <span className="ui-nav__login">
              <Button
                href={localizedPath(locale, '/login')}
                variant="ghost"
                size="md"
                leftIcon={<LogIn size={20} strokeWidth={1.75} aria-hidden="true" />}
              >
                {es ? 'Acceder' : 'Log in'}
              </Button>
            </span>
            <ThemeToggle locale={locale} />
            <LanguageToggle locale={locale} />
            <span className="ui-nav__cta">
              <Button href={ctaHref} variant="primary" size="md">
                {cta}
              </Button>
            </span>
            <span className="ui-nav__menu">
              <IconButton
                ref={toggleRef}
                aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
                aria-expanded={open}
                aria-controls={drawerId}
                onClick={() => (open ? close() : setOpen(true))}
                icon={
                  open ? (
                    <X size={20} strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
                  )
                }
              />
            </span>
          </div>
        </div>
      </header>

      <div
        id={drawerId}
        ref={drawerRef}
        className="ui-drawer"
        data-open={open ? 'true' : undefined}
        hidden={!open}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        data-testid="root-mobile-drawer"
      >
        <nav aria-label={es ? 'Menú móvil' : 'Mobile menu'} className="ui-drawer__nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={localizedPath(locale, link.path)}
                  className="ui-drawer__link"
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  onClick={() => close(false)}
                >
                  {es ? link.es : link.en}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={localizedPath(locale, '/contact')}
                className="ui-drawer__link"
                onClick={() => close(false)}
              >
                {es ? 'Contacto' : 'Contact'}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="ui-drawer__footer">
          <Button href={ctaHref} variant="primary" size="lg" fullWidth onClick={() => close(false)}>
            {cta}
          </Button>
          <Button
            href={localizedPath(locale, '/consultation#book')}
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => close(false)}
          >
            {es ? 'Reservar una consulta' : 'Book a consultation'}
          </Button>
        </div>
      </div>
    </>
  );
}
