# 05: Pre-fit validation

Scope: the 7 pre-fit data pathology checks that run before the curve fit, catching the failure modes the post-fit red flags cannot catch.

## Why the checks are pre-fit

The source doc is explicit about the ordering: the 7 checks are "prerequisites (not diagnostics); they catch the failure modes that the existing Red Flags only catch post-fit." A curve fit on garbage inputs does not just fail, it fails expensively and confusingly; the pre-fit section exists to make the failure cheap and legible. The checks were added in cycle 4 to close the failure-modes gap (axis 7, L3xS4=12, with S4 the highest severity), and the cycle closed 6 of 8 axis-7 sub-gaps for a net LxS delta of -76, the best cycle in the source doc's log.

## The 7 checks

As listed in the source doc:

1. NaN or inf values in Z (the target matrix).
2. NaN or inf values in t (the 1-D coordinate).
3. Duplicate t values, which make the design matrix singular.
4. Z and t shape mismatch.
5. Frequencies sitting at the softplus floor.
6. Target feature scaling sanity.
7. All-constant feature columns.

Two residual gaps from that cycle are informative: gap J (the skill excludes monotone data under When NOT to Use, but no pre-fit check catches monotonicity), and gap L (the check instruction says "add the assertion at the call site" without naming which file). Gap K is the action-versus-signal asymmetry: the anti-patterns list did not say "fit without running the pre-fit checks."

## What the checks map to in standard tooling

The checks are instances of standard pre-training data validation. TensorFlow Data Validation is the reference pattern: it identifies anomalies "by comparing data statistics against a schema," where the schema codifies expected data types, ranges, and categorical values (https://www.tensorflow.org/tfx/guide/tfdv, weak backing, jev weight 0.27), and its anomaly reference enumerates checks for missing features, out-of-range values, and wrong feature types (https://www.tensorflow.org/tfx/data_validation/anomalies, weak backing, jev weight 0.31; https://github.com/tensorflow/data-validation, weak backing, jev weight 0.28). The variant's checks play the same role for a much smaller matrix: Z and t are the whole universe, so the "schema" is 7 assertions.

## The singular design matrix check is a rank condition

Check 3 (duplicate t) is a rank-deficiency test: duplicate coordinates make the design matrix singular, so the least-squares system has no unique solution. The linear algebra background: a rank-deficient matrix is singular when square, with no inverse (https://knowledge.deck.no/mathematics/linear-algebra/rank-of-a-matrix/rank-deficiency, weak backing, jev weight 0.24), and LAPACK-level solvers compute minimum-norm solutions for rank-deficient least-squares problems rather than failing loudly (http://www.mathematik.uni-ulm.de/~lehn/FLENS/flens/examples/lapack-gelsy.html, weak backing, jev weight 0.22). That silent-minimum-norm behavior is exactly why the check must be explicit: the fit would otherwise proceed and produce a plausible-looking but non-unique curve.

The reference solvers document the regime the checks guard: numpy.linalg.lstsq returns "the least-squares solution to a linear matrix equation" for under-, well-, or over-determined systems (https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html, authoritative backing, jev weight 0.51), and scipy.linalg.lstsq demonstrates fitting a polynomial by first forming the design matrix with a constant column (https://docs.scipy.org/doc/scipy/reference/generated/scipy.linalg.lstsq.html, authoritative backing, jev weight 0.56). The variant's all-constant-column check (check 7) is the degenerate case of that construction: a constant column in Z contributes no information and, combined with an intercept, produces rank deficiency.

## Scale and floor checks

Check 5 (frequencies at the softplus floor) and check 6 (target feature scaling) are domain-specific to the learned-latent fit. The softplus mapping keeps fitted frequencies positive by construction (doc 04 covers the prior wording sharpened in cycle 7); a frequency pinned at the floor means the optimizer drove raw_freqs toward negative infinity, usually a symptom of mis-scaled targets rather than a real frequency of 0. Check 6 catches the mis-scaling before the fit burns cycles on it. Feature-scaling background: scaling normalizes the range of independent variables during preprocessing (https://handwiki.org/wiki/Feature_scaling, weak backing, jev weight 0.17).
