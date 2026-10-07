# Realized row, then remap, then rollups

Scope: step 12 and step 13 of the runflow. The supersedes contract, the ordering that makes it work, the visco rollups, the round record, and the draft PR with its GraphQL merge path.

## Step 12: realized row BEFORE remap, in that order

The realized row is posted first: `POST /api/outcomes {..., observed_delta: <level delta>, task_check: {verdict: 'kept'|'reverted'|'neutral'|'declined', ...}, supersedes: <pre-registration id>}` (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md). Only then is the map re-frozen with `POST /api/map {texts, names, labels, baseline_id}` for the next unit (source doc).

The order is not stylistic. It is forced by the supersedes contract: the superseding row MUST share `baseline_id` AND `target` with the row it supersedes, and pre-rows carry the map id current at their creation (source doc). Since a keep's remap advances the map id, posting the realized row after the remap would attach it to a `baseline_id` the pre-registration never had, and the ledger would reject or misplace it. The rule "realized row before remap" is therefore a data-integrity constraint, listed in the failure lessons precisely because a round once got it backwards.

The supersedes pattern is worth stating plainly: the realized row supersedes the pre-registration row, carries the same `baseline_id` and the same `target`, and adds the `observed_delta` and the final `task_check` verdict (one of kept, reverted, neutral, declined) (source doc). The ledger thus holds both the promise and the outcome as linked rows, which is what makes the chain auditable at the round level.

## Step 13: rollups

Three GETs close the loop (source doc):

1. `GET /api/jev/corpus/visco/hysteresis?baseline_id=<pre-row map id>`: the supersedes-chain rollup.
2. `GET /api/jev/corpus/visco/prony?metric=dbc&arms=2`.
3. `GET /api/jev/corpus/visco/mobility`: the lens snapshot from step 3 just added a point.

The vocabulary is borrowed from viscoelastic material modeling, and the borrowing is deliberate naming rather than borrowed math. A viscoelastic material's response is characterized by a Prony series: a sum of exponential relaxation terms fitted to measured behavior (https://www.scielo.br/j/lajss/a/JYnGg6LdhHhmq8cRG7Jdwjd/?lang=en, weight 0.66; https://ansyshelp.ansys.com/public/////////Views/Secured/corp/v242/en/ans_mat/evis.html, weight 0.79; Prony's method fits sums of exponentials, https://en.m.wikipedia.org/wiki/Prony%27s_method, weight 0.48, weak). The chain's `/visco/prony` route fits a relaxation-style model to the gate statistic series; `mobility` tracks how much the corpus geometry moves per unit, a saturation-series measurement; `hysteresis` rolls up the supersedes chain. The names indicate what kind of series each endpoint models; the flow's actual contract is just "call the three rollups with the ids shown".

## The round record

The round writes `refs/jev-corpus-rsi-refsN-YYYY-MM-DD.md` containing the setup, the one change, findings, ledger ids, and a repro log pointer, commits it on the branch, and opens the DRAFT PR (source doc). Separately, every endpoint call is documented with ids in a steps log (`steps-refsN-<date>.log`), and the repro log is part of the deliverable (source doc). Reproducibility is the standard: a measurement procedure is reproducible when an independent party can re-execute it and reach the same result (https://en.wikipedia.org/wiki/Reproducibility, weight 0.52; https://dictionary.cambridge.org/dictionary/english/reproducible, weight 0.63). The record plus the steps log are what make a round reproducible rather than merely done.

## The draft PR and its merge path

The PR opens as a draft and is held for review; Jenny merges (source doc). When a merge is directed, the un-drafting must go through GraphQL `markPullRequestReadyForReview` with the PR's `node_id`, because REST `PATCH {draft:false}` does NOT clear a draft; the merge itself is then `PUT /pulls/:n/merge {merge_method:'squash'}` (source doc). This is recorded in the failure lessons because the REST PATCH silently appears to work while leaving the PR in draft state, which blocks the merge without an obvious error.

## What this record does not claim

This record does not claim that the visco endpoints implement the mathematical Prony series or a physical snapback model; it states only the endpoint contracts and the borrowed naming, both from the source doc. It also does not describe the remap's internal geometry parameters (doc 03 covers the frozen frame family).

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); SciELO, Viscoelastic Relaxation Modulus Characterization Using Prony Series (https://www.scielo.br/j/lajss/a/JYnGg6LdhHhmq8cRG7Jdwjd/?lang=en, weight 0.66); Ansys, viscoelasticity documentation (https://ansyshelp.ansys.com/public/////////Views/Secured/corp/v242/en/ans_mat/evis.html, weight 0.79); Wikipedia, Prony's method (https://en.m.wikipedia.org/wiki/Prony%27s_method, weight 0.48, weak); Wikipedia, Reproducibility (https://en.wikipedia.org/wiki/Reproducibility, weight 0.52); Cambridge Dictionary, reproducible (https://dictionary.cambridge.org/dictionary/english/reproducible, weight 0.63).
