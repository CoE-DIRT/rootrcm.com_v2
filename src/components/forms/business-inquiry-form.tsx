'use client';

import { useState, type FormEvent } from 'react';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { Button } from '@/components/ui/button';
import { SelectField, TextArea, TextInput } from '@/components/ui/form-field';
import { StatusBanner } from '@/components/ui/status';
import { validateBusinessContact, type FieldErrors } from '@/lib/validation/business-contact';

export type InquiryConcern = 'consultation' | 'diagnostic' | 'managed' | 'custom';

export function BusinessInquiryForm({
  locale,
  defaultConcern = 'consultation',
}: {
  locale: Locale;
  defaultConcern?: InquiryConcern;
}) {
  const t = copy(locale);
  const [status, setStatus] = useState<'idle' | 'loading' | 'unavailable' | 'error'>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    const validated = validateBusinessContact(payload);
    if (!validated.ok) {
      setStatus('idle');
      setErrors(validated.fieldErrors);
      setMessage('');
      return;
    }
    setStatus('loading');
    setErrors({});
    setMessage('');
    try {
      const response = await fetch('/api/v1/public/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ intent: 'business-inquiry', concern: validated.data.concern }),
      });
      const json = (await response.json()) as {
        error?: { message?: string; fieldErrors?: FieldErrors };
        data?: { status?: string };
      };
      setStatus('unavailable');
      setMessage(json.error?.message ?? t.consultation.unavailable);
      if (!response.ok && response.status !== 503) {
        setStatus('error');
        setErrors(json.error?.fieldErrors ?? {});
      }
    } catch {
      setStatus('error');
      setMessage(t.status.error);
    }
  }

  return (
    <form
      className="surface mt-8 grid max-w-xl gap-4 p-6"
      onSubmit={onSubmit}
      noValidate
      data-testid="business-inquiry-form"
    >
      <TextInput
        id="name"
        name="name"
        label={t.form.name}
        required
        error={errors.name ? t.form.errors[errors.name] : undefined}
        autoComplete="name"
      />
      <TextInput
        id="email"
        name="email"
        type="email"
        label={t.form.email}
        required
        error={errors.email ? t.form.errors[errors.email] : undefined}
        autoComplete="email"
      />
      <TextInput
        id="organization"
        name="organization"
        label={t.form.organization}
        required
        error={errors.organization ? t.form.errors[errors.organization] : undefined}
        autoComplete="organization"
      />
      <SelectField
        id="concern"
        name="concern"
        label={t.form.concern}
        defaultValue={defaultConcern}
        error={errors.concern ? t.form.errors[errors.concern] : undefined}
      >
        <option value="consultation">{t.form.concernOptions.consultation}</option>
        <option value="diagnostic">{t.form.concernOptions.diagnostic}</option>
        <option value="managed">{t.form.concernOptions.managed}</option>
        <option value="custom">{t.form.concernOptions.custom}</option>
      </SelectField>
      <TextArea
        id="message"
        name="message"
        label={t.form.message}
        error={errors.message ? t.form.errors[errors.message] : undefined}
      />
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          {t.form.consent} {t.footer.noPhi}
        </span>
      </label>
      {errors.consent ? <p className="field-error">{t.form.errors[errors.consent]}</p> : null}
      <StatusBanner tone="warning">{t.consultation.unavailable}</StatusBanner>
      <Button type="submit" loading={status === 'loading'}>
        {t.consultation.submit}
      </Button>
      {status === 'unavailable' ? <StatusBanner tone="warning">{message}</StatusBanner> : null}
      {status === 'error' ? <StatusBanner tone="danger">{message}</StatusBanner> : null}
    </form>
  );
}
