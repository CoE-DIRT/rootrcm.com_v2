'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/locales';
import { Button } from '@/components/ui/Button';

type Provider = 'google' | 'microsoft';

export function OAuthButtons({ locale }: { locale: Locale }) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const es = locale === 'es';

  // Buttons exist only for providers the server reports as enabled; otherwise nothing renders (no dead buttons).
  useEffect(() => {
    let active = true;
    fetch('/api/v1/auth/oauth/providers', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : { providers: [] }))
      .then((data: { providers?: Provider[] }) => {
        if (active) setProviders((data.providers ?? []).filter((p): p is Provider => p === 'google' || p === 'microsoft'));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  function handleOAuth(provider: Provider) {
    // Server-side token flow: /start sets a one-time nonce cookie and redirects to Appwrite; /callback sets the HttpOnly session.
    window.location.assign(`/api/v1/auth/oauth/start?provider=${provider}&locale=${locale}`);
  }

  if (providers.length === 0) return null;

  return (
    <div className="stack">
      <div className="auth-shell__oauth">
        {providers.includes('google') && <Button variant="secondary" size="lg" fullWidth onClick={() => handleOAuth('google')} leftIcon={
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        }>
          {es ? 'Continuar con Google' : 'Continue with Google'}
        </Button>}
        {providers.includes('microsoft') && <Button variant="secondary" size="lg" fullWidth onClick={() => handleOAuth('microsoft')} leftIcon={
          <svg width="20" height="20" viewBox="0 0 23 23" aria-hidden="true">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
        }>
          {es ? 'Continuar con Microsoft' : 'Continue with Microsoft'}
        </Button>}
      </div>
      <p className="auth-shell__divider">{es ? 'o con correo y contraseña' : 'or with email and password'}</p>
    </div>
  );
}
