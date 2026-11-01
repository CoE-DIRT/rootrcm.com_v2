import type { ReactNode } from 'react';
import { PortalFrame } from '@/components/portal/portal-frame';
import { requireLocale } from '@/lib/locale';

export default async function PortalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  return <PortalFrame locale={locale}>{children}</PortalFrame>;
}
