'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/locales';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/status';

export function OAuthButtons({ locale }: { locale: Locale }) {
  const [notice, setNotice] = useState<string | null>(null);
  const es = locale === 'es';

  function handleOAuth(provider: 'google' | 'microsoft') {
    // Check if Appwrite endpoint is configured for OAuth
    const providerName = provider === 'google' ? 'Google' : 'Microsoft 365';
    // In production with live Appwrite, this redirects to Appwrite OAuth2 URL.
    // In current disabled/isolated adapter state, provide an honest enterprise message rather than fake success.
    const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const appwriteProject = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (appwriteEndpoint && appwriteProject) {
      const redirectUrl = `${window.location.origin}/${locale}/dashboard`;
      const failureUrl = `${window.location.origin}/${locale}/login?error=oauth_failed`;
      // External OAuth provider redirect
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `${appwriteEndpoint}/account/sessions/oauth2/${provider}?project=${appwriteProject}&success=${encodeURIComponent(redirectUrl)}&failure=${encodeURIComponent(failureUrl)}`;
    } else {
      setNotice(
        es
          ? `El inicio de sesión único con ${providerName} requiere la habilitación del proveedor de identidad en Appwrite. Utilice el acceso seguro mediante correo y contraseña.`
          : `${providerName} enterprise SSO requires an active Appwrite identity provider configuration. Please sign in with your practice email and password.`
      );
    }
  }

  return (
    <div className="stack">
      <div className="auth-shell__oauth">
        <Button variant="secondary" size="lg" fullWidth onClick={() => handleOAuth('google')} leftIcon={
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
        </Button>
        <Button variant="secondary" size="lg" fullWidth onClick={() => handleOAuth('microsoft')} leftIcon={
          <svg width="20" height="20" viewBox="0 0 23 23" aria-hidden="true">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
        }>
          {es ? 'Continuar con Microsoft' : 'Continue with Microsoft'}
        </Button>
      </div>
      {notice ? <StatusBanner tone="warning">{notice}</StatusBanner> : null}
      <p className="auth-shell__divider">{es ? 'o con correo y contraseña' : 'or with email and password'}</p>
    </div>
  );
}
