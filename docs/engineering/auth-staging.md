# Isolated auth staging configuration

1. In Appwrite Console create/select a **separate staging project in NYC**, never V1/production. Record its ID independently; the application cannot determine a project's purpose from its ID. No historical project ID or public variable is used as a fallback. Set the server variables below in staging only; keep both enable flags false during provisioning.

```dotenv
ROOT_AUTH_ENVIRONMENT=staging
APPWRITE_AUTH_PROJECT_ID=<approved-isolated-staging-project-id>
APPWRITE_DATABASE_ID=<staging-database-id>
APPWRITE_AUTH_API_KEY=<staging-runtime-key-from-secret-store>
ROOT_AUTH_ORIGIN=https://<exact-staging-host>
ROOT_ENABLE_AUTH=false
ROOT_ENABLE_LIVE_AUTH=false
```

`ROOT_AUTH_ORIGIN` must be an exact HTTPS origin (optional explicit port, no trailing slash/path/query/credentials). Production rootrcm.com/www.rootrcm.com are rejected. Nonproduction localhost HTTP remains supported. Leave NEXT_PUBLIC_APPWRITE_PROJECT_ID empty or set it to the same staging ID; a mismatch disables auth. The endpoint remains https://nyc.cloud.appwrite.io/v1. This patch does not configure other regions.

2. Enable email/password in that project's Console, register a Web platform for the exact staging hostname, configure email delivery and password/session policies. Callback URLs are constructed only from ROOT_AUTH_ORIGIN: `/en/sign-in?mode=verify`, `/es/sign-in?mode=verify` and corresponding `mode=reset` URLs. Browser POST Origin must match exactly (including non-default port). Keep HTTPS at the browser/proxy boundary. Cookies already use HttpOnly, Secure on HTTPS, SameSite=Strict, Path=/, provider expiry and no Domain; each staging hostname has its own cookie. After opening an external email link the same-origin client POST sends the cookie; verification/reset tokens also work without an existing session.

3. Runtime key scopes are **sessions.write + rows.read only**: transport sends the key solely for POST `/account/sessions/email` and GET `/tablesdb/{databaseId}/tables/memberships/rows`. Signup, recovery, verification and logout do not use the key. No users.write, rows.write, teams or schema-write scopes are needed at runtime. Keys bypass row permissions, so use a dedicated staging project. See [Appwrite scopes](https://appwrite.io/docs/partners/project/api-keys) and [SSR sessions](https://appwrite.io/docs/products/auth/server-side-rendering).

4. Provision using a separate temporary operator key (databases.write, tables.write, columns.write, indexes.write; add matching read scopes for inspection). Never install that key in the application. The following PowerShell commands are **operator-run**, not executed by this patch. Supply project/database IDs and an approved staging-only setup key via the process environment/secret store; do not paste keys into shell commands or enable transcription.

```powershell
if ($env:ROOT_AUTH_ENVIRONMENT -ne 'staging' -or !$env:APPWRITE_AUTH_PROJECT_ID -or !$env:APPWRITE_DATABASE_ID -or !$env:APPWRITE_STAGING_SETUP_KEY) { throw 'Missing explicit staging configuration' }
$stagingBase = 'https://nyc.cloud.appwrite.io/v1/tablesdb'
$stagingHeaders = @{ 'X-Appwrite-Project'=$env:APPWRITE_AUTH_PROJECT_ID; 'X-Appwrite-Key'=$env:APPWRITE_STAGING_SETUP_KEY }
$stagingDb = [uri]::EscapeDataString($env:APPWRITE_DATABASE_ID)
function Add-StagingResource($path, $body) {
  Invoke-RestMethod -ErrorAction Stop -Method Post -Uri "$stagingBase$path" -Headers $stagingHeaders -ContentType 'application/json' -Body ($body | ConvertTo-Json -Depth 6) | Out-Null
}
Add-StagingResource '' @{ databaseId=$env:APPWRITE_DATABASE_ID; name='ROOT auth staging' }
Add-StagingResource "/$stagingDb/tables" @{ tableId='memberships'; name='Memberships'; permissions=@(); rowSecurity=$true }
foreach ($column in @('userId','orgId','role')) {
  Add-StagingResource "/$stagingDb/tables/memberships/columns/varchar" @{ key=$column; size=36; required=$true }
}
# Wait until all three columns report status=available in Console, then run:
Add-StagingResource "/$stagingDb/tables/memberships/indexes" @{ key='by_user'; type='key'; columns=@('userId') }
Add-StagingResource "/$stagingDb/tables/memberships/indexes" @{ key='unique_user_org'; type='unique'; columns=@('userId','orgId') }
```

For repeat runs, inspect existing deterministic IDs first and skip matching resources; a 409 is not success unless schema/permissions match. Never delete/recreate resources to resolve a mismatch. Wait for both indexes to become available. The transport queries `equal(userId, account.$id)` with `limit(100)`; it fails closed above 100 memberships and on duplicate org assignments. `by_user` supports that query; unique `(userId,orgId)` prevents ambiguity. Required nonencrypted varchar fields match the existing schema: userId, orgId, canonical role from src/domain/identity/roles.ts (maximum role length <36). No client table or row permissions; new membership rows must have permissions=[] too. Use audited operator provisioning for synthetic org/membership rows; never accept browser role assignment. Organization onboarding remains outside this patch. Remove the temporary setup key after provisioning.

5. Install shared ingress limits for `/api/v1/auth/*`, then explicitly enable both flags **in isolated staging only** for validation. Run the existing acceptance journeys in auth-activation-2026-11-02.md. Verify ordinary users cannot write membership rows directly, and verify the runtime key cannot write rows/schema. Revert either flag to false to disable. No production resources, flags or deployment are changed by these instructions. [TablesDB REST reference](https://appwrite.io/docs/references/cloud/server-rest/tablesDB).
