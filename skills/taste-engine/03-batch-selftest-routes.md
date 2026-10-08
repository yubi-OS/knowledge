# 03 - Batch and selftest routes

## Scope

This doc covers the two supporting routes around the main scorer: POST /api/jev/corpus/taste/matrix, the paced fail-closed batch route, and GET /api/jev/corpus/taste/selftest, the 13-check suite that includes fixture parity against the Python source of record. Grounding spine: the source doc (yubi-OS/yubiOS skills/taste-engine/SKILL.md).

## POST /taste/matrix

The matrix route takes `{items: [{name, ...score fields}]}` with 1 to 20 items, plus optional `spacing_ms`. It is a paced batch: rather than letting a caller fire 20 scorer calls back to back, the route spaces the items and records the whole thing as one `taste-matrix` run row. Fail-closed means any invalid item 422s the whole batch: there is no partial success mode where 19 items score and 1 is silently dropped (source doc). This is the right default for a measurement instrument. A batch that half-succeeds is hard to interpret: either every item in a named batch is a valid measurement or the batch did not happen. The design-system guidance on validation errors makes the same call at the UI layer: tell the user what went wrong before processing anything, and do not process a partial input set silently (source: https://design-system.service.gov.uk/patterns/validation/, jev weight 0.94, note this result is UI-level guidance, used here only as a pattern analogy). The general contract: fail closed, all or nothing.

The 20-item cap is a size guard, and `spacing_ms` is a pacing guard; both exist so that a matrix run is a deliberate paced measurement rather than a burst. The one-run-row audit property (guideline 4 in the source doc) means a matrix batch is traceable as a single unit in `jev_corpus_runs`, idempotent per input sha256.

## GET /taste/selftest

The selftest route runs 13 checks and returns 200 when all pass and 500 when any fails (source doc). The checks cover: the math interface, the line and blob fixtures, the hysteresis table, question shapes, permutation determinism, and 6-fixture parity against the Python source of record, where parity tolerance is max |dD| of 4.4e-16 (source doc). That tolerance is essentially exact: 4.4e-16 is at the scale of double-precision epsilon, so the JS port and the Python source agree to the last bits on the fixtures.

The parity property is the golden-master pattern: a characterization test that pins the current behavior of a working system and fails on any unintended change. The literature on the pattern describes it as capturing the observable outputs of existing behavior so that refactoring or porting can be verified against the captured outputs (source: https://helpmetest.com/blog/golden-master-testing/, jev weight 0.29, weak backing, used only as the name of the pattern; the pattern's own strength here comes from the source doc's 4.4e-16 parity record). The same idea applies to the cross-language port itself: edge-standard-v1 exists as a Python source of record (`edge_standard.py`, stdlib, 34 of 34 checks per the source doc) and a JS worker port that imports boxCountingDim from jev-taste-math.js; the fixture parity check is what makes the port trustworthy rather than merely similar.

Permutation determinism is also in the selftest: the order_seed behavior of doc 02 must be reproducible, and the selftest checks it. If the same seed produced different orders across deploys, position-bias experiments would stop being interpretable.

## How to use the selftest

Guideline 5 in the source doc: a failing selftest (500) blocks trust in results, and the selftest must be run after any deploy (source doc). This is a discipline, not a convenience: the selftest checks extraction and math, but it cannot check that the routes are wired (doc 07 records the deploy where the selftest passed while a live route 500'd). So the operating rule is: selftest after every deploy, then live-verify every route, and only then resume scoring. The selftest is necessary, not sufficient.

## The deploy lesson embedded here

Two of the deploy lessons in the source doc live at the boundary of this doc. First, a module that calls askJev must import it: `node --check` is syntax-only, so the selftest passed while the live route 500'd because the extraction path never touched the missing import (source doc). The selftest could not catch that class of bug by construction, because extraction is pure and the failing code path only executes on a live score call. Second, fixture parts must ship path-qualified (`fixtures/taste-fixtures.mjs` with filename matching) or Cloudflare rejects the whole upload with error 10021 (source doc). Both lessons are expanded in doc 07; they are mentioned here because they are the reason guideline 5 says selftest plus live verification, never selftest alone.

## Run rows as audit trail

All three taste routes write run rows of kinds `taste`, `taste-matrix`, and `edge-standard` into `jev_corpus_runs`, idempotent per input sha256 (source doc, guidelines 4 and 8 context). Idempotency per input hash means re-scoring the same input does not create a second independent audit row pretending to be a new measurement; the version stamp on prior measurements survives parameter changes because pinned-parameter changes are major version bumps (guideline 8, source doc). The audit trail is what lets a verdict from an old run be compared against a verdict from a new one without ambiguity about which instrument version produced each.
