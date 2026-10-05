# Fixed-margin nulls: curveball swaps for binary matrices

**Scope:** Fixed-margin null models for binary matrices: curveball swap algorithms versus permutation, admissibility of null variance. The map's null edges are curveball trades that preserve both row and column sums; this doc grounds that choice against the published null-model literature.

## Design context

The map needs a null: what does the V2 statistic (a variance-ratio over shells) look like when the corpus carries no structure but keeps the observed margins? The design draws K independent samples of a fixed-margin randomization, each built from checkerboard trades, and reports the null mean and standard deviation of V2, then the standardized delta. Column permutation was rejected as the null: it destroys row margins, and the fixed-margin medium is the one the trade certificate covers. This doc reviews the published algorithms and their guarantees.

## The curveball algorithm

Strona and colleagues introduced Curveball in 2014 as "a fast and unbiased procedure to randomize ecological binary matrices with fixed row and column totals", published in Nature Communications. The algorithm picks two rows, identifies the columns where the rows disagree (the 10 and 01 cells forming a checkerboard), and swaps a random subset of those columns between the rows. Each swap preserves both row sums and column sums exactly, and the procedure converges to a uniform draw from the set of matrices with the observed margins [https://www.nature.com/articles/ncomms5114, weight 0.61]. The fixed-margin constraint is the point: the null keeps every observed row total and column total, so any deviation of the statistic from its null distribution is attributable to structure beyond the margins.

A follow-up paper, "A unifying framework for fast randomization of ecological networks with fixed node degrees", generalizes the trade operation to weighted matrices and confirms the fixed-margin discipline as the common core of the family [https://www.sciencedirect.com/science/article/pii/S2215016118301067, weight 0.92], with an open-access mirror on PMC [https://pmc.ncbi.nlm.nih.gov/articles/PMC6072652/, weight 0.89]. The same framework paper reports fastball, an accelerated variant that samples directly from the trade-implied distribution with fewer bookkeeping passes [https://arxiv.org/html/2112.04017v1, weight 0.81].

The R ecosystem exposes the canonical algorithm: the `incidentally` package documents `curveball()` as randomizing an incidence matrix (binary bipartite graph) with fixed row and column sums [https://search.r-project.org/CRAN/refmans/incidentally/html/curveball.html, weight 0.68]. A community null-model catalog positions fixed-margin swap methods against the alternative families (quasiswap, trial swap, permutation) for community matrices [https://matthewkling.github.io/nullcat/, weight 0.48, weak backing].

## Swap algorithms in the null-model tradition

Swap-based randomization has history before Curveball. A JSTOR-published analysis of swap algorithms in null model analysis traces the checkerboard swap through the ecology literature and its convergence behavior [https://www.jstor.org/stable/3107907, weight 0.75]. The theoretical mixing behavior of the fixed-margin swap chain is an active topic: a 2026 arXiv paper analyzes the spectral gap of the binary fixed-margin swap chain, showing that convergence to the uniform fixed-margin distribution can be slow in structured regimes [https://arxiv.org/abs/2606.22636, weight 0.34, weak backing]. A 2026 preprint proposes the Snake algorithm, a rejection-free sampler for binary matrices with fixed margins, as an alternative to swap chains [https://arxiv.org/abs/2608.17531, weight 0.72] [https://arxiv.org/html/2608.17531, weight 0.80].

These mixing results bear directly on the map's null discipline. The design's certificate records row and column sums unchanged per trade (an identity-level assertion, exact in integers), while the null statistic's adequacy (did K draws cover the fibre? did the chain mix?) is a measurement certificate that may honestly fail. The design also fixes a specific implementation detail flagged by its own field findings: the sampler runs a fixed number of attempted symmetric checkerboard switches including rejected self-loops. Stopping after successful moves samples a different (jump) chain, not the target stationary law; the attempted-switches convention keeps the sampler on the intended chain. This is consistent with the spectral-gap literature: the chain's transition kernel, not its accepted-move count, defines the stationary law [https://arxiv.org/abs/2606.22636, weight 0.34, weak backing].

## Admissibility: when the null coordinate is inadmissible

The map standardizes each observed statistic against its null: delta = (observed - E0) / SD0. That standardization is only meaningful when SD0 is not degenerate. The design sets an explicit floor: if the null standard deviation is below 1e-3, the coordinate is declared inadmissible and the map reports that instead of a z-score. The published null-model literature supports the principle: null models whose randomization is nearly deterministic (for example, margins so tight that almost every matrix in the fibre is identical) carry almost no variance, and a variance-normalized statistic against such a null manufactures significance from noise [https://www.nature.com/articles/ncomms5114, weight 0.61] [https://matthewkling.github.io/nullcat/, weight 0.48, weak backing].

The fixed-margin fibre itself shrinks as margins become extreme. With row sums at 0 or d (all-ones or all-zeros rows), no trade is possible and the fibre is a single point. The design's admissibility floor is the runtime guard for exactly this degeneracy.

## Permutation is a different medium

Column permutation shuffles each column independently, which preserves column sums but destroys row sums. The published framework paper treats these as distinct null families with different preserved structure [https://www.sciencedirect.com/science/article/pii/S2215016118301067, weight 0.92]. The map's choice of trades over permutation is therefore a choice of preserved structure: the row margins (per-item bit counts) are treated as real corpus properties that the null must hold fixed, while the null explores which columns carry the bits.

## What the null layer asserts

1. Curveball trades preserve row and column sums exactly and target the uniform fixed-margin distribution; this is the published, peer-reviewed procedure [https://www.nature.com/articles/ncomms5114, weight 0.61].
2. Mixing of fixed-margin swap chains can be slow, so null adequacy stays a measurement with its own certificate rather than an assumed property [https://arxiv.org/abs/2606.22636, weight 0.34, weak backing].
3. A variance-normalized statistic against a near-degenerate null is meaningless; an explicit admissibility floor (SD0 >= 1e-3) is the correct guard [https://www.sciencedirect.com/science/article/pii/S2215016118301067, weight 0.92].

## Sources considered

| Source | Weight |
|---|---|
| A unifying framework for fast randomization, ScienceDirect | 0.92 |
| Same paper, PMC open access | 0.89 |
| The Snake Algorithm, arXiv HTML | 0.80 |
| fastball, arXiv | 0.81 |
| Snake Algorithm abstract, arXiv | 0.72 |
| Swap algorithms in null model analysis, JSTOR | 0.75 |
| Curveball, Nature Communications (Strona et al) | 0.61 |
| curveball(), CRAN incidentally | 0.68 |
| Null models catalog, nullcat | 0.48 |
| Spectral gap for the binary fixed-margin swap chain, arXiv | 0.34 |
| Curveball, academia.edu mirror | 0.12 |
| null (dictionary, off topic) | 0.79 |
