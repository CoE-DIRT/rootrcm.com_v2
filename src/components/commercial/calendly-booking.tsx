'use client';

import { useState } from 'react';
import { Calendar, Phone, ArrowUpRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/locales';

export function CalendlyBooking({ locale }: { locale: Locale }) {
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  const es = locale === 'es';

  function showCalendar() {
    const url = new URL('https://calendly.com/rootrcm-info/30min');
    url.searchParams.set('embed_domain', window.location.hostname);
    url.searchParams.set('embed_type', 'Inline');
    setCalendarUrl(url.toString());
    setFrameLoaded(false);
  }

  return (
    <section
      id="book"
      className="surface relative mt-12 overflow-hidden p-6 sm:p-8 md:p-10 shadow-[var(--shadow)] scroll-mt-24"
      aria-label={es ? 'Programar consulta con ROOT' : 'Schedule consultation with ROOT'}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[var(--cyan)] opacity-[0.07] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 size-72 rounded-full bg-[var(--blue)] opacity-[0.07] blur-3xl" aria-hidden="true" />

      <div className="relative z-[1] max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">{es ? 'CONSULTA DIRECTA' : 'DIRECT CONSULTATION'}</span>
          <span className="badge-resolved">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {es ? '30 minutos · Sin compromiso' : '30 min · No commitment'}
          </span>
        </div>

        <h2 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl">
          {es ? 'Reserve una sesión con un especialista de ingresos' : 'Book a strategy session with a revenue specialist'}
        </h2>
        <p className="muted mt-3 text-base leading-relaxed">
          {es
            ? 'Analizaremos su combinación de pagadores, puntos ciegos en denegaciones y compatibilidad con su EHR actual. Sin ventas agresivas, solo una evaluación clara.'
            : 'We’ll review your payer mix, denial bottlenecks, and compatibility with your current EHR. No forced software migration, just an objective operational review.'}
        </p>

        {/* Value Points */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="surface-2 flex items-start gap-3 p-4">
            <Clock className="mt-0.5 size-4 shrink-0 text-[var(--cyan)]" aria-hidden="true" />
            <div className="text-xs">
              <p className="font-bold text-[var(--text)]">{es ? '30 minutos dedicados' : '30-minute review'}</p>
              <p className="muted mt-0.5">{es ? 'Enfoque en su especialidad' : 'Focused on your specialty'}</p>
            </div>
          </div>
          <div className="surface-2 flex items-start gap-3 p-4">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--cyan)]" aria-hidden="true" />
            <div className="text-xs">
              <p className="font-bold text-[var(--text)]">{es ? 'Sin datos de pacientes' : 'Zero PHI required'}</p>
              <p className="muted mt-0.5">{es ? 'Solo parámetros de práctica' : 'Practice parameters only'}</p>
            </div>
          </div>
          <div className="surface-2 flex items-start gap-3 p-4">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--cyan)]" aria-hidden="true" />
            <div className="text-xs">
              <p className="font-bold text-[var(--text)]">{es ? 'Diagnóstico preliminar' : 'Preliminary roadmap'}</p>
              <p className="muted mt-0.5">{es ? 'Próximos pasos accionables' : 'Actionable next steps'}</p>
            </div>
          </div>
        </div>

        {/* Immediate Call Alternative */}
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs">
          <span className="font-bold text-[var(--text)]">
            {es ? '¿Prefiere hablar ahora mismo?' : 'Prefer to talk right away?'}
          </span>
          <Button href="tel:+13024965648" variant="link" leftIcon={<Phone size={16} strokeWidth={1.75} aria-hidden="true" />}>
            +1 (302) 496-5648
          </Button>
          <span className="muted">
            {es ? 'Consulte los horarios disponibles en el calendario.' : 'See available appointment times in the calendar.'}
          </span>
        </div>
      </div>

      {/* Third-party Calendly loads only after an intentional booking action. */}
      <div className={`relative mt-8 w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] ${calendarUrl ? 'min-h-[640px]' : 'min-h-[210px]'}`}>
        {!calendarUrl ? (
          <div className="flex min-h-[210px] flex-col items-center justify-center gap-4 p-6 text-center">
            <Calendar className="size-8 text-[var(--cyan)]" aria-hidden="true" />
            <p className="max-w-lg text-sm font-semibold text-[var(--text)]">
              {es ? 'Elija cuándo desea hablar. Calendly se cargará solo después de su elección.' : 'Choose when to meet. Calendly loads only after you request available times.'}
            </p>
            <Button type="button" variant="primary" size="lg" onClick={showCalendar} aria-controls="root-calendly-frame">
              {es ? 'Ver horarios disponibles' : 'Show available times'}
            </Button>
          </div>
        ) : (
          <>
            {!frameLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center" role="status">
                <Calendar className="size-8 text-[var(--cyan)]" aria-hidden="true" />
                <p>{es ? 'Cargando el calendario...' : 'Loading calendar...'}</p>
              </div>
            )}
            <iframe
              id="root-calendly-frame"
              src={calendarUrl}
              width="100%"
              height="640"
              title={es ? 'Calendario de reserva de consulta ROOT' : 'ROOT Consultation Booking Calendar'}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="relative z-10 w-full border-0"
              onLoad={() => setFrameLoaded(true)}
            />
          </>
        )}
      </div>

      {/* Fallback footer bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
        <span>
          {es
            ? 'Los datos de la reserva se procesan a través de la infraestructura segura de Calendly.'
            : 'Booking is processed through Calendly’s secure scheduling infrastructure.'}
        </span>
        <Button href="https://calendly.com/rootrcm-info/30min" target="_blank" rel="noopener noreferrer" variant="link" rightIcon={<ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />}>
          {es ? 'Enlace externo de Calendly' : 'Direct Calendly link'}
        </Button>
      </div>
    </section>
  );
}
