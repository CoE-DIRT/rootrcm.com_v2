'use client';

import { useState } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { Button } from '@/components/ui/button';
import { SelectField, TextArea, TextInput } from '@/components/ui/form-field';
import { StatusBanner } from '@/components/ui/status';
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
        error?: { message?: string; fieldErrors?: FieldErrors };
        data?: { status?: string };
      };
      // HTTP 200 is not sufficient: only verified durable acceptance is success.
      if (!response.ok || json.data?.status !== 'accepted_persisted') {
        setStatus('error');
        setErrors(json.error?.fieldErrors ?? {});
        setMessage(json.error?.message ?? t.consultation.unavailable);
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

  return (
    <form className="surface mt-8 grid max-w-xl gap-4 p-6" onSubmit={onSubmit} noValidate>
      <TextInput id="name" name="name" label={t.form.name} required error={errors.name} autoComplete="name" />
      <TextInput
        id="email"
        name="email"
        type="email"
        label={t.form.email}
        required
        error={errors.email}
        autoComplete="email"
      />
      <TextInput
        id="organization"
        name="organization"
        label={t.form.organization}
        required
        error={errors.organization}
        autoComplete="organization"
      />
      <SelectField id="concern" name="concern" label={t.form.concern} error={errors.concern}>
        <option value="consultation">{t.form.concernOptions.consultation}</option>
        <option value="diagnostic">{t.form.concernOptions.diagnostic}</option>
        <option value="managed">{t.form.concernOptions.managed}</option>
        <option value="custom">{t.form.concernOptions.custom}</option>
      </SelectField>
      <TextArea id="message" name="message" label={t.form.message} error={errors.message} />
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          {t.form.consent} {t.footer.noPhi}
        </span>
      </label>
      {errors.consent ? <p className="field-error">{errors.consent}</p> : null}
      {!inquirySubmissionEnabled ? <StatusBanner tone="warning">{t.consultation.unavailable}</StatusBanner> : null}
      <Button type="submit" loading={status === 'loading'} disabled={!inquirySubmissionEnabled}>
        {t.consultation.submit}
      </Button>
      {status === 'success' ? <StatusBanner tone="warning">{message}</StatusBanner> : null}
      {status === 'error' ? <StatusBanner tone="danger">{message}</StatusBanner> : null}
    </form>
  );
}
