# 05 - Anti-patterns and red flags

Scope: the eight anti-patterns and six red flags the source doc pins down, what each one protects, and the fallbacks the doc prescribes when a gate fails.

The source doc lists the failure modes explicitly, in two lists: anti-patterns (things the operator should not do) and red flags (conditions that indicate the pipeline itself is unhealthy) (source doc: yubi-OS/yubiOS skills/curve-guided-rsi/SKILL.md). They are the operational half of the verification contract in doc 04.

## The eight anti-patterns

1. Whole-corpus NSS dispatch. Running the negative-skill-space sweep over every file defeats the curve-lens prioritization and reverts the skill to unguided gap-mapping (source doc).
2. RSI without NSS first. The gap list must come from NSS; running RSI without it produces blind edits (source doc).
3. Sparse-cell threshold r < 0.01. Too few cells become sparse; the gap list is too long (source doc).
4. Sparse-cell threshold r > 0.20. Too many cells merge; the gap list loses granularity (source doc).
5. Re-fitting the curve mid-run. This invalidates the sparse-cell snapshot; only re-fit at Stage 5 (source doc).
6. Skipping Stage 5 verification. Without it, the claim "the curve moved" is ungrounded (source doc).
7. Auto-applying RSI edits to main directly. Per PROJECT_RULES.md, RSI edits produce pull requests for review (source doc).
8. Top-N above 20 gaps per run. Compute blows up and the curve's prioritization signal gets diluted (source doc).

The pattern behind the list is consistent: each anti-pattern removes one of the two properties the skill exists for, either the curve-guided prioritization (items 1, 3, 4, 5, 8) or the verifiability of the loop (items 6, 7). Structured catalogues of ML pipeline anti-patterns make the same argument in general form: known failure patterns recur and are best handled by naming them and checking for them (https://www.cell.com/patterns/fulltext/S2666-3899(24)00188-0, jev weight 0.66). The MLOps anti-pattern literature reaches the same conclusion from the operations side (https://arxiv.org/pdf/2107.00079.pdf, jev weight 0.49, weak backing: below the 0.5 line, cite with caution).

## The six red flags

1. PC1+PC2 < 0.40 at Stage 1. The corpus lacks a structured low-rank basis. Fallback: switch to whole-corpus `negative-skill-space` dispatch, a degraded mode that still produces value but loses the curve-lens novelty (source doc).
2. sparse_cell_count_post equals sparse_cell_count_pre at Stage 5. Either the corpus had no real gaps or the RSI edits did not address the actual gaps. Investigate by reading the gap candidate's changelog entries (source doc).
3. RSI cycle count exceeded 3 per gap. The gap is too deep for this skill; surface to the user for a manual decision (source doc).
4. N < 20 corpus size. The curve fit is unreliable; abort and surface to the user (source doc).
5. r = 0.0 or r > 1.0. Invalid input; abort and report (source doc).
6. Re-fit produces different (u, v) for items that did not change. This is v_canonical sign-flip or PCA instability; check per `learned-latent-curve`'s coordinate robustness section on PC1 sign-flip protection (source doc).

The sign-flip flag is grounded in a real mathematical property: eigenvectors and singular vectors are defined only up to sign, so two fits of the same data can disagree by a global sign flip unless a canonical sign convention is enforced (https://www.researchgate.net/publication/227677444_Resolving_the_sign_ambiguity_in_the_singular_value_decomposition, jev weight 0.41, weak backing: paywalled venue metadata). Practitioner tooling documents the same issue and its fixes (https://www.mathworks.com/matlabcentral/fileexchange/22118-sign-correction-in-svd-and-pca, jev weight 0.43, weak backing; https://machinelearningmastery.com/introduction-to-eigendecomposition-eigenvalues-and-eigenvectors/, jev weight 0.43, weak backing).

## How the two lists interact

The anti-patterns are operator-side prohibitions; the red flags are runtime detections with prescribed responses (fallback, investigate, surface to user, abort). Only two red flags have an in-place recovery: the low-variance fallback to whole-corpus NSS, and the sign-flip check. Everything else halts the run. That asymmetry is deliberate: the metric-critical states are not something the pipeline can talk itself out of, because talking past a failed verification is precisely the failure mode item 6 in the anti-pattern list forbids.
