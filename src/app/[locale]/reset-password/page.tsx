import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthShell } from '@/components/forms/auth-shell';
import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return {
    ...publicPageMetadata(locale, es ? 'Nueva contraseña' : 'Reset password', es ? 'Elija una nueva contraseña de ROOT.' : 'Choose a new ROOT password.', 'reset-password'),
    referrer: 'no-referrer',
  };
}

export default async function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return (
    <AuthShell
      locale={locale}
      title={es ? 'Elija una nueva contraseña' : 'Choose a new password'}
      body={es ? 'Use al menos 12 caracteres. Este enlace solo funciona una vez.' : 'Use at least 12 characters. This link works once.'}
    >
      <Suspense fallback={null}>
        <ResetPasswordForm locale={locale} />
      </Suspense>
    </AuthShell>
  );
}
