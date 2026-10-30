'use client';

import { ScrollText } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import { localize, type OpsAuditEvent } from '@/lib/ops-client';
import { opsCard, opsSubtle } from './ui';

export function AuditPanel({ locale, events }: { locale: Locale; events: readonly OpsAuditEvent[] }) {
  const t = workspaceDemoText[locale];
  return (
    <section className={opsCard} aria-label={t.auditTrail} data-testid="audit-list">
      <h3 className="flex items-center gap-2 font-extrabold">
        <ScrollText className="size-5 text-[var(--cyan)]" aria-hidden="true" />
        {t.auditTrail}
      </h3>
      {events.length === 0 ? (
        <p className={`mt-3 text-sm ${opsSubtle}`}>{t.emptyAudit}</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {events.map((item) => (
            <li key={item.id} data-testid="audit-event" className="rounded-xl bg-[var(--surface-2)] p-3">
              <p className="wrap-break-word text-sm font-bold">{localize(item.summary, locale)}</p>
              <p className={`mt-1 wrap-break-word text-xs ${opsSubtle}`}>
                {item.type} · {item.actor}
                {item.resourceId ? ` · ${item.resourceId}` : ''}
                {item.at ? ` · ${item.at}` : ''}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
