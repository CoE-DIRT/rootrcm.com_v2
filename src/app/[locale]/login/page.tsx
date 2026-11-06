import type { Metadata } from 'next';
import { AuthShell } from '@/components/forms/auth-shell';
import { LoginForm } from '@/components/forms/login-form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';
import { localizedPath } from '@/lib/paths';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return publicPageMetadata(locale, es ? 'Iniciar sesión' : 'Log in', es ? 'Acceda a su espacio de ROOT.' : 'Log in to your ROOT workspace.', 'login');
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return (
    <AuthShell
      locale={locale}
      nodeId="6:99"
      title={es ? 'Inicie sesión en ROOT' : 'Log in to ROOT'}
      body={es ? 'Siga sus reclamos, denegaciones y acreditación en un solo lugar.' : 'Follow your claims, denials and credentialing in one place.'}
      aside={
        <Card
          surface="raised"
          padding="lg"
          headingLevel={2}
          kicker={es ? 'Espacio de muestra' : 'Sample workspace'}
          title={es ? '¿Aún evaluando ROOT?' : 'Still evaluating ROOT?'}
          body={es ? 'Explore un espacio de muestra con datos ficticios antes de conectar nada.' : 'Explore a sample workspace with fictional data before you connect anything.'}
          footer={
            <Button href={localizedPath(locale, '/preview/client')} variant="secondary" prefetch={false}>
              {es ? 'Abrir el espacio de muestra' : 'Open the sample workspace'}
            </Button>
          }
        />
      }
    >
      <LoginForm locale={locale} />
    </AuthShell>
  );
}
