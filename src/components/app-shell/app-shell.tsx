import Link from 'next/link';
import { StatusBanner } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { previewOrgs } from '@/content/preview-fixtures';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

const clientNav = [
  { href: '/preview/client', key: 'overview' as const },
  { href: '/preview/client/requests', key: 'requests' as const },
  { href: '/preview/dirt', key: 'dirt' as const },
  { href: '/preview/credentialing', key: 'credentialing' as const },
  { href: '/preview/billing', key: 'billing' as const },
  { href: '/preview/onboarding', key: 'onboarding' as const },
  { href: '/preview/subscriptions', key: 'subscriptions' as const },
];

const staffNav = [
  { href: '/preview/staff', key: 'queue' as const },
  { href: '/preview/credentialing', key: 'credentialing' as const },
  { href: '/preview/dirt', key: 'dirt' as const },
];

export function AppShell({
  locale,
  role,
  orgName,
  title,
  children,
}: {
  locale: Locale;
  role: 'client' | 'staff';
  orgName: string;
  title: string;
  children: React.ReactNode;
}) {
  const t = copy(locale);
  const nav = role === 'staff' ? staffNav : clientNav;
  return (
    <div className="page-width grid gap-6 pb-16 pt-6 lg:grid-cols-[240px_1fr]">
      <aside className="surface h-fit p-4">
        <p className="eyebrow">{role === 'staff' ? t.workspace.staff : t.workspace.client}</p>
        <p className="mt-2 font-bold">{orgName}</p>
        <label className="muted mt-4 block text-sm" htmlFor="org-preview">
          {t.workspace.orgPreview}
        </label>
        <select id="org-preview" className="mt-1 w-full rounded-[10px] border p-2" defaultValue={orgName} disabled>
          {previewOrgs.map((org) => (
            <option key={org.id}>{org.name}</option>
          ))}
        </select>
        <p className="muted mt-2 text-xs">{t.workspace.tenantNote}</p>
        <nav aria-label={t.workspace.primaryNav} className="mt-4 grid gap-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={localizedPath(locale, item.href)}>
              {t.workspace[item.key]}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <StatusBanner tone="warning">{t.preview}</StatusBanner>
        <h1 className="mt-5 text-3xl font-extrabold">{title}</h1>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
