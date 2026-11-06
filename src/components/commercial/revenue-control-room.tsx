'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  UserCheck,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Activity,
} from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function RevenueControlRoom({ locale }: { locale: Locale }) {
  const es = locale === 'es';

  const trustBullets = [
    {
      icon: RefreshCw,
      title: es ? 'Sin cambio de EHR' : 'No forced EHR replacement',
      desc: es
        ? 'Operamos en su sistema actual sin interrupciones.'
        : 'We operate inside your current software without workflow disruption.',
    },
    {
      icon: UserCheck,
      title: es ? 'Dueño asignado por excepción' : 'Named exception owners',
      desc: es
        ? 'Cada reclamo y denegación tiene un responsable y fecha límite.'
        : 'Every claim, denial, and credentialing task has an accountable specialist.',
    },
    {
      icon: RefreshCw,
      title: es ? 'Conciliación semanal de caja' : 'Weekly cash reconciliation',
      desc: es
        ? 'Depósitos bancarios conciliados contra reclamos cobrados.'
        : 'Bank deposits reconciled weekly against adjudicated claims.',
    },
    {
      icon: ShieldCheck,
      title: es ? 'Procesos alineados con HIPAA' : 'HIPAA-aligned safeguards',
      desc: es
        ? 'Acuerdo BAA disponible para todas las entidades cubiertas.'
        : 'BAA available for all covered entities with zero public PHI.',
    },
  ];

  const syntheticClaims = [
    {
      id: 'CLM-84920',
      payer: 'Aetna Commercial',
      amount: '$1,420.00',
      owner: 'Sarah M.',
      action: es ? 'Apelación de pago oportuno' : 'Timely appeal submitted',
      status: 'paid',
      statusLabel: es ? 'Cobrado' : 'Paid',
    },
    {
      id: 'CLM-84931',
      payer: 'BCBS Empire',
      amount: '$890.00',
      owner: 'Elena R.',
      action: es ? 'Corrección de modificador 25' : 'Modifier 25 correction verified',
      status: 'resolved',
      statusLabel: es ? 'Resuelto' : 'Resolved',
    },
    {
      id: 'CRD-20419',
      payer: 'UnitedHealthcare',
      amount: 'NPI-104928',
      owner: 'Kashif A.',
      action: es ? 'Validación de fuente primaria' : 'Primary source verification complete',
      status: 'verified',
      statusLabel: es ? 'Verificado' : 'Verified',
    },
  ];

  return (
    <div className="mt-8 space-y-8" data-testid="revenue-control-room">
      {/* 4 Trust Pillars */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trustBullets.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="surface flex flex-col justify-between p-5 transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              <div>
                <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--cyan)]">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-sm font-bold tracking-tight text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="muted mt-1.5 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Room Metaphor / Interactive Claim Lifecycle Card */}
      <div className="surface relative overflow-hidden p-6 sm:p-8 md:p-10 shadow-[var(--shadow)]">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" aria-hidden="true" />

        <div className="relative z-[1] flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="eyebrow">{es ? 'SALA DE CONTROL DE INGRESOS' : 'REVENUE CONTROL ROOM'}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {es ? 'Visibilidad compartida en vivo' : 'Live Shared Visibility'}
              </span>
            </div>
            <h2 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl">
              {es
                ? 'Vea exactamente los mismos números y colas de trabajo que ve ROOT.'
                : 'See the exact same numbers, owners, and queues that ROOT sees.'}
            </h2>
            <p className="muted mt-3 text-sm leading-relaxed">
              {es
                ? 'Se acabaron las cajas negras. Cada reclamo pendiente tiene un especialista con nombre, una causa de denegación identificada y una acción de resolución programada.'
                : 'No more outsourced black boxes. Every pending claim has a named specialist, an identified denial cause, and a scheduled resolution step.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={localizedPath(locale, '/preview/client')}
                className="btn-primary"
              >
                {es ? 'Explorar espacio del cliente' : 'Explore Sample Workspace'} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={localizedPath(locale, '/consultation#book')}
                className="btn-secondary"
              >
                {es ? 'Agendar consulta estratégica' : 'Book Strategy Session'}
              </Link>
            </div>
          </div>

          {/* Synthetic Work Queue Simulation */}
          <div className="w-full lg:max-w-md">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[var(--text)]">
                  <Activity className="size-3.5 text-[var(--cyan)]" aria-hidden="true" />
                  {es ? 'Cola de excepciones activas' : 'Active Exception Work Queue'}
                </span>
                <span className="text-[11px] font-semibold text-[var(--cyan)]">
                  {es ? '3 de 3 en meta' : '3 of 3 on target'}
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {syntheticClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="surface flex items-center justify-between p-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[var(--text)]">{claim.id}</span>
                        <span className="muted">·</span>
                        <span className="muted">{claim.payer}</span>
                      </div>
                      <p className="mt-1 font-medium text-[var(--text)]">{claim.action}</p>
                      <p className="muted mt-0.5 text-[11px]">
                        {es ? 'Responsable' : 'Owner'}: <strong className="text-[var(--text)]">{claim.owner}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-[var(--text)]">{claim.amount}</span>
                      <div className="mt-1">
                        <span className="badge-paid">
                          <CheckCircle2 className="size-3" aria-hidden="true" />
                          {claim.statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 text-[11px] text-[var(--muted)]">
                <span>{es ? 'Datos sintéticos de demostración' : 'Synthetic demonstration fixtures'}</span>
                <Link
                  href={localizedPath(locale, '/preview/dirt')}
                  className="font-bold text-[var(--cyan)] hover:underline"
                >
                  {es ? 'Ver analítica DIRT →' : 'View DIRT analytics →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
