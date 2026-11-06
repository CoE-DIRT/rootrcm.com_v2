import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BarChart3, Building2, CircleCheck, ShieldCheck, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';
import { teamMembers } from '@/content/team';
import type { Locale } from '@/i18n/locales';

export const metadata: Metadata = {
  title: 'ROOT V2 — Figma 6 visual preview',
  robots: { index: false, follow: false },
};

const content = {
  en: {
    eyebrow: 'ROOT / DESIGN PREVIEW · SYNTHETIC CONTENT ONLY',
    title: 'Revenue operations with every next action in view.',
    subtitle: 'A more connected experience for independent practices—designed for clarity from first conversation through day-to-day operations.',
    primary: 'Explore a consultation',
    secondary: 'Preview account access',
    badge: 'Visual prototype, not a live RCM system',
    workflowEyebrow: 'A connected operating journey',
    workflowTitle: 'From discovery to accountable delivery.',
    workflow: ['Discover', 'Assess', 'Scope', 'Onboard', 'Connect', 'Execute', 'Monitor', 'Optimize'],
    workflowBody: 'Each step has a clear responsibility and a visible handoff. Real data and payer transactions remain unavailable in this preview.',
    evidenceEyebrow: 'A better way to see the work',
    evidenceTitle: 'Human-centered operations, not another black box.',
    evidenceCopy: 'The experience should make responsibilities, exceptions and next actions easy to find—without implying a live integration.',
    media1: 'Collaborative financial and operational analysis, editorial photograph. Not ROOT staff.',
    media2: 'Physician using a laptop, editorial photograph. Not ROOT staff.',
    accessEyebrow: 'Design direction · Portal onboarding',
    accessTitle: 'A simple front door. A governed workspace beyond it.',
    accessBody: 'Account creation, email verification, Microsoft/Google sign-in and secure recovery are engineering-owned. Here we validate the presentation; no credentials are collected on this page.',
    accessCta: 'View current sign-in',
    teamEyebrow: 'Our people',
    teamTitle: 'Accountability by role.',
    teamNote: 'Leadership roles are shown for layout evaluation. No stock photographs or fabricated credentials are attributed to individuals.',
    endTitle: 'Ready to discuss your revenue operations?',
    endBody: 'Talk through workflow bottlenecks without sharing patient information.',
    note: 'This is an unindexed visual design lab. No clinical records, payer transactions, CRM writes or checkout are connected here.',
  },
  es: {
    eyebrow: 'ROOT / VISTA DE DISEÑO · SOLO CONTENIDO SINTÉTICO',
    title: 'Operaciones de ingresos con cada próxima acción a la vista.',
    subtitle: 'Una experiencia conectada para consultorios independientes, diseñada para dar claridad desde la primera conversación hasta las operaciones diarias.',
    primary: 'Explorar una consulta',
    secondary: 'Ver acceso a la cuenta',
    badge: 'Prototipo visual, no sistema RCM en vivo',
    workflowEyebrow: 'Un recorrido operativo conectado',
    workflowTitle: 'Del descubrimiento a una ejecución responsable.',
    workflow: ['Descubrir', 'Evaluar', 'Definir alcance', 'Incorporar', 'Conectar', 'Ejecutar', 'Supervisar', 'Optimizar'],
    workflowBody: 'Cada etapa tiene una responsabilidad y un traspaso visibles. Los datos reales y las transacciones de pagadores no están disponibles en esta vista previa.',
    evidenceEyebrow: 'Otra forma de ver el trabajo',
    evidenceTitle: 'Operaciones centradas en personas, no otra caja negra.',
    evidenceCopy: 'La experiencia debe facilitar la identificación de responsables, excepciones y próximas acciones sin insinuar una integración activa.',
    media1: 'Análisis financiero y operativo colaborativo, fotografía editorial. No es personal de ROOT.',
    media2: 'Médico usando un portátil, fotografía editorial. No es personal de ROOT.',
    accessEyebrow: 'Dirección de diseño · Incorporación',
    accessTitle: 'Una entrada sencilla. Un espacio de trabajo controlado.',
    accessBody: 'La creación de cuentas, verificación de correo, acceso Microsoft/Google y recuperación segura corresponden a ingeniería. Esta página valida la presentación y no recopila credenciales.',
    accessCta: 'Ver acceso actual',
    teamEyebrow: 'Nuestro equipo',
    teamTitle: 'Responsabilidad según la función.',
    teamNote: 'Se muestran cargos para evaluar el diseño. No se atribuyen fotos de archivo ni credenciales inventadas a personas.',
    endTitle: '¿Hablamos de sus operaciones de ingresos?',
    endBody: 'Conversemos sobre cuellos de botella sin compartir información de pacientes.',
    note: 'Este laboratorio visual no se indexa. Aquí no se conectan registros clínicos, operaciones de pagadores, CRM ni pagos.',
  },
} as const;

const accents = [BarChart3, Building2, ShieldCheck, CircleCheck] as const;

export default async function VisualLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = await requireLocale(params);
  const t = content[locale];

  return (
    <main id="main" className="page-width pb-20 pt-8" data-testid="root-figma6-visual-lab">
      <section className="relative isolate overflow-hidden rounded-[30px] border border-[#2a6078] bg-[#061225] px-6 py-10 text-[#f2f8ff] shadow-[0_35px_90px_rgba(3,16,36,.25)] sm:px-10 lg:px-14 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 size-[440px] rounded-full bg-[#11e1ee]/[.12] blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 left-10 size-[380px] rounded-full bg-blue-500/[.12] blur-[100px]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#7ff7ff]"><Sparkles className="size-4" aria-hidden="true" />{t.eyebrow}</p>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(2.15rem,4.8vw,4.35rem)] font-extrabold leading-[1.08] tracking-[-.04em]">{t.title}</h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-[#cfe2f2] md:text-lg">{t.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary btn-lg shadow-[0_15px_44px_rgba(17,225,238,.18)]" href={localizedPath(locale, '/consultation')}>{t.primary}<ArrowUpRight className="size-4" aria-hidden="true"/></Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20" href={localizedPath(locale, '/sign-in')}>{t.secondary}</Link>
            </div>
            <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.07] px-3 py-2 text-xs text-[#cfe2f2]"><ShieldCheck className="size-4" aria-hidden="true"/>{t.badge}</p>
          </div>
          <figure className="relative min-w-0 transform-gpu overflow-hidden rounded-[26px] border border-white/20 bg-[#132b45] shadow-[0_26px_80px_rgba(0,0,0,.35)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-1 motion-reduce:transform-none">
            <Image src="/media/stock/revenue-analytics.webp" alt={t.media1} width={1600} height={1067} sizes="(max-width: 1023px) 88vw, 530px" priority className="aspect-[4/3] w-full object-cover" />
            <figcaption className="border-t border-white/15 px-4 py-3 text-xs leading-5 text-[#d5e5f2]">{t.media1}</figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="visual-lab-workflow">
        <p className="eyebrow">{t.workflowEyebrow}</p>
        <h2 id="visual-lab-workflow" className="mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-tight md:text-4xl">{t.workflowTitle}</h2>
        <p className="muted mt-4 max-w-3xl">{t.workflowBody}</p>
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {t.workflow.map((stage, index) => {
            const Accent = accents[index % accents.length];
            return (
              <li key={stage} className="group relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--cyan)] motion-reduce:transform-none">
                <div className="mb-9 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[.12em] text-[var(--cyan)]">{String(index+1).padStart(2,'0')}</span>
                  <Accent className="size-5 text-[var(--muted)]" aria-hidden="true"/>
                </div>
                <h3 className="text-base font-extrabold">{stage}</h3>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-20 grid items-center gap-10 lg:grid-cols-2" aria-labelledby="visual-lab-evidence">
        <figure className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <Image src="/media/stock/analytics-team.webp" alt={t.media1} width={1600} height={1067} sizes="(max-width: 1023px) 88vw, 580px" className="aspect-[4/3] w-full object-cover" />
          <figcaption className="muted px-5 py-3 text-xs">{t.media1}</figcaption>
        </figure>
        <div>
          <p className="eyebrow">{t.evidenceEyebrow}</p>
          <h2 id="visual-lab-evidence" className="mt-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">{t.evidenceTitle}</h2>
          <p className="muted mt-5 text-lg leading-8">{t.evidenceCopy}</p>
          <Link className="btn-secondary mt-7" href={localizedPath(locale, '/services')}>{locale === 'es' ? 'Explorar servicios' : 'Explore services'}<ArrowUpRight className="size-4" aria-hidden="true"/></Link>
        </div>
      </section>

      <section className="mt-20 overflow-hidden rounded-[25px] border border-[var(--border)] bg-[var(--surface-2)] p-6 md:p-10" aria-labelledby="visual-lab-account">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,.65fr)] md:items-center">
          <div>
            <p className="eyebrow">{t.accessEyebrow}</p>
            <h2 id="visual-lab-account" className="mt-4 text-balance text-3xl font-extrabold md:text-4xl">{t.accessTitle}</h2>
            <p className="muted mt-5 max-w-2xl leading-8">{t.accessBody}</p>
            <Link href={localizedPath(locale, '/sign-in')} className="btn-primary mt-7">{t.accessCta}<ArrowUpRight className="size-4" aria-hidden="true"/></Link>
          </div>
          <figure className="overflow-hidden rounded-[19px] border border-[var(--border)] bg-[var(--surface)]">
            <Image src="/media/stock/practice-doctor-laptop.webp" width={1600} height={1067} alt={t.media2} sizes="(max-width: 767px) 90vw, 350px" className="aspect-square w-full object-cover"/>
            <figcaption className="muted p-3 text-xs">{t.media2}</figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="visual-lab-team">
        <p className="eyebrow">{t.teamEyebrow}</p>
        <h2 id="visual-lab-team" className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{t.teamTitle}</h2>
        <p className="muted mt-4 max-w-3xl">{t.teamNote}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map(member => (
            <article key={member.id} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
              <div aria-hidden="true" className="mb-7 flex size-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] font-extrabold text-[var(--cyan)]">{member.initials}</div>
              <h3 className="font-extrabold">{member.name}</h3>
              <p className="muted mt-2 text-sm">{member.role[locale]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[25px] border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center shadow-[var(--shadow)] md:p-14">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold md:text-4xl">{t.endTitle}</h2>
        <p className="muted mx-auto mt-4 max-w-xl">{t.endBody}</p>
        <Link href={localizedPath(locale, '/consultation')} className="btn-primary btn-lg mt-7">{t.primary}<ArrowUpRight className="size-4" aria-hidden="true"/></Link>
      </section>
      <p className="muted mt-8 text-center text-xs">{t.note}</p>
    </main>
  );
}
