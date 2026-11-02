'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { previewOrgs } from '@/content/preview-fixtures';

export type TenantOrganization = (typeof previewOrgs)[number];

type TenantContextValue = {
  organizations: readonly TenantOrganization[];
  activeOrgId: string;
  activeOrg: TenantOrganization | null;
  setActiveOrgId: (id: string) => void;
};

const TenantContext = createContext<TenantContextValue | null>(null);

const FALLBACK_ORG: TenantOrganization = {
  id: 'sample-austin-asc',
  name: 'Austin Ambulatory Surgery Center',
  type: 'asc',
  plan: 'Managed',
  specialty: 'ASC / Orthopedic Surgery',
};

export function TenantProvider({
  children,
  initialOrgId,
}: {
  children: ReactNode;
  initialOrgId?: string;
}) {
  const organizations = useMemo(
    () => (previewOrgs.length > 0 ? previewOrgs : [FALLBACK_ORG]),
    [],
  );
  const defaultId =
    (initialOrgId && organizations.some((org) => org.id === initialOrgId)
      ? initialOrgId
      : organizations[0]?.id) ?? FALLBACK_ORG.id;
  const [activeOrgId, setActiveOrgIdState] = useState(defaultId);

  const setActiveOrgId = useCallback(
    (id: string) => {
      if (organizations.some((org) => org.id === id)) {
        setActiveOrgIdState(id);
      }
    },
    [organizations],
  );

  const activeOrg =
    organizations.find((org) => org.id === activeOrgId) ?? organizations[0] ?? FALLBACK_ORG;

  const value = useMemo(
    () => ({
      organizations,
      activeOrgId: activeOrg.id,
      activeOrg,
      setActiveOrgId,
    }),
    [organizations, activeOrg, setActiveOrgId],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const value = useContext(TenantContext);
  if (!value) {
    const organizations = previewOrgs.length > 0 ? previewOrgs : [FALLBACK_ORG];
    return {
      organizations,
      activeOrgId: FALLBACK_ORG.id,
      activeOrg: organizations[0] ?? FALLBACK_ORG,
      setActiveOrgId: () => undefined,
    } satisfies TenantContextValue;
  }
  return value;
}

export function useTenantRequired() {
  const value = useContext(TenantContext);
  if (!value) throw new Error('TenantProvider is missing.');
  return value;
}
