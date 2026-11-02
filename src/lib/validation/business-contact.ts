/** Public contact fields only. Never solicit or accept PHI. */
export type BusinessContact = {
  name: string;
  email: string;
  organization: string;
  message?: string;
  consent: boolean;
  concern?: string;
};

export const fieldErrorKeys = [
  'required',
  'nameShort',
  'nameLong',
  'emailInvalid',
  'emailLong',
  'orgShort',
  'orgLong',
  'messageLong',
  'consentRequired',
  'phiRejected',
] as const;

export type FieldErrorKey = (typeof fieldErrorKeys)[number];
export type FieldErrors = Partial<Record<keyof BusinessContact, FieldErrorKey>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phiHint =
  /\b(patient|ssn|social security|dob|date of birth|mrn|diagnosis|icd-?10|cpt\s*\d)\b/i;

export function isBusinessContact(value: unknown): value is BusinessContact {
  return validateBusinessContact(value).ok;
}

export function validateBusinessContact(
  value: unknown,
): { ok: true; data: BusinessContact } | { ok: false; fieldErrors: FieldErrors } {
  if (!value || typeof value !== 'object') {
    return { ok: false, fieldErrors: { name: 'required' } };
  }
  const record = value as Record<string, unknown>;
  const fieldErrors: FieldErrors = {};
  const name = typeof record.name === 'string' ? record.name.trim() : '';
  const email = typeof record.email === 'string' ? record.email.trim() : '';
  const organization = typeof record.organization === 'string' ? record.organization.trim() : '';
  const message = typeof record.message === 'string' ? record.message.trim() : undefined;
  const concern = typeof record.concern === 'string' ? record.concern.trim() : undefined;
  const consent = record.consent === true || record.consent === 'true' || record.consent === 'on';

  if (name.length < 2) fieldErrors.name = 'nameShort';
  if (name.length > 120) fieldErrors.name = 'nameLong';
  if (!emailPattern.test(email)) fieldErrors.email = 'emailInvalid';
  if (email.length > 254) fieldErrors.email = 'emailLong';
  if (organization.length < 2) fieldErrors.organization = 'orgShort';
  if (organization.length > 200) fieldErrors.organization = 'orgLong';
  if (message && message.length > 2000) fieldErrors.message = 'messageLong';
  if (!consent) fieldErrors.consent = 'consentRequired';
  const combined = `${message ?? ''} ${concern ?? ''}`;
  if (phiHint.test(combined)) {
    fieldErrors.message = 'phiRejected';
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return {
    ok: true,
    data: { name, email, organization, message, consent, concern },
  };
}
