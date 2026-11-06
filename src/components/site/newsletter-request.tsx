'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';

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
    <form onSubmit={submit} className="ui-newsletter" data-testid="root-newsletter">
      <div className="ui-newsletter__row">
        <Input
          id="root-news-email"
          type="email"
          label={es ? 'Notas de operaciones de ingresos' : 'Revenue operations notes'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          required
          autoComplete="email"
          inputMode="email"
          hint={es ? 'Abre su aplicación de correo; este sitio no guarda direcciones.' : 'Opens your email app; this site does not store addresses.'}
        />
        <span className="ui-newsletter__submit">
          <IconButton
            type="submit"
            variant="primary"
            aria-label={es ? 'Preparar solicitud de suscripción' : 'Prepare newsletter request'}
            icon={<ArrowUpRight size={20} strokeWidth={1.75} aria-hidden="true" />}
          />
        </span>
      </div>
    </form>
  );
}
