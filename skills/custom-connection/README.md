# skills/custom-connection knowledge corpus

Explicates the yubiOS skill [custom-connection](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/custom-connection/SKILL.md) (ground source: yubi-OS/yubiOS skills/custom-connection/SKILL.md): how to work with custom API-key connections in the Sauna environment, the credential injection pattern, and the connection-management discipline the skill teaches.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [connection-row-inventory](01-connection-row-inventory.md) | the six Cloudflare connection rows, the one working row, and the dated dead-row history |
| 02 | [multi-connection-pinning](02-multi-connection-pinning.md) | the connections parameter plus the X-Sauna-Connection-Id header pattern for same-host rows |
| 03 | [credential-scoping-health-checks](03-credential-scoping-health-checks.md) | account-scoped credentials, the verify false positive, and the correct whoami endpoint |
| 04 | [error-code-discrimination](04-error-code-discrimination.md) | 6111 vs 9109 vs 1000 vs 7003 and what each says about the row versus the route |
| 05 | [account-inventory-mapping](05-account-inventory-mapping.md) | what the account holds, the workers.dev subdomain rename, and the Worker consolidation |
| 06 | [calibration-discipline](06-calibration-discipline.md) | session re-verification, the false-positive trap, and dynamic id pinning |
| 07 | [recursion-audit-rules](07-recursion-audit-rules.md) | session-start audit, table update discipline, append-dont-rewrite, re-run triggers |
| 08 | [proven-api-patterns](08-proven-api-patterns.md) | verified request patterns: live check, deployments, settings, lists, and the failed routes |
| 09 | [connector-selection-strategy](09-connector-selection-strategy.md) | managed connector rows vs manual api_key rows and the OAuth-create defect resolution |

## Research summary

- Results collected: 72 (12 searXNG queries across 6 web-shaped subtopics, top 6 kept per query)
- Weight split: 38 high (>= 0.5) / 34 low (< 0.5) of 72
- jev requests: 7 (1 outline score validation, 6 noul weighting batches of 12)
- Redo counts: 0 dig redos, 0 weighting redos
- Skipped docs: none (all 9 subtopics authored; 3 of them are internal-record subtopics grounded solely in the source doc, no dig)
- Weak-backing citations are labeled inline with their weight; every claim also carries the source-doc attribution or a dig URL

## Source attribution

Claims from the ground source are attributed explicitly as "source doc" (yubi-OS/yubiOS skills/custom-connection/SKILL.md). Claims from digs carry their URL and jev weight. Internal-record subtopics (01, 06, 07) skip searXNG entirely and say so.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); decide healthy, DefAPI direct endpoint used for all jev calls (no relay fallback needed).
