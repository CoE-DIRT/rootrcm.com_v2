import type { ReactNode } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export type PageIntroProps = {
  locale: Locale;
  eyebrow?: string;
  title: string;
  body?: string;
  cta?: string;
  ctaHref?: string;
  secondary?: { label: string; href: string };
  breadcrumb?: boolean;
  nodeId?: string;
  children?: ReactNode;
};

/**
 * Inner-page hero. Text, CTAs and a CSS/SVG line motif only — no photography
 * and no background-image URLs. Exactly one <h1> per page lives here.
 */
export function PageIntro({ locale, eyebrow, title, body, cta, ctaHref, secondary, breadcrumb = true, nodeId, children }: PageIntroProps) {
  const t = copy(locale);
  return (
    <header className="page-intro" data-node-id={nodeId} data-testid="page-intro">
      <svg className="page-intro__decor" viewBox="0 0 1440 480" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--cyan)]">
          <path d="M960 400 L1200 260 L1440 400" strokeOpacity="0.35" />
          <path d="M1040 440 L1200 348 L1360 440" strokeOpacity="0.25" />
          <path d="M1080 120 L1200 50 L1320 120 L1200 190 Z" strokeOpacity="0.4" />
          <path d="M1080 120 V160 L1200 230 V190" strokeOpacity="0.3" />
          <path d="M1320 120 V160 L1200 230" strokeOpacity="0.3" />
          <circle cx="1200" cy="120" r="4" fill="currentColor" fillOpacity="0.6" stroke="none" />
        </g>
      </svg>
      <Container>
        <div className="page-intro__inner">
          {breadcrumb ? (
            <Breadcrumb
              label={locale === 'es' ? 'Ruta de navegación' : 'Breadcrumb'}
              items={[{ href: localizedPath(locale), label: t.brand }, { label: title }]}
            />
          ) : null}
          {eyebrow ? <p className="ui-eyebrow">{eyebrow}</p> : null}
          <h1 className="page-intro__title">{title}</h1>
          {body ? <p className="page-intro__body">{body}</p> : null}
          {(cta && ctaHref) || secondary ? (
            <div className="page-intro__actions">
              {cta && ctaHref ? (
                <Button href={ctaHref} variant="primary" size="lg">
                  {cta}
                </Button>
              ) : null}
              {secondary ? (
                <Button href={secondary.href} variant="ghost" size="lg">
                  {secondary.label}
                </Button>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
      </Container>
    </header>
  );
}
