# 02 - The Ky Fan maximum principle: top-k eigenvalue sums as a trace reading

**Scope:** the Ky Fan maximum principle for sums of top-k eigenvalues and trace inequalities, the exact form behind the top-2 eigen-share and the frozen-frame gap reading.

## The original result

Ky Fan's maximum principle dates to 1951. The paper "Maximum Properties and Inequalities for the Eigenvalues of Completely Continuous Operators" appeared in PNAS volume 37 (1951) and is the primary reference the modern statement descends from (weight 0.91, [PNAS 37(11):760](https://www.pnas.org/doi/10.1073/pnas.37.11.760)). A later note in the Canadian Journal of Mathematics, "On the Maximum Principle of Ky Fan", studies the principle itself and confirms its status as a named result with its own proof literature (weight 0.92, [Cambridge CJM](https://www.cambridge.org/core/journals/canadian-journal-of-mathematics/article/on-the-maximum-principle-of-ky-fan/664EF49EF49D15CC71888B0E03E18659); the same article also collected weight 0.86 in a second query pass).

In its workhorse form for a real symmetric matrix C and an orthonormal k-frame X, the principle says the quantity tr(X^T C X) is maximized over orthonormal X by taking X to span the top k eigenvectors, and the maximum equals the sum of the k largest eigenvalues. The Ky Fan k-norm literature states the parallel fact for singular values: the Ky Fan k-norm of a matrix is defined as the sum of its k largest singular values, s1 + ... + sk, with the 1-norm reducing to the operator norm (weight 0.73, [Sze, Ky Fan norms, PolyU](https://www.polyu.edu.hk/ama/profile/sze/PDF/kyfan_final.pdf)).

## Where the corpus instrument touches it

The instrument's V2 statistic is the trace-normalized top-2 eigen-share of a bit covariance matrix. That is a Ky Fan quantity: the numerator is a top-2 eigenvalue sum, exactly the kind of object the maximum principle characterizes variationally. The frozen-frame reading goes one step further. It keeps the baseline frame X and re-evaluates tr(X^T C' X) on a later covariance C'. By the maximum principle, this can never exceed the top-2 eigenvalue sum of C', because X remains an admissible orthonormal candidate but is generally no longer the maximizer. The shortfall, the Ky Fan gap, is therefore sign-certain: 0 when C' is the baseline matrix itself, nonnegative thereafter.

This is why the gap reading needs no spectral theorem at evaluation time. The principle gives an upper bound for free; measuring the shortfall only requires the trace of a 2 by 2 projected matrix. What the gap means is frame adequacy, not corpus quality: a large gap says the frozen axes explain less of the current corpus, not that the corpus improved or worsened.

## Variational character and recent extensions

The Ky Fan norm has an active variational literature. A 2016 arXiv paper on "Variational Analysis of the Ky Fan k-norm" proves results by combining Ky Fan's maximum principle with methods from quantum information theory based on Fock rearrangements of density operators (weight 0.87, [arXiv:1601.07430](https://arxiv.org/abs/1601.07430)). This confirms the principle is treated as a live tool in current optimization work, not a museum piece.

The quotient connection runs through the ordinary Rayleigh quotient. A Chebfun example walks through the Rayleigh quotient and the maximum principle for eigenvalues, showing the quotient's maximizers are eigenvectors (weight 0.79, [Chebfun examples](https://www.chebfun.org/examples/sphere/RayleighQuotientExample.html)), and the Wikipedia Rayleigh quotient page covers the same ground at reference level (weight 0.84, [Wikipedia](https://en.wikipedia.org/wiki/Rayleigh_quotient)). The Ky Fan principle is the k-dimensional extension of that 1-dimensional maximization.

## What the dig did and did not find

The first dig pass for this subtopic came back thin: of 12 collected results, only 2 were authoritative (the Cambridge CJM article at 0.82 and the PolyU Ky Fan norms paper at 0.73), the rest being off-topic pages including two state-government homepages and Stack Exchange threads (weights 0.02 to 0.16). A redo with sharper math-specific queries was run and recovered the PNAS 1951 original (0.91), a second copy of the Cambridge article (0.92), the arXiv Ky Fan k-norm paper (0.87), and the Chebfun example (0.79). The redo log records this in the dig record for this doc.

Several results cannot back any claim here despite their weights: a Stack Exchange thread restating the Ky Fan principle (weight 0.03, weak backing, [math.stackexchange.com](https://math.stackexchange.com/questions/4193272/extending-the-trace-maximization-principle)), a Grokipedia min-max page (weight 0.05, weak backing, [grokipedia.com](https://grokipedia.com/page/Min-max_theorem)), and state-government homepages that the weighting model scored between 0.02 and 0.83 across the two dig passes but which contain no mathematical content relevant to this doc (weights 0.04, 0.02, 0.02, and 0.83 recorded in the archive; deliberately not used as backing). Weight is a necessary condition for citation here, not a sufficient one: no claim in this doc leans on a page whose content does not support it.
