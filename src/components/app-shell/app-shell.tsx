import Link from 'next/link';
import { StatusBanner } from '@/components/ui/status';
import { copy } from '@/content/messages';
import { previewOrgs } from '@/content/preview-fixtures';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

const clientNav = [
  { href: '/preview/client', label: 'Overview' },
  { href: '/preview/client/requests', label: 'Requests' },
  { href: '/preview/dirt', label: 'DIRT' },
  { href: '/preview/credentialing', label: 'Credentialing' },
  { href: '/preview/billing', label: 'Billing' },
  { href: '/preview/onboarding', label: 'Onboarding' },
  { href: '/preview/subscriptions', label: 'Subscriptions' },
];

const staffNav = [
  { href: '/preview/staff', label: 'Queue' },
  { href: '/preview/credentialing', label: 'Credentialing' },
  { href: '/preview/dirt', label: 'DIRT' },
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
        <p className="eyebrow">{role === 'staff' ? 'ROOT staff' : 'Client workspace'}</p>
        <p className="mt-2 font-bold">{orgName}</p>
        <label className="muted mt-4 block text-sm" htmlFor="org-preview">
          Organization preview
        </label>
        <select id="org-preview" className="mt-1 w-full rounded-[10px] border p-2" defaultValue={orgName} disabled>
          {previewOrgs.map((org) => (
            <option key={org.id}>{org.name}</option>
          ))}
        </select>
        <p className="muted mt-2 text-xs">
          Switching tenants requires server membership. This control is labeled preview-only and cannot grant access.
        </p>
        <nav aria-label="Workspace" className="mt-4 grid gap-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={localizedPath(locale, item.href)}>
              {item.label}
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
