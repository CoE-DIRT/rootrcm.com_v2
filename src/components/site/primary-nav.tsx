'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath, publicNav } from '@/lib/paths';

export function PrimaryNav({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const pathname = usePathname() || `/${locale}`;
  return (
    <nav aria-label="Primary" className="hidden items-center gap-5 text-sm lg:flex">
      {publicNav.map((item) => {
        const href = localizedPath(locale, item.href);
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={item.href}
            className="muted hover:text-[var(--text)]"
            href={href}
            aria-current={active ? 'page' : undefined}
          >
            {t.nav[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
