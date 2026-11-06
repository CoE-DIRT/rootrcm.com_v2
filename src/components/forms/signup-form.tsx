'use client';

import Link from 'next/link';
import { useState } from 'react';
import { OAuthButtons } from '@/components/forms/oauth-buttons';
import { authMessage, outcomeFromStatus, type AuthOutcome } from '@/components/forms/auth-status';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { StatusBanner } from '@/components/ui/status';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

type Errors = { email?: string; password?: string; consent?: string };

export function SignupForm({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<AuthOutcome | 'sent' | 'sentNoEmail' | null>(null);

  function validate(): Errors {
    const errors: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = es ? 'Introduzca un correo empresarial válido.' : 'Enter a valid business email.';
    if (password.length < 12) errors.password = es ? 'Use al menos 12 caracteres.' : 'Use at least 12 characters.';
    if (!consent) errors.consent = es ? 'Debe aceptar para crear la cuenta.' : 'You must agree to create an account.';
    return errors;
  }
  const errors = validate();
  const show = (key: keyof Errors) => (touched[key] ? errors[key] : undefined);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ email: true, password: true, consent: true });
    if (Object.keys(errors).length) return;
    setPending(true);
    setOutcome(null);
    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password, locale }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; verificationSent?: boolean };
      if (!response.ok || data.ok === false) {
        setOutcome(outcomeFromStatus(response.status, 'exists'));
        return;
      }
      // Success copy reflects only what Appwrite reported: the verification email was or was not sent.
      setOutcome(data.verificationSent === false ? 'sentNoEmail' : 'sent');
    } catch {
      setOutcome('network');
    } finally {
      setPending(false);
    }
  }

  if (outcome === 'sent' || outcome === 'sentNoEmail') {
    return (
      <div className="form-stack" role="status">
        <StatusBanner tone={outcome === 'sent' ? 'success' : 'warning'}>
          {outcome === 'sent'
            ? es
              ? `Cuenta creada. Enviamos un enlace de verificación a ${email}. Ábralo para activar su acceso.`
              : `Account created. We sent a verification link to ${email}. Open it to activate your access.`
            : es
              ? 'Cuenta creada, pero no pudimos enviar el correo de verificación. Inicie sesión para solicitar otro.'
              : 'Account created, but the verification email could not be sent. Log in to request another.'}
        </StatusBanner>
        <Button href={localizedPath(locale, '/login')} variant="primary" size="lg" fullWidth>
          {es ? 'Ir a iniciar sesión' : 'Go to log in'}
        </Button>
      </div>
    );
  }

  return (
    <div className="form-stack">
      <OAuthButtons locale={locale} />
      <form className="form-stack" onSubmit={onSubmit} noValidate>
        <Input
          id="signup-email"
          type="email"
          label={es ? 'Correo empresarial' : 'Business email'}
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={show('email')}
        />
        <PasswordInput
          id="signup-password"
          label={es ? 'Contraseña' : 'Password'}
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={256}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          hint={es ? 'Al menos 12 caracteres.' : 'At least 12 characters.'}
          error={show('password')}
          showLabel={es ? 'Mostrar contraseña' : 'Show password'}
          hideLabel={es ? 'Ocultar contraseña' : 'Hide password'}
        />
        <Checkbox
          id="signup-consent"
          required
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setTouched((t) => ({ ...t, consent: true }));
          }}
          error={show('consent')}
          label={
            es ? (
              <>
                Acepto los <Link href={localizedPath(locale, '/terms')}>Términos de servicio</Link> y la{' '}
                <Link href={localizedPath(locale, '/privacy')}>Política de privacidad</Link>.
              </>
            ) : (
              <>
                I agree to the <Link href={localizedPath(locale, '/terms')}>Terms of Service</Link> and{' '}
                <Link href={localizedPath(locale, '/privacy')}>Privacy Policy</Link>.
              </>
            )
          }
          hint={
            es
              ? 'Usamos su correo solo para gestionar su cuenta. Según la CCPA y el RGPD puede solicitar acceso, corrección o eliminación de sus datos en cualquier momento escribiendo a info@rootrcm.com. No vendemos datos personales. No introduzca información de pacientes.'
              : 'We use your email only to operate your account. Under CCPA and GDPR you can request access to, correction of, or deletion of your data at any time by writing to info@rootrcm.com. We do not sell personal information. Do not enter patient information.'
          }
        />
        <div aria-live="polite">{outcome ? <StatusBanner tone={outcome === 'rateLimited' ? 'warning' : 'danger'}>{authMessage(outcome, locale)}</StatusBanner> : null}</div>
        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={pending}>
          {pending ? (es ? 'Creando cuenta…' : 'Creating account…') : es ? 'Crear cuenta' : 'Create account'}
        </Button>
      </form>
      <p className="ui-field__hint">
        {es ? '¿Ya tiene cuenta?' : 'Already have an account?'}{' '}
        <Button href={localizedPath(locale, '/login')} variant="link" size="sm">
          {es ? 'Iniciar sesión' : 'Log in'}
        </Button>
      </p>
    </div>
  );
}
