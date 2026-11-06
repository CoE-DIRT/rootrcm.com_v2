import { BadgeCheck, FileLock2, Gauge, KeyRound, LayoutDashboard, ScrollText, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section, SectionHeading } from '@/components/ui/Section';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { VerifyMarker } from './verify-marker';

const icon = { size: 20, strokeWidth: 1.75, 'aria-hidden': true } as const;

/**
 * Proof blocks are fully designed but intentionally empty of claims. Each block
 * carries a VERIFY BEFORE LAUNCH marker; content is filled only from verified,
 * customer-approved or audited sources.
 */
export function ProofPlaceholders({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const es = locale === 'es';
  const onRequest = es ? 'Disponible a solicitud' : 'Available on request';

  const security = [
    { Icon: ShieldCheck, title: es ? 'HIPAA y manejo de PHI' : 'HIPAA and PHI handling', body: es ? 'Cómo se accede, se registra y se limita la información de pacientes. Se revisa con usted durante el alcance.' : 'How patient information is accessed, logged and limited. Reviewed with you during scoping.' },
    { Icon: ScrollText, title: es ? 'Acuerdo BAA' : 'Business Associate Agreement', body: es ? 'Los términos del BAA se comparten antes de cualquier acceso a sistemas.' : 'BAA terms are shared before any system access is granted.' },
    { Icon: BadgeCheck, title: es ? 'SOC 2 e ISO 27001' : 'SOC 2 and ISO 27001', body: es ? 'El estado de cada marco se publica aquí solo con evidencia de un auditor.' : 'Status for each framework is published here only with auditor evidence.' },
    { Icon: KeyRound, title: es ? 'Cifrado y controles de acceso' : 'Encryption and access controls', body: es ? 'Cuentas individuales, acceso por rol y revocación por su administrador.' : 'Individual accounts, role-based access and revocation by your administrator.' },
    { Icon: FileLock2, title: es ? 'Registros de auditoría' : 'Audit logs', body: es ? 'Quién hizo qué y cuándo, en cada reclamo y tarea.' : 'Who did what, and when, on every claim and task.' },
    { Icon: Gauge, title: es ? 'Respuesta a incidentes' : 'Incident response', body: es ? 'Cómo y en qué plazo le informamos si algo sale mal.' : 'How, and how quickly, we tell you if something goes wrong.' },
  ];

  const slas = [
    es ? 'Tasa de reclamos limpios' : 'Clean claim rate',
    es ? 'Respuesta a denegaciones' : 'Denial response time',
    es ? 'Plazo de acreditación' : 'Credentialing turnaround',
    es ? 'Cadencia de informes' : 'Reporting cadence',
  ];

  return (
    <Section labelledBy="proof-heading" tone="raised" divider="wave" data-testid="proof-placeholders">
      <SectionHeading id="proof-heading" eyebrow={t.commercial.proofEyebrow} title={t.commercial.proofTitle} body={t.commercial.proofBody} />

      <div className="stack-lg">
        {/* Testimonials */}
        <div className="proof-grid">
          {[0, 1, 2].map((slot) => (
            <Card key={slot} surface="outline" as="article" headingLevel={3} title={es ? 'Historia de cliente' : 'Customer story'} kicker={es ? 'Testimonio' : 'Testimonial'}>
              <VerifyMarker />
              <div className="proof-slot">
                <div className="proof-slot__lines" aria-hidden="true">
                  <span className="proof-slot__line" />
                  <span className="proof-slot__line" />
                  <span className="proof-slot__line" />
                </div>
                <p className="ui-card__body">{t.commercial.proofEmptyBody}</p>
                <div className="proof-slot__meta">
                  <span className="proof-slot__avatar" aria-hidden="true" />
                  <span className="ui-card__body">{es ? 'Nombre · cargo · organización · resultado' : 'Name · role · organization · outcome'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Case study */}
        <Card surface="base" padding="lg" kicker={es ? 'Caso de estudio' : 'Case study'} title={es ? 'Cómo se ve un caso publicado' : 'What a published case study covers'} headingLevel={3}>
          <VerifyMarker />
          <dl className="case-grid">
            {[
              [es ? 'Línea base' : 'Baseline', es ? 'Dónde empezó la práctica' : 'Where the practice started'],
              [es ? 'Intervención' : 'Intervention', es ? 'Qué cambió ROOT' : 'What ROOT changed'],
              [es ? 'Resultado' : 'Result', es ? 'Qué se movió, medido' : 'What moved, measured'],
              [es ? 'Plazo' : 'Timeframe', es ? 'En cuánto tiempo' : 'Over what period'],
              [es ? 'Cita' : 'Quote', es ? 'En palabras del cliente' : 'In the customer’s words'],
            ].map(([term, desc]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
          <p className="ui-card__body">{es ? 'Los casos se publican con la aprobación escrita del cliente.' : 'Case studies are published with the customer’s written approval.'}</p>
        </Card>

        {/* Logo strip */}
        <div className="stack">
          <VerifyMarker />
          <p className="ui-eyebrow">{es ? 'Prácticas que confían en ROOT' : 'Practices working with ROOT'}</p>
          <ul className="proof-logos" aria-label={es ? 'Logotipos de clientes (se publican con permiso)' : 'Client logos (published with permission)'}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <li key={n}>{es ? 'Con permiso' : 'With permission'}</li>
            ))}
          </ul>
        </div>

        {/* Security & compliance statements */}
        <div className="ui-grid">
          {security.map(({ Icon, title, body }) => (
            <Card key={title} surface="raised" headingLevel={3} title={title} body={body} kicker={<Icon {...icon} />} footer={<Badge status="neutral">{onRequest}</Badge>}>
              <VerifyMarker />
            </Card>
          ))}
        </div>

        <div className="split">
          {/* Service-level commitments */}
          <Card surface="base" padding="lg" headingLevel={3} kicker={es ? 'Compromisos de servicio' : 'Service-level commitments'} title={es ? '¿Qué se compromete ROOT a cumplir?' : 'What will ROOT commit to?'}>
            <VerifyMarker />
            <ul className="sla-list">
              {slas.map((sla) => (
                <li key={sla}>
                  <span>{sla}</span>
                  <span>{es ? 'Se define en su contrato' : 'Set in your agreement'}</span>
                </li>
              ))}
            </ul>
          </Card>
          {/* Same numbers guarantee + leadership */}
          <div className="stack">
            <Card surface="raised" headingLevel={3} kicker={<LayoutDashboard {...icon} />} title={es ? 'Garantía de las mismas cifras' : 'The “same numbers” guarantee'} body={es ? 'Usted y ROOT trabajan desde los mismos tableros e informes compartidos.' : 'You and ROOT work from the same shared dashboards and reports.'}>
              <VerifyMarker />
            </Card>
            <Card surface="raised" headingLevel={3} kicker={<Users {...icon} />} title={es ? 'Liderazgo y credenciales RCM' : 'Leadership and RCM credentials'} body={es ? 'Conozca al equipo responsable de su cuenta y sus credenciales profesionales.' : 'Meet the team accountable for your account and their professional credentials.'}>
              <VerifyMarker />
              <Button href={localizedPath(locale, '/company')} variant="link">
                {es ? 'Conozca a ROOT' : 'Meet ROOT'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
