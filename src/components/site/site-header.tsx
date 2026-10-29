import Link from 'next/link';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath, publicNav } from '@/lib/paths';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy(locale);
  return (
    <header className="site-header" data-node-id="4:3">
      <div className="page-width relative flex items-center justify-between gap-4 py-5">
        <Link href={localizedPath(locale)} className="text-[30px] font-extrabold tracking-tight">
          {t.brand}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-5 text-sm lg:flex">
          {publicNav.map((item) => (
            <Link key={item.href} className="muted hover:text-[var(--text)]" href={localizedPath(locale, item.href)}>
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle locale={locale} />
          <LocaleSwitcher locale={locale} />
          <Link className="btn-ghost hidden sm:inline-flex" href={localizedPath(locale, '/sign-in')}>
            {t.nav.signIn}
          </Link>
          <Link className="btn-ghost hidden font-bold text-[var(--cyan)] lg:inline-flex" href={localizedPath(locale, '/consultation')}>
            {t.nav.consultation} →
          </Link>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
