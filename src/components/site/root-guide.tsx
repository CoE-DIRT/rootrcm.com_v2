'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

type Topic = 'services' | 'integrations' | 'plans' | 'credentialing' | 'denials' | 'contact' | 'general';
type Message = { id: number; from: 'visitor' | 'root'; text: string };
const labels = {
  en: {
    title: 'ROOT Guide', launch: 'Ask ROOT', guide: 'ROOT interactive guide',
    scripted: 'Interactive site guide · not live AI', greeting: 'Welcome. Explore ROOT services, technology, plans and credentialing without leaving this page.',
    hint: 'Ask about ROOT services…', ask: 'Ask a question', send: 'Send',
    open: 'Open ROOT guide', close: 'Close ROOT guide', quick: 'Quick topics',
    privacy: 'No PHI. Messages remain in this browser session; nothing is sent to a server.',
    openPage: 'Open related page', notice: 'Site guide',
  },
  es: {
    title: 'Guía ROOT', launch: 'Pregunte a ROOT', guide: 'Guía interactiva ROOT',
    scripted: 'Guía del sitio · sin IA en vivo', greeting: 'Bienvenido. Explore los servicios, la tecnología, los planes y la acreditación de ROOT.',
    hint: 'Pregunte por los servicios de ROOT…', ask: 'Escriba una pregunta', send: 'Enviar',
    open: 'Abrir guía ROOT', close: 'Cerrar guía ROOT', quick: 'Temas rápidos',
    privacy: 'Sin datos de pacientes. Los mensajes quedan en esta sesión; no se envían a servidores.',
    openPage: 'Abrir página relacionada', notice: 'Guía del sitio',
  },
};
const topics: readonly { topic: Topic; en: string; es: string }[] = [
  { topic: 'services', en: 'Services', es: 'Servicios' },
  { topic: 'integrations', en: 'Keep my EHR', es: 'Mantener mi EHR' },
  { topic: 'plans', en: 'Plans', es: 'Planes' },
  { topic: 'credentialing', en: 'Credentialing', es: 'Acreditación' },
  { topic: 'contact', en: 'Talk to ROOT', es: 'Hablar con ROOT' },
];
const responses: Record<Topic, { en: string; es: string; href: string }> = {
  services: {
    en: 'ROOT connects medical billing, denials, A/R, practice operations, prior authorization and credentialing. Explore individual services and their next actions.',
    es: 'ROOT conecta facturación, denegaciones, cuentas por cobrar, operaciones y acreditación. Explore los servicios y sus próximos pasos.',
    href: '/services',
  },
  integrations: {
    en: 'Your existing EHR/PM is the starting point. ROOT evaluates compatibility by system, payer and scope. Listed platforms do not imply an active API connection.',
    es: 'Partimos de su EHR/PM actual. ROOT evalúa la compatibilidad por sistema, pagador y alcance; una plataforma listada no implica conexión API activa.',
    href: '/technology',
  },
  plans: {
    en: 'Compare a free consultation, diagnostic, managed services and scoped engagement options. Exact deliverables and fees are confirmed before engagement.',
    es: 'Compare consulta gratuita, diagnóstico, servicios gestionados y proyectos a medida. Se confirma el alcance antes de contratar.',
    href: '/plans',
  },
  credentialing: {
    en: 'The credentialing preview tracks payer-specific applications, document readiness, review stages, follow-up tasks and effective-date evidence. It uses fictional records.',
    es: 'La vista de acreditación muestra solicitudes por pagador, documentos, etapas, seguimiento y fechas de vigencia con datos ficticios.',
    href: '/preview/credentialing',
  },
  denials: {
    en: 'The operational preview shows synthetic 837/277CA/276-277/835 lifecycle events, denials, owners, appeals and A/R queues. No live claims are connected.',
    es: 'La vista operativa muestra eventos ficticios de 837/277CA/276-277/835, denegaciones, apelaciones y cuentas por cobrar.',
    href: '/preview/client',
  },
  contact: {
    en: 'The best next step is to describe your practice at a high level and request a consultation. Please do not include patient information.',
    es: 'El siguiente paso es describir su práctica a nivel general y solicitar una consulta. No incluya información del paciente.',
    href: '/consultation',
  },
  general: {
    en: 'I can guide you through ROOT services, credentialing, EHR compatibility, pricing or claims and denials. Choose a topic or open the relevant page.',
    es: 'Puedo orientarle sobre servicios, acreditación, compatibilidad EHR, precios, reclamos y denegaciones. Elija un tema o abra la página correspondiente.',
    href: '/services',
  },
};
function classify(input: string): Topic {
  const q = input.toLowerCase();
  if (/credent|enroll|caqh|pecos|acredit|inscri/.test(q)) return 'credentialing';
  if (/denial|appeal|claim|receivable|276|277|reclamo|deneg|apelaci/.test(q)) return 'denials';
  if (/ehr|epic|athena|software|practice.management|integrat|migrac|sistema/.test(q)) return 'integrations';
  if (/pricing|price|cost|plan|subscription|free|precio|suscrip|gratis/.test(q)) return 'plans';
  if (/contact|meeting|call|consult|talk|quote|contacto|hablar|consulta/.test(q)) return 'contact';
  if (/billing|rcm|mso|service|outsourc|servicio|facturaci/.test(q)) return 'services';
  return 'general';
}

export function RootGuide({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: 'root', text: t.greeting }]);
  const [destination, setDestination] = useState<Topic | null>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const countRef = useRef(0);

  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !open) return;
      setOpen(false);
      launchRef.current?.focus();
    }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function respond(topic: Topic, question?: string) {
    const response = responses[topic];
    countRef.current += 2;
    const sequence = countRef.current;
    const visitorText = question ?? (topics.find((x) => x.topic === topic)?.[locale] ?? t.ask);
    setMessages((history) => [...history.slice(-18),
      { id: sequence - 1, from: 'visitor', text: visitorText },
      { id: sequence, from: 'root', text: response[locale] },
    ]);
    setDestination(topic);
    setInput('');
    requestAnimationFrame(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }); });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim().slice(0, 160);
    if (!value) return;
    respond(classify(value), value);
  }

  return (
    <aside className="pointer-events-none fixed bottom-[max(12px,env(safe-area-inset-bottom))] right-3 z-[60] flex max-w-[calc(100vw-24px)] flex-col items-end gap-3 sm:bottom-6 sm:right-6" data-testid="root-guide-dock">
      {open && (
        <section
          id="root-guide-panel"
          className="pointer-events-auto flex h-[min(520px,calc(100dvh-108px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-[0_25px_85px_rgba(0,9,27,.34)] backdrop-blur-2xl motion-safe:animate-[root-guide-in_230ms_cubic-bezier(.2,.8,.2,1)]"
          aria-label={t.guide}
          data-testid="root-guide-panel"
        >
          <div className="flex items-center justify-between bg-[#0b2945] px-5 py-4 text-[#f5fbff]">
            <div>
              <p className="text-base font-extrabold">{t.title}</p>
              <p className="mt-1 text-[11px] text-[#bcd8ea]">{t.scripted}</p>
            </div>
            <button className="flex size-11 items-center justify-center rounded-xl text-[#f5fbff] transition hover:bg-white/15" onClick={() => { setOpen(false); launchRef.current?.focus(); }} type="button" aria-label={t.close}><X className="size-5" aria-hidden="true"/></button>
          </div>
          <div ref={logRef} role="log" aria-live="polite" aria-label={t.guide} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4 text-sm">
            {messages.map((message) => (
              <p key={message.id} className={`max-w-[92%] rounded-2xl border px-4 py-3 leading-6 ${message.from === 'visitor' ? 'ml-auto border-[var(--cyan)] bg-[var(--surface-2)]' : 'mr-auto border-[var(--border)] bg-[var(--surface-2)]'}`}>
                {message.text}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-[var(--border)] p-3" role="group" aria-label={t.quick}>
            {topics.map((item) => (
              <button key={item.topic} type="button" onClick={() => respond(item.topic)}
                className="min-h-9 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-bold transition hover:border-[var(--cyan)] hover:text-[var(--cyan)]">
                {item[locale]}
              </button>
            ))}
          </div>
          {destination && (
            <Link href={localizedPath(locale, responses[destination].href)} className="mx-3 mb-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--surface-2)] px-4 text-sm font-bold text-[var(--cyan)] transition hover:brightness-105" onClick={() => setOpen(false)}>
              {t.openPage}<ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          )}
          <form onSubmit={submit} className="flex gap-2 border-t border-[var(--border)] px-3 py-3">
            <label htmlFor="root-guide-input" className="sr-only">{t.ask}</label>
            <input id="root-guide-input" ref={inputRef} type="text" autoComplete="off" maxLength={160} value={input}
              onChange={(event) => setInput(event.target.value)} placeholder={t.hint}
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus-visible:outline-[var(--cyan)]"/>
            <button type="submit" disabled={!input.trim()} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[var(--cyan)] text-[var(--on-cyan)] disabled:opacity-40" aria-label={t.send}>
              <Send className="size-4" aria-hidden="true"/>
            </button>
          </form>
          <p className="muted flex items-center gap-1.5 px-4 pb-3 text-[10px] leading-4"><ShieldCheck className="size-3.5 shrink-0" aria-hidden="true"/>{t.privacy}</p>
        </section>
      )}
      <button
        type="button"
        ref={launchRef}
        onClick={() => setOpen((current) => !current)}
        className="pointer-events-auto flex min-h-12 items-center gap-2.5 rounded-full border border-[#54e8ff]/50 bg-[linear-gradient(120deg,#0756c4,#00aec6)] px-4 py-3 text-sm font-extrabold text-white shadow-[0_13px_40px_rgba(3,58,101,.34)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(3,58,101,.45)] motion-reduce:transform-none"
        aria-controls="root-guide-panel"
        aria-expanded={open}
        aria-label={open ? t.close : t.open}
        data-testid="root-guide-launch"
      >
        {open ? <X className="size-5" aria-hidden="true"/> : <MessageCircle className="size-5" aria-hidden="true"/>}
        <span>{t.launch}</span>
        <span className="size-2 rounded-full bg-[#8affce] shadow-[0_0_9px_#8affce]" aria-hidden="true" />
      </button>
    </aside>
  );
}
