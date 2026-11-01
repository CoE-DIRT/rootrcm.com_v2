import Link from 'next/link';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

const bars = [42, 55, 48, 63, 58, 70, 64, 76, 68, 80, 74, 86];

/** Demo 6 hero orbit uses sample queue counts, not unpublished recovery rates. */
export function HeroOrbit({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  return (
    <section className="mt-8" aria-labelledby="hero-orbit-title" data-testid="hero-orbit">
      <div className="orb-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="overline">{es ? 'ROOT / D.I.R.T. · MUESTRA' : 'ROOT / D.I.R.T. · SAMPLE'}</p>
            <h2 id="hero-orbit-title" className="enterprise-title mt-2 font-extrabold">
              {es ? 'Visibilidad de ingresos de ejemplo' : 'Sample revenue visibility'}
            </h2>
          </div>
          <span className="status-badge" data-tone="warn">
            {es ? 'Cifras ilustrativas' : 'Illustrative figures'}
          </span>
        </div>
        <p className="muted mt-2 text-sm">
          {es
            ? 'Estas cifras salen del prototipo Demo 6 (147 excepciones, $284k de exposición, 32 acciones). No son resultados de clientes. $1.8M, 98.4% y 14 días no aparecen en Demo 6 y no se muestran.'
            : 'These figures are the Demo 6 prototype counts (147 exceptions, $284k exposure, 32 actions). They are not customer results. $1.8M, 98.4% and 14-day turnaround are not in Demo 6 and are not shown.'}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            [es ? 'Excepciones' : 'Claim exceptions', '147'],
            [es ? 'Exposición prioritaria' : 'Priority exposure', '$284k'],
            [es ? 'Acciones asignadas' : 'Assigned actions', '32'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[11px] border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <span className="muted block text-[11px]">{label}</span>
              <b className="mt-1 block text-2xl tracking-tight">{value}</b>
              <small className="text-[var(--cyan)]">{es ? 'Solo ejemplo' : 'Sample only'}</small>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm font-bold">
            <span>{es ? 'Visibilidad de ingresos' : 'Revenue visibility'}</span>
            <span className="muted text-xs font-semibold">{es ? '12 semanas · ejemplo' : '12 weeks · sample'}</span>
          </div>
          <svg viewBox="0 0 240 72" className="mt-2 h-20 w-full" role="img" aria-label={es ? 'Gráfico de barras sintético de 12 semanas' : 'Synthetic 12-week bar chart'}>
            {bars.map((height, index) => (
              <rect
                key={index}
                className="orb-bar"
                x={index * 20 + 2}
                y={72 - height * 0.7}
                width="12"
                height={height * 0.7}
                rx="3"
                fill="var(--cyan)"
                opacity={0.45 + (index % 3) * 0.15}
              />
            ))}
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <div>
            <strong>{es ? 'Patrón de denegación recurrente' : 'Recurring denial pattern identified'}</strong>
            <p className="muted text-sm">{es ? 'Vea la causa, el responsable y la próxima acción en la cola sintética.' : 'Inspect the cause, owner and next action in the synthetic queue.'}</p>
          </div>
          <Link className="btn-secondary btn-sm" href={localizedPath(locale, '/portal/denials')}>
            {es ? 'Explorar →' : 'Explore →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
