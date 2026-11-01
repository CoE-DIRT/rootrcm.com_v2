import Link from 'next/link';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { PrimaryNav } from './primary-nav';
import { SiteBrand } from './site-brand';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return (
    <header className="site-header glass" data-node-id="4:3">
      <div className="hidden border-b border-[var(--border)] md:block">
        <div className="page-width flex items-center justify-between gap-4 py-1.5 text-[11px] text-[var(--muted)]">
          <p>
            <span className="font-semibold text-[var(--text)]">{t.nav.emergency}</span>
          </p>
          <div className="flex items-center gap-3">
            <a href="tel:+13024965648" className="font-semibold hover:text-[var(--cyan)]">
              +1 (302) 496-5648
            </a>
            <ThemeToggle locale={locale} />
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      </div>
      <div className="page-width site-header-bar relative flex items-center justify-between gap-3">
        <Link href={localizedPath(locale)} className="shrink-0 rounded-lg focus-visible:outline-offset-4" aria-label={t.brand}>
          <SiteBrand locale={locale} />
        </Link>
        <PrimaryNav locale={locale} />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 md:hidden">
            <ThemeToggle locale={locale} />
            <LocaleSwitcher locale={locale} />
          </span>
          <span className="hidden sm:inline-flex">
            <Link className="btn-ghost" href={localizedPath(locale, '/sign-in')}>
              {t.nav.signIn}
            </Link>
          </span>
          <span className="hidden items-center gap-2 lg:inline-flex">
            <Link className="btn-primary btn-sm" href={localizedPath(locale, '/portal')}>
              {t.nav.clientPortal}
            </Link>
            <Link className="btn-secondary btn-sm" href={localizedPath(locale, '/consultation')}>
              {t.nav.freeConsultation}
            </Link>
          </span>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
