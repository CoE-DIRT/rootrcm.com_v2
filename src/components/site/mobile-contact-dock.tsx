import Link from 'next/link';
import { CalendarDays, Phone } from 'lucide-react';
import { localizedPath } from '@/lib/paths';
import type { Locale } from '@/i18n/locales';

/** Public-home mobile conversion dock; never mounted in authenticated workspaces. */
export function MobileContactDock({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  return (
    <nav
      aria-label={es ? 'Contacto rápido de ROOT' : 'ROOT quick contact'}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 pt-2 shadow-[0_-12px_35px_rgba(0,0,0,0.15)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      data-testid="root-mobile-contact-dock"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <Link
          href={localizedPath(locale, '/consultation') + '#book'}
          className="btn-primary min-w-0 justify-center px-2 text-sm"
        >
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          <span>{es ? 'Agendar' : 'Book a time'}</span>
        </Link>
        <a href="tel:+13024965648" className="btn-secondary min-w-0 justify-center px-2 text-sm">
          <Phone className="size-4 shrink-0" aria-hidden="true" />
          <span>{es ? 'Llamar' : 'Call ROOT'}</span>
        </a>
      </div>
    </nav>
  );
}
