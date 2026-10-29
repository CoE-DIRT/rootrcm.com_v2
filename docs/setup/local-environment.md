# Local Cursor / OpenCode / Appwrite setup

## On Windows
Install current Node.js LTS, Git for Windows, Cursor Premium, VS Code (optional), Docker Desktop (only if needed) and OpenCode. Set up GitHub SSO or credential manager, clone the private repo and open in Cursor.

```powershell
git clone https://github.com/CoE-DIRT/rootrcm.com_v2.git
cd rootrcm.com_v2
npm install
Copy-Item .env.example .env.local
npm run dev
```

Use node-specific environment variables from **separate Appwrite V2 development** project, not the V1 one. Don't check .env into Git.

## AI coding strategy
- Cursor Agent for bounded feature tasks; Claude/Codex review in own branches.
- OpenCode: run `/connect` → OpenRouter and select an available metered coding model via `/models`. Local key stays in OpenCode keyring, never committed.
- Set provider spending caps and inspect usage daily. 'Unlimited' consumer tiers do not imply unlimited API calls.
- Use one PR per vertical slice: responsive nav, foundations, forms, auth, organizations, entitlement, etc.
