# Figma-to-production traceability — commercial sections

**File:** https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52  
**MCP session:** `edf34552-4c55-475a-ae2a-5103cc9734d4` (2026-10-30, page inventory + Public Website metadata)  
**Frontend merge:** commercial routes are **not** in this branch. Rows stay `pending-until-frontend-merge` until Agent A lands them and visual evidence exists.

Do not read this as Figma parity. Page `03 — Public Website` (`1:4`) still only contains Home `4:2` / `4:126` / `4:153`, Services `4:40`, Pricing `4:88`. There are **no painted frames** named Specialties, Locations, or Marquee. Pages `06–08` remain interaction/QA sources, not implemented motion.

## Matrix

| Commercial section | Intended route | Figma node | Code (this branch) | EN/ES | Dark/light | Reduced motion | Keyboard | Overflow 375/768/1366/2560 | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Specialties index | `/en/specialties` | No dedicated frame. Closest: Services band `4:83` / `4:84` “Specialty × State × Payer mix intelligence” | None (Playwright skip-if-404) | pending | pending | pending | pending | pending | pending-until-frontend-merge |
| Infectious disease specialty | `/en/specialties/infectious-disease` | No painted specialty frame on page 03 | None (Playwright skip-if-404) | pending | pending | pending | pending | pending | pending-until-frontend-merge |
| New York location | `/en/locations/new-york` | No painted location frame on page 03. IA called out in `docs/03-public-website.md` (payer/state) | None (Playwright skip-if-404) | pending | pending | pending | pending | pending | pending-until-frontend-merge |
| New York City location | `/en/locations/new-york-city` | No painted location frame on page 03 | None (Playwright skip-if-404) | pending | pending | pending | pending | pending | pending-until-frontend-merge |
| Trust / voices band | Home linked section | `4:37` / `4:38` “Customer voices & proof · editorial slots pending verification” | Home `BandList` copy only in `src/content/messages.ts` | copy present | tokens | N/A (static) | N/A | home overflow tests exist | copy-only; not a verified marquee |
| Specialty × payer band | Services linked section | `4:83` / `4:84` | Services `bands` copy | copy present | tokens | N/A (static) | N/A | not route-certified | copy-only |
| Logo / proof marquee | Home or services motion | No marquee layer on page 03. Motion belongs to page `06` (`1:7`) which is not coded | None. Playwright asserts pause/keyboard **if** `[data-marquee]` / `.marquee` / `aria-roledescription=marquee` appears | pending | pending | spec ready | spec ready | spec ready | pending-until-frontend-merge |

## Test contract (this branch)

Specs in `tests/e2e/` encode the gate without failing CI before frontend merge:

- `public-experience.spec.ts` — home overflow at **2560** in addition to 375 / 768 / 1366
- `reduced-motion.spec.ts` — `prefers-reduced-motion: reduce`; skip-link still works; infinite CSS animation must collapse; marquee paused **when present**
- `commercial-routes.spec.ts` — Agent A routes skip on HTTP 404 or the foundation “Page not found” shell

## After frontend merge

Re-open this file and move rows to `implemented` only with:

1. Route screenshot (dark + light, EN + ES) mapped to a real node ID
2. Playwright green **without** skip on those four paths
3. Marquee pause control evidence, or confirmation the section stayed static
4. No PHI, no unverified partner logos, no fabricated outcomes

Existing P0/P1 home/services/plans mapping remains in `docs/engineering/p0-p1/03-figma-code-traceability.md`.
