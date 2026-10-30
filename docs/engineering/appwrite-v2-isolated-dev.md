# Appwrite V2 isolated development environment

**Status:** preparation only. No project, Sites host, function, or paid resource was created in this pass.

## Constraint

The connected Appwrite Cloud account currently hosts the **live V1 Vite website**. That project must not be reused or modified for V2. Do not point `NEXT_PUBLIC_APPWRITE_PROJECT_ID` at V1. Do not enable `ROOT_ENABLE_AUTH`, CRM, payments, prospecting, or live claims until acceptance gates are met.

## Intended V2 layout (not provisioned)

| Environment | Appwrite project | GitHub Environment | Flags |
| --- | --- | --- | --- |
| Local / `dev` | New **ROOT V2 Dev** project | `dev` (does not exist yet) | all `false` until PDP is wired to real sessions |
| Preview | New **ROOT V2 Preview** project | `preview` | deny by default |
| Production | Separate **ROOT V2 Prod** after migration signoff | `production` | never enabled from this PR |

V1 production project and `rootrcm.com` remain untouched.

## Required before creating chargeable resources

1. Independent approval to create a **new** Appwrite project (not V1).
2. GitHub Environment `dev` with protected secrets. Current repo Environments count is **0**.
3. TablesDB schema with **row security** and team roles. Table-level `Role.any()` writes are forbidden.
4. SSR httpOnly session cookies. Client-only entitlement gates remain insufficient (`src/server/auth/policy.ts`).
5. Typed disabled adapters stay in `src/integrations/disabled.ts` until sandbox credentials exist.

## Local identifiers (placeholders)

See `.env.example`. Leave `NEXT_PUBLIC_APPWRITE_PROJECT_ID` blank until the isolated V2 project ID is issued. Server keys never use the `NEXT_PUBLIC_` prefix.

## Acceptance gates still closed

- Authentication
- HubSpot CRM writes
- Stripe checkout / subscriptions
- Apollo enrichment
- Patient-level or claims data

Issue: [#6](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/6).
