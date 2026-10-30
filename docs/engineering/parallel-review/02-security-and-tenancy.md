# Security and tenancy (existing repo — not a PR diff)

Defensive recommendations only. No exploit PoCs, payloads, or attack steps.  
**Current runtime attack surface is small** (static-ish foundation, integrations off, `robots` disallow). Findings below are **class risks** that become exploitable as soon as Auth, forms, or adapters are enabled on this architecture.

## 1. Authentication and session — P0/P1

| Item | Sev | Evidence | Why it matters | Fix | External? |
| --- | --- | --- | --- | --- | --- |
| No session implementation | P1 | No middleware, no `app/api/appwrite`, no `node-appwrite` | Cannot enforce server-side membership | Use Appwrite documented Next SSR: httpOnly cookie, `createSessionClient()` on the server, never trust client `user` for authorization | Needs Appwrite project (P0-5) |
| Flags vs env desync | P1 | `src/lib/flags.ts` vs `.env.example` `ROOT_ENABLE_AUTH` | Operator thinks Auth is off while a later change reads env, or the reverse | Single default-deny flags module; test both | No |
| Client-only gates forbidden | P0 (policy) | `AGENTS.md` §5; `docs/05-customer-portal.md` “tier-gating is advisory” | Hidden buttons ≠ authorization | Every mutation: session + active Team membership + role + entitlement | No |
| CSRF | P1 | No mutation routes yet; no CSRF token / origin check | Cookie-session POSTs will be forgeable | Origin/Host check + SameSite=Lax/Strict + CSRF on cookie mutations | No |
| Org switch | P1 | No org context | Stale `orgId` in client state → IDOR | Org id from path **and** membership; invalidate caches on switch | No |
| MFA for privileged roles | P2 now / P1 at Auth | CTO spec §9; not in Appwrite adapter | ROOT_SUPERADMIN without MFA | Plan Appwrite MFA / step-up before enabling staff roles | Appwrite project |
| OAuth Google/Microsoft | P2 | `docs/05-customer-portal.md` | Wrong redirect origins = account mix-up | Configure **dev** platforms/origins only; never V1 domain | Appwrite + IdP |

**Do not** ship mock login that sets a client cookie claiming a role.

## 2. Multi-tenancy / IDOR — P0 before Auth

Appwrite Teams docs: one team per tenant; row `permissions: [Permission.read(Role.team(id)), Permission.write(Role.team(id, ['admin']))]`. List queries still must not use an API key that bypasses user permissions for client-driven reads.

| Risk class | Sev | Evidence | Why | Fix | External? |
| --- | --- | --- | --- | --- | --- |
| Role catalog fork | P0 | CTO spec §9 vs `data/seed/roles.example.json` | Wrong Team role strings → over-grant | One enum; map ROOT staff vs client; `AUDITOR_READ_ONLY` must not write | No |
| Table-level grants | P0 at schema time | Appwrite `/docs/products/databases/permissions`: table grant = **all rows** | One `users.read` table ACL leaks every org | Row security on; permissions per team; admin SDK only in Functions/server with explicit `org_id` filter **and** membership check | Appwrite project |
| Query filter as auth | P1 | Common Next anti-pattern (not in code yet) | `Query.equal('orgId', body.orgId)` with admin key = IDOR | Session client for user reads; admin key never exposed to request-shaped queries without PDP | No |
| Storage path isolation | P1 | No buckets; Appwrite storage defaults deny; demo docs use `Any` CREATE/READ | Copying quick-start = public PHI/docs bucket | Per-org prefix + file security + team roles; extension/size allowlists; **no PHI** in MVP | Appwrite project |
| Invitation abuse | P1 | No membership API | Open invite URLs / role self-assign | Server-only `createMembership`; roles allowlist; expire invites | Appwrite |
| Cross-tenant tests missing | P1 | `tests/foundation.test.mjs` only | No regression net | Two synthetic orgs, assert deny on the other team’s row | Needs project or emulator |

## 3. Public forms and PHI — P1

| Item | Sev | Evidence | Why | Fix | External? |
| --- | --- | --- | --- | --- | --- |
| Validator too weak | P1 | `src/lib/validation/business-contact.ts` | Accepts any string “email”; optional `message` unbounded; no consent; no PHI field rejection | Zod; max lengths; reject patient/claim keywords in free text; require consent version | No |
| No rate limit / abuse | P1 | No API | Intake spam / email bombing | Turnstile (or Appwrite abuse) + IP/email throttle on Function/route | Turnstile keys |
| Fixtures | OK | `data/seed/*.json` fictional; `contactEmail` `@example.invalid` | Good | Keep; never swap in real prospects | No |
| Demo 6 HTML | P1 if copied | 806 463 byte file; CodeQL high dynamic method call | Prototype JS is not an auth model | Never import into `src/` | No |
| Analytics | OK/P2 | None wired | Don’t add GA4 until consent policy | Disabled | Privacy review |

HIPAA/SOC2/ISO: `SECURITY.md` and AGENTS.md correctly forbid claims. **Do not** describe Appwrite features as HIPAA certification.

## 4. Secrets and env — P1/P0

| Item | Sev | Evidence | Why | Fix | External? |
| --- | --- | --- | --- | --- | --- |
| Example env is safe | OK | `.env.example` empty; `NEXT_PUBLIC_*` only IDs | Good | Keep | No |
| `.gitignore` has `.env*` + `!.env.example` | OK | `.gitignore` | Good | Never commit `.env.local` | No |
| Secret scanning **off** | P0 | GitHub `secret_scanning.status: disabled` | Public repo | Enable + push protection | GitHub admin |
| `APPWRITE_API_KEY` in SSR handler | P1 (future) | Appwrite Next quick-start uses server key with `users.write` | Key in client bundle = full user takeover | `server-only` imports; CI grep `NEXT_PUBLIC_APPWRITE_API_KEY`; bundle check | No |
| No GitHub Environments | P1 | 0 environments | Preview/prod secret mix | GH Environments + Appwrite per-project keys | GitHub + Appwrite |

This review did **not** open `.env.local` or print values.

## 5. HTTP headers / browser hardening — P1

`next.config.ts` has no `headers`. Once the app is public:

- CSP (default-src self; tighten scripts when adding Turnstile/Stripe.js)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY` / CSP `frame-ancestors 'none'`
- HSTS only on HTTPS production host (not localhost)
- Stripe.js / HubSpot forms only after those adapters exist

## 6. Supply chain / CI — P0/P1

| Item | Sev | Evidence | Why | Fix |
| --- | --- | --- | --- | --- |
| `npm install` in CI, no lockfile on `main` | P0 | `ci.yml`; `origin/main` tree | Non-reproducible, `--no-audit` | `npm ci` after lockfile PR |
| Dependabot majors open | P1 | PR #14 typescript 7 **CI failed**; lucide 0.460 → 1.61 | Breaking upgrades on a skeleton | Reject majors; allow patch/minor security |
| Dependabot security updates disabled | P0 | repo `security_and_analysis` | No auto PR for advisories | Enable with P0-2 |
| CodeQL on Demo 6 | P1/P2 | Alerts #1–#3 in `reference/demo6` | Noise + one high | Path-ignore the archive; never copy the JS |
| `crazy-max/ghaction-github-labeler` write on `main` | P2 | `label-sync.yml` `issues: write` | Token misuse if workflow injectable | Pin SHA; keep `contents: read` default (already) |
| Org 2FA off | P0 | org API | Compromised GitHub user | Require 2FA |

## 7. Logging / PHI in CI

No APM. Foundation tests read seed JSON into CI logs — currently synthetic. **Rule:** never log request bodies of inquiries, Stripe payloads, or Appwrite session secrets. Redact `Authorization`, cookies, `STRIPE_SECRET_KEY`.

## 8. Unverified

- Appwrite Cloud project configuration and actual table permissions (API MCP error).
- Whether private vulnerability reporting is on.
- Live webhook endpoints (none should exist).
- Figma file contents (not opened this review).
- Contents of local `.env.local` (intentionally unread).
