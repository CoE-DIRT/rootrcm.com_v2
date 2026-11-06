'use client';

import { useEffect, useState } from 'react';
import { OAuthButtons } from '@/components/forms/oauth-buttons';
import { authMessage, outcomeFromStatus, type AuthOutcome } from '@/components/forms/auth-status';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { StatusBanner } from '@/components/ui/status';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function LoginForm({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<AuthOutcome | 'success' | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (new URL(window.location.href).searchParams.get('error')?.startsWith('oauth_')) setOutcome('unavailable');
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: typeof fieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = es ? 'Introduzca un correo válido.' : 'Enter a valid email address.';
    if (!password) errors.password = es ? 'Introduzca su contraseña.' : 'Enter your password.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    setPending(true);
    setOutcome(null);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, locale }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; verified?: boolean };
      if (!response.ok) {
        setOutcome(outcomeFromStatus(response.status, 'invalid'));
        return;
      }
      if (data.verified !== true) {
        setOutcome('unverified');
        return;
      }
      setOutcome('success');
      window.location.assign(`/${locale}/dashboard`);
    } catch {
      setOutcome('network');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="form-stack">
      <OAuthButtons locale={locale} />
      <form className="form-stack" onSubmit={onSubmit} noValidate aria-describedby={outcome ? 'login-status' : undefined}>
        <Input
          id="login-email"
          type="email"
          label={es ? 'Correo empresarial' : 'Business email'}
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <PasswordInput
          id="login-password"
          label={es ? 'Contraseña' : 'Password'}
          autoComplete="current-password"
          required
          maxLength={256}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          showLabel={es ? 'Mostrar contraseña' : 'Show password'}
          hideLabel={es ? 'Ocultar contraseña' : 'Hide password'}
          labelAside={
            <Button href={localizedPath(locale, '/forgot-password')} variant="link" size="sm">
              {es ? '¿Olvidó su contraseña?' : 'Forgot password?'}
            </Button>
          }
        />
        <div id="login-status" aria-live="polite">
          {outcome === 'success' ? (
            <StatusBanner tone="success">{es ? 'Sesión iniciada. Abriendo su espacio…' : 'Signed in. Opening your workspace…'}</StatusBanner>
          ) : outcome ? (
            <StatusBanner tone={outcome === 'rateLimited' || outcome === 'unverified' ? 'warning' : 'danger'}>{authMessage(outcome, locale)}</StatusBanner>
          ) : null}
        </div>
        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={pending}>
          {pending ? (es ? 'Verificando…' : 'Signing in…') : es ? 'Iniciar sesión' : 'Log in'}
        </Button>
      </form>
      <p className="ui-field__hint">
        {es ? '¿Aún no tiene cuenta?' : 'New to ROOT?'}{' '}
        <Button href={localizedPath(locale, '/signup')} variant="link" size="sm">
          {es ? 'Crear una cuenta' : 'Create an account'}
        </Button>
      </p>
    </div>
  );
}
