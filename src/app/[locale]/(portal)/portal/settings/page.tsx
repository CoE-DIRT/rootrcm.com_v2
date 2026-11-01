import type { Metadata } from 'next';
import { portalLabels } from '@/content/portal-demo';
import { copy } from '@/content/messages';
import { getFeatureFlags } from '@/lib/flags';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  return publicPageMetadata(locale, portalLabels.settings[locale], portalLabels.synthetic[locale]);
}

export default async function PracticeSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const flags = getFeatureFlags();
  const es = locale === 'es';
  const rows = [
    ['Auth', flags.auth],
    ['CRM', flags.crm],
    ['Billing', flags.billing],
    ['Prospecting', flags.prospecting],
    ['Live claims', flags.liveClaims],
  ] as const;
  return (
    <div>
      <p className="overline">{es ? 'Nada se guarda' : 'Nothing is saved'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{portalLabels.settings[locale]}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">
        {portalLabels.personaNote[locale]} {t.adaptersOff}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map(([name, enabled]) => (
          <li key={name} className="surface flex items-center justify-between p-4 text-sm">
            <span className="font-bold">{name}</span>
            <span className="status-badge" data-tone={enabled ? 'good' : 'warn'}>
              {enabled ? (es ? 'Activado' : 'Enabled') : es ? 'Desactivado' : 'Disabled'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
