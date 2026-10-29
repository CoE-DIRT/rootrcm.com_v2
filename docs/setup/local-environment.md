# Local Cursor / OpenCode / Appwrite setup

## On Windows
Install current supported Node.js LTS, Git for Windows, Cursor Premium, VS Code (optional), Docker Desktop (only if required) and OpenCode. Use a scoped GitHub login/credential manager, clone the **public source repository**, and open it in Cursor.

```powershell
git clone https://github.com/CoE-DIRT/rootrcm.com_v2.git
cd rootrcm.com_v2
npm install
Copy-Item .env.example .env.local
npm run dev
```

Run `npm run lint; npm run typecheck; npm run test; npm run build` before submitting a PR. No production secrets or PHI belong in local preview data.

## Agent budget and isolation
- Cursor Agent: bounded implementation tasks and isolated branches.
- OpenCode: `/connect` for a metered provider such as OpenRouter and select current supported coding models with `/models`.
- Store provider keys in local keyring/provider config, not repo; set account-level monthly cap and inspect consumption.
- Codex/Claude: independent targeted reviews, no concurrent edits to the same files.
- Per-PR scope: navigation → design primitives → conversion flow → synthetic workspace → isolated Appwrite identity/tenant → CRM → payments. See `docs/setup/environment-matrix.md`.
- No account or API plan guarantees uncapped tokens or unlimited service usage.

## Deploy boundary
Use a **separate Appwrite V2 project** for all preview/staging environments. No DNS changes, production CRM writes or V1 modifications without explicit review.
