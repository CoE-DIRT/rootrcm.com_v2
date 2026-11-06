'use client';

import { useState } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input, TextArea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { StatusBanner } from '@/components/ui/status';
import { publicStatusMessage } from '@/lib/public-status';
import type { FieldErrors } from '@/lib/validation/business-contact';

// Set true only after a reviewed server-side durable inquiry contract is deployed.
const inquirySubmissionEnabled = false;

export function BusinessInquiryForm({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inquirySubmissionEnabled) {
      setStatus('error');
      setMessage(t.consultation.unavailable);
      return;
    }
    setStatus('loading');
    setErrors({});
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      organization: form.get('organization'),
      concern: form.get('concern'),
      message: form.get('message'),
      consent: form.get('consent') === 'on',
    };
    try {
      const response = await fetch('/api/v1/public/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as {
        error?: { code?: string; fieldErrors?: FieldErrors };
        data?: { status?: string };
      };
      // HTTP 200 is not sufficient: only verified durable acceptance is success.
      if (!response.ok || json.data?.status !== 'accepted_persisted') {
        setStatus('error');
        setErrors(json.error?.fieldErrors ?? {});
        setMessage(publicStatusMessage(json.error?.code, {
          inquiryUnavailable: t.consultation.unavailable,
          checkoutUnavailable: t.consultation.checkoutUnavailable,
          generic: t.status.error,
        }));
        return;
      }
      setStatus('success');
      setMessage(t.consultation.received);
      formElement.reset();
    } catch {
      setStatus('error');
      setMessage(t.status.error);
    }
  }

  if (!inquirySubmissionEnabled) {
    return (
      <Card
        as="section"
        padding="lg"
        headingLevel={2}
        title={locale === 'es' ? 'Hable con nuestro equipo' : 'Speak with the ROOT team'}
        body={
          locale === 'es'
            ? 'Cuéntenos sobre su práctica y sus objetivos. Puede comunicarse directamente por correo, teléfono o WhatsApp.'
            : 'Tell us about your practice and goals. Reach our team directly by email, phone or WhatsApp.'
        }
        footer={<p className="ui-field__hint">{t.footer.noPhi}</p>}
        data-testid="contact-channels"
      >
        <div className="cluster">
          <Button href="mailto:info@rootrcm.com?subject=ROOT%20Practice%20Consultation" variant="primary" leftIcon={<Mail size={20} strokeWidth={1.75} aria-hidden="true" />}>
            {locale === 'es' ? 'Enviar correo' : 'Email ROOT'}
          </Button>
          <Button href="https://wa.me/13025064685" target="_blank" rel="noopener noreferrer" variant="secondary" leftIcon={<MessageCircle size={20} strokeWidth={1.75} aria-hidden="true" />}>
            WhatsApp
          </Button>
          <Button href="tel:+13024965648" variant="secondary" leftIcon={<Phone size={20} strokeWidth={1.75} aria-hidden="true" />}>
            {locale === 'es' ? 'Llamar' : 'Call ROOT'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate>
      <Input
        id="name"
        name="name"
        label={t.form.name}
        required
        error={errors.name ? t.form.errors[errors.name] : undefined}
        autoComplete="name"
      />
      <Input
        id="email"
        name="email"
        type="email"
        label={t.form.email}
        required
        error={errors.email ? t.form.errors[errors.email] : undefined}
        autoComplete="email"
      />
      <Input
        id="organization"
        name="organization"
        label={t.form.organization}
        required
        error={errors.organization ? t.form.errors[errors.organization] : undefined}
        autoComplete="organization"
      />
      <Select
        id="concern"
        name="concern"
        label={t.form.concern}
        error={errors.concern ? t.form.errors[errors.concern] : undefined}
      >
        <option value="consultation">{t.form.concernOptions.consultation}</option>
        <option value="diagnostic">{t.form.concernOptions.diagnostic}</option>
        <option value="managed">{t.form.concernOptions.managed}</option>
        <option value="custom">{t.form.concernOptions.custom}</option>
      </Select>
      <TextArea
        id="message"
        name="message"
        label={t.form.message}
        error={errors.message ? t.form.errors[errors.message] : undefined}
      />
      <Checkbox
        id="consent"
        name="consent"
        required
        label={`${t.form.consent} ${t.footer.noPhi}`}
        error={errors.consent ? t.form.errors[errors.consent] : undefined}
      />
      {!inquirySubmissionEnabled ? <StatusBanner tone="warning">{t.consultation.unavailable}</StatusBanner> : null}
      <Button type="submit" variant="primary" size="lg" isLoading={status === 'loading'} disabled={!inquirySubmissionEnabled}>
        {t.consultation.submit}
      </Button>
      {status === 'success' ? <StatusBanner tone="warning">{message}</StatusBanner> : null}
      {status === 'error' ? <StatusBanner tone="danger">{message}</StatusBanner> : null}
    </form>
  );
}
