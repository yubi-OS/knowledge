# 07 - Null-standardized spectral auditing of distributions

Scope: the statistical machinery a spectral share must survive before it counts as a finding, randomness tests for point patterns, permutation and randomization nulls, and the program's own admission protocol (curveball null, z > 3). This doc is the corpus's record of the external statistics that the program's null-standardized objective mirrors.

## Testing a point pattern for randomness

The closest classical instrument is the Ripley K statistic. A peer-reviewed study builds an asymptotically Gaussian test for the hypothesis of randomness corresponding to a homogeneous Poisson point process, computing the exact first and second moments of the Ripley K statistic under that model (ESAIM: Probability and Statistics article page, noul 0.88). The arXiv version states the motivation directly: aggregation patterns are often visually detected in sets of location data, and the question is whether clusters reflect interesting dynamics or the effect of pure randomness (arXiv 1006.1567, noul 0.76 for the PDF, 0.63 for the abstract page). The same paper's text confirms the lineage of its bounds: Koen (1991) gives approximate confidence bounds for Ripley's statistic for random points in a square (Internet Archive full text, noul 0.61).

The shape to notice: the test statistic has a known distribution under an explicit null model, and the finding is a z-score-like distance from that null. A spectral share of a corpus point distribution is exactly such a statistic, which is why the program's membership condition reads like this literature.

## Randomization and permutation nulls

The generic machinery is the permutation test: an exact statistical hypothesis test whose null hypothesis is that all samples come from the same distribution, so that under the null the label assignments are exchangeable (Wikipedia, Permutation test, noul 0.64). Lecture notes on randomization tests state the enabling fact compactly: when the randomization hypothesis holds for a null hypothesis using the group of permutations, many such tests are readily available, and one may base a permutation test on a test statistic of choice for real-valued observations (Ritzwoller lecture notes, noul 0.75).

Monte Carlo methods are the computational fallback when the null distribution is not analytically tractable: repeated random sampling to obtain numerical results, solving problems that might be deterministic in principle (Wikipedia, Monte Carlo method, noul 0.33, weak backing, carried only as background).

## The program's protocol (source-doc claims)

The program's refs doc imposes on every spectral share coordinate: the curveball null, admission only at z > 3, and the house rule that measurement-type results face seeded nulls in CI and are never elevated to theorems. The web dig confirms that this protocol has the same shape as the published practice above: an explicit null model, a statistic with known null behavior, and a threshold. What the dig cannot confirm is any claim about the program's own corpus values; those are internal and stay unmeasured here.

## Dig redo note

The first dig for this subtopic returned unusable results: its one nominally primary hit was the Wikipedia page for the film Inception (the decision model scored it 0.706, but the content is a film plot and it was not used for any claim), and the remaining 11 results weighted below 0.5. Per the redo rule, the dig was rerun with different queries (a permutation-test query and a Ripley statistic query); the redo returned the primary sources cited above. This record documents that redo so the thin first pass is not silently inherited.

## What a Zernike channel inherits

A new pre-lift Zernike channel (doc 05) inherits this machinery wholesale: the basis is fixed, the share of each mode is the statistic, and the null is the same seeded curveball construction the existing channels face. The external statistics say the design is sound in kind; the program's data decides it in fact.

## Sources

- ESAIM: Probability and Statistics, Testing randomness of spatial point patterns with the Ripley statistic (noul 0.88): https://www.esaim-ps.org/articles/ps/abs/2013/01/ps120027/ps120027.html
- arXiv 1006.1567 PDF (noul 0.76): https://arxiv.org/pdf/1006.1567
- arXiv 1006.1567 abstract (noul 0.63): https://arxiv.org/abs/1006.1567
- Ritzwoller, randomization test lecture notes (noul 0.75): https://davidritzwoller.github.io/files/randomization.pdf
- Wikipedia, Permutation test (noul 0.64): https://en.wikipedia.org/wiki/Permutation_test
- Internet Archive full text of arXiv 1006.1567 (noul 0.61): https://archive.org/stream/arxiv-1006.1567/1006.1567_djvu.txt
- Wikipedia, Monte Carlo method (noul 0.33, weak): https://en.wikipedia.org/wiki/Monte_Carlo_method
