# 06. Integration and Operational Governance

**Scope:** Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-oracle-solo-2026-10-06.md, no external web dig

## Scope of this doc

The meta scope for this subtopic is "integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail". The solo log is an ideation record, not an integration spec, so this doc assembles the integration facts the solo log actually contains and marks where the source is silent.

## Endpoints the solo run touched

All on the Steady Orbit worker (the jev orchestrator surface):

| Endpoint / surface | Use in the solo run | Identifier recorded |
|---|---|---|
| `/api/decide` (clef) | all variation weights, lane verdicts, MVP choice | 1 batched request, 16 questions, policy v6 |
| `/taste/matrix` (live) | tri, gasket, 6-fold ring readings | cr_c004215fd6a18141, cr_7c29fd78bd53aece, cr_2c76d0c9f1613f0d |
| point-map | placing 6 variants + 4 exemplars | map id 570, d = 9, seed 20260906 |
| evolution | persisting 3 learnings | sweep es_5b05b9549851c3c4, fire 610061 |

The solo log does not give full URL paths for the point-map or evolution surfaces; only the identifiers above are recorded.

## Policy versioning

Every decision in the solo log ran under **clef policy v6**. The header says "Every decision weighted via /api/decide (clef, policy v6)".

Why the version matters for governance:

- A clef reading is only reproducible under the same policy. Re-running the 16-question request under a later policy may produce different weights.
- The hierarchy-router build record shows what happens on promotion: when policy v7 was promoted, one v6-bound approval expired, and when v8 was promoted, 26 v7-bound approvals expired. Policy versions are binding contexts, not labels.
- Therefore, the solo log's weights should always be cited as "clef policy v6" readings.

## Audit trail

The solo log's audit trail has four layers:

1. **Decision layer**: the 16 clef answers, all from one request, so they share policy, model, and timing.
2. **Measurement layer**: three taste-matrix run ids, each a stored run that can be re-read.
3. **Placement layer**: point-map 570 with a fixed seed (20260906), so the placement is reproducible.
4. **Learning layer**: evolution sweep es_5b05b9549851c3c4 with 3 records.

The design principle is the same one the log states for its weights: live readings, not self-scores. Every claim points to an external stored artifact.

## Integration with yubiOS

The solo log itself does not describe yubiOS image, boot, or system integration. Its relationship to yubiOS is through the shared research infrastructure:

- the ground-source path is in the `yubi-OS/yubiOS` repo under `refs/`;
- the instruments it employed (clef, taste engine, point-map, evolution) run on the Steady Orbit worker that the yubiOS skills (`jev-orchestrator`, `jev-corpus`, `taste-engine`) document.

Any further claim about yubiOS integration would exceed the source.

## Governance principles carried forward

Although not written as governance rules in the solo log, three principles are visible in its practice and are stated explicitly in companion docs:

| Principle | Where visible in solo log | Stated explicitly in |
|---|---|---|
| decisions are made by an external model, not self-graded | header: "LIVE readings, not self-scores" | solo log header |
| gates exclude low-confidence measurements | tri excluded at r2 0.969 | taste doctrine, SPEC r2 gate |
| verdicts are data, not authorization | MVP choice selects what to build, not what to deploy | SPEC route contracts; router doctrine |

## Where the source is silent

The solo log does not record:

- bearer-auth or route contracts (those are in the SPEC);
- run-row schemas or idempotency rules (SPEC and router record);
- approval workflows or fail-closed gating (router record);
- costs or token usage of the clef request.

## Operational checklist for re-running the solo evidence

1. Re-issue the 16-question clef request pinned to policy v6.
2. Re-read the three taste-matrix runs by id.
3. Re-open point-map 570 with seed 20260906.
4. Read the 3 records under evolution sweep es_5b05b9549851c3c4.
5. Compare against the generation log table; any drift is a policy or data change, not an authoring error.
