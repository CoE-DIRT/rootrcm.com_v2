/**
 * Browser cookie-preference contract. Necessary cookies stay on.
 * Analytics/marketing choices are stored locally and cannot enable vendors
 * that are not present in this build.
 */
export const COOKIE_PREFERENCE_KEY = 'root-cookie-preferences';
export const COOKIE_PREFERENCE_VERSION = 1 as const;

export type CookiePreferenceRecord = {
  v: typeof COOKIE_PREFERENCE_VERSION;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedValue: CookiePreferenceRecord | null = null;

export function necessaryOnlyPreferences(now = new Date().toISOString()): CookiePreferenceRecord {
  return { v: 1, necessary: true, analytics: false, marketing: false, decidedAt: now };
}

export function acceptAllPreferences(now = new Date().toISOString()): CookiePreferenceRecord {
  return { v: 1, necessary: true, analytics: true, marketing: true, decidedAt: now };
}

export function coerceCookiePreferences(value: unknown): CookiePreferenceRecord | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (record.v !== COOKIE_PREFERENCE_VERSION) return null;
  if (typeof record.decidedAt !== 'string' || record.decidedAt.length < 10) return null;
  return {
    v: 1,
    necessary: true,
    analytics: record.analytics === true,
    marketing: record.marketing === true,
    decidedAt: record.decidedAt,
  };
}

export function readCookiePreferences(): CookiePreferenceRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_PREFERENCE_KEY);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    cachedValue = raw ? coerceCookiePreferences(JSON.parse(raw) as unknown) : null;
    return cachedValue;
  } catch {
    cachedRaw = null;
    cachedValue = null;
    return null;
  }
}

export function writeCookiePreferences(preferences: CookiePreferenceRecord): void {
  if (typeof window === 'undefined') return;
  const raw = JSON.stringify(preferences);
  window.localStorage.setItem(COOKIE_PREFERENCE_KEY, raw);
  cachedRaw = raw;
  cachedValue = preferences;
  listeners.forEach((listener) => listener());
}

export function subscribeCookiePreferences(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', listener);
    }
  };
}

export function cookiePreferencesServerSnapshot(): null {
  return null;
}

export function subscribeClientReady(): () => void {
  return () => {};
}

export function clientReadySnapshot(): true {
  return true;
}

export function clientReadyServerSnapshot(): false {
  return false;
}

/** No analytics vendor is shipped. A stored "allow" cannot turn pixels on. */
export function isAnalyticsRuntimeEnabled(preferences?: CookiePreferenceRecord | null): false {
  void preferences;
  return false;
}

/** No marketing pixels or CRM trackers are shipped. */
export function isMarketingRuntimeEnabled(preferences?: CookiePreferenceRecord | null): false {
  void preferences;
  return false;
}
