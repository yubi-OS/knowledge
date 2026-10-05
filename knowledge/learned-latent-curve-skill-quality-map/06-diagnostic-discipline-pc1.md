# 06 - Diagnostic discipline: the PC1 red flag, model failure versus target failure

Scope: what a failing metric actually implicates, the corrected interpretation of the PC1-below-40-percent rule, and the ablation matrix experiment that settled it.

## The false prescription

The application's first run failed: holdout R2 negative at every K, LOO cosine averaging -0.10. The skill's existing red flag, PC1 of the quality-feature matrix below 40 percent (it was 23.4 percent), fired. The natural reading of that flag is: the data has no dominant 1-D axis, so the 1-D curve is the wrong model; fit a 2-D surface instead.

That reading was tested and it was wrong. A 2-D Fourier surface on PC1 + PC2 with the same noisy targets scored holdout R2 = -0.962, worse than the 1-D fit it was meant to replace. More parameters on the same noisy targets mean more ways to memorize noise.

The matrix experiment that settled it crossed target pipeline and curve dimensionality on the same 62 skills and the same 8-item holdout:

| Variant | targets | curve | holdout R2 | status |
|---|---|---|---|---|
| original | TF-IDF | 1-D | -0.139 | fail |
| V3 | TF-IDF | 2-D | -0.962 | fail, worse |
| V7 | co-occurrence SVD | 1-D | +0.144 | pass |
| V3+V7 | co-occurrence SVD | 2-D | +0.036 | pass, weaker |

V7 alone was the clear winner, and even with good targets the 2-D surface did not help (adding a second coordinate over-constrains the basis without adding semantic information).

## The corrected rule

PC1 below 40 percent is a red flag about the target pipeline, not necessarily about the curve's intrinsic dimensionality. When a fit fails and a variance diagnostic fires, the failure has two candidate causes: the model class is wrong for the data's true dimensionality, or the targets the model is fit against are noise. The first candidate prescribes a richer model; the second prescribes rebuilding features. Only an ablation that varies one layer while holding the other fixed can tell them apart [0.686, strong].

The general machine-learning failure literature makes the same point structurally: predictive performance depends on complex interactions between dataset characteristics and configuration choices, so root-cause analysis needs a framework that explains failures and estimates repair impact rather than rerunning blindly [0.867, strong]. Failure analysis should distinguish failure causes systematically before choosing remedies [0.862, strong], and ablation studies are the standard controlled instrument, changing one component while holding the rest fixed [0.686, strong].

## Interpreting explained variance correctly

The variance explained by a first component is dataset-dependent, and the share falls mechanically as ambient dimensionality grows [0.073, weak]. The first principal component is by definition the linear combination explaining the most variance [0.812, strong], so a low PC1 tells you no single dominant axis exists; it does not by itself tell you which pipeline layer to change. In this corpus PC1 + PC2 was 40.3 percent, the 1-D curve on good targets generalized, and the residual outlier structure was consistent with intrinsic dimensionality at most 2.

## The checklist consequence

The practical discipline, in order: (1) sense-check targets with pairwise cosines on known-similar and known-distant pairs; (2) if targets are noise, rebuild the target layer before touching model dimensionality; (3) if targets are good and holdout still fails, then and only then escalate model capacity (1-D to 2-D); (4) record holdout R2 at or below zero as the primary tripwire.
