'use client';

import { Accordion } from '@/components/ui/accordion';
import { SectionHeader } from '@/components/commercial/section-header';
import type { Locale } from '@/i18n/locales';

export function PracticeFaqSection({ locale }: { locale: Locale }) {
  const es = locale === 'es';

  const faqs = [
    {
      q: es
        ? '¿Cómo se conecta ROOT a nuestro EHR actual sin necesidad de reemplazar el software?'
        : 'How does ROOT connect to our current EHR without software replacement?',
      a: es
        ? 'ROOT opera directamente dentro de su sistema de EHR y gestión de práctica actual (como Athenahealth, Epic, eClinicalWorks, NextGen o Kareo). Nuestros especialistas se conectan mediante accesos seguros de proveedor o credenciales de clearinghouse, lo que significa que sus médicos y personal de recepción mantienen su flujo diario sin interrupciones ni costosas migraciones de datos.'
        : 'ROOT operates directly within your existing EHR and practice management system (such as Athenahealth, Epic, eClinicalWorks, NextGen, or Kareo). Our specialists connect using standard, secure provider accounts or clearinghouse credentials, meaning your clinicians and front desk keep their exact daily workflows without downtime or costly data migrations.',
    },
    {
      q: es
        ? '¿Qué significa "responsable asignado por excepción"?'
        : 'What is named exception ownership?',
      a: es
        ? 'A diferencia de los proveedores de facturación tradicionales que acumulan reclamos en colas anónimas, ROOT asigna cada reclamo impago, denegación e hito de acreditación a un especialista con nombre y apellido, un código de causa raíz y una fecha límite estricta. Su práctica siempre sabe quién es el dueño de cada caso y cuál es la siguiente acción programada.'
        : 'Unlike traditional billing vendors that bury uncollected claims in anonymous backlogs, ROOT assigns every unpaid claim, payer denial, and credentialing milestone to a named team specialist with a root-cause reason code and a strict due date. Your practice always knows who is working on each item and what the next action is.',
    },
    {
      q: es
        ? '¿En qué consiste el Diagnóstico de Ingresos?'
        : 'What happens during the Revenue Diagnostic?',
      a: es
        ? 'El Diagnóstico de Ingresos es un análisis estructurado de 14 días de su historial de facturación, patrones de denegación, combinación de pagadores y cuentas por cobrar envejecidas. Identificamos puntos exactos de fuga financiera y entregamos una hoja de ruta priorizada con acciones de recuperación, sin compromiso de contratar servicios continuos.'
        : 'The Revenue Diagnostic is a 14-day structured analysis of your billing history, denial patterns, payer fee schedules, and aging accounts receivable. We identify exact revenue leakage points and deliver a prioritized recovery roadmap—with zero obligation to purchase ongoing managed services.',
    },
    {
      q: es
        ? '¿Cómo funciona la garantía de "los mismos números" y visibilidad compartida?'
        : 'How does the shared visibility model work?',
      a: es
        ? 'Usted y ROOT observan exactamente las mismas cifras. Su equipo directivo tiene visibilidad continua de las colas operativas en vivo, volumen de envíos diarios, apelaciones en curso y conciliación semanal de caja contra depósitos bancarios reales.'
        : 'You and ROOT look at the exact same numbers. Our clients have continuous visibility into live operational queues, daily submission rates, pending appeals, and weekly cash collections reconciled directly against bank deposits.',
    },
    {
      q: es
        ? '¿Cómo garantiza ROOT el cumplimiento de HIPAA y la seguridad de datos?'
        : 'How does ROOT handle HIPAA compliance and patient data?',
      a: es
        ? 'Firmamos Acuerdos de Socio Comercial (BAA) con cada entidad cubierta. El personal operativo sigue estrictos controles de acceso basados en roles, registros de auditoría y principios de mínimo privilegio. Los formularios y canales públicos de este sitio no aceptan ni almacenan información médica protegida (PHI).'
        : 'We execute Business Associate Agreements (BAAs) with every covered entity. Operational staff follow strict role-based access controls, audit logging, and least-privilege principles. Public website and marketing workflows do not accept or store Protected Health Information (PHI).',
    },
    {
      q: es
        ? '¿Cuánto tiempo toma comenzar a trabajar con ROOT?'
        : 'How quickly can our practice get started?',
      a: es
        ? 'Comenzamos con una sesión de evaluación o diagnóstico preliminar. El acceso técnico a los sistemas y la definición del inventario inicial demoran habitualmente entre 5 y 7 días hábiles, momento a partir del cual se inicia de inmediato la gestión activa de excepciones.'
        : 'We start with an introductory diagnostic review. Technical system access and operational scoping typically take 5 to 7 business days, after which exception triage begins immediately.',
    },
  ];

  return (
    <section className="commercial-section" aria-labelledby="faq-section-heading">
      <SectionHeader
        id="faq-section-heading"
        eyebrow={es ? 'PREGUNTAS FRECUENTES' : 'FREQUENTLY ASKED QUESTIONS'}
        title={es ? 'Claridad operativa para directores y administradores de práctica' : 'Operational clarity for practice leaders and administrators'}
        body={
          es
            ? 'Respuestas directas sobre integración de sistemas, propiedad de excepciones, conciliación de caja y seguridad de datos.'
            : 'Straightforward answers about software compatibility, exception workflows, cash reconciliation, and data security.'
        }
      />
      <div className="mt-8 grid gap-3 max-w-4xl mx-auto">
        {faqs.map((faq) => (
          <Accordion key={faq.q} title={faq.q}>
            <p className="leading-relaxed text-sm text-[var(--muted)]">{faq.a}</p>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
