'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/form-field';
import { copy } from '@/content/messages';
import { resourceGuides, type GuideRecord } from '@/content/guides';
import type { Locale } from '@/i18n/locales';
import { validateBusinessContact, type FieldErrors } from '@/lib/validation/business-contact';

export function ResourceLibrary({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<GuideRecord | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState(false);
  const es = locale === 'es';

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return resourceGuides;
    return resourceGuides.filter((guide) =>
      `${guide.title.en} ${guide.title.es} ${guide.summary.en} ${guide.summary.es}`.toLowerCase().includes(needle),
    );
  }, [query]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      organization: form.get('organization'),
      message: form.get('message'),
      concern: active.id,
      consent: form.get('consent') === 'on',
    };
    const validated = validateBusinessContact(payload);
    if (!validated.ok) {
      setErrors(validated.fieldErrors);
      setNotice('');
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const response = await fetch('/api/v1/public/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(validated.data),
      });
      const json = (await response.json()) as { error?: { message?: string } };
      setNotice(json.error?.message ?? t.consultation.unavailable);
    } catch {
      setNotice(t.consultation.unavailable);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-10" aria-labelledby="guides-heading">
      <h2 id="guides-heading" className="enterprise-title font-extrabold">
        {es ? 'Repositorio de guías' : 'Guide repository'}
      </h2>
      <p className="muted mt-2 text-sm">
        {es
          ? 'Solo títulos del prototipo Demo 6. La descarga no envía un archivo ni guarda el contacto mientras las consultas están desactivadas.'
          : 'Titles from the Demo 6 prototype only. A download does not email a file or store the contact while inquiries are disabled.'}
      </p>
      <label className="field mt-4 max-w-md">
        <span>{es ? 'Buscar' : 'Search'}</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          name="guide-search"
        />
      </label>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {visible.map((guide) => (
          <li key={guide.id} className="surface p-4">
            <p className="overline">{guide.kind === 'template' ? (es ? 'Plantilla' : 'Template') : es ? 'Guía' : 'Guide'}</p>
            <h3 className="mt-2 font-bold">{guide.title[locale]}</h3>
            <p className="muted mt-2 text-sm">{guide.summary[locale]}</p>
            <button type="button" className="btn-secondary btn-sm mt-3" onClick={() => { setActive(guide); setNotice(''); setErrors({}); }}>
              {es ? 'Solicitar acceso' : 'Request access'}
            </button>
          </li>
        ))}
      </ul>
      {visible.length === 0 ? <p className="muted mt-4 text-sm">{es ? 'Ninguna guía coincide.' : 'No guides match.'}</p> : null}
      {active ? (
        <div className="surface mt-4 p-4" role="dialog" aria-modal="true" aria-labelledby="guide-gate-title">
          <h3 id="guide-gate-title" className="text-lg font-bold">{active.title[locale]}</h3>
          <form className="mt-4 grid max-w-xl gap-4" onSubmit={onSubmit} noValidate>
            <TextInput id="guide-name" name="name" label={t.form.name} required error={errors.name ? t.form.errors[errors.name] : undefined} autoComplete="name" />
            <TextInput id="guide-email" name="email" type="email" label={t.form.email} required error={errors.email ? t.form.errors[errors.email] : undefined} autoComplete="email" />
            <TextInput id="guide-org" name="organization" label={t.form.organization} required error={errors.organization ? t.form.errors[errors.organization] : undefined} autoComplete="organization" />
            <TextInput id="guide-message" name="message" label={t.form.message} error={errors.message ? t.form.errors[errors.message] : undefined} />
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="consent" className="mt-1" />
              <span>{t.form.consent}</span>
            </label>
            {errors.consent ? <p className="field-error" role="alert">{t.form.errors[errors.consent]}</p> : null}
            {notice ? <p className="status-banner" data-tone="warning" role="status">{notice}</p> : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" loading={pending} size="sm">{es ? 'Enviar solicitud' : 'Submit request'}</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setActive(null)}>{es ? 'Cerrar' : 'Close'}</Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
