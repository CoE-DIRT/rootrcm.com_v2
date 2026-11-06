import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Brand } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export type AuthShellProps = {
  locale: Locale;
  title: string;
  body: string;
  children: ReactNode;
  aside?: ReactNode;
  nodeId?: string;
};

/** Consistent shell for /login, /signup, /forgot-password and /reset-password. UI only — Appwrite owns auth. */
export function AuthShell({ locale, title, body, children, aside, nodeId }: AuthShellProps) {
  const es = locale === 'es';
  return (
    <main id="main" data-node-id={nodeId}>
      <Container>
        <div className="auth-shell">
          <div className="auth-shell__panel">
            <div className="cluster">
              <Link href={localizedPath(locale)} className="ui-nav__logo" aria-label={es ? 'ROOT — inicio' : 'ROOT — home'}>
                <Brand locale={locale} />
              </Link>
              <Button href={localizedPath(locale)} variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />}>
                {es ? 'Volver al sitio' : 'Back to site'}
              </Button>
            </div>
            <div className="stack">
              <h1 className="auth-shell__title">{title}</h1>
              <p className="prose-muted">{body}</p>
            </div>
            <Card padding="lg" surface="base" as="div">
              {children}
            </Card>
            <nav className="auth-shell__legal" aria-label={es ? 'Enlaces legales' : 'Legal links'}>
              <Button href={localizedPath(locale, '/terms')} variant="link" size="sm">
                {es ? 'Términos de servicio' : 'Terms of Service'}
              </Button>
              <Button href={localizedPath(locale, '/privacy')} variant="link" size="sm">
                {es ? 'Política de privacidad' : 'Privacy Policy'}
              </Button>
              <Button href={localizedPath(locale, '/contact')} variant="link" size="sm">
                {es ? 'Ayuda' : 'Get help'}
              </Button>
            </nav>
          </div>
          {aside ? <aside className="auth-shell__aside">{aside}</aside> : null}
        </div>
      </Container>
    </main>
  );
}
