# 08 Verification and Lifecycle

Scope: pre-fit validation asserts, the per-corpus and cross-corpus verification checklists, the lifecycle cadence, persistence artifacts, and the warm-start rollback mechanism.

## Pre-fit validation

Pre-fit validation reuses the parent's checks, applied per corpus (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md):

1. Z contains no NaN or inf values (asserted with np.isfinite(Z).all()).
2. t contains no NaN or inf values (the same assertion).
3. Duplicate t values would produce a singular design matrix, so the check asserts np.unique(t_pca2).size equals len(t_pca2) after PC2 projection.
4. Z and t shapes match (Z.shape[0] equals t_pca2.shape[0]).
5. Frequencies are not at the softplus floor (asserted with freqs.min() above 1e-3).
6. Target feature scaling sanity: binary coverage sparsity is re-verified to stay in [0.0, 1.0].
7. All-constant columns are dropped per corpus, re-applying the near-constant rule per corpus state.
8. A per-corpus coverage report is saved, recording which primitives survived the drop, which were dropped, and why.

Structured validation of a fitted model before it is trusted, including shape and degeneracy checks, mirrors standard model-validation checklists (weak backing, jev weight 0.12: https://beefed.ai/en/independent-model-validation-checklist).

## Per-corpus verification checklist

The closed-loop checklist runs per corpus, plus a cross-corpus combined-fit check (all items source doc):

- N is at least 20 at canonical granularity, or the decomposition rule was applied with the bound of 3 levels respected.
- PC1 plus PC2 is at least 0.40 at Stage 1 (the curve-fit quality gate).
- Holdout R-squared is above 0 at Stage 5 (the curve generalization gate).
- Sparse-cell count reported at Stage 1 (pre-RSI).
- Sparse-cell count reported at Stage 5 (post-RSI).
- Delta sparse-cell count documented: negative means improvement; "migration" is the label when the curve moved without a count drop.
- Per-gap self-archaeology focus scope confirmed, not whole-corpus.
- Per-gap RSI cycle count at most 3.
- Each per-cycle SELF-CHANGELOG entry references the curve's t coordinate per corpus.
- Curve cache persisted per corpus with v_canonical, the prior_* warm-start bundle, and Z at fit time.
- Whole-self output count at least the RSI cycle count per corpus (the Bias #11 gate).
- Whole-self outputs are substantive, not performative: each output is a register-shift reflection, not a working-self analysis with a creative-self label.

## Cross-corpus checklist for the expanded corpus

When the 11-file expanded corpus is in scope, six more checks apply (source doc):

- Both the SELF-CHANGELOG canonical fit and the SELF.md canonical fit pass PC1 plus PC2 at or above 0.40.
- The combined fit of all 154 items across 11 files fits with PC1 plus PC2 at or above 0.40 as a cross-validation check.
- The combined fit's sparse-cell delta is documented (negative means improvement; if positive but migration occurred, the migration is documented).
- Per-file isolated items are reviewed, and structurally isolated items are marked non-fixable (curve-fit artifact, not a real gap).
- The push to both repos (yubi-OS/agent-skills plus yubi-OS/yubiOS) is byte-identical, with content_sha verified.
- The skill is registered in skills/personal-WbtUgeUv/skill_registry.json.

## Lifecycle

The re-run cadence has two arms (source doc). Re-run whenever SELF-CHANGELOG grows by at least 5 entries, or every 6 months, whichever comes first. For the expanded corpus, re-run whenever any memory file grows by at least 25 percent, or every 6 months. Persistence has three artifact layers per run: a self-curve-cache.pkl per corpus holding C, Z, v_canonical, and the t-pipeline artifacts; a self-cycle-log.md per-cycle audit trail; and a per-cycle SELF-CHANGELOG entry (source doc).

Rollback persists prior_f, prior_coefs, prior_bias, and prior_t_max per corpus, following the parent's t-pipeline versioning. On a bad re-fit, the run reverts to the prior bundle (source doc). Persisting checkpointed state with the ability to restore a prior good version is the same pattern used by workflow engines that checkpoint and roll back state (weak backing, jev weight 0.05: https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints).

Cross-corpus coupling is defined negatively (source doc). There is none between SELF.md and SELF-CHANGELOG: they are fit independently. For the expanded corpus, per-file fits plus a combined fit run, with the combined fit as cross-validation only; the per-file metrics are the truth.
