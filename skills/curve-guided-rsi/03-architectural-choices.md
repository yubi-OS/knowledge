# 03 - Architectural choices

Scope: the parameter and design decisions the skill pins down: the sparse-cell threshold r, the top-N gap cap, the RSI cap, the re-fit cadence, the t coordinate as audit primary key, and the target space the curve is fit on.

curve-guided-rsi composes three existing skills but adds its own set of pinned choices, all listed under Architectural Choices in the source doc (source doc: yubi-OS/yubiOS skills/curve-guided-rsi/SKILL.md). These choices are what make the pipeline deterministic enough to audit.

## The sparse-cell threshold r

The sparse-cell threshold is set at r = 0.05, tuned on the v3 fit's neighbor distances, and exposed as a configurable parameter (source doc). The threshold bounds are load-bearing in both directions: below 0.01, too few cells become sparse and the gap list gets too long; above 0.20, too many cells merge and the gap list loses granularity (source doc, Anti-patterns). The value r = 0.0 or r > 1.0 is invalid input and the run aborts and reports it (source doc, Red Flags).

Threshold selection with an explicit tuning-and-sensitivity discipline is standard practice in machine learning systems; scikit-learn documents threshold tuning as a first-class configuration step with measurable tradeoffs rather than a fixed default (https://scikit-learn.org/stable/modules/classification_threshold.html, jev weight 0.87). The skill follows the same posture: the number is pinned, its provenance is named (the v3 fit's neighbor distances), and its sensitivity band is documented.

## Caps that bound compute and drift

Three caps shape the run. Top-N gap candidates are capped at 10 per run to bound compute, and larger corpora need multiple runs rather than a larger cap (source doc). The RSI cap is 3 cycles per gap per run, matching `recursive-self-improvement`'s soft cap with the user-override protocol preserved (source doc). The curve is re-fit after every run, following the re-fit cadence in `learned-latent-curve`'s Lifecycle section (source doc). Re-fitting mid-run is an anti-pattern because it invalidates the sparse-cell snapshot the run is working from; re-fit only at Stage 5 (source doc).

## The t coordinate as audit primary key

Every changelog entry in a gap candidate's SKILL.md records the t coordinate the file was at when the RSI cycle ran (source doc). This makes t the audit trail's primary key: downstream consumers can verify that the curve moved by inspecting the t history across changelog entries rather than re-deriving the fit. The doc states this as the persistence convention for the audit trail itself (source doc, Architectural Choices).

## Obtaining t and the target space

The t coordinates come from `learned-latent-curve`'s 1-D coordinate pipeline: PC1+PC2 of the 9-D binary coverage matrix by default (source doc). Rank-uniformization is deliberately not used here, because the sparse-cell detector operates on (u, v) coordinates rather than rank structure (source doc).

The target space Z is the v3 binary-coverage lift, re-used from `learned-latent-curve` v3. The doc is emphatic: do NOT swap in a sentence-transformer Z. The v4 NEGATIVE finding showed that high-rank semantic embeddings fail the curve's parameter budget, while the 9-D binary coverage lift has an effective rank of about 9 and is the correct target (source doc). This is the doc's most consequential empirical choice: it forbids the intuitive "use richer embeddings" upgrade and grounds the refusal in a recorded failed experiment rather than taste.

## Losses: none, by design

The doc includes a Losses section only to say none apply: the skill is a closed-loop pipeline, not a single-model fit, and the closest analog to a loss is the Stage 5 verification metric (sparse-cell-count delta plus holdout R2 plus PC1+PC2 variance), which acts as the audit signal (source doc). Reading the pipeline through a loss lens is a category error the doc closes off explicitly.

## Pre-fit validation

Before any fit, the pipeline re-uses `learned-latent-curve`'s pre-fit validation: Z and t must contain no NaN or inf values; duplicate t values after PC2 projection would make the design matrix singular and are asserted away; Z and t shapes must match; frequencies must not sit at the softplus floor (assert freqs.min() > 1e-3); binary coverage sparsity must stay in [0.0, 1.0]; and all-constant columns are dropped, the doc's own example being a self-describing column at 94% coverage (source doc, Pre-Fit Validation). These assertions are the reason the architectural choices can be trusted when the curve moves: a fit that passes them is fit on well-formed inputs.
