'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MarketingPage } from '@/components/site/marketing-page';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { use } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

function ResetPasswordForm({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') ?? '';
  const secret = searchParams.get('secret') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isInvalidToken = !userId || !secret;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (password.length < 12) {
      setErrorMessage(
        es
          ? 'La nueva contraseña debe tener al menos 12 caracteres.'
          : 'New password must be at least 12 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        es
          ? 'Las contraseñas ingresadas no coinciden. Verifíquelas e intente nuevamente.'
          : 'Passwords do not match. Please verify and try again.'
      );
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/v1/auth/reset', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          userId,
          secret,
          password,
          locale,
        }),
      });

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(
          es
            ? 'No se pudo actualizar la contraseña. El enlace puede haber caducado.'
            : 'Could not reset password. The security token may have expired.'
        );
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage(
        es
          ? 'Error de red al actualizar la contraseña. Intente nuevamente.'
          : 'Network error. Please try again.'
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="py-6 text-center" role="status">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--outcome-paid)]">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-[var(--text)]">
          {es ? 'Contraseña actualizada' : 'Password updated'}
        </h2>
        <p className="muted mt-3 text-sm leading-relaxed">
          {es
            ? 'Su contraseña ha sido actualizada exitosamente. Ahora puede iniciar sesión con sus nuevas credenciales.'
            : 'Your practice account password has been updated. You can now sign in with your new credentials.'}
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href={localizedPath(locale, '/login')}
            className="btn-primary"
          >
            {es ? 'Iniciar sesión' : 'Sign in'}
          </Link>
        </div>
      </div>
    );
  }

  if (isInvalidToken) {
    return (
      <div className="space-y-4">
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-200">
          {es
            ? 'El enlace de restablecimiento es inválido o ha caducado. Solicite un nuevo enlace de recuperación.'
            : 'The password reset link is invalid or has expired. Please request a new recovery link.'}
        </div>
        <Link
          href={localizedPath(locale, '/forgot-password')}
          className="btn-primary inline-flex"
        >
          {es ? 'Solicitar nuevo enlace' : 'Request new link'}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="new-password" className="block text-xs font-bold text-[var(--text)]">
          {es ? 'Nueva contraseña (mínimo 12 caracteres)' : 'New password (min 12 characters)'}
        </label>
        <input
          id="new-password"
          type="password"
          required
          minLength={12}
          maxLength={256}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)] focus-visible:outline-offset-2"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-xs font-bold text-[var(--text)]">
          {es ? 'Confirmar nueva contraseña' : 'Confirm new password'}
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          minLength={12}
          maxLength={256}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            ? 'Actualizando contraseña...'
            : 'Updating password...'
          : es
            ? 'Guardar nueva contraseña'
            : 'Save new password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = (resolvedParams.locale === 'es' ? 'es' : 'en') as Locale;
  const es = locale === 'es';

  return (
    <MarketingPage
      locale={locale}
      title={es ? 'Crear nueva contraseña' : 'Create new password'}
      body={
        es
          ? 'Elija una nueva contraseña segura para su cuenta de práctica.'
          : 'Set a new secure password for your practice account.'
      }
      nodeId="6:99"
    >
      <div className="mx-auto mt-8 max-w-xl">
        <div className="surface relative overflow-hidden p-6 sm:p-8 md:p-10 shadow-[var(--shadow)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" aria-hidden="true" />
          <div className="mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4 text-xs font-semibold text-[var(--muted)]">
            <Lock className="size-4 text-[var(--cyan)]" aria-hidden="true" />
            <span>{es ? 'Seguridad de cuenta de práctica' : 'Practice account security'}</span>
          </div>
          <Suspense fallback={<div className="p-4 text-center text-xs text-[var(--muted)]">{es ? 'Cargando formulario...' : 'Loading form...'}</div>}>
            <ResetPasswordForm locale={locale} />
          </Suspense>
        </div>
      </div>
    </MarketingPage>
  );
}
