import { Calendar, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function MobileConversionDock({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  return (
    <aside className="mobile-dock" aria-label={es ? 'Acciones rápidas' : 'Quick actions'} data-testid="mobile-conversion-dock">
      <Button
        href="tel:+13024965648"
        variant="secondary"
        size="md"
        fullWidth
        aria-label={es ? 'Llamar a ROOT: +1 (302) 496-5648' : 'Call ROOT: +1 (302) 496-5648'}
        leftIcon={<Phone size={20} strokeWidth={1.75} aria-hidden="true" />}
      >
        {es ? 'Llamar' : 'Call'}
      </Button>
      <Button href={localizedPath(locale, '/consultation#book')} variant="primary" size="md" fullWidth leftIcon={<Calendar size={20} strokeWidth={1.75} aria-hidden="true" />}>
        {es ? 'Reservar consulta' : 'Book consultation'}
      </Button>
    </aside>
  );
}
