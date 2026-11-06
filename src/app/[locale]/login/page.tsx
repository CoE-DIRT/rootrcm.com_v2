'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OAuthButtons } from '@/components/forms/oauth-buttons';
import { MarketingPage } from '@/components/site/marketing-page';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { use } from 'react';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = (resolvedParams.locale === 'es' ? 'es' : 'en') as Locale;
  const router = useRouter();
  const es = locale === 'es';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'unverified' | 'rateLimited'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, locale }),
      });

      const data = (await response.json()) as { ok?: boolean; verified?: boolean; error?: string };

      if (response.status === 429) {
        setStatus('rateLimited');
        setErrorMessage(
          es
            ? 'Demasiados intentos fallidos. Por seguridad, espere unos minutos antes de volver a intentar.'
            : 'Too many authentication attempts. Please wait a few minutes before trying again.'
        );
        return;
      }

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(
          es
            ? 'Credenciales no reconocidas o el acceso no está autorizado para este entorno.'
            : 'Invalid credentials or practice account is not authorized for this environment.'
        );
        return;
      }

      if (data.verified !== true) {
        setStatus('unverified');
        setErrorMessage(
          es
            ? 'Dirección de correo no verificada. Revise su bandeja de entrada o solicite un nuevo enlace de activación.'
            : 'Email address is not yet verified. Please check your inbox or request a new verification link.'
        );
        return;
      }

      setStatus('success');
      router.push(`/${locale}/dashboard`);
    } catch {
      setStatus('error');
      setErrorMessage(
        es
          ? 'Error de red al conectar con el servicio de autenticación. Verifique su conexión.'
          : 'Network failure connecting to the authentication service. Please check your connection.'
      );
    }
  }

  return (
    <MarketingPage
      locale={locale}
      title={es ? 'Acceso al portal de práctica' : 'Sign in to Practice Portal'}
      body={
        es
          ? 'Gestión de reclamos, apelaciones y acreditación para consultorios independientes.'
          : 'Dedicated revenue cycle operations, claim resolution, and credentialing management.'
      }
      nodeId="6:99"
    >
      <div className="mx-auto mt-8 max-w-xl">
        <div className="surface relative overflow-hidden p-6 sm:p-8 md:p-10 shadow-[var(--shadow)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" aria-hidden="true" />

          <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4 text-xs font-semibold text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-[var(--cyan)]" aria-hidden="true" />
              {es ? 'Acceso empresarial protegido' : 'Protected enterprise access'}
            </span>
            <span>Appwrite SSR</span>
          </div>

          <OAuthButtons locale={locale} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-[var(--text)]">
                {es ? 'Correo electrónico corporativo' : 'Practice business email'}
              </label>
              <input
                id="login-email"
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
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-bold text-[var(--text)]">
                  {es ? 'Contraseña' : 'Password'}
                </label>
                <Link
                  href={localizedPath(locale, '/forgot-password')}
                  className="text-xs font-semibold text-[var(--cyan)] hover:underline"
                >
                  {es ? '¿Olvidó su contraseña?' : 'Forgot password?'}
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                required
                minLength={1}
                maxLength={256}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)] focus-visible:outline-offset-2"
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className={`rounded-xl border p-3.5 text-xs font-medium leading-relaxed ${
                  status === 'rateLimited'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                    : 'border-red-500/30 bg-red-500/10 text-red-200'
                }`}
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
                  ? 'Verificando credenciales...'
                  : 'Verifying credentials...'
                : es
                  ? 'Iniciar sesión'
                  : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
            <p>
              {es ? '¿Aún no tiene cuenta de práctica?' : "Don't have a practice account yet?"}{' '}
              <Link
                href={localizedPath(locale, '/signup')}
                className="font-bold text-[var(--cyan)] hover:underline"
              >
                {es ? 'Crear cuenta' : 'Create an account'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MarketingPage>
  );
}
