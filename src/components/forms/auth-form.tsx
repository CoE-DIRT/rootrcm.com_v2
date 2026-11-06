'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authCopy } from '@/content/auth-messages';
import type { Locale } from '@/i18n/locales';
import { Button } from '@/components/ui/Button';
type Action = 'login' | 'signup' | 'recover' | 'reset' | 'verify' | 'verification' | 'logout';
type Status = 'idle' | 'pending' | 'success' | 'verificationFailed' | 'verificationRequired' | 'signupSent' | 'verified' | 'verifyFailed' | 'recoverySent' | 'passwordReset' | 'error';
export function AuthForm({ locale, logout = false }: { locale: Locale; logout?: boolean }) {
  const t = authCopy[locale];
  const router = useRouter();
  const [action, setAction] = useState<Action>(logout ? 'logout' : 'login');
  const [token, setToken] = useState({ userId: '', secret: '' });
  const [status, setStatus] = useState<Status>('idle');
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const url = new URL(window.location.href);
      const mode = url.searchParams.get('mode');
      if (url.searchParams.get('verified') === '1') {
        window.history.replaceState(null, '', url.pathname);
        setStatus('verified');
        return;
      }
      if (mode === 'verify' || mode === 'reset') {
        const userId = url.searchParams.get('userId') ?? '';
        const secret = url.searchParams.get('secret') ?? '';
        window.history.replaceState(null, '', url.pathname);
        setAction(mode);
        if (mode === 'reset') {
          setToken({ userId, secret });
          return;
        }
        if (!userId || !secret) { setStatus('verifyFailed'); return; }
        setStatus('pending');
        void fetch('/api/v1/auth/verify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ locale, userId, secret }),
        }).then(response => {
          if (!response.ok) throw new Error('verification_failed');
          setAction('login');
          setToken({ userId: '', secret: '' });
          setStatus('verified');
          window.location.assign('/' + locale + '/dashboard');
        }).catch(() => setStatus('verifyFailed'));
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [locale, router]);
  return <div className="mt-6 space-y-4">
    {!logout && <><p>{t.business}</p><div className="flex flex-wrap gap-3">{(['login', 'signup', 'recover', 'verification'] as const).map(mode => <Button variant="secondary" key={mode} type="button" aria-pressed={action === mode} onClick={() => { setAction(mode); setStatus('idle'); }}>{t[mode]}</Button>)}</div></>}
    <form className="space-y-4" onSubmit={async event => {
      event.preventDefault(); setStatus('pending');
      const form = new FormData(event.currentTarget);
      try {
        const result = await fetch(`/api/v1/auth/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password'), locale, ...token }) });
        const data = await result.json() as { verificationSent?: boolean; verified?: boolean };
        if (!result.ok) { setStatus('error'); return; }
        if (action === 'login') {
          if (data.verified !== true) { setStatus('verificationRequired'); return; }
          setStatus('success');
          window.location.assign('/' + locale + '/dashboard');
        } else if (action === 'signup' || action === 'verification') {
          if (action === 'verification' && data.verified === true) { window.location.assign('/' + locale + '/dashboard'); return; }
          setStatus(data.verificationSent === false ? 'verificationFailed' : 'signupSent');
        } else if (action === 'recover') {
          setStatus('recoverySent');
        } else if (action === 'reset') {
          setAction('login'); setToken({ userId: '', secret: '' }); setStatus('passwordReset');
        } else if (action === 'logout') {
          setStatus('idle'); router.replace('/' + locale + '/sign-in'); router.refresh();
        } else {
          setStatus('success');
        }
      } catch { setStatus('error'); }
    }}>
      {['login', 'signup', 'recover', 'verification'].includes(action) && <label className="block">{t.email}<input className="block w-full rounded border bg-transparent p-3" name="email" type="email" autoComplete="email" required maxLength={254} /></label>}
      {['login', 'signup', 'reset', 'verification'].includes(action) && <label className="block">{t.password}<input className="block w-full rounded border bg-transparent p-3" name="password" type="password" autoComplete={action === 'login' ? 'current-password' : 'new-password'} minLength={action === 'login' ? 1 : 12} maxLength={256} required /></label>}
      <Button variant="primary" type="submit" disabled={status === 'pending' || action === 'verify'}>{status === 'pending' ? t.pending : t[action]}</Button>
      <p role="status" aria-live="polite">{status === 'success' ? t.success
        : status === 'verificationFailed' ? t.verificationFailed
        : status === 'signupSent' ? (locale === 'es' ? 'Cuenta creada. Abra el correo de ROOT y pulse el enlace de verificación.' : 'Account created. Open the ROOT email and click the verification link once.')
        : status === 'verificationRequired' ? (locale === 'es' ? 'Correo no verificado. Abra el enlace de ROOT o seleccione Reenviar verificación. Iniciar sesión no envía otro correo.' : 'Email not verified yet. Open the ROOT verification link or select Resend verification. Sign-in does not send another email.')
        : status === 'verified' ? (locale === 'es' ? 'Correo verificado. Inicie sesión para abrir ROOT.' : 'Email verified. Sign in to open your ROOT workspace.')
        : status === 'verifyFailed' ? (locale === 'es' ? 'Enlace inválido o caducado. Inicie sesión y seleccione Reenviar verificación.' : 'Verification link invalid or expired. Sign in and select Resend verification.')
        : status === 'recoverySent' ? (locale === 'es' ? 'Si la cuenta existe, llegará un correo de recuperación de ROOT.' : 'If the account exists, a ROOT recovery email will arrive shortly.')
        : status === 'passwordReset' ? (locale === 'es' ? 'Contraseña actualizada. Inicie sesión de nuevo.' : 'Password updated. Sign in with the new password.')
        : status === 'error' ? t.error : ''}</p>
    </form>
    {!logout && <div className="flex flex-wrap gap-3"><Link href={`/${locale}/dashboard/client`}>{t.client}</Link><Link href={`/${locale}/dashboard/admin`}>{t.admin}</Link></div>}
  </div>;
}
