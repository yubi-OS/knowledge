# 03-scores-painkiller-switching-defensibility-testab

**Scope.** Scores (painkiller / switching / defensibility / testability, 1 to 5 each): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md, no external web dig

## The scoring frame

The ground source scores every variation on four axes, each 1 to 5: painkiller (how much real pain the idea removes), switching (how cheap it is to adopt, higher meaning cheaper), defensibility (how robust the result is to critique), and testability (how cleanly it can be checked against ground truth). The sum ranges from 4 to 20. The record applies an explicit drop threshold of 8: anything summing below 8 is dropped.

## The table, verbatim

| Variation | Pain | Switch | Defend | Test | Sum | Status |
|---|---|---|---|---|---|---|
| V1 | 3 | 5 | 2 | 5 | 15 | backbone for Line A |
| V2 | 5 | 3 | 4 | 4 | 16 | finalist, Line A walk leg |
| V3 | 4 | 4 | 3 | 5 | 16 | finalist, Line B |
| V4 | 2 | 2 | 2 | 1 | 7 | dropped (below 8) |
| V5 | 3 | 4 | 3 | 4 | 14 | Phase 2 hook |
| V6 | 4 | 2 | 3 | 2 | 11 | blocked by the deploy hold |
| V7 | 4 | 4 | 4 | 2 | 14 | Phase 2 (needs registration) |

## Extreme-score justifications

The record requires a written justification for any score above 4 or below 2. It gives five:

1. **V2 painkiller 5.** The walk leg's A1 verdicts flip between two implementations of the same algorithm. The feasibility benchmark measured this in `session/arr-premap/feasibility-check-2026-10-16.md` section 3. The record stresses that this is a measured defect, not a guess. That distinction is why V2 earns the top pain score: it removes a known reproducibility failure, not a hypothetical one.
2. **V2 switching 3.** Pinning a new Delaunay changes the walk graph for every consumer, so it is a major version bump with anchor re-derivation. Switching cost is real but bounded, hence the middle score rather than a low one.
3. **V3 testability 5.** Gasket holdouts have exact ground truth. Every site of a depth-k gasket is known, so any subset can be withheld and the predicted holes checked exactly.
4. **V4 testability 1.** Inverse IFS recovery from a finite, noisy, partial point set is not identifiable in general (research pass 2). An idea that cannot in principle be checked earns the floor.
5. **V6 switching 2.** It needs a deploy, a policy change, and the dispatch path: three changes, each individually blocked.

V1's switching 5 and testability 5 also sit above 4; the record does not justify them separately, but both follow from V1 being a single additive route reading quantities the oracle already computes.

## Reading the ties and near-ties

V2 and V3 tie at 16 but for different reasons. V2 wins on painkiller and defensibility (it fixes a measured defect and produces a reproducible graph); V3 wins on testability (exact ground truth) and switching (it adds a module rather than replacing a shared graph). V1 at 15 is one point behind and becomes the backbone rather than a finalist, because its defensibility 2 is the lowest of any surviving idea: on its own, a three-arm readout on an implementation-dependent walk graph is easy to critique. Pairing V1 with V2 addresses exactly that weakness.

V5 and V7 tie at 14. V5 is a hook (it depends on Line A output) and V7 is gated on registration; both are deferred to Phase 2 rather than dropped, since neither falls below 8.

V6 at 11 survives the threshold but is blocked by an external constraint, the deploy hold. The status column records the blocking reason rather than a score-based verdict, which keeps the scoring honest: V6 is not a bad idea, it is an idea that cannot run under current governance.

## What the scores do not claim

The scores are ordinal judgments made solo, without dialogue, on 2026-10-16. They are not measurements. The only score that cites a measured artifact is V2 painkiller 5 (the feasibility benchmark). The record's discipline is that extreme scores must be argued; the middle scores carry no written rationale and should be read as the author's judgment. The threshold of 8 is applied mechanically: V4 at 7 is dropped even though it represents the most general approach, because a testability of 1 makes it unshippable as an MVP.

## Downstream use

The scores feed directly into the finalists (V2 and V3, both at 16), the backbone (V1 at 15), the Phase 2 queue (V5, V7 at 14), the blocked list (V6 at 11), and the dropped list (V4 at 7). The generation log at the end of the record restates the same partition, so the scores section and the log can be cross-checked line by line.
