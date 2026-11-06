import { ArrowUpRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

type Answer = { question: string; answer: string };
const faqs: Record<Locale, readonly Answer[]> = {
  en: [
    {
      question: 'Can ROOT work with the systems my practice already uses?',
      answer: 'Our approach starts by mapping your current workflows and systems before suggesting changes. Compatibility, access, vendor capabilities and any integrations are assessed during scoping rather than assumed.',
    },
    {
      question: 'What services can ROOT help us evaluate?',
      answer: 'Revenue cycle management, unpaid claims and denials, credentialing and enrollment, practice operations and revenue intelligence. The final scope and service owners are agreed in writing.',
    },
    {
      question: 'Is the initial consultation free?',
      answer: 'Yes. The initial 30-minute discussion is free. ROOT also offers a separately priced $2,500 Revenue Diagnostic, with any subsequent engagement quoted according to scope.',
    },
    {
      question: 'Will ROOT replace our practice management or EHR system?',
      answer: 'Not automatically. The goal is to improve visibility, accountability and process performance around the workflows you already use. Recommendations depend on the diagnostic and access available.',
    },
    {
      question: 'Can I see a working client portal?',
      answer: 'ROOT has synthetic demonstration workspaces. Access to real organization data and live capabilities requires an authorized account, correct membership and completed deployment and security checks.',
    },
    {
      question: 'Can I send patient details through the website or Calendly?',
      answer: 'No. Do not submit patient information, claim-level identifiers or clinical records through public forms or booking notes. ROOT will identify an appropriate secure channel if sensitive records are needed.',
    },
    {
      question: 'What happens after we book a meeting?',
      answer: 'We discuss your goals, current revenue-operation bottlenecks and the best next step. Any diagnostic, onboarding, integration or recurring service will be scoped separately before work begins.',
    },
  ],
  es: [
    {
      question: '¿Puede ROOT trabajar con los sistemas que ya utiliza mi consulta?',
      answer: 'Primero analizamos sus flujos de trabajo y sistemas actuales. La compatibilidad, los accesos y las integraciones se evalúan durante la definición del alcance; no se dan por supuestos.',
    },
    {
      question: '¿Qué servicios puede evaluar ROOT?',
      answer: 'Gestión del ciclo de ingresos, reclamaciones pendientes y denegaciones, acreditación e inscripción, operaciones de la consulta e inteligencia de ingresos. El alcance final se acuerda por escrito.',
    },
    {
      question: '¿La consulta inicial es gratuita?',
      answer: 'Sí. La primera conversación de 30 minutos es gratuita. ROOT también ofrece un Diagnóstico de Ingresos por $2,500; los servicios posteriores se cotizan según el alcance.',
    },
    {
      question: '¿ROOT reemplazará nuestro sistema de gestión o historia clínica?',
      answer: 'No necesariamente. Buscamos mejorar la visibilidad y la responsabilidad en los procesos existentes. Cualquier recomendación depende del diagnóstico y los accesos disponibles.',
    },
    {
      question: '¿Puedo ver un portal de clientes funcional?',
      answer: 'ROOT ofrece espacios de demostración con datos sintéticos. El acceso a información real requiere una cuenta autorizada, membresía correcta y controles de seguridad y despliegue aprobados.',
    },
    {
      question: '¿Puedo enviar datos de pacientes por el sitio o Calendly?',
      answer: 'No. No comparta datos de pacientes, identificadores de reclamaciones ni documentos clínicos en formularios públicos o notas de reserva. Se indicará un canal seguro cuando sea necesario.',
    },
    {
      question: '¿Qué ocurre después de reservar una reunión?',
      answer: 'Hablamos de sus objetivos, los obstáculos en las operaciones de ingresos y el siguiente paso. Los diagnósticos, integraciones y servicios posteriores se definirán por separado.',
    },
  ],
};

export function HomeFaq({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  return (
    <section id="faq" aria-labelledby="root-faq-title" className="scroll-mt-24 py-4" data-testid="root-home-faq">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(250px,0.75fr)_minmax(0,1.25fr)]">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow flex items-center gap-2"><HelpCircle className="size-4" aria-hidden="true"/>{es ? 'Preguntas frecuentes' : 'Frequently asked questions'}</p>
          <h2 id="root-faq-title" className="mt-4 max-w-sm text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
            {es ? 'Respuestas claras, antes del primer paso.' : 'Clear answers before the first step.'}
          </h2>
          <p className="muted mt-5 max-w-md leading-7">
            {es ? 'Empiece con lo esencial y profundice cuando esté listo.' : 'Start with the essentials. Explore the details when you need them.'}
          </p>
          <Link href={localizedPath(locale, '/consultation') + '#book'} className="btn-primary mt-7">
            {es ? 'Agendar una conversación' : 'Schedule a conversation'}
            <ArrowUpRight className="size-4" aria-hidden="true"/>
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)] overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          {faqs[locale].map((faq, i) => (
            <details key={faq.question} className="group p-5 open:bg-[var(--surface-2)] sm:p-6" open={i === 0}>
              <summary className="cursor-pointer list-none rounded-lg pr-6 text-base font-bold leading-7 outline-offset-4 marker:hidden">
                <span className="flex items-start justify-between gap-4">
                  {faq.question}
                  <span className="shrink-0 text-xl font-normal text-[var(--cyan)] group-open:rotate-45" aria-hidden="true">+</span>
                </span>
              </summary>
              <p className="muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
