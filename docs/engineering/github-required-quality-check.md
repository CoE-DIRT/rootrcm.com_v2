# Required `quality` check on `main`

**Not applied from this agent.** Updating repository rulesets is a GitHub admin write. `protect-main` (id `26163186`) currently requires 1 approving review, conversation resolution, and blocks force-push/delete. It does **not** yet require the Actions job `quality`.

Independent review is already enforced. To also require CI, a repo admin should add this rule to `protect-main` (do not weaken review count):

```json
{
  "type": "required_status_checks",
  "parameters": {
    "strict_required_status_checks_policy": true,
    "required_status_checks": [
      { "context": "quality" }
    ]
  }
}
```

Source: `GET /repos/CoE-DIRT/rootrcm.com_v2/rulesets/26163186` on 2026-10-30. Issue [#3](https://github.com/CoE-DIRT/rootrcm.com_v2/issues/3).
