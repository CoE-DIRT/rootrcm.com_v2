'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authCopy } from '@/content/auth-messages';
import type { Locale } from '@/i18n/locales';
type Action = 'login' | 'signup' | 'recover' | 'reset' | 'verify' | 'verification' | 'logout';
export function AuthForm({ locale, logout = false }: { locale: Locale; logout?: boolean }) {
  const t = authCopy[locale];
  const router = useRouter();
  const [action, setAction] = useState<Action>(logout ? 'logout' : 'login');
  const [token, setToken] = useState({ userId: '', secret: '' });
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  useEffect(() => {
    const timer = window.setTimeout(() => {
    const url = new URL(window.location.href);
    const mode = url.searchParams.get('mode');
    if (mode === 'verify' || mode === 'reset') {
      setAction(mode);
      setToken({ userId: url.searchParams.get('userId') ?? '', secret: url.searchParams.get('secret') ?? '' });
      window.history.replaceState(null, '', url.pathname);
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return <div className="mt-6 space-y-4">
    {!logout && <><p>{t.business}</p><div className="flex flex-wrap gap-3">{(['login', 'signup', 'recover', 'verification'] as const).map(mode => <button className="btn-secondary" key={mode} type="button" aria-pressed={action === mode} onClick={() => { setAction(mode); setStatus('idle'); }}>{t[mode]}</button>)}</div></>}
    <form className="space-y-4" onSubmit={async event => {
      event.preventDefault(); setStatus('pending');
      const form = new FormData(event.currentTarget);
      try {
        const result = await fetch(`/api/v1/auth/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password'), locale, ...token }) });
        setStatus(result.ok ? 'success' : 'error');
        if (result.ok) { setToken({ userId: '', secret: '' }); if (action === 'logout') router.replace(`/${locale}/sign-in`); router.refresh(); }
      } catch { setStatus('error'); }
    }}>
      {['login', 'signup', 'recover'].includes(action) && <label className="block">{t.email}<input className="block w-full rounded border bg-transparent p-3" name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
      {['login', 'signup', 'reset'].includes(action) && <label className="block">{t.password}<input className="block w-full rounded border bg-transparent p-3" name="password" type="password" autoComplete={action === 'login' ? 'current-password' : 'new-password'} minLength={action === 'login' ? 1 : 12} maxLength={256} required /></label>}
      <button className="btn-primary" disabled={status === 'pending'}>{status === 'pending' ? t.pending : t[action]}</button>
      <p role="status" aria-live="polite">{status === 'success' ? t.success : status === 'error' ? t.error : ''}</p>
    </form>
    {!logout && <div className="flex flex-wrap gap-3"><Link href={`/${locale}/dashboard/client`}>{t.client}</Link><Link href={`/${locale}/dashboard/admin`}>{t.admin}</Link></div>}
  </div>;
}
