'use client';

import Link from 'next/link';
import { Calendar, Phone } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function MobileConversionDock({ locale }: { locale: Locale }) {
  const es = locale === 'es';

  return (
    <aside
      className="mobile-dock md:hidden"
      aria-label={es ? 'Acciones rápidas móviles' : 'Mobile quick actions'}
      data-testid="mobile-conversion-dock"
    >
      <div className="flex items-center gap-2">
        <a
          href="tel:+13024965648"
          className="btn-secondary flex-1 text-xs font-bold"
          aria-label={es ? 'Llamar a ROOT: +1 (302) 496-5648' : 'Call ROOT: +1 (302) 496-5648'}
        >
          <Phone className="size-3.5 shrink-0 text-[var(--cyan)]" aria-hidden="true" />
          <span>{es ? 'Llamar' : 'Call'}</span>
        </a>
        <Link
          href={localizedPath(locale, '/consultation#book')}
          className="btn-primary flex-[2] text-xs font-bold shadow-[0_4px_16px_rgba(17,225,238,0.25)]"
        >
          <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{es ? 'Reservar consulta' : 'Book consultation'}</span>
        </Link>
      </div>
    </aside>
  );
}
