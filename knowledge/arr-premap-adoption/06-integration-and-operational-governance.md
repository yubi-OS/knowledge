# 06. Integration and operational governance

**Scope:** Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md, no external web dig

## Scope of this doc

This doc pulls together how the adoption integrates with the yubiOS and Steady Orbit /jev/ endpoint surface, how policy versioning and worker configuration were held stable, and what audit trail governs the change. It draws only on the adoption record and the merged feasibility record it cites.

## Endpoints touched or verified

| Endpoint | Role in the adoption |
|---|---|
| /api/jev/health | Liveness, policy_version, pause state |
| /api/jev/corpus/spectral/selftest | 9-check selftest on the new graph |
| /api/jev/route/selftest | Router selftest |
| POST /api/jev/corpus/spectral/walk (points mode) | The 366-centre gasket walk |
| POST /api/jev/corpus/oracle | Centroid d_w on the five gold renders |
| POST /api/jev/route | Lane routing for gold artifacts |

The feasibility record identified the oracle, spectral walk, lens/correct, and route endpoints and their GET selftests as the live routes that matter for this line of work. The adoption verified the selftests and the walk and oracle outputs directly.

## Policy versioning

Post-deploy health reported **policy_version 23** and **not paused**. Two facts follow:

1. The adoption changed code, not policy. The orchestrator's policy (which governs gated actions and approval bindings) did not need a version bump.
2. The orchestrator stayed live throughout. A paused state would have signaled that the deploy interrupted gated operations.

The distinction matters because the jev orchestrator ties approvals to policy versions. A deploy that silently bumped policy would invalidate pending approvals; this one did not.

## Instrument versioning

The adoption introduced a version label at the instrument level instead: `walkPoints` reports `delaunay: "exact-sos-v1"`. The feasibility record had framed the change as a candidate spectral-standard-v2 needing a major version bump, anchor re-derivation, and a router band recheck. The adoption delivered the label and the code; anchor re-derivation (open item 4) and threshold recalibration (open item 1) remain outstanding.

## Configuration invariants

| Invariant | Status after deploy |
|---|---|
| Bindings | 15 live: 14 explicit plus `secret_text` kept (AE_SQL_TOKEN) |
| Crons | Unchanged: `0 * * * *` and `*/5 * * * *` |
| Unchanged parts | Byte-identical to pre-deploy snapshot |
| Custom limits | None (`limits: null`) |

The `keep_bindings ["secret_text"]` metadata is the mechanism that preserves the AE_SQL_TOKEN secret across a modules upload. It is also part of the rollback recipe, so a rollback does not drop the secret either.

## Change-control sequence

1. **Evidence merged first.** PR #319 (squash db404b6e) put the feasibility analysis in the repo before production changed.
2. **Named decision.** Jenny decided to adopt on 2026-10-16. The feasibility record had stated that nothing would deploy without a separate go after the advisor report.
3. **Snapshot before change.** pre/ captured bundle, parts, per-part sha256 manifest, settings, and schedules.
4. **Fidelity check before regeneration.** The c2 fixture was first reproduced on the old graph (trace exact, d_w 1e-9).
5. **Minimal diff.** Three parts changed, one added, all others byte-identical.
6. **Stale-window wait.** 25 seconds before probing.
7. **Prediction-match verification.** Six-decimal agreement on all five gold renders.
8. **Open items disclosed.** Six items, each with an owner or blocker.

## Audit trail artifacts

| Artifact | What it proves |
|---|---|
| Etag eb4862465f33... | Exact deployed version |
| manifest.json sha256 per part | Which parts changed and which did not |
| PR #319, db404b6e | Rationale merged before deploy |
| Gold table before/after | Consumer impact, predicted then observed |
| Open items list | Known limits at time of adoption |

## Governance gaps the record exposes

- **Mirror rule breach.** AGENT.md in KV (92,569 bytes) and the git mirror (85,085 bytes) differ from byte 21,861 (open item 6). AGENT.md is the agent-facing contract for the worker, so a split copy means agents may read different rules depending on source.
- **Source-of-record split.** The repo Python still uses Bowyer-Watson (open item 5).
- **Calibration debt.** Thresholds and anchors predate the canonical graph (open items 1 and 4).

## Operational guidance derived from the record

- Any consumer storing walk values should store the graph label beside the number.
- A rollback must re-PUT all 60 pre parts with `keep_bindings ["secret_text"]`, which restores Bowyer-Watson and the old c2 fixture together.
- After any future spectral deploy, rerun the same five-render oracle table; it is now a standing regression baseline with six-decimal expected values.
