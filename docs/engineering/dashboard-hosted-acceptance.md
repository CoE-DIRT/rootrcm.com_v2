# Dashboard hosted real-member acceptance (PR #78)

**Status: NOT RUN.** No hosted origin, fixture accounts or Appwrite console access were available to the agent. Local mocks and CI are not acceptance evidence.

## Preconditions (founder / console)
1. Existing Site `6ae879e5000e56af0015` variables per `hosted-auth-release.md` (`ROOT_ENABLE_AUTH`/`ROOT_ENABLE_LIVE_AUTH`=true only for the validation window, `ROOT_AUTH_ORIGIN`, `APPWRITE_*`; key stored as secret). Verify domain/TLS and Web platform for the canonical origin.
2. Four controlled, **synthetic** verified users (never the real admin; no PHI):
   - `ADMIN` — active `ROOT_SUPERADMIN` membership in a root org
   - `STAFF` — active `ROOT_SPECIALIST` or `ROOT_ACCOUNT_MANAGER`
   - `CLIENT` — active `CLIENT_OWNER`/`CLIENT_MEMBER` in org A
   - `PENDING` — verified, no membership row
   plus a second client org B (`ACCEPT_OTHER_ORG_ID`) the `CLIENT` is not a member of.
3. Memberships table rows: `userId, orgId, role, status=active, revokedAt=null`.

## Run
```bash
PLAYWRIGHT_BASE_URL=https://<canonical-origin> \
ACCEPT_{ADMIN,STAFF,CLIENT,PENDING}_EMAIL=... ACCEPT_{...}_PASSWORD=... \
ACCEPT_CLIENT_ORG_ID=<org A> ACCEPT_OTHER_ORG_ID=<org B> \
npx playwright test hosted-dashboard-acceptance
```
Covers: role-matched landing (EN/ES), SYNTHETIC SAMPLE label, refresh, logout then redirect/401, cookie HttpOnly+Secure, access-pending, wrong `orgId` 403, client→staff/admin 403, admin cannot pick another org, tampered/cleared cookies, preview API not an auth path.

## Manual checks the spec cannot make
- Revoke the `CLIENT` membership (set `status` != active) → next request denies; restore afterwards.
- Cookie expiry: wait out or delete the Appwrite session in Console → redirect to sign-in.
- Canonical redirect has no loop; preview-origin POST rejected; no secrets in responses/logs.

Record the SHA, date, origin host and pass/fail per test here before moving PR #78 out of draft.
