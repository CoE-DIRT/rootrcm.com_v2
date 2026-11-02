'use client';

import { Bell } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { workspaceDemoText } from '@/content/operations-demo';
import { localize, type OpsNotification } from '@/lib/ops-client';
import { opsCard, opsSubtle } from './ui';

export function NotificationsPanel({
  locale,
  notifications,
}: {
  locale: Locale;
  notifications: readonly OpsNotification[];
}) {
  const t = workspaceDemoText[locale];
  return (
    <section className={opsCard} aria-label={t.notifications} data-testid="notifications-list">
      <h3 className="flex items-center gap-2 font-extrabold">
        <Bell className="size-5 text-[var(--cyan)]" aria-hidden="true" />
        {t.notifications}
      </h3>
      {notifications.length === 0 ? (
        <p className={`mt-3 text-sm ${opsSubtle}`}>{t.emptyNotifications}</p>
      ) : (
        <ul className="mt-4 divide-y divide-[var(--border)]">
          {notifications.map((item) => (
            <li key={item.id} data-testid="notification-item" className="py-3">
              <p className="wrap-break-word font-bold">{localize(item.title, locale)}</p>
              <p className={`mt-1 wrap-break-word text-xs ${opsSubtle}`}>
                {localize(item.body, locale)}
                {item.createdAt ? ` · ${item.createdAt}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
