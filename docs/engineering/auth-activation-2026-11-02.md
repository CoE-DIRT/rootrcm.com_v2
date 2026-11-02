# ROOT V2 real authentication release gates

V2 Appwrite project: `6ae878f400268114a480`. Deploy only to isolated V2; do not change V1.

Required: Server-side Appwrite session validation, email verification, account registration, logout, secure HTTP-only cookies, protected client/admin dashboards, team membership checks, password recovery, request origin checks, rate limiting and tests. Do not grant admin based only on an email or a shared credential.

Admin: `info@rootrcm.com`, only after email ownership verification and audited manual role assignment. Never use a public demo password.

Create staging API key with only necessary scopes and store it in Appwrite Site secret variables, not GitHub or NEXT_PUBLIC. Do not enable production auth until all acceptance checks pass. Existing synthetic preview remains distinct from real sessions.

## Implemented contract and activation dependencies
- Both ROOT_ENABLE_AUTH and ROOT_ENABLE_LIVE_AUTH default to false; both must be explicitly enabled in isolated staging only.
- APPWRITE_AUTH_API_KEY: server-only V2 key with sessions.write and rows.read. APPWRITE_DATABASE_ID: isolated V2 database containing the existing memberships schema (userId, orgId, role). No client create/update/delete permissions on this table or its rows. Membership writes and canonical role assignment are audited administrator operations; signup never assigns a role. Remove a membership row to revoke access. Duplicate org assignments fail closed. Add a userId query index.
- ROOT_AUTH_ORIGIN: exact trusted staging origin, HTTPS with no trailing slash. Local nonproduction accepts http://localhost:3000. Configure the matching Appwrite Web platform and verification/recovery redirect hostname; configure and validate Appwrite email delivery, password policy and session expiry.
- Install a shared ingress rate limit for /api/v1/auth/* before enabling multi-instance access. Login has a bounded per-instance per-email backstop; public signup/recovery/verification retain Appwrite limits. Configure platform limits for IP and aggregate traffic; do not trust client-forwarded IP headers.
- Routes: POST /api/v1/auth/{signup,login,logout,verification,verify,recover,reset}; JSON business email/password, locale en|es; verify/reset also require userId and secret. CSRF requires exact configured Origin. Session secrets stay in HTTP-only, SameSite=Strict, host-only cookies; Secure on HTTPS. No provider token/error response is exposed. All provider requests bypass caches and time out.
- /{en,es}/sign-in reuses Figma 6:99 shell; /{en,es}/dashboard/{client,admin} reuses existing page components and 5:138/5:195 inventory mapping. Visual approval remains pending. Dashboard orgId is a selector only; server checks canonical membership and permission on every render. No connected operational data is claimed. Synthetic previews remain separate.
- Staging acceptance still required: actual email signup/login/logout, email links (including expired/reused), recovery and session revocation behavior, cookie inspection, cross-tenant denial, manual keyboard/screen reader/mobile/theme checks. Do not enable production or claim approval from mocked tests.
