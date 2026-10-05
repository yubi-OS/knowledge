# Null models for corpus geometry

Scope: column-permutation, curveball, and iid nulls for the coverage matrix; what each preserves and destroys, and which verdicts each licenses.

## Why a null at all

A fitted curve on a corpus always shows dense and sparse regions. The question the audit must answer before acting is whether the structure is real or an artifact of per-primitive frequency. The null model is the instrument that answers it: generate matrices that match the corpus under a stated constraint, refit the geometry on each, and see whether the observed structure survives. This is the ecology tradition applied to documentation: null model analysis data is typically a binary presence-absence matrix whose entries represent presence (1) or absence (0) of a species at a site, rows for taxa, columns for sites (https://cran.r-project.org/web/packages/SESraster/vignettes/null-models.html, jev high 0.7786 and 0.5270).

## Column permutation: the joint-pattern null

The column-permutation null permutes the entries within each primitive column independently. This preserves each column's 0/1 frequency exactly and destroys co-occurrence between columns. That makes it the right null for exactly one question: is the joint pattern real? If the fitted curve on the real corpus separates regions that the permutated corpus does not, the structure lives in co-occurrence, not in marginal frequencies (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

Column permutation as a null model class is standard in ecology. The CommEcol package documents a "perm.cols" null model that permutes columns and is used to test a site-by-species matrix when columns were ordered by an a priori hypothesis (https://cran.r-project.org/web/packages/CommEcol/CommEcol.pdf, jev high 0.7010). The corpus method inherits the mechanism and points it at a different hypothesis: the ordering of primitives along each coverage axis.

The verdict rule is exclusion-only: a permutation null can show that the observed structure is no more extreme than chance, in which case the claim "this sparse cell is a real gap" is excluded, but a pass does not positively prove the gap is meaningful. The null licenses deletions of claims, not confirmations (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## Curveball: preserving row and column totals

The curveball algorithm randomizes a binary matrix while preserving both row and column sums. It was introduced with an explicit contrast to prior methods: curveball differs from existing procedures in that it focuses on matrix information content rather than matrix structure (https://www.nature.com/articles/ncomms5114, jev high 0.9528). A follow-up framework generalized it into a unifying approach for fast randomization of ecological networks with binary matrices and co-occurrence as the keywords (https://www.sciencedirect.com/science/article/pii/S2215016118301067, jev high 0.9514).

Adoption is broad. FALCON, a package for nestedness analysis of bipartite networks, uses the curveball algorithm to generate its null matrices (https://pmc.ncbi.nlm.nih.gov/articles/PMC4244763/, jev high 0.8442), and a 2024 co-occurrence study runs its null model with the curveball algorithm of Strona et al. 2014 (https://onlinelibrary.wiley.com/doi/full/10.1002/ece3.70498, jev high 0.9044).

For the corpus matrix, curveball is the stricter null: it preserves both the per-file coverage total and the per-primitive frequency, and reshuffles only which files cover which primitives within those margins. That is the appropriate null when the suspicion is that the curve's dense pole is an artifact of files that simply cover many primitives. It is the wrong null for the question "is this single file unusual", because it preserves every file's total coverage by construction (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).

## iid and the caution about mismatched nulls

The iid null resamples each cell independently, preserving neither margins nor co-occurrence. It is the loosest null and the least useful: structure under iid says little that the other two nulls do not say more sharply. The corpus method keeps it only as a floor comparison.

The general lesson is documented in the ecology literature: a study of null models for animal social network analysis warns that caution should be taken when using pre-network and node network permutations to create null models with data collected via focal sampling, because the null must respect the data's collection structure (https://besjournals.onlinelibrary.wiley.com/doi/10.1111/2041-210X.13400, jev high 0.8166). A null that destroys structure the hypothesis depends on turns every test into a foregone conclusion. Popular fixed-margin choices exist in the same ecosystem, such as the fixed-fixed null behind the Stone-Roberts C-score calculator, which reports a standardized effect size and Monte-Carlo p-value (https://metricgate.com/docs/c-score-co-occurrence-null/, jev low 0.3025, cited as a low-weight practitioner reference).

## Mapping nulls to verdicts

The corpus method's assignment is explicit:

1. Column permutation: preserves per-column frequency, destroys co-occurrence. Verdict class: is the joint pattern real. This is the default null for sparse-cell claims.
2. Curveball: preserves row and column totals, destroys pairwise structure. Verdict class: is the dense pole more than a degree artifact.
3. iid: preserves nothing. Verdict class: sanity floor only.

A sparse-cell lens is authored only when the column-permutation null fails to reproduce the sparse region. If the permutation null produces equally sparse cells, the "gap" is a property of primitive frequency, and the honest prescription is to retire the primitive or the claim, not to write files against it (source: yubi-OS/yubiOS refs/adjacent-problems-curve-corpus-primitives-2026-09-01.md).
