import type { Locale } from '@/i18n/locales';

export type AuthOutcome = 'invalid' | 'unverified' | 'rateLimited' | 'unavailable' | 'network' | 'expired' | 'exists';

const messages: Record<AuthOutcome, Record<Locale, string>> = {
  invalid: {
    en: 'That email and password combination was not recognized.',
    es: 'No reconocimos esa combinación de correo y contraseña.',
  },
  unverified: {
    en: 'Your email address is not verified yet. Open the verification email from ROOT, then sign in again.',
    es: 'Su correo aún no está verificado. Abra el correo de verificación de ROOT y vuelva a iniciar sesión.',
  },
  rateLimited: {
    en: 'Too many attempts. For your security, please wait a few minutes and try again.',
    es: 'Demasiados intentos. Por seguridad, espere unos minutos e inténtelo de nuevo.',
  },
  unavailable: {
    en: 'Sign-in is temporarily unavailable. Please try again shortly or contact ROOT.',
    es: 'El acceso no está disponible temporalmente. Inténtelo en unos minutos o contacte a ROOT.',
  },
  network: {
    en: 'We could not reach the server. Check your connection and try again.',
    es: 'No pudimos conectar con el servidor. Revise su conexión e inténtelo de nuevo.',
  },
  expired: {
    en: 'This reset link is invalid or has expired. Request a new one.',
    es: 'Este enlace no es válido o caducó. Solicite uno nuevo.',
  },
  exists: {
    en: 'We could not create the account. The email may already be registered — try signing in or resetting your password.',
    es: 'No pudimos crear la cuenta. Es posible que el correo ya esté registrado: inicie sesión o restablezca su contraseña.',
  },
};

/** Maps a real Appwrite-backed HTTP status to a user-facing outcome. Never fabricates success. */
export function outcomeFromStatus(status: number, fallback: AuthOutcome = 'invalid'): AuthOutcome {
  if (status === 429) return 'rateLimited';
  if (status >= 500) return 'unavailable';
  return fallback;
}

export function authMessage(outcome: AuthOutcome, locale: Locale) {
  return messages[outcome][locale];
}
