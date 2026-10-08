# skills/shipping-and-launch knowledge corpus

Knowledge corpus for the yubiOS skill `shipping-and-launch` (ground source: yubi-OS/yubiOS skills/shipping-and-launch/SKILL.md, 17353 B). Topic: preparing production launches: pre-launch checklist, monitoring setup, staged rollout planning, and rollback strategy.

## Docs

| NN | doc | scope | results kept | primary (>= 0.5) |
|---|---|---|---|---|
| 01 | [01-pre-launch-checklist.md](01-pre-launch-checklist.md) | The six-section pre-launch checklist (code quality, security, performance, accessibility,  | 20 | 12 |
| 02 | [02-feature-flag-strategy.md](02-feature-flag-strategy.md) | Decoupling deployment from release with feature flags: the flag lifecycle (deploy off, ena | 20 | 8 |
| 03 | [03-staged-rollout.md](03-staged-rollout.md) | The six-step rollout sequence from staging to full rollout: staging tests, deploy with fla | 20 | 9 |
| 04 | [04-rollout-thresholds.md](04-rollout-thresholds.md) | The advance, hold, and roll back decision thresholds (error rate, P95 latency, client JS e | 24 | 14 |
| 05 | [05-monitoring-observability.md](05-monitoring-observability.md) | What to monitor at launch (application, infrastructure, client metrics), error reporting s | 12 | 11 |
| 06 | [06-error-budget-gate.md](06-error-budget-gate.md) | Using the SLO error budget as an objective release gate: the 20 percent remaining, 0 to 20 | 12 | 9 |
| 07 | [07-rollback-strategy.md](07-rollback-strategy.md) | The rollback plan document: trigger conditions, rollback steps (flag off vs revert), datab | 22 | 10 |
| 08 | [08-launch-discipline.md](08-launch-discipline.md) | The cultural layer: common rationalizations (works in staging, monitoring is overhead, rol | 12 | 5 |

## Research summary

- Results collected: 156 (every result carries a jev noul weight; none shipped unweighted)
- Weight split: high (>= 0.5) 59, low (< 0.5) 97. Weak-backing sources are cited in the docs only as labeled corroboration.
- jev: 14 requests, 15188 input / 2984 output tokens, model typesafe/jev-1.13 via DefAPI direct (https://api.defapi.org/api/v1/decisions)
- Outline validation: 8 subtopics scored 1.09 to 1.69, 0 dropped
- Redos: 01 (2), 02 (2), 03 (2), 04 (2), 07 (2), because the first-round digs returned dictionary entries and off-topic results for those subtopics
- Skipped docs: none

## Notes

- The source doc is the primary source of record; every doc cites it as "source doc" for its grounding spine and carries dig sources with their jev weight for the external mechanisms it references.
- Drift notes are dated 2026-10-08 and marked as corrections of emphasis, not contradictions.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide (DefAPI typesafe/jev-1.13) 200 on all 14 agent-side requests.
