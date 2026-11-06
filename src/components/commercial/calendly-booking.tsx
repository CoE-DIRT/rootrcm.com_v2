'use client';

import { useState } from 'react';
import { ArrowUpRight, CalendarDays, Phone, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/locales';

const bookingUrl = 'https://calendly.com/rootrcm-info/30min';

export function CalendlyBooking({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const openCalendar = () => {
    const url = new URL(bookingUrl);
    url.searchParams.set('embed_domain', window.location.hostname);
    url.searchParams.set('embed_type', 'Inline');
    setCalendarUrl(url.toString());
    setLoaded(false);
  };

  return (
    <section id="book" className="booking-panel surface scroll-mt-24" aria-labelledby="booking-heading" data-testid="root-calendly-booking">
      <div className="booking-panel__layout">
        <div className="booking-panel__intro">
          <p className="eyebrow">{es ? 'Hable con ROOT' : 'Talk with ROOT'}</p>
          <h2 id="booking-heading" className="text-balance text-[clamp(1.65rem,2.1vw,2.5rem)] font-bold leading-tight">
            {es ? 'Conversemos sobre sus ingresos.' : 'Let’s talk about your revenue.'}
          </h2>
          <p className="booking-panel__description">
            {es ? 'Reserve 30 minutos para revisar sus prioridades y definir los siguientes pasos.' : 'Book 30 minutes to discuss priorities and clear next steps.'}
          </p>
          <div className="booking-panel__features">
            <span><Clock3 size={17} aria-hidden="true" />{es ? '30 minutos' : '30 minutes'}</span>
            <span><CalendarDays size={17} aria-hidden="true" />{es ? 'Elija su horario' : 'Choose your time'}</span>
          </div>
          <Button href="tel:+13024965648" variant="secondary" leftIcon={<Phone size={17} aria-hidden="true" />}>
            {es ? 'Llamar a ROOT' : 'Call ROOT'}
          </Button>
        </div>

        <div className="booking-panel__scheduler">
          {!calendarUrl ? (
            <div className="booking-panel__start">
              <CalendarDays aria-hidden="true" size={34} strokeWidth={1.5} />
              <h3>{es ? 'Su consulta comienza aquí' : 'Your consultation starts here'}</h3>
              <Button type="button" variant="primary" size="lg" onClick={openCalendar} aria-controls="root-calendly-frame">
                {es ? 'Ver horarios disponibles' : 'View available times'}
              </Button>
              <Button href={bookingUrl} target="_blank" rel="noopener noreferrer" variant="link" rightIcon={<ArrowUpRight size={17} aria-hidden="true" />}>
                {es ? 'Abrir calendario' : 'Open calendar'}
              </Button>
            </div>
          ) : (
            <div className="booking-panel__frame">
              {!loaded ? <p className="booking-panel__loading" role="status">{es ? 'Cargando horarios…' : 'Loading availability…'}</p> : null}
              <iframe
                id="root-calendly-frame"
                src={calendarUrl}
                title={es ? 'Reservas de ROOT en Calendly' : 'ROOT Calendly bookings'}
                width="100%"
                height="660"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full border-0"
                onLoad={() => setLoaded(true)}
              />
              <Button href={bookingUrl} target="_blank" rel="noopener noreferrer" variant="link">
                {es ? 'Abrir en Calendly' : 'Open in Calendly'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
