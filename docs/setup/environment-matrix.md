# ROOT V2 — Environment and credentials matrix

| Environment | Intended use | Appwrite identity | Public base URL | Secrets/data | Publishing gate |
|---|---|---|---|---|---|
| local | Cursor/OpenCode developers | Dedicated V2 development project only | localhost | Local .env.local, synthetic | Developer |
| preview | Isolated PR/UI review | Dedicated V2 preview project (to create) | Separate preview hostname (TBD) | Mocked/disabled adapters, synthetic | PR QA |
| staging | Integration contract testing | Dedicated V2 staging project (to create) | Staging domain (TBD) | Test credentials and synthetic data; provider sandbox | Technical review |
| production | Approved customer platform only | Dedicated V2 production project (NOT created by this document) | Post-approval (TBD) | Least-privilege production secret store, approved data agreements | Manual founder/security signoff |

**Current state:** documentation only. No Appwrite projects, GitHub Environments, OAuth credentials, secrets, Pages or public domain are created by adding this file.

## Environment rules
- Use a separate Appwrite project, storage, origin allowlist, roles and API keys for each environment.
- Public `NEXT_PUBLIC_*` may contain endpoint/project identifiers, **never private app keys**.
- Never mirror production patient data into previews; only known synthetic org/provider fixtures.
- Define Google/Microsoft/email sign-in later with correct redirect origins, consent and tenant policy. Mock sign-in screens are not live authentication.
- No HubSpot/Apollo synchronization, billing charges or webhooks until the respective integration gate passes.
- Preserve V1 and rootrcm.com; no cutover from repository automation.
