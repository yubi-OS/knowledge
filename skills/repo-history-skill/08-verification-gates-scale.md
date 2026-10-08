# 08 - Verification Gates, Red Flags, Scale, and Rate Limits

**Scope.** The fit-quality gates every run must pass before push, the red flags that force re-derivation or freezing, the scale table up to 100k items, and the API rate-limit guards on the GitHub and Linear sweeps.

Grounding spine: the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md` (source doc).

## The five gates

Stage 5 verifies the fit before anything is pushed (source doc):

1. Unit norm: the norm of every sphere point p equals 1.0 within 1e-6.
2. Curve-fit quality: PC1+PC2 >= 0.40.
3. Valid coverage: 0 <= c.sum() <= 9 for every item.
4. Moebius identity cross-ratio preserved on 100 held-out 4-tuples, when phi_theta is fit.
5. Sparse-cell count is finite and below the corpus size.

The verification checklist adds: cache and fit files written, last_run_timestamp updated, at least 3 of 9 primitives survived the near-constant filter (>10% and <90% coverage), all three join keys attempted on every item, and no fabricated SHA strings, PR numbers, or Linear IDs (source doc).

The PCA gate is a variance-explained threshold: PC1 and PC2 are the top-2 principal components' explained-variance ratios, and their sum must carry at least 40% of the corpus's variance. Principal component analysis identifies new axes ordered by captured variance (https://en.wikipedia.org/wiki/Principal_component_analysis, weight 0.55). The common practice of choosing component counts by cumulative explained variance is documented in secondary sources with weak backing (https://www.r-bloggers.com/2026/06/pca-in-r-principal-component-analysis-step-by-step-prcomp-ggplot2/, weight 0.23, weak, which pairs the Kaiser criterion with an 80% cumulative threshold; https://stackoverflow.com/questions/32857029/python-scikit-learn-pca-explained-variance-ratio-cutoff, weight 0.11, weak, which shows the cumsum idiom; https://towardsdatascience.com/pca-102-should-you-use-pca-how-many-components-to-use-how-to-interpret-them-da0c8e3b11f0/, weight 0.22, weak; https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-pca/, weight 0.17, weak). The 0.40 threshold itself is a skill-level choice inherited from the hyperspherical-harmonic-curve Stage-5 gate, not from any of those sources (source doc). A car-club site sharing the PCA acronym is off-topic (https://www.pca.org/, weight 0.53; recorded, not evidence).

## Red flags and their remedies

The source doc maps each failure to a specific remedy (source doc):

- PC1+PC2 < 0.40: insufficient variation (N < 20 without decomposition) or a wrong primitive basis; the cycle-1 NSS re-map flags near-constant primitives to drop.
- Norm not 1.0 within 1e-6: numerical bug in the S^2 lift; re-derive the lift. Chordal distance is bounded by 2.0, so an out-of-range norm is always a bug, not noise.
- Delta < 0 for the geodesic winner: the geodesic-only criterion is mis-applied; flip the sign and pick the smallest d_post, or surface the failure.
- All candidates delta < 0: local geodesic minimum; defer to Stage 3 of the full corpus fit.
- Sparse cells above 50% of the corpus: wrong primitive basis; re-derive via NSS.
- Moebius refinement train R^2 <= 0: freeze phi_theta at identity and skip future refinements (measured twice: cycle 2 cross-ratio error 14.5, cycle 3 error 17.3 under a spread-preserving loss).
- Cache older than 7 days and refresh fails: the cache is the only honest state; surface the failure, never silently fall back to partial refresh.

## Scale

The source doc's measured table (source doc):

| Repo state | Items | Fit time (workstation) | Notes |
|---|---:|---|---|
| Small (< 100 items) | about 100 | under 1 second | single-batch |
| Medium (about 1k) | about 1,000 | about 5 seconds | PCA plus Moebius refine per cycle |
| Large (about 10k) | about 10,000 | about 30 seconds | sample to 1k for Moebius; full PCA |
| Mega (100k+) | about 100,000+ | minutes | sample to 10k; per-corpus basis auto-derive |

The measured instances: the 1,387-commit yubiOS corpus fits in about 5 seconds on a workstation without sampling; the 47-issue Production Gates Linear corpus fits in under 1 second (source doc).

## Rate-limit guards

The source doc budgets both APIs before running (source doc). GitHub: 5,000 requests per hour authenticated, with the full yubiOS PR plus issue plus commit plus release sweep at about 50 calls. Linear: 1,500 requests per hour authenticated, with the full 6-project by 200-issue sweep at about 12 calls. Both budgets leave 2 orders of magnitude of headroom.

The GitHub primary docs state the number directly: "GitHub Apps authenticating with an installation access token use the installation's minimum rate limit of 5,000 requests per hour" (https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api, weight 0.97; the Enterprise Cloud variant states the same, https://docs.github.com/enterprise-cloud@latest/rest/using-the-rest-api/rate-limits-for-the-rest-api, weight 0.96). A community discussion of the same topic is weak backing (https://github.com/orgs/community/discussions/163553, weight 0.12, weak), as are a personal blog post on rate-limit errors (https://dev.to/mehmetakar/api-rate-limit-exceeded-github-how-to-fix-4h6n, weight 0.09, weak) and unrelated Stack Overflow threads (http://stackoverflow.com/q/43960813, weight 0.12, weak).

## Push protocol

Run outputs stay in session/; only the human-readable summary is pushed, to refs/ on the target repo, and every push runs in a single bash call per the /tmp wipe rule (source doc, Anti-patterns and Verification).
