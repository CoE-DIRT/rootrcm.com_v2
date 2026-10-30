'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n/locales';

type Kind = 'capabilities' | 'eligibility' | 'claims' | 'credentialing';
type Envelope = {
  mode?: string;
  source?: string;
  data?: unknown;
  error?: string;
};

const kinds: readonly Kind[] = ['capabilities', 'eligibility', 'claims', 'credentialing'];

const copy = {
  en: {
    heading: 'Go healthcare API architecture',
    body: 'Explore the read-only transaction contracts for eligibility, claim status and credentialing. The preview uses fictional records and never contacts payers.',
    capabilities: 'Capabilities', eligibility: 'Eligibility 270/271',
    claims: 'Claim status 276/277', credentialing: 'Credentialing',
    offline: 'Local Go simulator not connected. Start the Go service to activate the interactive technical preview.',
    loading: 'Checking Go service…', connected: 'Go service connected — simulated transactions',
    noData: 'No records returned', source: 'Synthetic data · no PHI',
    refresh: 'Refresh', error: 'Preview unavailable', provider: 'Payer',
  },
  es: {
    heading: 'Arquitectura de API sanitaria en Go',
    body: 'Explore contratos de elegibilidad, reclamos y credencialización con datos ficticios, sin contactar pagadores.',
    capabilities: 'Capacidades', eligibility: 'Elegibilidad 270/271',
    claims: 'Estado de reclamos 276/277', credentialing: 'Credencialización',
    offline: 'El simulador Go local no está conectado. Inicie el servicio Go para habilitar esta vista.',
    loading: 'Consultando servicio Go…', connected: 'Servicio Go conectado — transacciones simuladas',
    noData: 'No hay registros', source: 'Datos sintéticos · sin PHI',
    refresh: 'Actualizar', error: 'Vista no disponible', provider: 'Pagador',
  },
} as const;

function fields(value: unknown): [string, string][] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value).filter(([k, v]) =>
    k !== 'effectiveDate' && k !== 'verifiedAt' && typeof v === 'string'
  ).slice(0, 6).map(([k, v]) => [k, String(v)]);
}

export function GoHealthcarePreview({ locale }: { locale: Locale }) {
  const [kind, setKind] = useState<Kind>('capabilities');
  const [generation, setGeneration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [payload, setPayload] = useState<Envelope | null>(null);
  const t = copy[locale];

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/healthcare/demo?kind=${kind}&orgId=bayview`, {
      cache: 'no-store', signal: controller.signal,
    })
      .then(async (response) => {
        const json = (await response.json()) as Envelope;
        if (!response.ok) throw new Error(json.error || 'go_preview_unavailable');
        return json;
      })
      .then((json) => {
        if (!controller.signal.aborted) {
          setPayload(json);
          setConnected(json.source === 'synthetic');
          setLoading(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPayload(null);
          setConnected(false);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [kind, generation]);

  const records = Array.isArray(payload?.data) ? payload.data :
    payload?.data && typeof payload.data === 'object' ? [payload.data] : [];
  return (
    <section className="relative mt-10 overflow-hidden rounded-[23px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-8" aria-labelledby="go-healthcare-heading" data-testid="go-healthcare-preview">
      <div className="pointer-events-none absolute -right-14 -top-14 size-48 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" />
      <div className="relative">
        <p className="eyebrow">{t.source}</p>
        <h2 id="go-healthcare-heading" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">{t.heading}</h2>
        <p className="muted mt-3 max-w-3xl text-sm">{t.body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label={t.heading}>
          {kinds.map((next) => (
            <button key={next} type="button" onClick={() => { setLoading(true); setKind(next); }}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline-offset-2 ${next === kind ? 'border-[var(--cyan)] bg-[var(--surface-2)] text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--cyan)]'}`}
              aria-pressed={next === kind}>
              {t[next]}
            </button>
          ))}
          <button type="button" className="ml-auto min-h-11 rounded-xl border border-[var(--border)] px-3 text-sm font-bold hover:border-[var(--cyan)]" onClick={() => { setLoading(true); setGeneration((n) => n + 1); }}>
            {t.refresh}
          </button>
        </div>
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4" role="status">
          <p className="flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="size-4 text-[var(--cyan)]" aria-hidden="true" />
            {loading ? t.loading : connected ? t.connected : t.offline}
          </p>
        </div>
        {connected && !loading && (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {records.map((record, index) => (
              <dl className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4" key={index}>
                {fields(record).map(([key, value]) => (
                  <div key={key} className="mb-3">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{key.replace(/([A-Z])/g, ' $1')}</dt>
                    <dd className="mt-1 break-words text-sm font-semibold">{value}</dd>
                  </div>
                ))}
                {!fields(record).length && <p className="muted text-sm">{t.noData}</p>}
              </dl>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
