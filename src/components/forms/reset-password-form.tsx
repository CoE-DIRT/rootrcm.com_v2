'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { authMessage, outcomeFromStatus, type AuthOutcome } from '@/components/forms/auth-status';
import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { StatusBanner } from '@/components/ui/status';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function ResetPasswordForm({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const params = useSearchParams();
  const userId = params.get('userId') ?? '';
  const secret = params.get('secret') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<AuthOutcome | 'done' | null>(null);
  const tokenMissing = !userId || !secret;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    if (password.length < 12) next.password = es ? 'Use al menos 12 caracteres.' : 'Use at least 12 characters.';
    if (confirm !== password) next.confirm = es ? 'Las contraseñas no coinciden.' : 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    setOutcome(null);
    try {
      const response = await fetch('/api/v1/auth/reset', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId, secret, password, locale }),
      });
      setOutcome(response.ok ? 'done' : outcomeFromStatus(response.status, 'expired'));
    } catch {
      setOutcome('network');
    } finally {
      setPending(false);
    }
  }

  if (tokenMissing) {
    return (
      <div className="form-stack">
        <StatusBanner tone="warning">{authMessage('expired', locale)}</StatusBanner>
        <Button href={localizedPath(locale, '/forgot-password')} variant="primary" size="lg" fullWidth>
          {es ? 'Solicitar un enlace nuevo' : 'Request a new link'}
        </Button>
      </div>
    );
  }

  if (outcome === 'done') {
    return (
      <div className="form-stack" role="status">
        <StatusBanner tone="success">{es ? 'Contraseña actualizada. Inicie sesión con la nueva contraseña.' : 'Password updated. Log in with your new password.'}</StatusBanner>
        <Button href={localizedPath(locale, '/login')} variant="primary" size="lg" fullWidth>
          {es ? 'Iniciar sesión' : 'Log in'}
        </Button>
      </div>
    );
  }

  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate>
      <PasswordInput
        id="reset-password"
        label={es ? 'Nueva contraseña' : 'New password'}
        autoComplete="new-password"
        required
        minLength={12}
        maxLength={256}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint={es ? 'Al menos 12 caracteres.' : 'At least 12 characters.'}
        error={errors.password}
        showLabel={es ? 'Mostrar contraseña' : 'Show password'}
        hideLabel={es ? 'Ocultar contraseña' : 'Hide password'}
      />
      <PasswordInput
        id="reset-confirm"
        label={es ? 'Confirmar contraseña' : 'Confirm password'}
        autoComplete="new-password"
        required
        maxLength={256}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        showLabel={es ? 'Mostrar contraseña' : 'Show password'}
        hideLabel={es ? 'Ocultar contraseña' : 'Hide password'}
      />
      <div aria-live="polite">{outcome ? <StatusBanner tone={outcome === 'rateLimited' ? 'warning' : 'danger'}>{authMessage(outcome, locale)}</StatusBanner> : null}</div>
      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={pending}>
        {es ? 'Guardar contraseña' : 'Save new password'}
      </Button>
    </form>
  );
}
