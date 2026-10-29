/** Public contact fields only. Never solicit or accept PHI. */
export type BusinessContact = {
  name: string;
  email: string;
  organization: string;
  message?: string;
  consent: boolean;
  concern?: string;
};

export type FieldErrors = Partial<Record<keyof BusinessContact, string>>;

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
    return { ok: false, fieldErrors: { name: 'Required' } };
  }
  const record = value as Record<string, unknown>;
  const fieldErrors: FieldErrors = {};
  const name = typeof record.name === 'string' ? record.name.trim() : '';
  const email = typeof record.email === 'string' ? record.email.trim() : '';
  const organization = typeof record.organization === 'string' ? record.organization.trim() : '';
  const message = typeof record.message === 'string' ? record.message.trim() : undefined;
  const concern = typeof record.concern === 'string' ? record.concern.trim() : undefined;
  const consent = record.consent === true || record.consent === 'true' || record.consent === 'on';

  if (name.length < 2) fieldErrors.name = 'Enter a business contact name.';
  if (name.length > 120) fieldErrors.name = 'Name is too long.';
  if (!emailPattern.test(email)) fieldErrors.email = 'Enter a valid business email.';
  if (email.length > 254) fieldErrors.email = 'Email is too long.';
  if (organization.length < 2) fieldErrors.organization = 'Enter an organization name.';
  if (organization.length > 200) fieldErrors.organization = 'Organization is too long.';
  if (message && message.length > 2000) fieldErrors.message = 'Message is too long.';
  if (!consent) fieldErrors.consent = 'Consent is required to send a business inquiry.';
  const combined = `${message ?? ''} ${concern ?? ''}`;
  if (phiHint.test(combined)) {
    fieldErrors.message = 'Do not include patient, clinical or identifying health details.';
  }

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
  return {
    ok: true,
    data: { name, email, organization, message, consent, concern },
  };
}
