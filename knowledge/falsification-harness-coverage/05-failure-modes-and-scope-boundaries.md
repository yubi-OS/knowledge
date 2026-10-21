# 05. Failure modes and scope boundaries

**Scope:** Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md, no external web dig

## Purpose of this doc

This doc collects the failure modes, negative results, and explicit non-claims recorded or implied by the ground source. A coverage map is only useful if its limits are visible: what a harness cannot detect, where an estimator is known to be weak, and which claims the map deliberately does not make.

## Documented failure modes the harnesses target

The source names specific ways each instrument can fail. Grouped by kind:

**Noisy-instrument verdicts.** The refs3 lesson is the motivating failure: the free-prose scorer band was 6 to 8 times the true effect, so negative verdicts earned under it were provisional rather than terminal. The failure mode is trusting a verdict before shrinking the instrument.

**Extraction-recall limits.** The refs4 round recorded 3 no-flip cycles that were extraction-recall limits, not genuine absences of effect. The scorer gold set (Tier 2 item 3) targets this by planting evidence at known counts.

**The axis-vocabulary trap.** Named in AGENT.md and cited in the scorer item: an extractor that keys on vocabulary will fire on distractor documents that use the right words without carrying the evidence. Distractor vocabulary in the gold set gates specificity.

**Weak estimators on short or noisy series.** The Prony tau-grid plus NNLS fit gave r2 0.069 on the first 35-point series. Series under 5 points return 422. Nothing yet pins where the estimator is trustworthy.

**Deterministic-scorer collapse.** For the persistence statistic, a deterministic scorer collapses recovery fraction R to 1.0 (recorded as F3). The honest target is therefore the inter-pass offset under multi-pass mode with planted noise, not R itself.

**Fragile consolidation logic.** The hysteresis route only works because of the Oct-3 fix to `consolidateLedgerChains`, and that fix had fixture coverage only via a single 102.86 anchor. The shapes that broke the original route (1-cycle, multi-cycle, pending, single-row-both) are the planted fixtures.

**Non-converged correction.** For routing, a deliberately mis-corrected artifact must land `reroute_not_converged`, as observed on run `cr_b11bbeee22ed5425`. The failure mode is a convergence gate that silently dispatches a bad correction.

**Decision-model drift.** The clef migration moved 21.6% of raw probabilities, and the 0.55 threshold was chosen from only a 50-doc sample. Without a fixed battery, drift across deploys is invisible.

## Explicit non-claims

The source is careful about what it does not assert:

- **Parity is not validity.** Scorer parity is byte-exact against `session/r15/scorer_v2.py`, but the source states plainly that parity of a port is not validity of the extractor. No known-answer set existed.
- **The Lean bounds do not cover the statistical layer.** For map placement, WayfinderBounds.lean covers the integer layer only. Whether a document authored for a (u,v) neighborhood actually lands there is an open statistical question.
- **Taste fractal band is not admitted.** The fractal band is `admitted:false` pending a human-rated gold set. The synthetic tier can gate extraction, but the semantic tier stays open; a synthetic pass does not admit the axis.
- **One fixture is not a corpus.** The snapback round-3 series is ONE fixture. Passing it says nothing about the verdict mapping across classes.
- **Tier 3 is a fit claim, not a quality claim.** Relays and CRUD routes are not certified correct by being excluded; they are routed to contract tests.

## Scope boundaries of the coverage map itself

- **Surface boundary.** The map covers the steady-orbit worker endpoint surface as of the 51-part bundle (etag chain through the corrected-hierarchy round). New parts added after that bundle are not classified.
- **Date boundary.** The map is dated 2026-10-06 and pairs with the ENDPOINTS.md refresh of the same date.
- **Design, not results.** Tier 2 entries are designs. Except where a later round executed them (snapback and hysteresis, recorded separately), no gate result is claimed.
- **Cost figures are estimates.** "Pure compute", "about $0.0002 per score", and "under $0.05" are planning figures, not measured invoices.

## Failure modes of the harness process

The procedure itself can fail, and the source's final paragraph is designed against those failures: gates moved after results (prevented by pre-registration), windows that cannot pass on the real scale lattice (prevented by pre-run lattice verification), silent regressions (prevented by committed anchors), port drift (prevented by live-route parity), and post-hoc plan changes (prevented by logging amendments before the first clean run). The companion visco record shows a further process failure in practice: a runner seed-index misalignment that measured an unintended corpus. It was caught, logged as a dated amendment, and its data discarded from every gate.
