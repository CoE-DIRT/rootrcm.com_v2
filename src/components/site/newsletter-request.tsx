'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/locales';

/** No backend is activated. This opens the visitor's email client;
 * it never collects or silently persists addresses in ROOT systems.
 */
export function NewsletterRequest({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('');
  const es = locale === 'es';
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!address) return;
    const subject = encodeURIComponent('ROOT healthcare operations updates — request');
    const body = encodeURIComponent(`Please add this business email to the ROOT operations updates interest list: ${address}\n\nPlease confirm subscription and consent before adding me. No patient information is included.`);
    window.location.href = `mailto:info@rootrcm.com?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={submit} className="mt-5" data-testid="root-newsletter">
      <label htmlFor="root-news-email" className="block text-xs font-bold">
        {es ? 'Novedades de operaciones sanitarias' : 'Healthcare operations notes'}
      </label>
      <div className="mt-2 flex items-stretch gap-2">
        <input
          id="root-news-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          required
          autoComplete="email"
          placeholder="you@practice.com"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus-visible:outline-[var(--cyan)]"
        />
        <button type="submit" className="flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-[var(--cyan)] text-[var(--on-cyan)] transition hover:brightness-110" aria-label={es ? 'Preparar solicitud de suscripción' : 'Prepare newsletter request'}>
          <ArrowUpRight className="size-5" aria-hidden="true"/>
        </button>
      </div>
      <p className="muted mt-2 text-[11px] leading-5">
        {es
          ? 'Abre su aplicación de correo; ninguna dirección se envía ni almacena aquí. No incluya datos de pacientes.'
          : 'Opens your email app; no address is stored or sent by this site. Do not include patient details.'}
      </p>
    </form>
  );
}
