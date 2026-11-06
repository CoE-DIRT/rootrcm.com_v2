import type { ReactNode } from 'react';
import { Container } from './Container';

export type SectionProps = {
  id?: string;
  /** id of the heading element labelling this section. */
  labelledBy?: string;
  tone?: 'default' | 'raised' | 'inverse';
  spacing?: 'default' | 'compact' | 'none';
  width?: 'default' | 'narrow';
  /** Fade-up on first scroll entry. */
  reveal?: boolean;
  /** Decorative SVG divider at the top edge. */
  divider?: 'none' | 'slice' | 'wave';
  children: ReactNode;
  'data-testid'?: string;
};

export function Section({
  id,
  labelledBy,
  tone = 'default',
  spacing = 'default',
  width = 'default',
  reveal = true,
  divider = 'none',
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className="ui-section"
      data-tone={tone}
      data-spacing={spacing}
      data-reveal={reveal ? 'pending' : undefined}
      {...rest}
    >
      {divider !== 'none' ? (
        <svg className="ui-section__divider" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {divider === 'slice' ? (
            <path d="M0 48 L1440 0 L1440 48 Z" fill="currentColor" />
          ) : (
            <path d="M0 32 C 240 0 480 0 720 24 S 1200 48 1440 16 L1440 48 L0 48 Z" fill="currentColor" />
          )}
        </svg>
      ) : null}
      <Container width={width}>{children}</Container>
    </section>
  );
}

export type SectionHeadingProps = {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  level?: 1 | 2;
  align?: 'start' | 'center';
};

export function SectionHeading({ id, eyebrow, title, body, level = 2, align = 'start' }: SectionHeadingProps) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <header className="ui-section-heading" data-align={align}>
      {eyebrow ? <p className="ui-eyebrow">{eyebrow}</p> : null}
      <Heading id={id} className="ui-section-heading__title" data-level={level}>
        {title}
      </Heading>
      {body ? <p className="ui-section-heading__body">{body}</p> : null}
    </header>
  );
}
