# 03: Warm start and the re-fit lifecycle

Scope: re-fit cadence, drift signals, warm-start kwargs with t-range rescaling, the t-pipeline persistence list, and the rollback protocol that keeps cross-corpus re-fits faithful.

## The lifecycle section exists because a gap forced it

The source doc's Changelog records that the Lifecycle section (drift signals, re-fit cadence, t-pipeline versioning, rollback protocol) was added in cycle 3 to close the highest-ranked carryover gap, operationally motivated by the github-yubios corpus growing past roughly 80 files. Cycle 3 was net negative (+30 L times S): the section existed but was under-specified, generating 4 edit-induced gaps (F, G, H, I). Cycle 5 closed them with a 4-entry Edge cases subsection. The documented lesson, quoted from the source doc: "section presence does not equal section completeness; every operational claim needs WHEN, HOW, and edge-case handling."

## The re-fit trigger and its reconciliation rule

The source doc's drift machinery defines when a re-fit is due. Cycle 5's reconciliation rule resolves the cycle-3 tension (gap F) between the re-fit cadence and the red-flag triggers: the trigger fires on at least 25 percent corpus growth, and the recorded Phase H audit-only entry shows the rule in use, with a multi-seed fit on the enriched 73-skill corpus holding K_kept=2, below the 25 percent re-fit trigger. Drift signal recomputation has its own cadence rule from gap I (the source doc says the signals are recomputed on held-out items; the Edge cases entry specifies when). Drift signal 5 is ridge residual drift above 2x the fit-time baseline.

## Warm start: the kwargs and the rescaling invariant

The PyTorch skeleton's constructor evolved over cycles 9 and 10. Cycle 9 extended the signature from (out_dim=384, k=8, t_max=1.0, target_mean=None) to also accept prior_f=None, prior_coefs=None, prior_bias=None, with the cold-start path preserved as the default when the kwargs are None. Cycle 10 added prior_t_max=1.0 and the rescaling line inside the prior_f branch: f_t = prior_f * (prior_t_max / t_max). Without the rescaling, the source doc records, warm start silently degrades to cold start for frequencies on any cross-corpus re-fit where the t range differs from the prior's, breaking drift signal 5 and the rollback protocol's byte-for-byte reproducibility.

The general pattern is standard practice: scikit-learn's developer docs define warm_start=True as reusing "the previous state of the trainable parameters of the estimator... instead of using the default initialization strategy" (https://scikit-learn.org/stable/developers/develop.html, weak backing, jev weight 0.43), and community discussion of the parameter notes its use for fitting on closely related data rather than starting over (https://stackoverflow.com/questions/42757892/how-to-use-warm-start, weak backing, jev weight 0.09). The variant's contribution is the invariant that makes warm start safe across corpora: priors must be rescaled into the new coordinate range at init time, and a prior_t_max default of 1.0 makes the rescaling a no-op in the common case.

## The persistence list

Cycle 12 extended the t-pipeline versioning persistence list to: the scaler, the PCA loadings, the rank map, the canonical sign vector v_canonical, the full warm-start bundle (prior_f, prior_coefs, prior_bias, prior_t_max), and the target matrix Z at fit time plus its closed-form ridge residual baseline so drift signal 5 is computable after a re-fit. The rollback protocol's persistence list mirrors it. This closes gaps Z and U2, whose shared root cause the source doc names directly: "the persistence list was not updated when new sections were added in cycles 3-10."

## Rollback protocol

The source doc's rollback requirement is byte-for-byte reproducibility: a rollback must restore a state that reproduces the prior fit exactly, which is only possible if every input to the fit (including the warm-start bundle and the fit-time baseline) was persisted. The t-pipeline migration question (gap H, 3 options with defaults in the Edge cases entry) covers what happens when the pipeline itself changes version rather than just the data.

External drift-detection practice corroborates the shape of the design: Evidently's docs describe distribution-drift tests on individual columns with configurable thresholds and methods including PSI, K-L divergence, Jensen-Shannon distance, and Wasserstein distance (https://docs.evidentlyai.com/metrics/preset_data_drift, weak backing, jev weight 0.27; https://docs.evidentlyai.com/metrics/explainer_drift, weak backing, jev weight 0.30). The variant's ridge-residual drift signal is a single-model analogue: one residual, one baseline, one 2x threshold.
