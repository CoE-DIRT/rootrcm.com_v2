# ROOT V2 real authentication release gates

V2 Appwrite project: `6ae878f400268114a480`. Deploy only to isolated V2; do not change V1.

Required: Server-side Appwrite session validation, email verification, account registration, logout, secure HTTP-only cookies, protected client/admin dashboards, team membership checks, password recovery, request origin checks, rate limiting and tests. Do not grant admin based only on an email or a shared credential.

Admin: `info@rootrcm.com`, only after email ownership verification and audited manual role assignment. Never use a public demo password.

Create staging API key with only necessary scopes and store it in Appwrite Site secret variables, not GitHub or NEXT_PUBLIC. Do not enable production auth until all acceptance checks pass. Existing synthetic preview remains distinct from real sessions.
