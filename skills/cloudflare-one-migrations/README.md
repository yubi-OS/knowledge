# cloudflare-one-migrations knowledge corpus

Explication corpus for the yubi-OS/yubiOS skill `skills/cloudflare-one-migrations/SKILL.md`: planning migrations from Zscaler ZIA/ZPA, Palo Alto, legacy VPN, SWG, or SASE stacks to Cloudflare One, including migration assessments, policy mapping, rollout plans, and parity/gap analysis patterns. The ground source is the primary source of record; every doc cites it as its grounding spine and adds jev-weighted dig sources for the external mechanisms it references.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-migration-workflow.md | The 7-step migration workflow from source-stack identification to rule accounting, and its grounding in Cloudflare migration guidance |
| 02 | 02-source-exports.md | Per-source export checklists (ZIA, ZPA, Palo Alto/Prisma) and why structured exports beat screenshots |
| 03 | 03-mapping-heuristics.md | Source-stack to Cloudflare One mapping patterns: ZIA/SWG to Gateway, ZPA to Access plus Tunnel, Palo Alto intent mapping, legacy VPN replacement |
| 04 | 04-assessment-prompts.md | The 7 readiness dimensions: source coverage, rule volume and hit data, object dependencies, identity, TLS/DLP, connectivity, rollout readiness |
| 07 | 07-palo-alto-traps.md | Palo Alto/Prisma/NGFW traps: one rule to many resources, partial mappings, object exports, broad rules and catchalls, device posture prerequisites |
| 08 | 08-gotchas-rule-accounting.md | Cross-source gotchas and how each feeds the rule-accounting obligation |
| 09 | 09-validation-gates.md | The 6 stage-scoped validation gates: count reconciliation, review classes, pilot validation, TLS testing, rollback, accounting table |
| 10 | 10-assessment-template.md | The migration assessment markdown deliverable template (internal-record subtopic, no dig) |

## Research summary

- Results collected: 84 (top 6 per query, 2 queries per web-shaped subtopic, 14 searXNG queries total)
- Weight split: 19 high (>= 0.5) / 65 low (< 0.5)
- jev requests: 7 (1 outline validation score request + 6 noul weighting batches), usage 12249 input / 1690 output tokens, via DefAPI direct (https://api.defapi.org/api/v1/decisions), model typesafe/jev-1.13
- Redo counts: 0 dig redos, 0 jev redos
- Skipped docs: 05 (zscaler-zia-traps) and 06 (zscaler-zpa-traps) dropped at outline validation with score 0 (0.25 and 0.38); their material remains covered inside 02, 03, 04, 08 where the source doc cites those mechanisms
- Gaps: none beyond the dropped subtopics

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide preflight run orchestrator-side (agent-side probe skipped for speed per the mint brief)
