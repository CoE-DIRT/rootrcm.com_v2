export const practiceSizes = ['solo', '2-5', '6-20', '21-50', '51+'] as const;
export type PracticeSize = (typeof practiceSizes)[number];

export type SignupProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  practiceName: string;
  specialty?: string;
  practiceSize?: PracticeSize;
  /** Separate, optional, default false. Never implied by terms acceptance. */
  marketingConsent: boolean;
  locale: 'en' | 'es';
};

export type ProfileErrors = Partial<Record<keyof SignupProfile | 'terms', string>>;

// Free-text business fields must not carry patient data.
const phiHint = /\b(patient|ssn|social security|dob|date of birth|mrn|diagnosis|icd-?10|cpt\s*\d)\b/i;
const control = /[\u0000-\u001f\u007f<>]/;

const text = (value: unknown, min: number, max: number): string | null => {
  if (typeof value !== 'string') return null;
  const v = value.trim().replace(/\s+/g, ' ');
  return v.length >= min && v.length <= max && !control.test(v) && !phiHint.test(v) ? v : null;
};

/** Normalizes to E.164-like: optional leading +, 7 to 15 digits. */
export function normalizePhone(value: unknown): string | null {
  if (typeof value !== 'string' || !/^[+\d\s().-]{7,24}$/.test(value)) return null;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  return `${value.trim().startsWith('+') ? '+' : ''}${digits}`;
}

export function validateSignupProfile(input: unknown): { ok: true; data: SignupProfile } | { ok: false; errors: ProfileErrors } {
  const r = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
  const errors: ProfileErrors = {};
  const firstName = text(r.firstName, 1, 60);
  const lastName = text(r.lastName, 1, 60);
  const phone = normalizePhone(r.phone);
  // organizations.displayName is varchar(160) in the verified Appwrite schema.
  const practiceName = text(r.practiceName, 2, 160);
  if (!firstName) errors.firstName = 'invalid';
  if (!lastName) errors.lastName = 'invalid';
  if (!phone) errors.phone = 'invalid';
  if (!practiceName) errors.practiceName = 'invalid';
  let specialty: string | undefined;
  if (r.specialty !== undefined && r.specialty !== '') {
    const s = text(r.specialty, 2, 80);
    if (!s) errors.specialty = 'invalid';
    else specialty = s;
  }
  let practiceSize: PracticeSize | undefined;
  if (r.practiceSize !== undefined && r.practiceSize !== '') {
    if ((practiceSizes as readonly unknown[]).includes(r.practiceSize)) practiceSize = r.practiceSize as PracticeSize;
    else errors.practiceSize = 'invalid';
  }
  if (r.termsAccepted !== true) errors.terms = 'required';
  if (r.marketingConsent !== undefined && typeof r.marketingConsent !== 'boolean') errors.marketingConsent = 'invalid';
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      firstName: firstName!, lastName: lastName!, phone: phone!, practiceName: practiceName!,
      ...(specialty ? { specialty } : {}), ...(practiceSize ? { practiceSize } : {}),
      marketingConsent: r.marketingConsent === true,
      locale: r.locale === 'es' ? 'es' : 'en',
    },
  };
}
