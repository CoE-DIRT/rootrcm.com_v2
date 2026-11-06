# Google / Microsoft sign-in (Appwrite OAuth2, server-side token flow)

Status: implemented, **hidden until enabled**. Not exercised against a real provider (needs console configuration below).

Flow: `GET /api/v1/auth/oauth/start?provider=&locale=` sets a one-time HttpOnly nonce cookie and redirects to Appwrite `account/tokens/oauth2/{provider}`;
Appwrite returns to `GET /api/v1/auth/oauth/callback?userId&secret&p&locale&n`; the server verifies the nonce (login-CSRF defence), exchanges the token for a session with
the server key, requires `status` and `emailVerification` (provider-verified), sets the same HttpOnly `root_v2_auth` cookie as password login and redirects to `/{locale}/dashboard`.
Role routing and tenant isolation are unchanged (the dashboard redirects by real membership). A verified account with no membership sees the workspace setup form
(`POST /api/v1/account/workspace`, needs `ROOT_ENABLE_SIGNUP_PROVISIONING`), otherwise the access-pending message. No token ever appears in a browser-visible URL after the callback.

Buttons render only for providers returned by `GET /api/v1/auth/oauth/providers`, which needs live auth plus `ROOT_OAUTH_GOOGLE=true` / `ROOT_OAUTH_MICROSOFT=true`.

Console steps (owner; secrets never go in Git):
1. Appwrite → Auth → Settings → OAuth2: enable Google / Microsoft with the provider client id + secret; copy Appwrite's redirect URI into the provider app
   (`https://nyc.cloud.appwrite.io/v1/account/oauth2/callback/{provider}/6ae878f400268114a480`).
2. Confirm the web platform hostname `rootrcm.com` exists (success/failure URLs must be on a registered platform).
3. Confirm `APPWRITE_AUTH_API_KEY` has `sessions.write` (token exchange) and `rows.read`.
4. Set `ROOT_OAUTH_GOOGLE` / `ROOT_OAUTH_MICROSOFT` only after a real sign-in works on an isolated Appwrite-hosted origin.

Open questions to verify hosted: that Microsoft personal/work accounts return a verified email (otherwise sign-in is refused with `oauth_unverified`), and account linking when an existing password user signs in with the same email.
