# 05. Provenance

**Scope:** Provenance: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-adoption-2026-10-16.md, no external web dig

## Why provenance is part of the record

An adoption that changes a measurement for every consumer has to be reconstructable: what was decided, on what evidence, by whom, with what rollback. The adoption record ends with a provenance section naming three locations. This doc expands each, tying in the decision, the deploy artifacts, and the evidence chain described elsewhere in the record.

## 1. Build and advisor record: session/arr-premap/

Contents named in the source: the SPEC, the feasibility check, and the integration report.

From the merged feasibility record (refs/arr-premap-feasibility-2026-10-16.md), this build ran in lanes with an advisor:

- **Lane A1**: the arrangement-response line, including the float-safe rasterizer.
- **Lane A2**: the canonical exact-integer Delaunay with Simulation of Simplicity tie-break. Edge parity 33 of 33 between JS and Python, walks agreeing to 0.0 between languages, and a reproduction of the original record on the recorded graphs (deviation 5e-5).
- **Lanes B1 and B2**: the premap line.
- **Advisor**: integration, and exploratory checks such as the hierarchy-sign comparison that became open item 2.

The new deployed part, jev-delaunay-exact.js, is explicitly identified as the lane A2 build.

## 2. Pre-deploy snapshot and post-deploy checks: session/deploy-2026-10-16/

Three subdirectories are named: `pre/`, `candidate/`, and `baseline/`.

**pre/** is the rollback source. It holds:

| Artifact | Purpose |
|---|---|
| bundle.raw | The full pre-deploy bundle as pulled |
| The 60 parts | Every pre-deploy module, individually |
| manifest.json | sha256 per part |
| settings.json | Worker settings at deploy time |
| schedules.json | Cron schedules at deploy time |

Rollback re-PUTs those parts with the same metadata, including `keep_bindings ["secret_text"]`. The per-part sha256 manifest is what makes "every other part is byte-identical to the pre-deploy snapshot" a checkable claim rather than an assertion: the post-deploy bundle can be hashed part by part against it.

**candidate/** holds the bundle that was deployed: the 60 prior parts with three changed (jev-spectral-centroid.js, jev-spectral.js, fixtures/spectral-fixtures.mjs) and one added (jev-delaunay-exact.js), for 61 modules.

**baseline/** holds the reference measurements against which post-deploy values were compared. The verification states every oracle d_w post-deploy value matched the local prediction to six decimals; those predictions are the baseline.

## 3. Merged feasibility record: refs/arr-premap-feasibility-2026-10-16.md (PR #319)

PR #319 contains the docs, specs, and feasibility record. The decision explicitly required it to merge FIRST, before the deploy. It merged as squash commit db404b6e.

Merging the evidence before the code means the repo holds the justification for the change before production carries the change. Anyone reading the deploy history can follow it back to a merged analysis rather than a session transcript.

## The decision itself

- **Who**: Jenny.
- **When**: 2026-10-16.
- **What**: adopt the exact-predicate Delaunay, deploy, and merge PR #319 first.

The feasibility record had framed this as decision 1: adopt an exact-predicate, symbolic-perturbation Delaunay as spectral-standard-v2 (with re-anchoring and a router recheck), or keep the deployed graph and record its implementation sensitivity as a finding. It also stated that nothing in the build was deployed and that a deploy needed a separate go after the advisor report. The adoption record is that go, executed.

## Evidence chain, end to end

1. Feasibility check finds JS and Python graphs differ (1031 vs 1025 edges).
2. Independent forced-edge check (no implementation in the loop) finds 1014 forced edges; JS misses 8, Python misses 14.
3. Lane A2 builds the exact graph: 1039 edges, contains every forced edge, 33/33 JS/Python parity.
4. PR #319 merges the evidence (db404b6e).
5. Jenny decides to adopt.
6. Snapshot to pre/, candidate built, fixture regeneration first reproduces the old fixture on the old graph (trace exact, d_w 1e-9).
7. Deploy (etag eb486246..., 61 modules).
8. Live verification after 25 seconds matches predictions to 6 decimals.
9. Open items recorded, none softened.

## Gaps in provenance

- The Python source of record in the repo still uses Bowyer-Watson (open item 5); the canonical Python twin lives in the lane A2 session output until Jenny names files.
- The session/ paths are session artifacts, not repo paths. Their durability depends on those sessions being retained, unlike the merged refs/ record.

## Summary

| Question | Answer location |
|---|---|
| Why change? | refs/arr-premap-feasibility-2026-10-16.md (PR #319) |
| Who decided? | Jenny, 2026-10-16 |
| What was built? | session/arr-premap/ (SPEC, lanes, integration report) |
| What was deployed? | session/deploy-2026-10-16/candidate/, etag eb486246... |
| How to undo? | session/deploy-2026-10-16/pre/ with per-part sha256 |
| Did it match prediction? | baseline/ vs live, 6 decimals |
