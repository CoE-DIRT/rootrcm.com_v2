# Contributing to ROOT V2

## Before opening a change
1. Read `AGENTS.md`, `SECURITY.md`, the product blueprint, ADRs, and approved Figma handoff.
2. Open a scoped issue. Work in `feat/*`, `fix/*`, `chore/*` or `docs/*` on a fork/feature branch; never force-push `main`.
3. Keep each PR a small, reviewable vertical slice tied to an approved Figma node or state why design mapping does not apply.
4. Preserve pricing/content terminology, EN/ES, dark/light states, motion/accessibility and responsive layouts.

## Local checks
```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

The initial dependency lockfile is pending a verified local install; once committed CI should use `npm ci`. Do not regenerate dependencies from untrusted scripts or paste API tokens into issues.

## PR requirements
Use the PR template: summary, Figma reference, acceptance criteria, screenshots/tests, privacy risk, rollback plan. At least one approving review and green `quality` check are targeted repo rules after the ruleset is enabled.

Do not upload PHI, live patient data, private access keys, company secrets or unlicensed third-party assets. Do not submit design/content changes that invent client testimonials, certifications, payer partnerships or guaranteed revenue outcomes.

## Intellectual property
This public repository is not automatically an open-source project. Review `LICENSE` before reusing code or sending contributions. All contributions require maintainers' review and appropriate rights to submit.
