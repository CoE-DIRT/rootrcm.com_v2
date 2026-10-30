'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBanner } from '@/components/ui/status';
import { copy } from '@/content/messages';
import type { OfferId } from '@/content/catalog';
import { offerRequiresPayment } from '@/domain/catalog-entitlement';
import type { Locale } from '@/i18n/locales';

export function CheckoutRequest({ locale, offerId }: { locale: Locale; offerId: OfferId }) {
  const t = copy(locale);
  const [status, setStatus] = useState<'idle' | 'loading' | 'unavailable' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!offerRequiresPayment(offerId)) return null;

  async function onClick() {
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/v1/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ offerId }),
      });
      const json = (await response.json()) as { error?: { message?: string } };
      setStatus('unavailable');
      setMessage(json.error?.message ?? t.commercial.checkoutUnavailable);
    } catch {
      setStatus('error');
      setMessage(t.status.error);
    }
  }

  return (
    <div className="mt-6 max-w-xl" data-testid="checkout-request">
      <Button type="button" loading={status === 'loading'} onClick={onClick}>
        {t.commercial.requestCheckout}
      </Button>
      {status === 'unavailable' ? <div className="mt-3"><StatusBanner tone="warning">{message}</StatusBanner></div> : null}
      {status === 'error' ? <div className="mt-3"><StatusBanner tone="danger">{message}</StatusBanner></div> : null}
    </div>
  );
}
