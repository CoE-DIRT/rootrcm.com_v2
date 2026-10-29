# ROOT V2 — Autonomous Engineering Contract

**Read before every change:** README, `docs/architecture.md`, `docs/00-product-blueprint.md`, `docs/07-developer-handoff.md`, `docs/08-qa-approval.md`, `docs/decisions/ADR-0001-stack.md`, and the Figma handoff.

## Non-negotiable
1. Figma is the visual source of truth. Reuse shared components, one header/footer, one price catalog, semantic light/dark tokens and EN/ES copy keys. **Never redesign from scratch.**
2. Preserve existing Demo 6 content, SEO hierarchy and information architecture until a specific accepted improvement is documented.
3. Work on `feat/*` or `fix/*` branches; each PR is one small vertical slice. No direct commits to `main` after initial bootstrap.
4. Never read, send, paste or persist PHI, patient records, production secrets, access tokens, billing details or private correspondence in prompts, issues, logs, browser analytics or sample fixtures.
5. Public forms accept business contacts only. Appwrite enforces tenant membership and roles server-side; client-only entitlement gates are insufficient.
6. HubSpot owns sales; Stripe owns payment/subscription truth; Apollo only enriches prospecting; Appwrite owns app identity, orgs, roles, onboarding, requests and entitlements. Use idempotent server-side flows.
7. No claims of HIPAA certification, SOC 2 completion, ISO certification, payer partnership, approved EHR integrations, payment outcomes or customer success without evidence.
8. All external integrations start as typed **disabled** adapters; do not fabricate successes, credentials or webhooks.
9. Run lint, typecheck, build, and relevant tests before PR. Check focus, screen readers, reduced motion, mobile overflow, locale parity and semantic status states.
10. Do not deploy V2 to rootrcm.com or touch existing V1 without written migration signoff.

## Agent division
- **Cursor:** local lead, implementation, tests and refactoring with targeted file context.
- **OpenCode + metered OpenRouter/DeepSeek:** bounded implementation, fixture/test generation, repetitive mechanical refactors; set account-level spend caps.
- **Codex:** architectural review, hard debugging, PR security review and high-risk tasks.
- **Claude:** UX/accessibility/code review and targeted second opinion. No uncontrolled parallel edits in same files.
- Each agent uses isolated branch/worktree and posts a concise change summary, tests, risks, files altered and cost estimate.

## Definition of done
A feature is complete only with approved Figma mapping, typed API and data contract, no actual PHI, error/empty/loading states, EN/ES + dark/light, keyboard/a11y, unit/E2E, and reviewed PR. `main` must remain buildable.

## Repo boundaries
`reference/demo6` holds archived HTML reference only. `src/` is the new typed implementation. Do not copy the prototype's 800KB inline JavaScript into production.
