import Link from 'next/link';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const links = [
    { href: '/privacy', label: t.footer.privacy },
    { href: '/terms', label: t.footer.terms },
    { href: '/cookies', label: t.footer.cookies },
    { href: '/resources', label: t.footer.resources },
    { href: '/consultation', label: t.footer.contact },
  ];
  return (
    <footer className="page-width py-10 text-sm" data-node-id="4:39">
      <p className="muted">
        {t.brand} · {t.footer.notice} · {links.map((link) => link.label).join(' · ')}
      </p>
      <nav aria-label="Footer" className="mt-4 flex flex-wrap gap-4">
        {links.map((link) => (
          <Link key={link.href} href={localizedPath(locale, link.href)}>
            {link.label}
          </Link>
        ))}
        <Link href={localizedPath(locale, '/preview/client')}>{t.preview}</Link>
      </nav>
      <p className="muted mt-4">
        {t.footer.copyright} {t.footer.noPhi}
      </p>
    </footer>
  );
}
