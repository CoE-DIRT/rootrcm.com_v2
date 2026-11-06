import type { Locale } from '@/i18n/locales';

export type FaqItem = { q: Record<Locale, string>; a: Record<Locale, string> };
export type FaqGroup = { id: string; title: Record<Locale, string>; items: readonly FaqItem[] };

/**
 * Buyer FAQ. Answers describe how ROOT works without asserting unverified
 * certifications, turnaround guarantees or customer outcomes.
 */
export const faqGroups: readonly FaqGroup[] = [
  {
    id: 'software',
    title: { en: 'Software and switching', es: 'Software y cambio' },
    items: [
      {
        q: { en: 'Can I keep my software?', es: '¿Puedo conservar mi software?' },
        a: {
          en: 'Yes. ROOT works inside the EHR, practice management system and clearinghouse you already use. We are not asking you to replace anything, and your clinicians keep their daily workflow.',
          es: 'Sí. ROOT trabaja dentro del EHR, el sistema de gestión y el intermediario que ya utiliza. No le pedimos reemplazar nada y sus profesionales mantienen su flujo diario.',
        },
      },
      {
        q: { en: 'How does ROOT get access to our systems?', es: '¿Cómo accede ROOT a nuestros sistemas?' },
        a: {
          en: 'Through individual user accounts that your administrator creates and can revoke at any time. Access scope is agreed in writing during onboarding.',
          es: 'Mediante cuentas de usuario individuales que su administrador crea y puede revocar en cualquier momento. El alcance del acceso se acuerda por escrito durante la incorporación.',
        },
      },
      {
        q: { en: 'How long does it take to get started?', es: '¿Cuánto se tarda en empezar?' },
        a: {
          en: 'It depends on your payer mix, system access and backlog. We agree a start plan with dates during scoping, and exception work begins as soon as access is in place.',
          es: 'Depende de su combinación de pagadores, el acceso a sistemas y el atraso. Acordamos un plan con fechas durante el alcance y el trabajo de excepciones empieza en cuanto hay acceso.',
        },
      },
    ],
  },
  {
    id: 'accountability',
    title: { en: 'Ownership and visibility', es: 'Responsables y visibilidad' },
    items: [
      {
        q: { en: 'Where is my money?', es: '¿Dónde está mi dinero?' },
        a: {
          en: 'Every open claim shows where it sits — submitted, pending, denied or paid — with a named owner and the next action. You see it on the same dashboard ROOT uses.',
          es: 'Cada reclamo abierto muestra dónde está —enviado, pendiente, denegado o pagado— con un responsable y la próxima acción. Lo ve en el mismo tablero que usa ROOT.',
        },
      },
      {
        q: { en: 'What is named exception ownership?', es: '¿Qué es un responsable con nombre por excepción?' },
        a: {
          en: 'Every unpaid claim, denial and credentialing task is assigned to a specific person on the ROOT team, with a reason and a due date. Nothing sits in an anonymous queue.',
          es: 'Cada reclamo impago, denegación y tarea de acreditación se asigna a una persona concreta del equipo ROOT, con un motivo y una fecha límite. Nada queda en una cola anónima.',
        },
      },
      {
        q: { en: 'Will I see the same numbers you see?', es: '¿Veré las mismas cifras que ustedes?' },
        a: {
          en: 'Yes. Your team and ROOT read from one shared view of claims, denials, credentialing and weekly cash reconciliation.',
          es: 'Sí. Su equipo y ROOT leen una sola vista compartida de reclamos, denegaciones, acreditación y conciliación semanal de caja.',
        },
      },
      {
        q: { en: 'Why are enrollments stalled?', es: '¿Por qué se detienen las inscripciones?' },
        a: {
          en: 'Usually a missing document, an out-of-date CAQH attestation or a payer waiting on a response. ROOT tracks each enrollment as a checklist with an owner so you can see which step is blocking.',
          es: 'Normalmente falta un documento, la atestación CAQH está desactualizada o el pagador espera una respuesta. ROOT sigue cada inscripción como una lista con responsable para ver qué paso bloquea.',
        },
      },
    ],
  },
  {
    id: 'getting-started',
    title: { en: 'Cost and getting started', es: 'Costo y primeros pasos' },
    items: [
      {
        q: { en: 'What happens in the free revenue leak review?', es: '¿Qué incluye la revisión gratuita de fugas?' },
        a: {
          en: 'A short conversation and a look at your top revenue concerns. You leave with a view of where money is most likely stalling and what a deeper diagnostic would cover — with no obligation.',
          es: 'Una conversación breve y una mirada a sus principales preocupaciones de ingresos. Sale con una idea de dónde es más probable que se detenga el dinero y qué cubriría un diagnóstico más profundo, sin compromiso.',
        },
      },
      {
        q: { en: 'What does the $2,500 Revenue Diagnostic include?', es: '¿Qué incluye el Diagnóstico de Ingresos de $2,500?' },
        a: {
          en: 'A fixed-fee review of your billing history, denial patterns, payer mix and aging A/R, delivered as a prioritized list of actions. Follow-on work is quoted separately and only with your approval.',
          es: 'Una revisión de tarifa fija de su historial de facturación, patrones de denegación, combinación de pagadores y cuentas por cobrar, entregada como una lista priorizada de acciones. El trabajo posterior se cotiza aparte y solo con su aprobación.',
        },
      },
      {
        q: { en: 'Do I have to sign a long contract?', es: '¿Debo firmar un contrato largo?' },
        a: {
          en: 'No long-term commitment is required to start. Managed services are scoped in writing — inclusions, responsibilities and rates — before any work begins.',
          es: 'No se requiere un compromiso largo para empezar. Los servicios gestionados se definen por escrito —inclusiones, responsabilidades y tarifas— antes de comenzar.',
        },
      },
    ],
  },
  {
    id: 'security',
    title: { en: 'Security and patient data', es: 'Seguridad y datos de pacientes' },
    items: [
      {
        q: { en: 'How is patient information protected?', es: '¿Cómo se protege la información de pacientes?' },
        a: {
          en: 'Patient information stays inside your systems and is reached only through accounts you control. Security, PHI handling and Business Associate Agreement terms are reviewed with you during scoping, before any access is granted.',
          es: 'La información de pacientes permanece en sus sistemas y solo se accede con cuentas que usted controla. La seguridad, el manejo de PHI y los términos del acuerdo BAA se revisan con usted durante el alcance, antes de otorgar acceso.',
        },
      },
      {
        q: { en: 'Can I send patient details through this website?', es: '¿Puedo enviar datos de pacientes por este sitio?' },
        a: {
          en: 'No. Forms on this website accept business contact details only. Please never include patient names, dates of birth, member IDs or clinical details.',
          es: 'No. Los formularios de este sitio aceptan solo datos de contacto empresarial. Nunca incluya nombres de pacientes, fechas de nacimiento, identificadores de afiliado ni datos clínicos.',
        },
      },
    ],
  },
];

export function allFaqItems() {
  return faqGroups.flatMap((group) => group.items);
}
