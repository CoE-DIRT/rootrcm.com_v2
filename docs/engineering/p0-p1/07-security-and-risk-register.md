# 07 — Security and risk register

Independent review findings in `docs/engineering/parallel-review/` were treated as facts. This file records **execution**.

| ID | Sev | Status after this phase |
| --- | --- | --- |
| P0-1 main unprotected | P0 | **Partial.** Ruleset `protect-main` active (PR + 1 approval, no force-push/delete). Required check `quality` not attached. |
| P0-2 secret scanning off | P0 | **Mitigated on repo.** Secret scanning + push protection enabled via API. Dependabot security updates enabled. Validity checks still off. |
| P0-3 org 2FA off | P0 | **Still open.** `two_factor_requirement_enabled: false` after PATCH. Org admin UI required. |
| P0-4 lockfile / npm install | P0 | **Fixed in branch.** Lockfile committed; CI `npm ci`. |
| P0-5 no Appwrite V2 | P0 | **Blocked.** Flags remain false. |
| P0-6 role catalog conflict | P0 | **Code freeze.** Canonical enum + PDP tests. Auth flag still off. |
| P1-1 flags vs env | P1 | **Fixed.** `getFeatureFlags()` default deny. |
| P1-2 README-only adapters | P1 | **Typed disabled adapters.** No vendor SDKs. |
| P1-3 no API/middleware | P1 | Inquiry stub + locale middleware only. No session cookies. |
| P1-4 TablesDB | P1 | Blocked on Appwrite project. |
| P1-5 unused header / no PDP | P1 | Header/footer wired; `policy.ts` present. |
| P1-6 weak contact validator | P1 | Consent, PHI denylist, max lengths added. No Turnstile. |
| P1-7 security headers | P1 | Added in `next.config.ts`. CSP still allows `'unsafe-inline'` for this foundation. |
| P1-8 Dependabot majors | P1 | Not merged. |
| P1-9 GitHub Environments | P1 | Still 0. Not fabricated. |
| P1-10 webhooks | P1 | Not implemented. |
| P1-11 Demo 6 CodeQL | P1 | CodeQL ignore path added; JS not copied to `src/`. |
| P1-12 missing public IA | P1 | Routes implemented as labeled shells. |

No PHI, production secrets, or live customer data were used. `.env.local` was not opened or committed. Inquiry handler does not call HubSpot.
