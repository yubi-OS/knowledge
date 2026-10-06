# 03 Five-Stage Pipeline

Scope: the retargeted 5-stage model, covering Stage 1 per-corpus curve fitting, Stage 2 sparse-cell detection, Stage 4 RSI cycles with the whole-self output requirement, and Stage 5 re-fit and per-corpus verification. Stage 3 dispatch has its own doc.

## Overview

The parent's 5 stages transfer to self-doc corpora; what changes is the granularity and the primitive basis (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md). The pipeline runs per corpus, where a corpus is SELF.md, SELF-CHANGELOG.md, or the expanded 11-file memory corpus. Each corpus is processed independently end to end.

## Stage 1: fit the curve per corpus

Stage 1 applies the granularity rule to produce the item list, then scores each item on the corpus's 9-D binary primitive basis, producing a coverage vector in {0,1}^9 per item (source doc). Near-constant columns are dropped: any primitive with coverage above 0.90 or below 0.10 is removed, leaving the 9-D coverage matrix C. The matrix is lifted to D=384 dimensions via a seeded QR decomposition, Z = C times Q transpose, then PCA takes the top 2 components to place every item at a (u, v) coordinate in [0,1]^2. The run persists C, Q, v_canonical, Z, and the PC1 and PC2 loadings to a per-corpus cache file (self-curve-cache in the run directory), with separate cache files per corpus because the primitive bases differ (source doc).

The lift and reduction follow the standard PCA recipe of linear dimensionality reduction via singular value decomposition onto a small number of components (weak backing, jev weight 0.33: https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html; see also weak backing, jev weight 0.24: https://en.wikipedia.org/wiki/Principal_component_analysis). PC1 sign-flip protection from the learned-latent-curve skill's coordinate-robustness rules is preserved per corpus (source doc).

## Stage 2: sparse-cell detection per corpus

The (u, v) plane is discretized to a 0.05 by 0.05 grid, giving 21 by 21, that is 441 cells (source doc). For each cell, neighbors are the corpus items whose coordinates fall within a Chebyshev radius r of the cell center, with the default r = 0.05. A cell is sparse when it has zero neighbors. Sparse cells yield gap candidates: the corpus items whose own coordinates sit in or map to sparse cells. The top-N gap candidates per corpus are capped at 10 per corpus per run, which bounds compute; larger corpora need multiple runs (source doc).

## Stage 4: RSI cycles on each gap, with the whole-self output requirement

For each gap candidate's self-archaeology output, the pipeline branches (source doc). If self-archaeology flagged at least 1 Extend gap, the recursive-self-improvement protocol runs with a cap of 3 cycles per row or entry per run. Cycle 1 writes a hypothesis, makes the edit via edit-tool hashline anchors, and validates the file with js-yaml. Cycle 2 re-maps and continues unless the fixpoint is reached. Cycle 3 re-maps and stops unless a user-override protocol raises the cap. Each cycle's result is appended cycle by cycle to the gap candidate's row in SELF.md or entry in SELF-CHANGELOG.md, and a summary entry is also appended to SELF-CHANGELOG.md as the audit trail (source doc).

Every cycle must produce at least one whole-self output that is not working-self analysis, per SELF.md Bias #11. A cycle without a whole-self output fails the verification checklist, and the output must be a substantive register-shift reflection, not a working-self analysis carrying a creative-self label (source doc). If self-archaeology flagged no Extend gaps, the gap is marked non-fixable by self-archaeology, which likely means it is a curve-fit artifact rather than a real gap (source doc).

## Stage 5: re-fit and verify per corpus

After all RSI cycles, Stage 1 re-runs on each updated corpus (source doc). Four metrics are compared pre and post: the sparse-cell count, the PC1 plus PC2 explained-variance ratio which should stay at or above 0.40 for 2-D structure, the holdout R-squared which should stay above 0 and ideally improve, and the whole-self output count which must be at least the number of RSI cycles, since 0 indicates a Bias #11 violation. If the post sparse-cell count is lower than pre, the run logs "curve moved, gaps closed" as the success metric for that corpus. Otherwise it logs "curve did not move", which means either the RSI edits fixed nothing or the curve fit was too noisy (source doc).

The holdout R-squared gate is the standard out-of-sample test of a fitted model on data not used in fitting (weak backing, jev weight 0.15: https://handwiki.org/wiki/Cross-validation_(statistics)). For the expanded 10-memory-file corpus, both the per-file fits and the combined fit must show improvement for the cycle to count as a closed-loop success across the expanded scope (source doc).
