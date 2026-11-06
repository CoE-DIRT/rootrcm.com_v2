'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBanner } from '@/components/ui/status';
import type { Locale } from '@/i18n/locales';

type Outcome = 'invalid' | 'busy' | 'unavailable' | 'inactive' | 'exists' | null;

const copy = {
  en: {
    first: 'First name', last: 'Last name', phone: 'Business phone', practice: 'Practice name',
    specialty: 'Specialty (optional)', size: 'Practice size (optional)', sizePick: 'Select',
    terms: 'I agree to the ROOT terms and understand this workspace is for business contacts only (no patient information).',
    marketing: 'Send me ROOT news and offers by email (optional).',
    submit: 'Create my free workspace', pending: 'Please wait…',
    invalid: 'Check the highlighted details and accept the terms.',
    busy: 'Your workspace is being set up. Try again in about a minute.',
    unavailable: 'Workspace setup is temporarily unavailable. Try again later.',
    inactive: 'This account has no active workspace. Contact your ROOT administrator.',
    exists: 'This account already belongs to an organization. Contact your ROOT administrator.',
  },
  es: {
    first: 'Nombre', last: 'Apellido', phone: 'Teléfono empresarial', practice: 'Nombre de la práctica',
    specialty: 'Especialidad (opcional)', size: 'Tamaño de la práctica (opcional)', sizePick: 'Seleccione',
    terms: 'Acepto los términos de ROOT y entiendo que este espacio es solo para contactos empresariales (sin información de pacientes).',
    marketing: 'Quiero recibir noticias y ofertas de ROOT por correo (opcional).',
    submit: 'Crear mi espacio gratuito', pending: 'Espere…',
    invalid: 'Revise los datos marcados y acepte los términos.',
    busy: 'Su espacio se está configurando. Inténtelo de nuevo en aproximadamente un minuto.',
    unavailable: 'La configuración del espacio no está disponible temporalmente. Inténtelo más tarde.',
    inactive: 'Esta cuenta no tiene un espacio activo. Contacte al administrador de ROOT.',
    exists: 'Esta cuenta ya pertenece a una organización. Contacte al administrador de ROOT.',
  },
} as const;

/** Verified accounts with no membership (password or OAuth) create their FREE workspace here. */
export function WorkspaceSetupForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setOutcome(null);
    try {
      const response = await fetch('/api/v1/account/workspace', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: form.get('firstName'), lastName: form.get('lastName'), phone: form.get('phone'),
          practiceName: form.get('practiceName'), specialty: form.get('specialty'), practiceSize: form.get('practiceSize'),
          termsAccepted: form.get('terms') === 'on', marketingConsent: form.get('marketing') === 'on', locale,
        }),
      });
      if (response.ok) {
        window.location.assign(`/${locale}/dashboard`);
        return;
      }
      const body = (await response.json().catch(() => ({}))) as { error?: { code?: string } };
      const code = body.error?.code;
      setOutcome(
        response.status === 422 ? 'invalid'
          : code === 'signup_in_progress' ? 'busy'
          : code === 'membership_inactive' ? 'inactive'
          : code === 'existing_membership' ? 'exists'
          : 'unavailable',
      );
    } catch {
      setOutcome('unavailable');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate>
      <Input id="ws-first" name="firstName" label={t.first} autoComplete="given-name" required maxLength={60} />
      <Input id="ws-last" name="lastName" label={t.last} autoComplete="family-name" required maxLength={60} />
      <Input id="ws-phone" name="phone" type="tel" label={t.phone} autoComplete="tel" inputMode="tel" required maxLength={24} />
      <Input id="ws-practice" name="practiceName" label={t.practice} autoComplete="organization" required maxLength={160} />
      <Input id="ws-specialty" name="specialty" label={t.specialty} maxLength={80} />
      <Select id="ws-size" name="practiceSize" label={t.size} defaultValue="">
        <option value="">{t.sizePick}</option>
        {['solo', '2-5', '6-20', '21-50', '51+'].map((size) => <option key={size} value={size}>{size}</option>)}
      </Select>
      <Checkbox id="ws-terms" name="terms" label={t.terms} required />
      <Checkbox id="ws-marketing" name="marketing" label={t.marketing} />
      <Button variant="primary" type="submit" disabled={pending}>{pending ? t.pending : t.submit}</Button>
      {outcome ? <StatusBanner tone={outcome === 'invalid' || outcome === 'busy' ? 'warning' : 'danger'}>{t[outcome]}</StatusBanner> : null}
    </form>
  );
}
