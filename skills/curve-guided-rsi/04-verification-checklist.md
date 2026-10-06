# 04 - Verification checklist

Scope: the closed-loop verification contract: the gates the skill must pass at Stage 1 and Stage 5, the sparse-cell delta that constitutes the success metric, and the ten-item checklist a finished run must satisfy.

The skill's claim is that its edits actually close gaps, and the verification section is where that claim is held to evidence. The source doc enumerates the checklist explicitly, ten items, each of which is a gate rather than a suggestion (source doc: yubi-OS/yubiOS skills/curve-guided-rsi/SKILL.md).

## The ten checks

The checklist verbatim from the source doc:

1. N >= 20, the corpus size gate. Below 20 files the curve fit is unreliable and the run aborts and surfaces to the user (source doc, Red Flags).
2. PC1+PC2 >= 0.40 at Stage 1, the curve fit quality gate.
3. Holdout R2 > 0 at Stage 5, the curve generalization gate.
4. Sparse-cell count reported at Stage 1, pre-RSI.
5. Sparse-cell count reported at Stage 5, post-RSI.
6. The delta sparse-cell count documented, where negative means improvement.
7. Per-gap NSS focus scope confirmed, meaning the gap work was scoped to the candidate file, not the whole corpus.
8. Per-gap RSI cycle count <= 3.
9. Each per-gap changelog entry references the curve's t coordinate.
10. Curve cache persisted with v_canonical, the prior_* warm-start bundle, and Z at fit time.

## The gates behind the numbers

The 0.40 variance gate is a judgment about low-rank structure: principal component analysis reports an explained variance ratio per component, and cumulative ratios are the standard way to decide whether a small number of components captures a dataset's structure (https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html, jev weight 0.84). PCA's use as a low-rank approximation of a high-dimensional matrix is textbook material (https://en.wikipedia.org/wiki/Principal_component_analysis, jev weight 0.66; https://pmaicourses.github.io/Linear_Algebra_For_ML/lectures/lecture-08.pdf, jev weight 0.5, weak backing: course notes). The skill's 0.40 floor for the top 2 components encodes the same reasoning: if 2 components explain under 40 percent, the corpus does not have the 2-D structure the curve surface assumes.

The holdout R2 gate is a standard generalization check: evaluate the fitted surface on points held out of the fit and require positive predictive power before trusting the curve's geometry (https://sebastianraschka.com/pdf/lecture-notes/stat451fs20/09-eval2-ci__slides.pdf, jev weight 0.51). A negative holdout R2 would mean the fit generalizes worse than a mean predictor, which is exactly what the gate is designed to catch.

## The success metric

The Stage 5 comparison is the skill's headline claim operationalized: after RSI cycles, the curve's sparse cells become less sparse (or migrate to lower-frequency regions) as gaps close. The comparison is sparse_cell_count_post versus sparse_cell_count_pre. A decrease logs "curve moved, gaps closed"; equality logs "curve did not move", and the doc instructs investigating by reading the gap candidate's changelog entries, since either the corpus had no real gaps or the RSI edits did not address the actual ones (source doc, Stage 5).

The skill's own history shows the metric firing: the cycle-5 run on the expanded 69-skill corpus reported fit coordinate (u=0.824, v=0.719) with PC1+PC2 = 0.4615 and holdout R2 = +0.2244, and the cycle-9 run on the 73-skill corpus closed 17 residual sparse cells and declared fixpoint (source doc, Changelog). The v3 evidence that the composed pipeline inherits, holdout R2 = +0.4655, is persisted on main in `learned-latent-curve`'s refs (source doc, Changelog).

## Red flags that gate the gates

The checklist interacts with the Red Flags section. PC1+PC2 < 0.40 at Stage 1 triggers a fallback to whole-corpus `negative-skill-space` dispatch, a degraded mode that still produces value but loses the curve-lens novelty (source doc). A re-fit that changes (u, v) for items that did not change indicates v_canonical sign-flip or PCA instability, checked per `learned-latent-curve`'s coordinate robustness section (source doc). Both conditions stop the run before an unverifiable claim can be written down.
