import { SectionHeader } from '@/components/commercial/section-header';
import { EmptyState } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { proofSlots } from '@/content/credibility';
import type { Locale } from '@/i18n/locales';
import { ShieldCheck, CheckCircle2, Lock, Scale, Eye } from 'lucide-react';

export function ProofUnpublished({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const es = locale === 'es';

  const commitments = [
    {
      icon: ShieldCheck,
      title: es ? 'Alineación HIPAA y Disponibilidad BAA' : 'HIPAA Safeguards & BAA Availability',
      desc: es
        ? 'Firmamos acuerdos BAA formales con cada práctica médica cubierta. Las medidas técnicas, administrativas y físicas protegen los datos operativos.'
        : 'Formal Business Associate Agreements (BAAs) executed with every covered entity. Rigorous administrative, physical, and technical safeguards.',
    },
    {
      icon: Eye,
      title: es ? 'Garantía de "Los Mismos Números"' : '"Same Numbers" Visibility Guarantee',
      desc: es
        ? 'Prácticas y operadores observan exactamente el mismo tablero de reclamos, depósitos bancarios y estados de excepción en tiempo real.'
        : 'Practices and ROOT operators monitor identical live queues, verified bank deposits, and claim adjudication records in real time.',
    },
    {
      icon: Scale,
      title: es ? 'Compromisos de Nivel de Servicio (SLA)' : 'Service-Level Commitments (SLA)',
      desc: es
        ? 'Meta de tasa de reclamos limpios >98%, triaje de denegaciones en 48 horas laborables y cadencia de conciliación semanal.'
        : 'Target clean claim rate >98%, 48-hour denial triage turnaround, and structured weekly cash reconciliation cadences.',
    },
    {
      icon: Lock,
      title: es ? 'Transparencia de Seguridad y Cumplimiento' : 'Security & Compliance Posture',
      desc: es
        ? 'Cifrado de datos en reposo y en tránsito. Controles de acceso basados en roles. No se realizan afirmaciones de certificación sin evidencia formal.'
        : 'Encryption in transit and at rest. Strict role-based access control. No unverified certification claims made.',
    },
  ];

  return (
    <section className="commercial-section" aria-labelledby="proof-heading">
      <SectionHeader
        id="proof-heading"
        eyebrow={t.commercial.proofEyebrow}
        title={t.commercial.proofTitle}
        body={t.commercial.proofBody}
      />

      {/* Customer Voices Slots — strictly unpublished until verified */}
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {proofSlots.map((slot) => (
          <li key={slot.id}>
            {slot.editorialStatus === 'published' && slot.quote ? (
              <blockquote className="surface p-6">
                <p className="eyebrow">{slot.role[locale]}</p>
                <p className="mt-3 text-lg font-bold">“{slot.quote[locale]}”</p>
                {slot.attribution ? (
                  <footer className="muted mt-3 text-sm">{slot.attribution[locale]}</footer>
                ) : null}
              </blockquote>
            ) : (
              <EmptyState
                title={`${slot.role[locale]} · ${t.commercial.proofEmptyTitle}`}
                body={t.commercial.proofEmptyBody}
              />
            )}
          </li>
        ))}
      </ul>

      {/* Verified Commitments & Compliance Framework */}
      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div>
            <span className="eyebrow">{es ? 'ESTÁNDARES OPERATIVOS' : 'OPERATIONAL STANDARDS'}</span>
            <h3 className="mt-1 text-lg font-bold text-[var(--text)]">
              {es ? 'Gobernanza, Privacidad y Compromisos de Servicio' : 'Governance, Privacy & Service Level Commitments'}
            </h3>
          </div>
          <span className="badge-resolved">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {es ? 'Políticas vigentes 2026' : 'Active 2026 Policies'}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface flex flex-col justify-between p-4">
                <div>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--cyan)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <h4 className="mt-2.5 text-xs font-bold text-[var(--text)]">{item.title}</h4>
                  <p className="muted mt-1.5 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
