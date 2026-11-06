import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { AuthShell } from '@/components/forms/auth-shell';
import { SignupForm } from '@/components/forms/signup-form';
import { Card } from '@/components/ui/Card';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return publicPageMetadata(locale, es ? 'Crear cuenta' : 'Create an account', es ? 'Cree su cuenta de práctica en ROOT.' : 'Create your ROOT practice account.', 'signup');
}

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  const points = es
    ? ['Vea reclamos, denegaciones y acreditación en un solo lugar', 'Cada excepción con responsable y próxima acción', 'Sin reemplazar su EHR']
    : ['See claims, denials and credentialing in one place', 'Every exception has an owner and a next action', 'No EHR replacement required'];
  return (
    <AuthShell
      locale={locale}
      title={es ? 'Cree su cuenta de práctica' : 'Create your practice account'}
      body={es ? 'Use su correo empresarial. La verificación llega por correo.' : 'Use your business email. Verification arrives by email.'}
      aside={
        <Card surface="raised" padding="lg" headingLevel={2} title={es ? 'Qué obtiene' : 'What you get'}>
          <ul className="check-list">
            {points.map((point) => (
              <li key={point}>
                <Check size={20} strokeWidth={1.75} aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      }
    >
      <SignupForm locale={locale} />
    </AuthShell>
  );
}
