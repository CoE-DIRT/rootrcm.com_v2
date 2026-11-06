import type { Metadata } from 'next';
import { AuthShell } from '@/components/forms/auth-shell';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return publicPageMetadata(locale, es ? 'Recuperar contraseña' : 'Forgot password', es ? 'Restablezca el acceso a su cuenta de ROOT.' : 'Reset access to your ROOT account.', 'forgot-password');
}

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return (
    <AuthShell
      locale={locale}
      title={es ? '¿Olvidó su contraseña?' : 'Forgot your password?'}
      body={es ? 'Introduzca el correo de su cuenta y le enviaremos un enlace para restablecerla.' : 'Enter your account email and we will send you a link to reset it.'}
    >
      <ForgotPasswordForm locale={locale} />
    </AuthShell>
  );
}
