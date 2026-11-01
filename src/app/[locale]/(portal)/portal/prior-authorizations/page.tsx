import type { Metadata } from 'next';
import { portalLabels, priorAuthRows } from '@/content/portal-demo';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  return publicPageMetadata(locale, portalLabels.authorizations[locale], portalLabels.synthetic[locale]);
}

export default async function PriorAuthPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return (
    <div>
      <p className="overline">{es ? 'Sin conectividad de pagador' : 'No payer connectivity'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{portalLabels.authorizations[locale]}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">
        {es
          ? 'Estas filas no se enviaron. El adaptador de pagador permanece desactivado.'
          : 'These rows were not submitted. The payer adapter stays disabled.'}
      </p>
      <ul className="mt-4 grid gap-3">
        {priorAuthRows.map((row) => (
          <li key={row.id} className="surface p-4">
            <h2 className="font-bold">{row.label[locale]}</h2>
            <p className="mt-2 text-sm">
              <span className="status-badge" data-tone="warn">{row.state[locale]}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
