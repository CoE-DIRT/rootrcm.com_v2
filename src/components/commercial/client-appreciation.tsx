import { MessageCircleMore, ListChecks, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Section, SectionHeading } from '@/components/ui/Section';
import type { Locale } from '@/i18n/locales';

/** Anonymous, non-verbatim themes from the owner's professional client feedback.
 * Never fabricate an individual's quotation, job title or endorsement.
 */
export function ClientAppreciation({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const themes = es
    ? [
        { Icon: MessageCircleMore, title: 'Comunicación clara', body: 'Explicaciones directas, informes útiles y seguimiento que facilita la toma de decisiones.' },
        { Icon: ListChecks, title: 'Atención a cada detalle', body: 'Análisis cuidadoso de denegaciones, cuentas pendientes y obstáculos con pagadores.' },
        { Icon: HeartHandshake, title: 'Compromiso con el trabajo', body: 'Responsabilidad, constancia y soluciones prácticas para los equipos de las consultas.' },
      ]
    : [
        { Icon: MessageCircleMore, title: 'Clear communication', body: 'Straightforward explanations, useful updates and follow-through that supports decisions.' },
        { Icon: ListChecks, title: 'Attention to detail', body: 'Careful analysis of denials, outstanding accounts and payer-related obstacles.' },
        { Icon: HeartHandshake, title: 'Commitment to the work', body: 'Ownership, consistency and practical solutions for busy practice teams.' },
      ];

  return (
    <Section labelledBy="proof-heading" spacing="compact" data-testid="client-appreciation">
      <div className="client-appreciation">
        <SectionHeading
          id="proof-heading"
          eyebrow={es ? 'Lo que nuestros clientes valoran' : 'What clients appreciate'}
          title={es ? 'Confianza construida con trabajo constante.' : 'Trust built through consistent work.'}
          body={es
            ? 'Comunicación clara, atención a los detalles y dedicación constante al éxito operativo de cada consulta.'
            : 'Clear communication, attention to detail and dependable follow-through across revenue-cycle engagements.'}
        />
        <div className="proof-grid">
          {themes.map(({ Icon, title, body }) => (
            <Card
              key={title}
              surface="glass"
              headingLevel={3}
              kicker={<Icon aria-hidden="true" size={20} strokeWidth={1.75} />}
              title={title}
              body={body}
            />
          ))}
        </div>
        <p className="client-appreciation__footer">
          <ShieldCheck aria-hidden="true" size={19} strokeWidth={1.75} />
          {es
            ? 'Colaboración responsable, acceso por funciones y visibilidad clara del trabajo.'
            : 'Responsible collaboration, role-based access and clear visibility into the work.'}
        </p>
      </div>
    </Section>
  );
}
