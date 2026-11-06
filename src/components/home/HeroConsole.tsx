'use client';

import { ArrowRight, PlayCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge, type BadgeStatus } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

type Claim = {
  id: string;
  status: BadgeStatus;
  /** Second state for the single animated pill. */
  next?: BadgeStatus;
  owner: string;
  cents: number;
  when: { en: string; es: string };
  layer: 0 | 1 | 2;
};

const claims: readonly Claim[] = [
  { id: 'CLM-4821', status: 'pending', next: 'paid', owner: 'A', cents: 124000, when: { en: 'Follow-up 2:30 PM', es: 'Seguimiento 14:30' }, layer: 0 },
  { id: 'CLM-4833', status: 'submitted', owner: 'M', cents: 86550, when: { en: 'Payer ack in 2h', es: 'Acuse en 2 h' }, layer: 1 },
  { id: 'CLM-4840', status: 'denied', owner: 'R', cents: 231875, when: { en: 'Appeal due Thu', es: 'Apelación jueves' }, layer: 2 },
  { id: 'CLM-4852', status: 'paid', owner: 'K', cents: 41020, when: { en: 'Posted today', es: 'Registrado hoy' }, layer: 1 },
  { id: 'CLM-4866', status: 'submitted', owner: 'J', cents: 157300, when: { en: 'Scrub check 4 PM', es: 'Revisión 16:00' }, layer: 0 },
];

const exceptions = [
  { id: 'CLM-4790', en: 'Missing prior authorization', es: 'Falta autorización previa', owner: 'J. Rivera' },
  { id: 'CLM-4802', en: 'Eligibility mismatch', es: 'Elegibilidad no coincide', owner: 'A. Chen' },
  { id: 'CLM-4815', en: 'Underpaid vs. contract', es: 'Pago menor al contrato', owner: 'M. Okafor' },
] as const;

const statusLabel: Record<BadgeStatus, { en: string; es: string }> = {
  submitted: { en: 'Submitted', es: 'Enviado' },
  pending: { en: 'Pending', es: 'Pendiente' },
  denied: { en: 'Denied', es: 'Denegado' },
  paid: { en: 'Paid', es: 'Pagado' },
  neutral: { en: 'Open', es: 'Abierto' },
};

function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export type HeroConsoleProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  trust: readonly string[];
};

export function HeroConsole({ locale, eyebrow, title, body, primaryCta, secondaryCta, trust }: HeroConsoleProps) {
  const es = locale === 'es';
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState<number[] | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const hero = heroRef.current;
    if (!stage || !hero) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    // One-time count-up when the console first enters the viewport (800ms ease-out).
    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 800);
          const eased = 1 - Math.pow(1 - t, 3);
          setProgress(claims.map((c) => Math.round(c.cents * eased)));
          if (t < 1) raf = requestAnimationFrame(tick);
          else setProgress(null);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.15 },
    );
    observer.observe(stage);

    // Scroll parallax: layers translate 0 / -20px / -40px across the hero height.
    let scrollRaf = 0;
    function onScroll() {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const rect = hero!.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
        stage!.style.setProperty('--hero-scroll', p.toFixed(3));
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Pointer tilt (±3deg). Fine pointers only — never on touch.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    function onMove(event: PointerEvent) {
      if (!fine.matches || event.pointerType !== 'mouse') return;
      const rect = stage!.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stage!.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`);
      stage!.style.setProperty('--tilt-y', `${(x * 6).toFixed(2)}deg`);
    }
    function onLeave() {
      stage!.style.setProperty('--tilt-x', '0deg');
      stage!.style.setProperty('--tilt-y', '0deg');
    }
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScroll);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-console" aria-labelledby="hero-title" data-testid="hero-console">
      <div className="hero-console__mesh" aria-hidden="true">
        <span className="hero-console__mesh-blob" data-blob="a" />
        <span className="hero-console__mesh-blob" data-blob="b" />
      </div>
      <div className="hero-console__inner">
        <div className="hero-console__copy">
          <p className="hero-console__eyebrow">{eyebrow}</p>
          <h1 id="hero-title" className="hero-console__title">
            {title}
          </h1>
          <p className="hero-console__sub">{body}</p>
          <div className="hero-console__ctas">
            <Button href={localizedPath(locale, '/diagnostic')} variant="primary" size="lg" rightIcon={<ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />}>
              {primaryCta}
            </Button>
            <Button href={localizedPath(locale, '/preview/client')} variant="ghost" size="lg" prefetch={false} leftIcon={<PlayCircle size={20} strokeWidth={1.75} aria-hidden="true" />}>
              {secondaryCta}
            </Button>
          </div>
          <ul className="hero-console__trust">
            {trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="hero-console__visual">
          <p className="sr-only">
            {es
              ? 'Ilustración de un espacio de muestra: cinco reclamos con estado, responsable, importe y próxima acción, y una cola de tres excepciones asignadas a personas.'
              : 'Sample workspace illustration: five claims with status, owner, amount and next action, plus a queue of three exceptions being assigned to named people.'}
          </p>
          <div ref={stageRef} className="hero-stage" aria-hidden="true">
            <div className="hero-stage__grid" />
            <div className="hero-stage__head">
              <span className="hero-stage__live" />
              <span>{es ? 'Sala de control de ingresos' : 'Revenue control room'}</span>
              <span className="hero-stage__tag">{es ? 'espacio de muestra' : 'sample workspace'}</span>
            </div>
            <ol className="hero-stage__claims">
              {claims.map((claim, index) => (
                <li key={claim.id} className="hero-claim" data-layer={claim.layer}>
                  <span className="hero-claim__id">{claim.id}</span>
                  <span className="hero-claim__status">
                    {claim.next ? (
                      <span className="hero-claim__swap">
                        <span className="hero-claim__state" data-state="a">
                          <Badge status={claim.status}>{statusLabel[claim.status][locale]}</Badge>
                        </span>
                        <span className="hero-claim__state" data-state="b">
                          <Badge status={claim.next}>{statusLabel[claim.next][locale]}</Badge>
                        </span>
                      </span>
                    ) : (
                      <Badge status={claim.status}>{statusLabel[claim.status][locale]}</Badge>
                    )}
                  </span>
                  <span className="hero-claim__owner">{claim.owner}</span>
                  <span className="hero-claim__amount">{formatUsd(progress ? progress[index] : claim.cents)}</span>
                  <span className="hero-claim__when">{claim.when[locale]}</span>
                </li>
              ))}
            </ol>
            <div className="hero-queue">
              <p className="hero-queue__title">{es ? 'Cola de excepciones' : 'Exception queue'}</p>
              <ul>
                {exceptions.map((row) => (
                  <li key={row.id} className="hero-queue__row">
                    <span className="hero-queue__id">{row.id}</span>
                    <span className="hero-queue__reason">{row[locale]}</span>
                    <span className="hero-queue__assign">→ {es ? 'asignar' : 'assign'} · {row.owner}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hero-stage__vignette" />
          </div>
        </div>
      </div>
    </section>
  );
}
