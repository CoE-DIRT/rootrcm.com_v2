# 05 — Implementation changelog

## `fix/config-stabilization` (`17fb82c`)

- Commit verified `package-lock.json`; CI `npm ci` + npm cache
- PostCSS named export; gitignore `tsconfig.tsbuildinfo`
- Next 16 `next-env.d.ts` / `tsconfig` includes; `next typegen` in typecheck
- Favicon SVG + apple-icon from navy/cyan tokens
- Security headers in `next.config.ts`
- CodeQL `paths-ignore` for `reference/demo6/**`

## `feat/p0-p1-public-shell`

- Locale middleware; `/` → `/en`; `html lang` from `x-root-locale`
- One `SiteHeader` / `SiteFooter` wired in `[locale]/layout.tsx`
- Public IA: why-root, services, solutions, technology, plans, resources, company
- Conversion: consultation, account, diagnostic, custom, custom-rcm
- Legal placeholders: privacy, terms, cookies
- Auth preview: sign-in (disabled) + synthetic client/staff/DIRT/credentialing/billing/onboarding/subscriptions
- One price catalog; inquiry API with consent/PHI denylist; flags default-deny
- Canonical roles + two-tenant PDP tests
- EN/ES copy module; dark/light tokens + theme toggle
- Inter font; skip link; mobile drawer (Escape to close)

Files of record live under `src/app/[locale]/**`, `src/components/**`, `src/domain/**`, `src/server/auth/policy.ts`, `src/lib/flags.ts`, `tests/*.test.ts`.
