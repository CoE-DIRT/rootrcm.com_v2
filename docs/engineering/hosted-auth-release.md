# Existing Site hosted-auth release gate

PR base: latest validated #66 head cd7219f (contains #67/#71/#72). Work is isolated; the running local checkout and its uncommitted fixes are untouched. No users, memberships, projects or Sites are created or changed.

Observed 2026-11-03 through Appwrite read-only metadata: existing project `6ae878f400268114a480`, Site `6ae879e5000e56af0015`, Next.js SSR, build `npm run build`, output `.next`, tracking `main`, zero Site variables. Custom-domain lookup is **not verified**: the connection lacks `rules.read`. Do not infer canonical origin from the commercial domain or a preview hostname. Production mode is implemented but remains disabled without explicit configuration and both flags.

Configure these variables on the **existing Site**, available during both build and SSR runtime (use Console's secret option for the key). No `.env.local` upload, no public key, no secret in release notes:

| Variable | Required value |
| --- | --- |
| ROOT_ENABLE_AUTH | true only for intentional hosted validation; otherwise false |
| ROOT_ENABLE_LIVE_AUTH | true only for intentional hosted validation; otherwise false |
| ROOT_AUTH_ENVIRONMENT | production (or staging for an isolated preview) |
| ROOT_AUTH_ORIGIN | Exact verified canonical HTTPS origin; no slash/path/query/credentials |
| APPWRITE_AUTH_PROJECT_ID | 6ae878f400268114a480 (production guard; no fallback) |
| APPWRITE_DATABASE_ID | `root_v2_core` (confirmed existing database) |
| APPWRITE_AUTH_API_KEY | Existing-project server secret, only sessions.write and rows.read |
| NEXT_PUBLIC_SITE_URL | Same canonical origin for public metadata |

Leave NEXT_PUBLIC_APPWRITE_PROJECT_ID empty or identical to APPWRITE_AUTH_PROJECT_ID. Server auth uses the fixed NYC endpoint. No generic APPWRITE_API_KEY or configurable cookie-name variable is used by this auth transport. Read-only schema inspection confirmed memberships has row security, no table permissions, userId/orgId/role/status/revokedAt columns and available by_user/by_org/unique_user_org indexes. Membership shape/status checks, percent-decoding and verified-principal preservation remain unchanged from #72.

Canonical strategy: first verify the Site's custom-domain mapping and TLS in Console. Pick that exact origin; do not accept a list or arbitrary request Host/Origin. Production middleware redirects EN/ES sign-in and dashboard GETs from the default preview/alias host to the configured origin, preserving path/query. Auth POSTs from another Origin are rejected, not redirected. Public/contact routes remain unchanged. Email callback URLs use ROOT_AUTH_ORIGIN only. Host-only Secure+HttpOnly+SameSite=Strict cookies therefore live on the canonical host; restart sign-in there instead of expecting preview cookies to cross domains. If proxy URL reconstruction differs from the public origin, hosted smoke must detect and block any redirect loop before release. Register the canonical hostname as an Appwrite Web platform for verification/recovery callbacks.

Release checklist (do not merge #66 or this child to main yet):
- Founder configures the existing Site's listed variables using the secret store, confirms domain/TLS mapping and existing database ID. No key is printed or committed. Confirm shared ingress auth throttling is already configured.
- On an authorized hosted preview of this commit, existing verified admin logs in in EN and ES; `/dashboard` resolves to `/dashboard/admin?orgId=root_internal`; reload/second page view works. Inspect cookie flags, JS invisibility, no secret response/log leakage. Do not create/reverify the existing admin.
- Logout then direct dashboard visit redirects to localized sign-in. Missing/expired/forged sessions redirect. Current inactive/revoked/wrong-tenant membership denies; no membership yields access pending. Use synthetic fixtures or a controlled test account, never revoke the real admin to test denial.
- Verify canonical alias redirect does not loop, preview-origin POST is denied, public/contact routes and synthetic previews are unchanged. CI quality, E2E and CodeQL must pass on this PR.
- Only after variable configuration and hosted smoke evidence are recorded: founder authorizes the final main merge/deployment. Main is wired to automatic Site deployment. No deploy/merge is executed by this patch.

Hosted authenticated smoke is blocked until Site variables and canonical-domain access are available. Local mocked tests and CI do not establish hosted acceptance.
