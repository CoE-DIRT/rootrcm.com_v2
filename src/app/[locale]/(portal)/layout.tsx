import type { ReactNode } from 'react';
import { TenantProvider } from '@/lib/context/tenant-context';

export default function PortalGroupLayout({ children }: { children: ReactNode }) {
  return <TenantProvider>{children}</TenantProvider>;
}
