# ROOT V2 — targeted restoration and release verification

Act as a three-agent React/Next.js/Tailwind production cluster. Execute fixes, not another redesign. Read AGENTS.md and its required references. Repository: CoE-DIRT/rootrcm.com_v2. The supplied ROOT_V2_Restoration.bundle contains local branch `fix/demo6-restoration`, based on `feat/p0-p1-public-shell`. Its GitHub push was blocked by automatic approval review; there is no restoration PR yet. Inspect current remote heads before integration. Do not assume an old SHA is current.

## Preserve and integrate

- Inspect status, worktrees, remote refs and open PRs. Preserve all Cursor work.
- Do not run `git stash clear`, `git clean -xdf`, `git reset --hard`, force-push, or terminate unrelated processes.
- Review the local restoration branch. Any GitHub publication requires founder authorization because the prior push was rejected. After authorization, create a reviewable PR and integrate through normal review; do not cherry-pick twice or bypass protected main.
- Keep V1, production DNS, business email and unrelated Appwrite resources untouched.
- Use three isolated worktrees. Assign exact files before editing. Shared files have one writer; coordinator integrates sequentially.

## Verified restoration work — inspect and retain

- Single global header/footer/Ask ROOT guide already exists. Do not add duplicate chrome.
- Home already mounts SpecialtyGrid once, using the ten featured typed catalog entries. Preserve it.
- Company now mounts TeamGrid with typed EN/ES Demo6 leadership records, corrected Aliah spelling and portrait placeholders. Never pass stock portraits off as employees. Reconcile later approved team changes with current signature records before broadening the grid.
- Original six Demo6 WebPs are restored in public/brand with SHA-256/source/dimensions manifest in docs/design/original-brand-assets.json. SiteBrand uses the recovered original mark.
- RecordDrawer uses left-auto and max-h-none to defeat native dialog centering/height defaults.
- Desktop mega-menu starts at xl; matching mobile navigation remains below xl.
- New York EN/ES copy is simplified, with factual market/payer disclosures retained.
- Standalone safe review launcher is scripts/windows/Start-ROOT-V2-Review.ps1. Windows execution still requires an actual Windows check.

## Design authority

Figma: https://www.figma.com/design/x5HJC3HjJNCCTUOwEdUc52
Homepage node 4:2; global nav 4:3; services 4:40; plans 4:88. Inspect Company and relevant child nodes through Figma metadata/design context rather than guessing IDs.
Demo6: reference/demo6/ROOT_V2_Interactive_Browser_Demo_6.html.
Use Figma geometry/tokens plus the richer approved Demo6 structure. Do not copy its monolithic embedded JavaScript into runtime code. No pixel-parity claim without screenshot comparison.

## Agent 1 — layout, accessibility and responsive stability

Own shared shell, CSS and layout fixes. Audit page containers, duplicated mounts, sticky/fixed layers, native dialog placement, clipping, horizontal overflow and competing positioning. Repair only evidenced defects. Inspect header, mega-menu, mobile drawer, footer, Ask ROOT and operation drawers together; verify focus return, Escape, keyboard navigation and touch dismissal. Do not hide required content to make screenshots pass.

Test 375/768/1024/1366/2560 widths, EN/ES, light/dark and reduced motion. At 1024 ensure navigation remains available and controls fit. At 1366 verify the Spanish desktop menu does not crowd actions. Capture actual screenshots and record routes/states.

## Agent 2 — feature parity and connected workflow

Own Specialties, Team and commercial structural blocks. Retain existing SpecialtyGrid; validate its ten featured links plus full directory and Infectious Disease. Validate TeamGrid spacing, initials, roles, locale text and Company placement against Demo6. Add only confirmed personnel; no invented credentials, biography, testimonial or headshot.

Walk website → inquiry → qualification → consultation → proposal → agreement → organization → activation → login → scheduling → eligibility → claims → credentialing → DIRT → service requests. Record each step as functional, simulated, disabled, or blocked with evidence. Repair meaningful dead controls within current architecture; keep server authorization and tenant isolation intact. Do not relabel missing backend integration as success.

Go is the healthcare backend language. Preserve existing Go adapter and current RCM domain engine. Do not create a second ledger or disconnected KPIs. Keep credentials/PHI/live vendor activation disabled pending approved secrets and contracts.

## Agent 3 — imagery, copy and presentation

Own asset slots, provenance and New York editorial checks. Use the exact recovered brand bytes. Inspect all six assets and place them only where their purpose/crop fits; preserve native proportions. Keep the existing original illustrated heroes if they improve the composition. Add editorial healthcare photography where it answers a visitor question.

Source workflow: docs/design/free-media-sourcing-and-demo6-parity.md contains eight Pexels candidate pages. These candidates are not downloaded assets. Open each selected original page, verify free use and depicted subject suitability, record photographer/source/license/date, download locally, optimize WebP/AVIF and use next/image with correct dimensions/sizes. Prefer local files to runtime CDN dependencies. Never imply stock subjects endorse ROOT or work for ROOT. No arbitrary image-result scraping, unlicensed media, real patient records or decorative certification claims.

Retain layered navy masks, readable text overlays, glass surfaces, deliberate radii, hover/touch states and reduced-motion behavior. Avoid uncontrolled blur, excessive animation or CLS. Simplify New York language without inventing an office, payer contract or guaranteed outcome.

## Coordinator — two-pass release checks

1. Integrate small independently verified slices; inspect diffs and resolve shared-file conflicts explicitly.
2. Run npm ci, npm run lint -- --max-warnings=0, npm run typecheck, npm test and npm run build.
3. In services/healthcare-go run gofmt check, go test ./... and go vet ./....
4. Run the existing Playwright suite against the combined build. Fix failures, including brand selectors affected by the original mark, then rerun only affected checks until stable. Do not weaken assertions to conceal a regression.
5. Add focused layout coverage for the restored Team grid, single Specialties mount, tablet header, right-aligned record drawer and loaded original brand assets where existing tests do not cover them.
6. Functional pass: test every meaningful visible control in changed surfaces, errors/empty/loading states, focus, locale changes and demo reset.
7. Visual pass: inspect screenshots, overlays, image loading, nav/footer/chat layering and text wrapping. Automated overflow checks alone do not establish visual quality.
8. Run CodeQL in GitHub; distinguish queued, passed, failed and not run. Existing npm environment/module warnings and Next middleware deprecation are not TypeScript warnings; report them honestly and fix only within a separately justified scope.
9. Verify local Go health and Next HTTP responses; record exact commit and PIDs. Localhost is not cloud deployment.
10. Use relevant authenticated GitHub, Figma and hosting plugins only. Verify account/resource scope. Do not access unrelated CRM records merely because plugins are installed. No fictional live CRM writes, campaigns, real payments or PHI.
11. Publish an isolated V2 HTTPS preview only on the approved V2 resource. Report resource charges/owner requirements precisely; continue all independent work. Never alter V1 or DNS/email to unblock a preview.

Stop the affected operation on unexpected system errors. Preserve logs without secrets, identify the cause and repair before retrying. Do not continue a launch after failed validation. Do not discard completed independent work.

## Final evidence

Return actual commit SHA, PR URL/status, local URL/PIDs, HTTPS URL/deployment ID if actually verified, changed files, test totals, screenshots/viewport matrix, loaded-asset/provenance status, remaining mock/disabled integrations and specific blockers. State ready, conditionally ready or blocked. Do not claim flawless UI or production readiness solely from a build.
