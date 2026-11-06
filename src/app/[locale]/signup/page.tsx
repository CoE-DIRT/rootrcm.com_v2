'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OAuthButtons } from '@/components/forms/oauth-buttons';
import { MarketingPage } from '@/components/site/marketing-page';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { use } from 'react';
import { ShieldCheck, MailCheck } from 'lucide-react';

export default function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = (resolvedParams.locale === 'es' ? 'es' : 'en') as Locale;
  const es = locale === 'es';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'verificationSent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (!consent) {
      setErrorMessage(
        es
          ? 'Debe aceptar los Términos de Servicio y la Política de Privacidad para continuar.'
          : 'You must agree to the Terms of Service and Privacy Policy to proceed.'
      );
      return;
    }

    if (password.length < 12) {
      setErrorMessage(
        es
          ? 'La contraseña debe contener al menos 12 caracteres por motivos de seguridad empresarial.'
          : 'Password must be at least 12 characters for practice security compliance.'
      );
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, locale }),
      });

      const data = (await response.json()) as { ok?: boolean; verificationSent?: boolean };

      if (!response.ok || data.ok === false) {
        setStatus('error');
        setErrorMessage(
          es
            ? 'No se pudo crear la cuenta. Es posible que el correo ya esté registrado o que el servicio esté temporalmente inactivo.'
            : 'Account registration could not be completed. The email may already be registered, or the service is temporarily offline.'
        );
        return;
      }

      setStatus('verificationSent');
    } catch {
      setStatus('error');
      setErrorMessage(
        es
          ? 'Error de conexión. Verifique su red e intente nuevamente.'
          : 'Network error. Please check your connection and try again.'
      );
    }
  }

  return (
    <MarketingPage
      locale={locale}
      title={es ? 'Crear cuenta de práctica' : 'Register Practice Account'}
      body={
        es
          ? 'Acceso a tableros de ciclo de ingresos, conciliación de caja y seguimiento de excepciones.'
          : 'Secure access to revenue operations dashboards, cash reconciliation, and exception tracking.'
      }
      nodeId="6:99"
    >
      <div className="mx-auto mt-8 max-w-xl">
        <div className="surface relative overflow-hidden p-6 sm:p-8 md:p-10 shadow-[var(--shadow)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" aria-hidden="true" />

          {status === 'verificationSent' ? (
            <div className="py-6 text-center" role="status">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--cyan)]">
                <MailCheck className="size-8" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-[var(--text)]">
                {es ? 'Enlace de verificación enviado' : 'Verification Email Dispatched'}
              </h2>
              <p className="muted mt-3 text-sm leading-relaxed">
                {es
                  ? `Hemos enviado un enlace de confirmación a ${email}. Abra el correo y pulse el enlace una sola vez para activar su cuenta.`
                  : `A confirmation link has been sent to ${email}. Open the email and follow the link to activate your practice access.`}
              </p>
              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left text-xs leading-relaxed text-[var(--muted)]">
                <p className="flex items-center gap-2 font-bold text-[var(--text)]">
                  <ShieldCheck className="size-4 text-[var(--cyan)]" aria-hidden="true" />
                  {es ? 'Seguridad y privacidad' : 'Enterprise Access Policy'}
                </p>
                <p className="mt-1">
                  {es
                    ? 'Por seguridad, el enlace caduca en 24 horas. ROOT no almacena datos de pacientes (PHI) en este entorno público.'
                    : 'The verification link expires in 24 hours. ROOT does not accept or store PHI in public web workflows.'}
                </p>
              </div>
              <Link
                href={localizedPath(locale, '/login')}
                className="btn-primary mt-6 inline-flex"
              >
                {es ? 'Volver a iniciar sesión' : 'Return to sign in'}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4 text-xs font-semibold text-[var(--muted)]">
                <span className="flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full bg-[var(--cyan)]" aria-hidden="true" />
                  {es ? 'Registro de práctica comercial' : 'Commercial practice registration'}
                </span>
                <span>Sin PHI</span>
              </div>

              <OAuthButtons locale={locale} />

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label htmlFor="signup-email" className="block text-xs font-bold text-[var(--text)]">
                    {es ? 'Correo corporativo de la práctica' : 'Practice business email'}
                  </label>
                  <input
                    id="signup-email"
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

                <div>
                  <label htmlFor="signup-password" className="block text-xs font-bold text-[var(--text)]">
                    {es ? 'Contraseña (mínimo 12 caracteres)' : 'Password (minimum 12 characters)'}
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    minLength={12}
                    maxLength={256}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)] focus-visible:outline-offset-2"
                  />
                  <p className="muted mt-1 text-[11px]">
                    {es
                      ? 'Debe tener al menos 12 caracteres e incluir números o símbolos.'
                      : 'Must be at least 12 characters and combine letters, numbers, and symbols.'}
                  </p>
                </div>

                {/* Consent checkbox with CCPA / GDPR notices */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 rounded border-[var(--border)] bg-[var(--surface-2)] text-[var(--cyan)] focus:ring-[var(--cyan)]"
                      required
                    />
                    <span className="leading-relaxed">
                      {es ? (
                        <>
                          Acepto los{' '}
                          <Link href={localizedPath(locale, '/terms')} className="text-[var(--cyan)] underline" target="_blank">
                            Términos de Servicio
                          </Link>{' '}
                          y la{' '}
                          <Link href={localizedPath(locale, '/privacy')} className="text-[var(--cyan)] underline" target="_blank">
                            Política de Privacidad
                          </Link>
                          . Entiendo que los formularios de ROOT están destinados a comunicaciones empresariales y no aceptan información médica protegida (PHI).
                        </>
                      ) : (
                        <>
                          I agree to the{' '}
                          <Link href={localizedPath(locale, '/terms')} className="text-[var(--cyan)] underline" target="_blank">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href={localizedPath(locale, '/privacy')} className="text-[var(--cyan)] underline" target="_blank">
                            Privacy Policy
                          </Link>
                          . I confirm this is a business registration and will not transmit protected health information (PHI).
                        </>
                      )}
                    </span>
                  </label>
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
                      ? 'Procesando registro...'
                      : 'Processing registration...'
                    : es
                      ? 'Crear cuenta de práctica'
                      : 'Create practice account'}
                </button>
              </form>

              <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
                <p>
                  {es ? '¿Ya tiene una cuenta de práctica?' : 'Already have a practice account?'}{' '}
                  <Link
                    href={localizedPath(locale, '/login')}
                    className="font-bold text-[var(--cyan)] hover:underline"
                  >
                    {es ? 'Iniciar sesión' : 'Sign in'}
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </MarketingPage>
  );
}
