# 03. The 1-D Curve Fits: v1 Failure and v2 First Pass

**Scope:** The two 1-D learned-latent-curve fits on the yubiOS corpus: v1 on raw skill content (holdout R-squared -0.155, fail) and v2 on the primitive coverage basis (holdout R-squared +0.183, first pass), with the sanity checks and holdout gates each had to clear.

## Fit mechanics shared by both versions

Both 1-D fits use the same curve machinery: a 1-D curve with k=4 basis functions fitted by least squares. The Fourier-basis least squares approach has standard textbook backing: fitting a truncated Fourier series to data is an ordinary linear least squares problem in the basis coefficients (https://jsteinhardt.stat.berkeley.edu/blog/least-squares-and-fourier-analysis, jev weight 0.587; https://web.engr.oregonstate.edu/~webbky/ESC440_files/Section%207%20Fourier%20Analysis.pdf, jev weight 0.728), and the MATLAB Curve Fitting Toolbox documents the same library-style Fourier series fit (https://www.mathworks.com/help/curvefit/fourier.html, jev weight 0.837). ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted)

## v1: raw content, honest failure

v1 loaded the 62 github-yubios SKILL.md files, built a co-occurrence matrix (window 5, weights 1/distance) over a 1,623-word vocabulary, ran SVD to rank 60, weighted singular values by sqrt(S_r), mean-pooled per document, L2-normalized, and lifted to 384-D via seeded QR. t was PC1 of that 384-D content embedding.

The sanity checks passed: cos(docker-build-push-action, docker-bake-action) = 0.974 against a target near 0.97, and cos(github-actions, linkedin-browser-outreach) = 0.403 against a target near 0.44. The holdout test (6 of 62 skills held out, refit on 56) also passed the MSE gate at 1.33x, inside the 2x limit. But holdout R-squared was -0.155: the curve fit unseen points worse than predicting the mean. PC1 explained only 0.257 of variance. ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source)

The diagnosis: raw skill content is multi-dimensional, spanning CI, security, dev-process, and architecture axes, so a single content-PC1 coordinate smears the structure. The mechanism was sound; the target was not.

## v2: coverage as the basis

v2 changed the basis, not the curve. It parsed the 10 primitive names into keyword dictionaries, built the 9-D binary coverage matrix for 213 artifacts (62 skills, 92 refs, 26 workflows, 33 ADRs), dropped the saturated self-describing column, took t as PC1 of coverage, and lifted to 384-D via a seeded QR projection of the 9-D coverage.

It tried 3 t-pipeline variants. Variant A (binary, self-describing dropped) was the only one that passed the holdout gate without overfitting. Variants B and C (graded coverage) "passed" the PC1 heuristic and then catastrophically overfit at holdout R-squared -2.4.

On variant A with a 21/213 holdout (9.9%): holdout MSE over train MSE = 1.05x, holdout R-squared = +0.183, mean holdout cosine = 0.794. PC1 was 0.243, technically a NO-GO on the 0.40 heuristic, but the holdout R-squared > 0 gate, which the skill treats as the real test, passed. ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source)

## The holdout discipline

Both versions evaluate on held-out artifacts, never on training data. This is the standard holdout discipline: split the data, fit on one part, evaluate generalization on the other (https://developers.google.com/meridian/docs/advanced-modeling/holdout-observations, jev weight 0.911; https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html, jev weight 0.916; https://towardsdatascience.com/train-test-split-and-cross-validation-in-python-80b61beca4b6, jev weight 0.618). The v1 result shows why the holdout gate earns its authority: every other metric (sanity cosines, MSE ratio) looked acceptable while the fit was actually worse than a constant predictor.

## Weak-source notes

Low-weight dig results in this subtopic back no load-bearing claim: a Computational Science Stack Exchange thread (jev weight 0.055), a Wikipedia Fourier transform page (jev weight 0.109), a GeeksforGeeks holdout page (jev weight 0.314), and one spam result from an unrelated domain (jev weight 0.020), recorded in the archive only as evidence of query drift.
