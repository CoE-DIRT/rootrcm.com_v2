import { AuthForm } from '@/components/forms/auth-form';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export const metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' as const };

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.signIn.title} body={t.signIn.body} nodeId="6:99">
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div className="surface relative overflow-hidden p-6 sm:p-8 md:p-10 shadow-[var(--shadow)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[var(--cyan)] opacity-[0.06] blur-3xl" aria-hidden="true" />
          <div className="mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4 text-xs font-semibold text-[var(--muted)]">
            <span className="inline-block size-2 rounded-full bg-[var(--cyan)]" aria-hidden="true" />
            <span>
              {locale === 'es'
                ? 'Portal empresarial de práctica · Acceso seguro sin PHI'
                : 'Business practice portal · Protected access · No PHI permitted'}
            </span>
          </div>
          <AuthForm locale={locale} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="surface-2 border border-[var(--border)] p-6 sm:p-8">
            <p className="eyebrow">{locale === 'es' ? 'VISTAS INTERACTIVAS' : 'INTERACTIVE PREVIEWS'}</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight">
              {locale === 'es' ? 'Explore los espacios de demostración' : 'Explore simulated workspaces'}
            </h2>
            <p className="muted mt-2 text-sm leading-relaxed">
              {locale === 'es'
                ? 'Inspeccione la gestión de reclamos, apelaciones y acreditación en entornos con datos sintéticos.'
                : 'Inspect full-cycle claims, denials, and credentialing workflows with synthetic practice records.'}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link className="btn-primary" href={localizedPath(locale, '/preview/client')} prefetch={false}>
                {t.signIn.clientPreview} →
              </Link>
              <Link className="btn-secondary" href={localizedPath(locale, '/preview/staff')} prefetch={false}>
                {t.signIn.staffPreview} →
              </Link>
            </div>
          </div>

          <div className="surface p-5 text-xs text-[var(--muted)]">
            <p className="font-bold text-[var(--text)]">
              {locale === 'es' ? 'Seguridad y control de acceso' : 'Security & Access Control'}
            </p>
            <p className="mt-1 leading-relaxed">
              {locale === 'es'
                ? 'Los formularios públicos aceptan únicamente contactos comerciales. Appwrite valida pertenencia y roles en el servidor.'
                : 'Public forms accept business contacts only. Appwrite enforces organization tenancy and permissions server-side.'}
            </p>
          </div>
        </div>
      </div>
    </MarketingPage>
  );
}
