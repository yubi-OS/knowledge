# jev-orchestrator knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS `refs/jev-orchestrator-2026-10-01.md`. Topic: the Jev v2 operations-controller architecture as a deployable skill, i.e. gated-approval orchestration (understand, decide, deterministic fail-closed gate, execute, verify, terminal states, human review, append-only audit) for autonomous agents.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | [01-pipeline-stages.md](01-pipeline-stages.md) | The seven-stage controller flow (ingest, understand, decide, gate, execute, verify, terminal) and why stage ordering is the security model. |
| 02 | [02-fail-closed-gate.md](02-fail-closed-gate.md) | The deterministic fail-closed policy gate: versioned policy, stamped enforcement version, deny-by-default, re-gating at dispatch. |
| 03 | [03-human-approval-loop.md](03-human-approval-loop.md) | Approval bindings (actor, target, payload hash, limits, expiry, policy version), the review queue, and binding-mismatch failure classes. |
| 04 | [04-terminal-states-failure-paths.md](04-terminal-states-failure-paths.md) | Closed terminal enum, bounded retry, reconciliation, and honest reporting of partial completion. |
| 05 | [05-append-only-audit.md](05-append-only-audit.md) | Append-only event-chained state, why mutable state is forbidden, and the pause/kill switch that cannot undo executed effects. |
| 06 | [06-advisory-decision-layer.md](06-advisory-decision-layer.md) | The advisory decision layer: typed model outputs that inform the pipeline but never authorize dispatch. |
| 09 | [09-deploy-and-first-use.md](09-deploy-and-first-use.md) | Deploying on a live worker without route shadowing, the policy starter, the first gated end-to-end run, and open items. |

## Research summary

- Results collected: 84 (deduplicated per subtopic across 2 seed queries per subtopic, top 6 per query).
- Weight split: 18 results at weight >= 0.5 (authoritative backing), 66 at < 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 19 total on `/api/decide` (model clef): 1 probe, 1 outline validation (9 questions, score metric), 17 weighting batches (5 noul questions each). Usage: 14992 input tokens, 0 output tokens. One weighting run crashed after batch r1 was sent because of a log-format bug; batch r1 was re-sent and its first-round answers discarded (recorded in jev-log.json).
- Redo counts: 0 dig redos. All 7 kept subtopics returned strong digs on their first queries.
- Dropped at outline validation: 07 (improve-loop, score 0.46) and 08 (parallel-lane-build, score 0.44), both scored 0 (padding). Marginal subtopics 06 (score 1.18) and 09 (score 1.12) were kept because their digs came back strong.
- Skipped docs: none.

Per-doc source counts: 01: 9 results, 3 primary; 02: 5 results, 2 primary; 03: 8 results, 1 primary; 04: 10 results, 3 primary; 05: 10 results, 2 primary; 06: 10 results, 4 primary; 09: 12 results, 2 primary.

Note on sources: claims specific to the deployed Jev controller itself are sourced to its live surface (`https://steady-orbit.systems-a.workers.dev/api/jev/*`, listed as "system of record"); web-dig claims carry their URL and jev weight inline.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
