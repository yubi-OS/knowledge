# 01: Recovery fraction collapse under a deterministic scorer

Scope: why a deterministic grader drives the recovery fraction R to a constant 1.0 in the viscoelastic replay, and what a metric that cannot vary can and cannot tell you.

## The F3 finding

The corpus-audit replay of the linear viscoelasticity corpus (knowledge/linear-viscoelasticity/08-creep-recovery-replay.md) produced finding F3: a deterministic scorer collapses the recovery fraction R to exactly 1.0 (source: yubiOS refs decision doc "Rate-dependent scorer decision", 2026-10-02, internal). The same replay measured persistence at 9 out of 9 rows under blind re-grading, so the persistence instrument itself worked; it was R that carried no information. The jev decision record attached to the replay weighted persistence beats R at 0.92.

## Why determinism collapses the metric

A deterministic measurement of an unchanged quantity returns the same value on every repetition. In statistical terms such a measurement is a degenerate distribution whose support is a single point, the distribution of a deterministic random variable equal to that value with probability 1 (source: https://en.wikipedia.org/wiki/Degenerate_distribution, jev weight 0.381, weak backing, labeled as such). A rate-dependent metric needs the instrument's answer to depend on the rate of change it observes. A constant has no rate dimension: R measured at 1.0 forever is not a measurement of recovery, it is a measurement of the protocol design.

The replay made this concrete. The scorer was re-run over the same loaded text and reproduced identical grades, so every "recovered" flip was counted as recovered with certainty. Nothing in the single-pass deterministic path can distinguish a flip that is plastically real from a flip that sits inside grader noise, because the path produces no noise to sit inside.

## Determinism in LLM graders is itself partial

The determinism that collapsed R is a protocol convention, not a physical guarantee. A 2026 study of LLM-as-judge safety evaluations found that setting the grader's sampling temperature to 0 is necessary but not sufficient for reproducibility: significant non-determinism persists from unaddressed factors in the model's operation and infrastructure (source: https://arxiv.org/abs/2606.26185, jev weight 0.697; full text https://arxiv.org/html/2606.26185v1, jev weight 0.914). A practitioner write-up reaches the same conclusion: temperature 0 eliminates user-controlled sampling randomness, not all sources of variation, so an eval reproducibility gate should check distribution stability rather than exact score equality (source: https://delta.engineer/archive/2026-06-24-llm-judge-temp0-not-deterministic/, jev weight 0.697).

This matters for the collapse finding in two directions. First, the single-pass protocol is deterministic by discipline (pinned scorer, fixed temperature, fixed prompt), and the replay confirmed it empirically at 1.0. Second, the residual infrastructure-level variation documented in the arXiv study is exactly the kind of noise a multi-pass protocol surfaces instead of suppressing: if passes disagree, the disagreement is the rate dimension.

LLM judge components are now standard in evaluation harnesses, including safety evaluations where a pass or fail verdict gates downstream deployment decisions (source: https://arxiv.org/abs/2606.26185, jev weight 0.697), so the instrument design question applies wherever a grader gates an outcome.

## What a constant metric cannot tell you

The corpus audit wanted R to answer: of the credit a flip receives, how much is elastic (reverts) versus plastic (persists)? With one deterministic pass the answer is forced. There is no second pass to revert from, so R is 1.0 by construction, not by physics. The elastic or plastic distinction has to live somewhere else: either inside the persistence measurement alone (the status quo option, doc 06) or inside a widened measurement protocol that re-grades each edited row with multiple independent passes (the adopted option, doc 03).

The generic term for this failure mode is a degenerate measurement: the metric's support has collapsed to a single value, so changes in the world cannot move it (source: https://en.wikipedia.org/wiki/Degenerate_distribution, jev weight 0.381, weak backing). The remedy is not a better point estimate but a wider instrument, which is the through-line to docs 03 and 04.
