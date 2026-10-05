# 09. Metric Gates and Anti-Patterns the Fit Validated

**Scope:** The metric gates and anti-patterns that the v1 through v4 chain put to the test: the PC1 >= 0.40 heuristic versus the holdout R-squared > 0 ground truth, the overfitting graded-coverage variants, and the fixed-basis-fit-sold-as-learned anti-pattern.

## The two gates

The learned-latent-curve skill defines 2 gates ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted):

- A heuristic: PC1 explained variance >= 0.40, listed under When NOT to Use.
- Ground truth: holdout R-squared > 0, listed under Verification.

The 4-version chain separates them cleanly. v1: PC1 = 0.257, holdout R-squared -0.155, both gates fail. v2: PC1 = 0.243, holdout R-squared +0.183, heuristic fails, ground truth passes. v3: PC1 = 0.2258, PC1+PC2 = 0.4036, holdout R-squared +0.4655, both pass when read as a 2-D structure per the skill's 2-D alternative. v4: PC1 = 0.0955, holdout R-squared at best +0.1301, both fail. The flow doc's conclusion: the holdout gate is the ground truth and the PC1 gate is a heuristic, because v2 is a live counterexample of a fit that generalized while failing the heuristic.

## Why holdout R-squared is the ground truth

A holdout evaluation fits on one split and scores on data the fit never saw, which is the only direct measurement of generalization (https://developers.google.com/meridian/docs/advanced-modeling/holdout-observations, jev weight 0.911; https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html, jev weight 0.916; https://towardsdatascience.com/train-test-split-and-cross-validation-in-python-80b61beca4b6, jev weight 0.618). R-squared near 0 means the model predicts about as well as the mean, and below 0 means worse than the mean, which is what v1's -0.155 was. The v1 episode is the case study for why in-sample-adjacent metrics mislead: its sanity cosines matched the skill's worked example and its MSE ratio was inside the 2x gate, yet the fit was worse than a constant predictor on unseen points.

## The overfitting anti-pattern: variants B and C

In v2, the graded-coverage variants B and C "passed" the PC1 heuristic and then catastrophically overfit, with holdout R-squared of -2.4, meaning the fitted curve was more than twice as bad as predicting the mean on held-out artifacts. The flow doc records this as a textbook example of the skill's anti-pattern: a metric that goes green while generalization collapses ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). Overfitting references describe the general mechanism of a model fitting noise and failing on new data (https://www.ibm.com/think/topics/overfitting, jev weight 0.752; https://aws.amazon.com/what-is/overfitting/, jev weight 0.449, weak backing).

## The fixed-basis anti-pattern, validated honestly

The v3 gradient refinement is the documented honest treatment of the fixed-basis anti-pattern. Over 500 epochs the frequencies moved by at most 0.001; the R-squared improvement from 0.4164 to 0.4655 came from the coefficient matrix polish. The flow doc says so explicitly rather than crediting the gradient step with learning, which is exactly the honesty the anti-pattern entry demands ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). The practical reading: closed-form ridge at fixed log-spaced frequencies was the actual fitting mechanism.

## What the v3 fit validated in the skill

The flow doc closes with the list of skill sections the v3 fit validates: the When NOT to Use PC1 >= 0.40 heuristic (passed as 2-D by v3, failed decisively by v4 with PC1 = 0.0955); the fixed-basis anti-pattern (validated by the gradient finding); the Verification holdout R-squared > 0 gate (hit at +0.4655, mean holdout cosine 0.858); the Target Space low-rank pipeline (v3's effective rank near 9 is the correct target, v4's near 211 is the wrong one); and the Lifecycle t-pipeline versioning (the overrides, filtering, and PC1+PC2 pipeline artifacts) ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

## Weak-source notes

Low-weight dig results here back no load-bearing claim: GeeksforGeeks pages on overfitting, bias-variance, and cross-validation (jev weights 0.152, 0.473, 0.155), two completely off-topic government results (jev weights 0.789 and 0.618), and a holdout-method blog (jev weight 0.097).
