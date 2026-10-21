# 04. Concurrency handling

**Scope:** Concurrency handling: detailed analysis grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md, no external web dig

## What happened

During the build, the operator's own Cloudflare push, the STYLE-ROUTER round, landed on the live worker while the four jev-timeseries lanes were still working from an earlier bundle snapshot. Any lane hunk prepared against the old snapshot was now targeting files that had changed underneath it. Deploying the old snapshot plus the new hunks would have silently reverted the STYLE-ROUTER work.

The ground-source doc records how the build reconciled this without losing either change.

## The reconciliation steps

1. **Fresh bundle re-pull.** The build re-pulled the live bundle so that every subsequent edit targeted the current production code, not the stale snapshot.
2. **Advisor re-port of Lane B.** Lane B's changes were re-ported onto the NEW `jev-main.js` and `routes-jev.js`: 4 hunks in the first file and 2 in the second. For every hunk, its anchor was re-asserted unique in the new file. A hunk whose anchor matches zero places or more than one place cannot be applied safely, so uniqueness is the precondition for a mechanical re-port.
3. **Lane C card re-insertion.** The Forecast card (doc 01) was re-inserted into the new KV-hosted console. Its CSS anchor had moved in the new version, so the insertion point was re-derived rather than reused.
4. **Fixture recovery.** The advisor caught that the fresh extraction of the bundle had dropped `fixtures/lens-fixtures.mjs`. The file was recovered byte-identical. The source explains the stakes: a static import of a missing module would have produced CF 10021 on deploy, the same error family seen in doc 03.
5. **Test re-run against the real module.** Lane B's test suite was re-run against the real math module rather than a stub, and passed 44/44.

## Why each step was necessary

| Step | Failure it prevents |
|---|---|
| Re-pull | Reverting the operator's STYLE-ROUTER push |
| Unique-anchor re-port | Hunks applying in the wrong place or not at all |
| Re-derived CSS anchor | A card injected into the wrong part of the console |
| Fixture recovery | A deploy-time 10021 from a missing static import |
| 44/44 against the real module | Passing tests that only exercised a stub |

## The roles in the reconciliation

The build ran as 4 parallel lanes plus an advisor. The record shows the advisor doing integration work that no single lane could own: re-porting another lane's hunks, auditing the extracted bundle for missing parts, and confirming the module set before upload. Lanes produce changes against a snapshot; the advisor owns the mapping from snapshot to live.

## Extraction is not lossless by default

The most instructive item is the dropped fixture. Re-pulling the live bundle is the correct response to a concurrent push, but the act of re-extraction introduced its own defect: a file present in production was missing from the working copy. Had the build trusted the fresh extraction, the deploy would have failed at upload. Had the upload tooling been more permissive, it could have shipped a worker whose static import pointed at nothing.

The practical check implied by the record is a part-set comparison: the module list of the working copy must equal the live module list plus the intended additions. For this build, the intended additions were the two new parts, `jev-timeseries.js` (52nd) and `jev-forecast-math.js` (53rd).

## Byte-identity as the recovery standard

The fixture was recovered byte-identical, and the console card write was byte-verified in KV (doc 01). In both cases, "looks the same" was not accepted. A byte-level comparison is cheap and removes a whole class of whitespace, encoding, and truncation defects.

## Relation to the deploy chain

This concurrency episode sits inside the etag sequence `7f8fa641` to `f2313fa6` documented in doc 03. The final deployed worker carried both the STYLE-ROUTER changes and the jev-timeseries changes, and live verification (doc 05) confirmed that schedules and all 16 bindings were intact afterward. That last check is the end-to-end proof that the reconciliation did not clobber unrelated configuration.

## Takeaways for future builds

- Treat a concurrent push as a re-base, not a merge conflict to patch around.
- Require unique anchors for every hunk before re-applying it.
- Re-run tests against real modules after any re-base.
- Diff the part set before upload; a missing fixture is a deploy failure waiting to happen.
- Verify bindings and schedules after deploy, since those live outside the code diff.
