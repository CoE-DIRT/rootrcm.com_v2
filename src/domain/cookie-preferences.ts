/**
 * Browser cookie-preference contract. Necessary cookies stay on.
 * Analytics and marketing choices are stored locally and cannot enable vendors
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

export type CookiePreferenceStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const listeners = new Set<() => void>();
let memoryRecord: CookiePreferenceRecord | null = null;
let cachedRaw: string | null = null;
let persistence: 'unknown' | 'local' | 'memory' = 'unknown';
const emptyPreferences = necessaryOnlyPreferences('1970-01-01T00:00:00.000Z');

export function necessaryOnlyPreferences(now = new Date().toISOString()): CookiePreferenceRecord {
  return { v: 1, necessary: true, analytics: false, marketing: false, decidedAt: now };
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

/** A partial edit keeps the other saved choice. The string "false" is not approval. */
export function mergeCookiePreferences(
  current: CookiePreferenceRecord | null,
  patch: { analytics?: boolean; marketing?: boolean },
  now = new Date().toISOString(),
): CookiePreferenceRecord {
  const base = current ?? necessaryOnlyPreferences(now);
  return {
    v: 1,
    necessary: true,
    analytics: patch.analytics ?? base.analytics,
    marketing: patch.marketing ?? base.marketing,
    decidedAt: now,
  };
}

export function persistCookieRecord(
  storage: CookiePreferenceStorage | null,
  record: CookiePreferenceRecord,
): 'stored' | 'memory' {
  if (!storage) return 'memory';
  try {
    storage.setItem(COOKIE_PREFERENCE_KEY, JSON.stringify(record));
    return 'stored';
  } catch {
    return 'memory';
  }
}

function browserStorage(): CookiePreferenceStorage | null {
  if (typeof window === 'undefined') return null;
  if (persistence === 'memory') return null;
  try {
    const probe = `${COOKIE_PREFERENCE_KEY}-probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    persistence = 'local';
    return window.localStorage;
  } catch {
    persistence = 'memory';
    return null;
  }
}

export function readCookiePreferences(): CookiePreferenceRecord | null {
  const storage = browserStorage();
  if (!storage) return memoryRecord;
  try {
    const raw = storage.getItem(COOKIE_PREFERENCE_KEY);
    if (raw === cachedRaw) return memoryRecord;
    cachedRaw = raw;
    memoryRecord = raw ? coerceCookiePreferences(JSON.parse(raw) as unknown) : null;
    return memoryRecord;
  } catch {
    persistence = 'memory';
    return memoryRecord;
  }
}

export function cookiePreferencesSnapshot(): CookiePreferenceRecord {
  return readCookiePreferences() ?? emptyPreferences;
}

export function subscribeCookiePreferences(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function writeCookiePreferences(preferences: CookiePreferenceRecord): CookiePreferenceRecord {
  memoryRecord = preferences;
  const stored = persistCookieRecord(browserStorage(), preferences);
  if (stored === 'memory') {
    persistence = 'memory';
    cachedRaw = null;
  } else {
    cachedRaw = JSON.stringify(preferences);
  }
  listeners.forEach((listener) => listener());
  return preferences;
}

export function updateCookiePreferences(
  patch: { analytics?: boolean; marketing?: boolean },
  now = new Date().toISOString(),
): CookiePreferenceRecord {
  return writeCookiePreferences(mergeCookiePreferences(readCookiePreferences(), patch, now));
}

export function cookiePreferencePersistence(): 'local' | 'memory' | 'server' {
  if (typeof window === 'undefined') return 'server';
  browserStorage();
  return persistence === 'memory' ? 'memory' : 'local';
}

/** No analytics vendor is shipped. A stored allow cannot turn pixels on. */
export function isAnalyticsRuntimeEnabled(): false {
  return false;
}

/** No marketing pixels or CRM trackers are shipped. */
export function isMarketingRuntimeEnabled(): false {
  return false;
}
