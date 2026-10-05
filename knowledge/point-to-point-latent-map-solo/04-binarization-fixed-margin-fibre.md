# 04 Binarization and the fixed-margin fibre: the admitted state and the null

Scope: the admitted binary state {0,1}^{N x d}, the per-axis median binarization rule as part of the map key, and the fixed-margin curveball null versus column-permutation nulls.

## The admitted state is binary

The source record is categorical: all measured quantities are properties of a designed chain on a measured ladder, the admitted state is binary {0,1}^{N x d}, and continuous data must be binarized under a stated rule; comparing the statistic V2 across different dimensions d is forbidden (internal record). This is not a performance choice but a soundness one: the theorems the map certifies are theorems about binary matrices, so the input must actually be one.

## Binarization as a real, standard operation

Binarizing vectors is an established operation in retrieval systems: Vespa's documentation describes a binarize function that maps vector values to 0 or 1 and notes that the function itself does not compress the vector, only the values change (https://docs.vespa.ai/en/rag/binarizing-vectors.html, weight 0.65). The information-theoretic grounding is stronger: binary embedding is a nonlinear dimension-reduction methodology that embeds high-dimensional data into the Hamming cube while preserving structure of the original data (https://arxiv.org/abs/1502.05746, weight 0.92). Practitioner write-ups in vector-database land describe binary quantization with Hamming distance as a standard speed and storage play (https://theaidatabaseblog.com/learn/binary-quantization-and-hamming-distance/, weight 0.22, weakly backed), and note the sign-threshold rule as the common binarization (https://dev.to/vrannang1/zero-knowledge-ai-matching-binarized-embeddings-hamming-distance-5fb3, weight 0.28, weakly backed).

The record's specific rule is per-axis median: each of the d axes is binarized at the median of that axis across the corpus. The chosen axis set and the threshold rule together define which fibre the data lands in.

## The rule is part of the map's key

The record's strongest stress-test critique of its own finalist is that binarization is a design choice: a different rule gives a different fibre and a different null, so the certificates are only as strong as the rule is explicit. The mitigation is cryptographic: the rule is part of the map's key, hashed over {d, axis-selection, threshold}, and printed on the artifact (internal record). This mirrors the deduplication world's discipline of pinning content identity to an explicitly computed digest (https://comsec.ethz.ch/wp-content/files/dupefs_fast22.pdf, weight 0.83): the artifact carries its own construction recipe, so two maps with different binarization rules cannot be silently compared.

## The fixed-margin fibre and the curveball null

Once the state is binary, the null lives on the fibre of matrices sharing the row and column margins. Sampling binary matrices with prescribed row and column sums is a studied problem, with swap-based methods that select rows and exchange entries while preserving margins (https://arxiv.org/pdf/2007.15043, weight 0.79). The curveball algorithm is one such method: a null model for binary matrices that exactly preserves row and column sums while randomizing specific entries (https://www.emergentmind.com/topics/margin-preserving-curveball-null, weight 0.34, weakly backed). Network analysis teaching material makes the general case that relational data require permutation-based null models because the data do not satisfy independence assumptions (https://dshizuka.github.io/networkanalysis/06_permutations.html, weight 0.54), and the permutation test itself is the exact, non-parametric baseline (https://en.wikipedia.org/wiki/Permutation_test, weight 0.36, weakly backed in this dig).

The record's complaint about the deploy target (sos-agent) is that it uses a column-permutation null instead of the fixed-margin curveball null the Lean file certifies, and that its latent representation is bag-of-terms clusters rather than embeddings (internal record). The gap matters: a null that does not preserve the margins samples a different fibre, so z scores computed against it do not certify what the theorem file says they do.

## Degeneracy as the admissibility gate

The whole construction has one acknowledged soft spot: nothing guarantees that a median-binarized embedding cloud produces a non-degenerate null. The record converts this from an un-testable bet into a pre-registered check: run the null and look at SD0, the null standard deviation of V2; if SD0[V2] < 1e-3, the coordinate is inadmissible and the app says so (internal record). This is the binarization analogue of checking a variance is not zero before running a test, and it is cheap enough to run at load time.

## Why not skip binarization

The record considered skipping it: V6 proposes unit-normalizing to S^(D-1) with slerp edges and vMF concentration. Its verdict was deferral, because no fixed-margin fibre exists for continuous rows, so the only certified statement would be delta nonnegativity on geodesic distance, a weaker medium (internal record). Binarization is the price of the theorem coverage, and the median rule is the price of determinism.
