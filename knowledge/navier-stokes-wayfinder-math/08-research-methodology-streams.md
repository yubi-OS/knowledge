# Research methodology: independent streams, audited recommendations, and the rejected claim

Scope: the multi-stream research discipline used in the Navier-Stokes wayfinding research phase, how its recommendations were audited rather than accepted, the pre-registration requirement it left behind, and the accuracy claim that was rejected out of its own results.

## The four streams

The research phase ran 4 independent streams: primary-claim verification, formalization and Lean compatibility, numerical transfer, and PR 230 statistical reconciliation. The statistical stream was restarted after a container interruption, which is itself a resilience property worth keeping: a killed stream was rerun rather than backfilled from memory. The streams were kept independent so that no single stream's framing could silently set the others' conclusions (internal research record).

This structure matches the external methodological literature on verification and replication: independent verification is what makes a finding matter, and replication failure detection depends on verification being genuinely separate (Verification makes discovery matter, Science, https://www.science.org/doi/10.1126/science.aem6125, weight 0.75; Reproducibility of Scientific Results, Stanford Encyclopedia of Philosophy, https://plato.stanford.edu/entries/scientific-reproducibility, weight 0.78).

## Recommendations audited, not accepted

Stream recommendations were audited rather than accepted wholesale. The concrete catch: one margin experiment overstated its value by omitting the majority-class baseline. The audit recomputed the comparison and the experiment's claim collapsed against the always no-flip baseline (91.35% versus 91.475% at increment 0.2; 97.625% versus 97.775% at increment 0.05). That audit is recorded in margin-prototype-audit.json (internal research record).

The general lesson is documented in the bias-reduction literature: structural transparency requirements and pre-specified comparisons are what catch motivated reasoning, not intentions (Reducing bias, increasing transparency and calibrating confidence, Nature Human Behaviour, https://www.nature.com/articles/s41562-022-01497-2.pdf, weight 0.75). Confirmation bias operates exactly at the point where an agent evaluates its own prototype favorably (https://www.simplypsychology.org/confirmation-bias.html, weight 0.55). The preregistration revolution's core result is that prospective registration of comparisons changes what counts as evidence (The preregistration revolution, PNAS, https://www.pnas.org/doi/10.1073/pnas.1708274114, weight 0.86). Weaker sources concur (https://forrt.org/curated_resources/reducing-bias-increasing-transparency-an/, weak, weight 0.44; https://arxiv.org/pdf/2607.02931, weak, weight 0.42).

## The rejected accuracy claim

The rejected claim is part of the deliverable, not an embarrassment to hide. An unsigned `|m| < |ds|` flip-predictor prototype claimed 85 to 98% accuracy. Recomputation against the always no-flip baseline showed the baseline wins at both tested increments, and the shuffled control did not approach the claimed always-flip baseline. The prototype was excluded from the evidence supporting deployment, and the record says so explicitly. A research pipeline that discards its own rejected claims loses the calibration data those rejections provide.

## What is finished and what is not

Finished: pinned source audits, all 11 live map snapshots, exact graph replay of all 10 transitions, exhaustive graph checks, tested JS helpers with 10 passing selftests, and a small Lean draft. Not done: kernel compilation of the Lean draft, any new GitHub commit or CI dispatch, production deployment, or a new prospective edit benchmark. Nothing in the research establishes a higher forward-prediction score.

## The standing requirement

The pre-registered held-out comparison must pit proposed predictors against ordinary source inspection, the always-zero geometric prediction, and the existing synthetic-rung baseline, with ADD and CHANGE separated, sign and magnitude separated, neutral abstentions counted separately, and semantic regressions, infrastructure errors, and costs tracked. Only prospective outcome data can raise the forward-prediction score. This is the pre-registration discipline applied to an internal tool decision rather than a paper.

## Artifacts

`validate_map_math.py` plus `map-math-validation.json` (replay, exhaustive checks, perturbation tests), `wayfinder-equations.mjs` (10 passing selftests), `WayfinderBounds.lean` (uncompiled draft), `margin-prototype-audit.json` (the corrected majority-class comparison), `source-manifest.json` with PR metadata and maps 51 through 61. No GitHub or Cloudflare mutation was performed during the research turn.

## Sources considered

| source | weight |
|---|---|
| https://github.com/yubi-OS/yubiOS/pull/230 (internal research record) | record |
| https://www.pnas.org/doi/10.1073/pnas.1708274114 | 0.86 |
| https://plato.stanford.edu/entries/scientific-reproducibility | 0.78 |
| https://www.nature.com/articles/s41562-022-01497-2.pdf | 0.75 |
| https://www.science.org/doi/10.1126/science.aem6125 | 0.75 |
| https://www.simplypsychology.org/confirmation-bias.html | 0.55 |
| https://www.cnn.com/markets/premarkets | 0.52 (weak, off-topic) |
| https://pubmed.ncbi.nlm.nih.gov/10649002 | 0.49 |
| https://forrt.org/curated_resources/reducing-bias-increasing-transparency-an/ | 0.44 (weak) |
| https://arxiv.org/pdf/2607.02931 | 0.42 (weak) |
| https://sai.science/verification | 0.34 (weak) |
| http://www.orgonelab.org/ | 0.08 (weak, off-topic) |
| https://www.independent.co.uk/ | 0.06 (weak, off-topic) |
