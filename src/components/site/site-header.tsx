import Link from 'next/link';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { PrimaryNav } from './primary-nav';
import { ThemeToggle } from './theme-toggle';
import { SiteBrand } from './site-brand';

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return (
    <header className="site-header" data-node-id="4:3">
      <div className="hidden border-b border-[var(--border)] bg-[var(--surface-2)] py-1.5 text-[11px] text-[var(--muted)] md:block">
        <div className="page-width flex items-center justify-between gap-4">
          <span className="font-semibold">{locale === 'es' ? 'Para consultorios independientes de EE. UU.' : 'Built for independent US healthcare practices'}</span>
          <div className="flex items-center gap-3">
            <a href="tel:+13024965648" className="hover:text-[var(--cyan)]">+1 (302) 496-5648</a>
            <span aria-hidden="true">·</span>
            <Link href={localizedPath(locale, '/consultation')} className="font-semibold hover:text-[var(--cyan)]">{locale === 'es' ? 'Contactar a ROOT' : 'Contact ROOT'} ↗</Link>
          </div>
        </div>
      </div>
      <div className="page-width relative flex items-center justify-between gap-3 py-4">
        <Link href={localizedPath(locale)} className="shrink-0 rounded-lg focus-visible:outline-offset-4" aria-label={t.brand}>
          <SiteBrand locale={locale} />
        </Link>
        <PrimaryNav locale={locale} />
        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <ThemeToggle locale={locale} />
          <LocaleSwitcher locale={locale} />
          <span className="hidden sm:inline-flex">
            <Link className="btn-ghost" href={localizedPath(locale, '/sign-in')}>
              {t.nav.signIn}
            </Link>
          </span>
          <span className="hidden lg:inline-flex max-xl:hidden">
            <Link className="btn-ghost font-bold text-[var(--cyan)]" href={localizedPath(locale, '/consultation')}>
              {t.nav.consultation} →
            </Link>
          </span>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
