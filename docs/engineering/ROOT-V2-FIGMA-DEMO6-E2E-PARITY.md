# ROOT V2 — Figma + Demo 6 E2E parity (issue #43)

**Owner:** Agent D (DevSecOps / QA / Release)  
**Recorded:** 2026-10-31 ~04:00 PKT  
**Code SHA:** `470b76c69550eeefb3f2d706a1232cc4b2fa3650` (`origin/feat/p0-p1-public-shell`)  
**Sources:** Figma `x5HJC3HjJNCCTUOwEdUc52`; archived Demo 6 HTML (reference only); actual `src/app/[locale]` tree on this SHA.  
**This is not visual or production certification.** A route that builds, returns HTTP 200, or has a menu item is not “complete” unless the #43 action works.

**Status key**

| Status | Meaning |
| --- | --- |
| **DONE** | Next route exists on `470b76c`, smoke or Playwright evidence exists, and the claimed interaction works as labeled (including honest disabled/synthetic banners). |
| **PARTIAL** | Route exists, but a #43 acceptance action is missing, synthetic-only, unpainted vs Figma, or untested at the required viewports. |
| **MISSING** | No `src/app/[locale]` page (or equivalent) on this SHA. Do not treat a footer/nav hint as a route. |

**Owners:** A = public UX / brand / nav (do not edit from this PR); B = ops / Go / auth; C = commercial catalogs; D = QA / release docs / CI / preview evidence.

Issue: [#43](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/43). Do not close #43 from this document.

---

## 1. Worktree / SHA ledger (do not collide)

| Worktree | Branch | HEAD | Notes |
| --- | --- | --- | --- |
| `C:\Dev\ROOT\worktrees\rootrcm-release` | `feat/release-qa` | `470b76c` | This slice. Docs only. |
| `C:\Dev\ROOT\rootrcm.com_v2` | `feat/p0-p1-public-shell` | `f750005` (behind origin by 62) | Integration checkout; local untracked `.cursor/settings.json`. |
| `C:\Dev\ROOT\_ROOT_V2_PREVIEW_20261031-000225` | detached | `5c025cd` | **Founder snapshot. Untouched.** Untracked `ROOT_V2_PREVIEW_AUDIT.json` only. |
| `C:\Dev\ROOT\worktrees\rootrcm-ops-a` | `feat/commercial-parity` | `470b76c` | Agent A/C lane. |
| `C:\Dev\ROOT\worktrees\rootrcm-ops-b` | detached | `eb5a2fd` | Uncommitted brand files (`public/brand/*`, `page-hero`, `site-brand`, media-manifest). **Do not touch.** |
| `C:\Dev\ROOT\worktrees\rootrcm-ops-c` | `feat/media-sourcing` | `eb5a2fd` | [PR #44](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/44) media CLI; staged brand WebPs. **Do not touch.** |
| `C:\Dev\ROOT\worktrees\rootrcm-backend` | `feat/commercial-backend` | `0859307` | Already merged via PR #24. |
| `C:\Dev\ROOT\worktrees\rootrcm-frontend` | `feat/commercial-frontend` | `289b08e` | Already merged via PR #25. |

No `git reset --hard`, no force-push, no merge of [PR #19](https://github.com/CoE-DIRT/rootrcm.com_v2/pull/19) to `main`.

---

## 2. Global chrome (#43 checklist)

| Source / control | Code | Owner | Status | Interaction / evidence | Gap |
| --- | --- | --- | --- | --- | --- |
| Header utility + six-category mega + mobile nested drawer | `primary-nav.tsx`, `mobile-nav.tsx`, `site-header.tsx` | A (PR #42) | **DONE** for chrome presence | `tests/e2e/demo6-chrome.spec.ts` (6 buttons, Escape, 375 drawer, ES copy) | Search control not present. Original Demo 6 lockup files not on this SHA (`public/` has two SVGs only). |
| EN/ES + light/dark | `locale-switcher.tsx`, `theme-toggle.tsx` | A | **DONE** for toggles | `public-experience.spec.ts` locale + theme | Persisted cookie/consent UX is not a preference center. |
| Four-column footer, contacts, newsletter fallback | `site-footer.tsx`, `newsletter-request.tsx` | A (PR #42) | **DONE** for labeled fallback | Playwright: mailto, tel, WhatsApp, “no address is stored” | Newsletter is mailto, not HubSpot. |
| Ask ROOT guide on localized pages | `root-guide.tsx` in locale layout | A (PR #42) | **DONE** for scripted guide | Playwright at 375/768/1366/2560; Escape; ES topics | Not live support. No PHI. |
| Cookie preferences UX | `/cookies` marketing page only | A / D | **PARTIAL** | HTTP 200 on `127.0.0.1:3032/en/cookies` | No consent banner, no category toggles, no storage. Legal copy only. |
| Motion / reduced-motion | CSS + `reduced-motion.spec.ts` | A | **PARTIAL** | Reduced-motion test exists | No 4-width × 2-theme × 2-locale screenshot matrix attached to #43. |

---

## 3. Public routes that exist on `470b76c`

Every row is a real `src/app/[locale]/…/page.tsx`. Locales are `/en` and `/es` via the `[locale]` segment. Playwright default base is port **3010**; this workstation’s live Next is **3032** (also 3020 and founder 3021). Smoke below is from `127.0.0.1:3032` unless noted.

| Route | Figma / Demo 6 | Code | Owner | Status | Test / smoke | Missing vs #43 |
| --- | --- | --- | --- | --- | --- | --- |
| `/[locale]` | 4:2 / 4:126 / 4:153 | `page.tsx` | A | **PARTIAL** | Playwright home IA; 3032 `/en` 200 | Photographic/original brand lockup and licensed stills not on this SHA. Hero is SVG (`root-revenue-hero.svg`). |
| `/[locale]/why-root` | inventory 5:24 / 5:2 | `why-root/page.tsx` | A | **PARTIAL** | Linked from mega + Playwright heading | No painted public-site frame. |
| `/[locale]/services` | 4:40 | `services/page.tsx` | A | **PARTIAL** | Playwright heading; tiles | Tile hrefs are IA routes, not unique service nodes. |
| `/[locale]/solutions` | inventory 6:7 | `solutions/page.tsx` | A | **PARTIAL** | Route exists | No painted frame; denials/A/R copy points here, not to portal modules. |
| `/[locale]/technology` | inventory 6:22 | `technology/page.tsx` | B | **PARTIAL** | Go panel + marquees | Go is synthetic loopback. Dashboards not live. |
| `/[locale]/plans` | 4:88 | `plans/page.tsx` | C | **PARTIAL** | Playwright `$2,500`; 3032 `/en/plans` 200 | Checkout not live. Five commercial paths are catalog cards + conversion pages, not billed entitlements. |
| `/[locale]/resources` | inventory 6:49 | `resources/page.tsx` | A | **PARTIAL** | Route exists | No CMS PDFs / official-form downloads. |
| `/[locale]/company` | inventory 6:34 | `company/page.tsx` | A | **PARTIAL** | Route exists | Bios/certs/founder-team pages withheld. |
| `/[locale]/account` | 5:46 | `account/page.tsx` | C | **PARTIAL** | Inquiry form disabled | Appwrite signup **MISSING**. |
| `/[locale]/consultation` | 5:69 | `consultation/page.tsx` | C | **PARTIAL** | Playwright: submit disabled | HubSpot not connected (#20). |
| `/[locale]/diagnostic` | 5:92 | `diagnostic/page.tsx` | C | **PARTIAL** | Catalog `$2,500` | Stripe checkout **MISSING**. |
| `/[locale]/custom` | 5:115 | `custom/page.tsx` | C | **PARTIAL** | Route exists | Subscribe planned. |
| `/[locale]/custom-rcm` | 5:115 alias | `custom-rcm/page.tsx` | C | **PARTIAL** | Alias of custom | Same as `/custom`. |
| `/[locale]/specialties` | Demo 6 catalog | `specialties/page.tsx` | C (PR #25) | **DONE** as catalog index | `commercial-routes.spec.ts` | Featured-ten vs full 27 needs founder copy sign-off. |
| `/[locale]/specialties/infectious-disease` | commercial add-on | dedicated page | C | **DONE** as dedicated profile | 3032 EN+ES 200; Playwright | Clinical-care claims are not present (administrative RCM copy). |
| `/[locale]/specialties/[slug]` | Demo 6 V4_SPEC | `[slug]/page.tsx` | C | **DONE** as generated catalog pages | `generateStaticParams` for 26 slugs (ID excluded) | Not 27 unique painted Figma frames. |
| `/[locale]/locations/new-york` | NY landscape | `locations/new-york/page.tsx` | C | **DONE** as market page | Playwright | Insurer list is copy, not live payer API. |
| `/[locale]/locations/new-york-city` | NYC | `locations/new-york-city/page.tsx` | C | **DONE** as market page | Playwright | Same caveat. |
| `/[locale]/sign-in` | Demo 6 auth entry | `sign-in/page.tsx` | B | **PARTIAL** | Preview links only | Google / Microsoft / email auth **MISSING** until Appwrite V2 (#6). |
| `/[locale]/privacy` | legal | `privacy/page.tsx` | A | **DONE** as legal page | Route exists | Not a DPA/BAA. |
| `/[locale]/terms` | legal | `terms/page.tsx` | A | **DONE** as legal page | Route exists | — |
| `/[locale]/cookies` | 6:175 | `cookies/page.tsx` | A | **PARTIAL** | 3032 200 | Preference center **MISSING**. |
| `/[locale]/preview/client` | 5:138 | `preview/client/page.tsx` | B | **PARTIAL** | 3032 200; ops e2e | Synthetic command center; org switch disabled. |
| `/[locale]/preview/client/requests` | Demo 6 requests | `preview/client/requests/page.tsx` | B | **PARTIAL** | Fixture queue | No live request write path. |
| `/[locale]/preview/staff` | 5:195 | `preview/staff/page.tsx` | B | **PARTIAL** | 3032 200; session e2e | Operator capability is signed cookie, not Appwrite role. |
| `/[locale]/preview/credentialing` | Demo 6 cred | `preview/credentialing/page.tsx` | B | **PARTIAL** | Playwright / ops | Synthetic phases; Go credentialing is demonstration envelope. |
| `/[locale]/preview/dirt` | DIRT | `preview/dirt/page.tsx` | B | **PARTIAL** | Fixture cards | Metrics unpublished; not reconciled to Go (#41). |
| `/[locale]/preview/billing` | entitlements | `preview/billing/page.tsx` | C | **PARTIAL** | Spanish heading Playwright | Stripe entitlements **MISSING**. |
| `/[locale]/preview/subscriptions` | alias | re-exports billing | C | **PARTIAL** | Same as billing | Not a Stripe customer portal. |
| `/[locale]/preview/onboarding` | Demo 6 onboard | `preview/onboarding/page.tsx` | C | **PARTIAL** | Step list + link to sales | No Appwrite org verification. |
| `/[locale]/preview/sales` | sales simulator | `preview/sales/page.tsx` | C (PR #28) | **PARTIAL** | 3032 200; `sales-journey.spec.ts` | Disabled adapters; no CRM write. |
| `/` (root) | redirect | `src/app/page.tsx` | A | **DONE** as locale entry | Exists | — |
| 404 | Demo 6 404 | `src/app/not-found.tsx` | D | **PARTIAL** | 3032 `/en/careers` 404 | English-only; no localized 404. |

### Specialty slugs generated on this SHA (catalog, not dedicated Figma frames)

`internal-family-medicine`, `cardiology`, `orthopedics`, `behavioral-health`, `pain-management`, `podiatry`, `anesthesia`, `wound-care`, `otolaryngology`, `family-medicine`, `internal-medicine`, `psychiatry`, `ambulatory-surgery`, `ophthalmology`, `physical-therapy`, `occupational-therapy`, `speech-language-pathology`, `neurology`, `dermatology`, `gastroenterology`, `urgent-care`, `radiology`, `home-health`, `chiropractic`, `multi-specialty`, `vascular`. Infectious Disease is the only dedicated page.

---

## 4. Demo 6 / #43 routes that are MISSING

| Expected source feature | Expected path | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| Careers | `/careers` | A | **MISSING** | 3032 `/en/careers` → 404 |
| XML/HTML sitemap | `/sitemap` or `sitemap.ts` | D | **MISSING** | 3032 `/en/sitemap` → 404; no `sitemap.ts`. Public metadata sets `robots: noindex`. |
| Founder / team bios | `/company/team` or similar | A | **MISSING** | Company page is inventory FAQ only. |
| Case studies / testimonials | `/cases` `/success` | A | **MISSING** | Slots unpublished until legal review (#40). |
| Evidence / certifications register | `/evidence` `/security` | A | **MISSING** | Do not invent HIPAA/SOC2 claims. |
| Industries index | `/industries` | C | **MISSING** | Specialties catalog is the closest stand-in. |
| Integrations directory page | `/integrations` | B | **MISSING** | Ecosystem marquees live on `/technology`. |
| Dedicated contact (vs consultation) | `/contact` | C | **MISSING** | Footer “Contact ROOT” → `/consultation`. |
| Cookie preference center | interactive overlay | A | **MISSING** | Static `/cookies` only. |
| Appwrite Google / Microsoft / email | `/sign-in` real IdP | B | **MISSING** | Blocked on #6 V2 project. |
| Stripe Checkout / Customer Portal | `/diagnostic` pay, billing | C | **MISSING** | Adapter disabled. |
| Durable inquiry / newsletter CRM | HubSpot | C | **MISSING** | Fail-closed (#20 / PR #21). |
| `sitemap.xml` + hreflang index | SEO | D | **MISSING** | Correct while V2 is noindex. |

---

## 5. Eighteen Demo 6 portal modules

Command center tabs on client/staff/credentialing: `overview`, `revenue`, `credentialing`, `practice`. Dedicated Next routes do **not** exist for every module. Do not mark 18/18 DONE.

| # | Module | Where it lives | Owner | Status |
| --- | --- | --- | --- | --- |
| 1 | Client KPI / overview | `/preview/client` + command-center overview tab | B | **PARTIAL** |
| 2 | Staff queue | `/preview/staff` | B | **PARTIAL** |
| 3 | Service requests | `/preview/client/requests` | B | **PARTIAL** |
| 4 | Onboarding | `/preview/onboarding` | C | **PARTIAL** |
| 5 | Sales → onboarding | `/preview/sales` | C | **PARTIAL** |
| 6 | Practice scheduling | command-center `practice` tab only | B | **PARTIAL** (no `/preview/schedule`) |
| 7 | Eligibility 270/271 | command-center revenue + Go `/v1/eligibility` | B | **PARTIAL** synthetic |
| 8 | Prior authorization | revenue tab aliases | B | **PARTIAL** (no dedicated route) |
| 9 | Charge capture | revenue tab | B | **PARTIAL** |
| 10 | Claims 276/277 / 837 | revenue tab + Go `/v1/claims/status` | B | **PARTIAL** synthetic |
| 11 | Denials / appeals | revenue tab | B | **MISSING** as route |
| 12 | A/R | revenue tab | B | **MISSING** as route |
| 13 | Credentialing timeline | `/preview/credentialing` + Go `/v1/credentialing` | B | **PARTIAL** |
| 14 | DIRT metrics | `/preview/dirt` | B | **PARTIAL** — not same ledger as Go (#41) |
| 15 | Billing / entitlements | `/preview/billing` | C | **PARTIAL** |
| 16 | Subscriptions | alias of billing | C | **PARTIAL** |
| 17 | Notifications / tasks | `NotificationsPanel` inside command center | B | **PARTIAL** (no route) |
| 18 | Admin / org switch | disabled `<select>` in `app-shell.tsx` | B | **MISSING** real tenant switch |

---

## 6. Viewport / a11y / screenshot gate (#43 last bullet)

| Gate | Required | Observed 2026-10-31 | Status |
| --- | --- | --- | --- |
| 375 / 768 / 1366 / 2560 | All public routes | Playwright covers chrome + a few public/commercial routes at those widths; **not** every route × theme × locale | **MISSING** as a complete matrix |
| EN/ES | Every route | Locale switch Playwright on `/plans`; ES billing, ES ID, ES chrome | **PARTIAL** |
| Light/dark | Every route | Theme toggle Playwright on home | **PARTIAL** |
| Keyboard / SR | WCAG 2.2 AA | Skip link, mega Escape, mobile focus restore | **PARTIAL** |
| Figma screenshot compare | Per accepted frame | `docs/engineering/p0-p1/03-figma-code-traceability.md` still “not pixel-certified” | **MISSING** |
| No broken assets | Manifest | Two original SVGs in `public/media/`; Demo 6 WebPs not on this SHA | **PARTIAL** |

---

## 7. What is allowed to be called DONE

Only these #43 items are **DONE** as *implemented and tested chrome/catalog*, not as launch:

1. Six-category mega + mobile nested menu + EN/ES Ask ROOT + four-column footer (PR #42).
2. Specialty index, Infectious Disease dedicated page, other specialty slugs, NY/NYC pages (PR #25) with Playwright 200s.
3. Fail-closed consultation submit (PR #21) — truthful disabled, not HubSpot success.
4. Canonical `$2,500` diagnostic on `/plans`.

Everything else is **PARTIAL** or **MISSING**. Issue #43 stays open.
