# 04 - The Effective Dimension Ladder: From Discrete Rungs to a Smooth Dial

**Scope.** The V2(D) dimension ladder (Prop. 1, Table 1) read against established spectral-share theory: participation ratio, stable rank, intrinsic dimension, Zhang's effective dimension, and Johnson-Lindenstrauss, which together make "0 leading to N dimensions" a formal statement.

## Known spectral-share quantities

The quantity the corpus measures has established relatives. The participation ratio (srank(A) = ||A||_F^2 / ||A||^2) and intrinsic dimension (tr M / ||M||) measure how much of a matrix's mass is spread over its spectrum; a recent SIAM paper treats stable rank and intrinsic dimension together for real and complex matrices [https://epubs.siam.org/doi/10.1137/24M1681537, jev weight 0.89], with an arXiv version available [https://arxiv.org/abs/2407.21594, jev weight 0.54; https://arxiv.org/html/2407.21594v2, jev weight 0.21, weak backing for the preprint text]. The source document's claim that Prop. 1 is a special case of known spectral-share behavior stands on this family: V2 is a normalized spectral share, and participation-ratio-type quantities are its classical siblings.

## Zhang's effective dimension is the focal-length knob

Zhang, "Effective Dimension and Generalization of Kernel Learning" (NeurIPS 2002), defines D_lambda = tr((T + lambda I)^(-1) T), an effective dimension controlled continuously by the regularization parameter lambda [https://papers.neurips.cc/paper/2196-effective-dimension-and-generalization-of-kernel-learning.pdf, jev weight 0.93; https://dl.acm.org/doi/10.5555/2968618.2968677, jev weight 0.83; open PDF mirror https://www.yaroslavvb.com/papers/zhang-effective.pdf, jev weight 0.52]. As lambda goes to infinity, D_lambda goes to 0; as lambda goes to 0, D_lambda approaches numerical rank. The brainstorm's key formal move is to identify this one-parameter family with "0 leading to N dimensions": the discrete ladder (2, 3, 7, 9, 16, 24, 384) becomes a smooth dial swept by lambda, and Zhang's generalization bounds are the payoff, since D_lambda is the quantity his bounds control.

## Johnson-Lindenstrauss gives the floor

The JL lemma states that k = O(epsilon^-2 log n) dimensions suffice to preserve all pairwise distances among n points up to factor 1 +/- epsilon [https://en.wikipedia.org/wiki/Johnson%E2%80%93Lindenstrauss_lemma, jev weight 0.21, weak backing: definition only; the Dasgupta-Gupta proof cited in the source document was not recovered in the dig]. The corpus-level reading: the number of dimensions a corpus needs is logarithmic in its row count, not equal to the nominal D. This gives the 0-to-N direction a floor, and it explains why the fitted null laws (Eq. 18) can be low-dimensional descriptions of a high-D object.

## Dimension as wavelength: the dispersion reading

The brainstorm assigns dimension the role wavelength plays in optics: the null V2 varies with D (Prop. 1 and Eq. 18 are the medium's dispersion relation). Two consequences:

- A coordinate comparable across corpora should be invariant along the dispersion relation, the way an achromatic lens treats all wavelengths alike. The corpus already has such coordinates: the Parseval shares E_lm of Eq. 40, the same 16 entries whatever N and d [source document, Section 3].
- Sweeping lambda (Zhang's knob) sweeps effective dimension continuously, which is the operation the lensing chain needs for its "latent space, 0 to N dims" stage.

## Honesty constraint

The ladder's measured V2 values at exact 1.0000 (14 rows, including pure noise) are rank-2 degeneracies, treated in doc 07 as caustics. Here the relevant constraint is weaker: Prop. 1's special-case status means the corpus's dimension laws must be re-derived against the stable-rank/intrinsic-dimension family before any new dimension claim is admitted [https://epubs.siam.org/doi/10.1137/24M1681537, jev weight 0.89].
