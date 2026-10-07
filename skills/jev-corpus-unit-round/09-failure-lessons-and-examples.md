# Failure lessons, worked examples, and guidelines

Scope: the accumulated ground truth of the chain. Nine rounds of failure lessons, the three worked examples (change, add, revert), and the six guidelines that summarize the whole runflow.

## The failure lessons

Each lesson below is recorded in the source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md and is quoted here as protocol ground truth:

1. The `dbc` audit field is not the gate statistic; `level_dbc` is (refs6 correction). The dbc field is an L2 share-spectrum distance, negative when close to the null, uncorrelated with z at cycle scale.
2. Marginal-bit threshold jitter: hysteresis on every edited-row re-score (refs5 F1). A plain re-score dropped marginal bits in the 0.45 to 0.55 band and manufactured wrong signs.
3. Nulls=100 z deltas are not gate-grade; re-measure at 400 before acting (refs7 F2). refs6's +0.29 and +0.71 z-revisions collapsed to -0.61 and -0.26 at nulls 400.
4. The lens predicts movability, never improvement; rungs propose, the gate disposes (refs8 F1). The lens is retired as a candidate source but retained as a detectability filter and mobility-series feeder.
5. Axis-fill is a closed class on refs/: level-negative under three gate statistics (refs2, refs4, refs7). This is why the lens's axis-fill proposals were retired.
6. Supersedes shares baseline_id and target; pre-rows carry the current map id (refs5 contract). This forces the realized row to be posted before the remap.
7. Realized row before remap; commit errors surfaced; stale blob sha 409s on the second edit of a file.
8. Worker deploys serve stale code for about 20 seconds after a 200 upload; KV serve converges in about 60 seconds. Verify late, verify bytes. (This belongs to deploys, owned by the steady-orbit-deploy skill, but it is listed in the round's lessons because a round may straddle a deploy.)
9. Draft PRs: GraphQL ready-for-review, not REST PATCH.

The pattern across all nine: every lesson is a specific, dated, measurable correction to a way the flow once broke. None is a style preference. This is the reproducibility discipline applied to the harness itself: the runflow is a procedure that can be re-executed and its failures re-observed (https://en.wikipedia.org/wiki/Reproducibility, weight 0.52), and the lessons are the diff history of that procedure.

## Worked example: a change unit (refs7 cycle 1)

Baseline level 14.1707. The change was a pre-registered revert of a merged edit. The hysteresis re-score returned the row to baseline. The audit read 14.5626, a realized delta of +0.3919, bearing aligned. The taskcheck was exempt because a revert restores an already-checked state. Commit, realized row, remap. One keep, one PR (source doc).

## Worked example: an add unit (refs9)

Baseline 12.9517. A rung proposed `add:s3`, which joins two isolates. The operator authored `refs/adjacent-problems-corpus-rsi-2026-10-03.md` into the rung's exemplar family. The add-check ran the C5/C6 subset. Pre-registration predicted -2 geometric. The scorer row carried twelve zeros plus adjacent and failure bits. The audit read +1.0092. Commit, remap to map id 558 (source doc). This example shows the full candidate-to-keep arc of a rung join: the structure proposed, the content filters shaped, the gate decided.

## Worked example: a revert unit (refs7 cycles 2 and 3)

Re-applications of prior-round revisions. Hysteresis re-scores. Audit read level-negative. No commit. Realized rows carried `reverted` verdicts. The finding recorded: the prior z readings had been nulls=100 noise, which is exactly the refs7 F2 lesson above (source doc). A revert unit is a valid round: it removes an error and records why.

## The six guidelines

From the source doc (quoted in substance):

1. Read AGENT.md first; stop if unreachable.
2. One atomic change per round. If no instrument-proposed candidate survives the content filters, record an honest abstention. Never author a padding change to satisfy a count.
3. The gate is level_dbc UP. Nothing else authorizes a keep.
4. Geometry proposes; the frozen task check disposes. A keep without a taskcheck pass is not shipped.
5. Every unit re-derives its frozen baseline; carry nothing across units except the round number and the lessons.
6. Selftest before trusting any engine result; fixtures are the truth.

Guideline 2 deserves emphasis because it defines what a round is for. The chain is not trying to maximize the number of keeps; it is trying to make only changes the instrument endorses. Bounded self-improvement, as a research concept, is precisely the constraint that a self-modifying process stops itself from unbounded or unverified changes (https://arxiv.org/abs/1312.6764, weight 0.55). The unit roundflow is that idea made operational: one change, one gate, one verdict, evidence at every step.

## What this record does not claim

This record does not restate the endpoint contracts (doc 03 and doc 08 cover them) and does not generalize the lessons to corpora other than refs/; the closed-class finding, for example, is scoped to refs/ by its own statement (source doc). The numbers in the worked examples are quoted from the source doc and carry its authority as the source of record; they are not independently re-measured by this corpus.

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); arXiv 1312.6764, Bounded Recursive Self-Improvement (http://arxiv.org/abs/1312.6764, weight 0.55); Wikipedia, Reproducibility (https://en.wikipedia.org/wiki/Reproducibility, weight 0.52).
