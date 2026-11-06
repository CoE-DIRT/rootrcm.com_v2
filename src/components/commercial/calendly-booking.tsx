'use client';

import { useState } from 'react';
import { CalendarDays, ExternalLink, Phone } from 'lucide-react';
import type { Locale } from '@/i18n/locales';

const bookingUrl = 'https://calendly.com/rootrcm-info/30min';
const phone = 'tel:+13024965648';

export function CalendlyBooking({ locale }: { locale: Locale }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const es = locale === 'es';

  function revealCalendar() {
    // Only load Calendly after a visitor intentionally requests the calendar.
    // The third party does not receive a request merely because the page rendered.
    const url = new URL(bookingUrl);
    url.searchParams.set('embed_domain', window.location.hostname);
    url.searchParams.set('embed_type', 'Inline');
    setEmbedUrl(url.toString());
  }

  return (
    <section
      id="book"
      aria-labelledby="root-booking-heading"
      className="scroll-mt-28 overflow-hidden rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-8"
      data-testid="root-calendly-booking"
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="eyebrow">{es ? 'Reserve una consulta' : 'Book a consultation'}</p>
          <h2 id="root-booking-heading" className="mt-3 text-balance text-2xl font-extrabold tracking-tight md:text-3xl">
            {es ? 'Elija un horario que le convenga.' : 'Choose a time that works for you.'}
          </h2>
          <p className="muted mt-3 max-w-2xl text-sm leading-7 sm:text-base">
            {es
              ? 'Agende una conversación inicial gratuita de 30 minutos. No incluya información de pacientes ni datos clínicos en su reserva.'
              : 'Schedule a free 30-minute introductory conversation. Do not include patient details or clinical information in your booking.'}
          </p>
        </div>
        <a
          href={phone}
          className="btn-secondary inline-flex items-center justify-center"
          data-testid="root-call-cta"
        >
          <Phone aria-hidden="true" className="size-4" />
          {es ? 'Llamar: +1 (302) 496-5648' : 'Call: +1 (302) 496-5648'}
        </a>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-primary btn-lg"
          onClick={revealCalendar}
          aria-expanded={Boolean(embedUrl)}
          aria-controls="root-calendly-frame"
        >
          <CalendarDays aria-hidden="true" className="size-5" />
          {es ? 'Mostrar horarios disponibles' : 'Show available times'}
        </button>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          {es ? 'Abrir Calendly' : 'Open Calendly'}
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </div>

      {embedUrl ? (
        <div className="mt-7 overflow-hidden rounded-[18px] border border-[var(--border)] bg-white">
          <iframe
            id="root-calendly-frame"
            title={es ? 'Calendario de consultas ROOT' : 'ROOT consultation calendar'}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-[740px] w-full border-0 sm:h-[780px]"
          />
        </div>
      ) : (
        <p id="root-calendly-frame" className="muted mt-5 text-xs">
          {es
            ? 'El calendario se carga al seleccionar «Mostrar horarios disponibles». Calendly procesará la información de reserva conforme a su política de privacidad.'
            : 'The calendar loads only when you select “Show available times.” Calendly processes booking information under its privacy policy.'}
        </p>
      )}
    </section>
  );
}
