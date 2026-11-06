'use client';

import { useState } from 'react';
import { authMessage, outcomeFromStatus, type AuthOutcome } from '@/components/forms/auth-status';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBanner } from '@/components/ui/status';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function ForgotPasswordForm({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<AuthOutcome | 'sent' | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(es ? 'Introduzca un correo válido.' : 'Enter a valid email address.');
      return;
    }
    setError(undefined);
    setPending(true);
    setOutcome(null);
    try {
      const response = await fetch('/api/v1/auth/recover', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      setOutcome(response.ok ? 'sent' : outcomeFromStatus(response.status, 'unavailable'));
    } catch {
      setOutcome('network');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate>
      <Input
        id="recover-email"
        type="email"
        label={es ? 'Correo de su cuenta' : 'Account email'}
        autoComplete="email"
        inputMode="email"
        required
        maxLength={254}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <div aria-live="polite">
        {outcome === 'sent' ? (
          <StatusBanner tone="success">
            {es ? 'Si existe una cuenta con ese correo, recibirá un enlace de restablecimiento en breve.' : 'If an account exists for that email, a reset link will arrive shortly.'}
          </StatusBanner>
        ) : outcome ? (
          <StatusBanner tone={outcome === 'rateLimited' ? 'warning' : 'danger'}>{authMessage(outcome, locale)}</StatusBanner>
        ) : null}
      </div>
      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={pending}>
        {es ? 'Enviar enlace' : 'Send reset link'}
      </Button>
      <Button href={localizedPath(locale, '/login')} variant="link" size="sm">
        {es ? 'Volver a iniciar sesión' : 'Back to log in'}
      </Button>
    </form>
  );
}
