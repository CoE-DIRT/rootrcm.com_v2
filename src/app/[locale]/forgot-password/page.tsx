'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { use } from 'react';
import { MailCheck, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = (resolvedParams.locale === 'es' ? 'es' : 'en') as Locale;
  const es = locale === 'es';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/v1/auth/recover', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(
          es
            ? 'No se pudo procesar la solicitud de recuperación en este momento. Intente más tarde.'
            : 'Could not process the recovery request at this time. Please try again later.'
        );
        return;
      }

      setStatus('sent');
    } catch {
      setStatus('error');
      setErrorMessage(
        es
          ? 'Error de red al conectar con el servidor. Verifique su conexión.'
          : 'Network error. Please check your connection and try again.'
      );
    }
  }

  return (
    <MarketingPage
      locale={locale}
      title={es ? 'Recuperar contraseña' : 'Reset your password'}
      body={
        es
          ? 'Ingrese el correo electrónico asociado a su cuenta de práctica para recibir las instrucciones de restablecimiento.'
          : 'Enter the email address registered to your practice account to receive recovery instructions.'
      }
      nodeId="6:99"
    >
      <div className="mx-auto mt-8 max-w-xl">
        <div className="surface relative overflow-hidden p-6 sm:p-8 md:p-10 shadow-[var(--shadow)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" aria-hidden="true" />

          {status === 'sent' ? (
            <div className="py-6 text-center" role="status">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--cyan)]">
                <MailCheck className="size-8" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-[var(--text)]">
                {es ? 'Correo de recuperación enviado' : 'Recovery email dispatched'}
              </h2>
              <p className="muted mt-3 text-sm leading-relaxed">
                {es
                  ? `Si existe una cuenta asociada a ${email}, recibirá en breve un correo con instrucciones para restablecer su contraseña.`
                  : `If an account exists for ${email}, a password recovery email will arrive shortly with instructions.`}
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href={localizedPath(locale, '/login')}
                  className="btn-primary"
                >
                  {es ? 'Volver al inicio de sesión' : 'Back to sign in'}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4 text-xs font-semibold text-[var(--muted)]">
                <KeyRound className="size-4 text-[var(--cyan)]" aria-hidden="true" />
                <span>{es ? 'Recuperación de credenciales de práctica' : 'Practice credential recovery'}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="recovery-email" className="block text-xs font-bold text-[var(--text)]">
                    {es ? 'Correo electrónico registrado' : 'Registered practice email'}
                  </label>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@practice.com"
                    className="mt-1.5 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)] focus-visible:outline-offset-2"
                  />
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-medium leading-relaxed text-red-200"
                  >
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full shadow-[0_4px_16px_rgba(17,225,238,0.2)]"
                >
                  {status === 'loading'
                    ? es
                      ? 'Enviando instrucciones...'
                      : 'Sending instructions...'
                    : es
                      ? 'Enviar correo de recuperación'
                      : 'Send recovery email'}
                </button>
              </form>

              <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
                <Link
                  href={localizedPath(locale, '/login')}
                  className="font-bold text-[var(--cyan)] hover:underline"
                >
                  {es ? '← Volver al inicio de sesión' : '← Back to sign in'}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </MarketingPage>
  );
}
