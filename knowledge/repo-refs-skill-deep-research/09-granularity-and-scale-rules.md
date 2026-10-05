# 09 - Granularity and Scale Rules for Corpus Fitting

Scope: how corpus size changes the fit: granularity tiers, the degeneracy of PCA on small samples, corpus-size determination methods, and re-fit cadence tied to corpus growth.

## How big should a corpus be? The sizing literature

The most direct published method for deciding corpus size treats it as a sampling problem: determine the needed number of documents from the capture probabilities of unique words within the target corpus, rather than defaulting to cost and time constraints, which the authors note dominate decision-making in practice (https://www.sciencedirect.com/science/article/pii/S1532046411002243, jev weight 0.76, high). For a docs archive this reframes the granularity question: the corpus is not a fixed inventory, it is a sample of the project's knowledge vocabulary, and its adequacy can be measured by vocabulary capture.

Classification research grounds the scale effects on the training side. A 2026 study of clinical text classification explores sample-size requirements for training data and how those requirements depend on the language properties of the underlying documents (https://arxiv.org/abs/2601.15846, jev weight 0.64, high). The same paper's introduction notes that practice commonly annotates 200 to 500 documents, a number constrained by time and cost and lacking justification against vocabulary properties (https://kclpure.kcl.ac.uk/portal/en/publications/determinants-of-training-corpus-size-for-clinical-text-classifica/, jev weight 0.38, weak). The transferable point: the right corpus size depends on the documents' language properties, not on a universal constant.

## PCA degeneracy at small sample counts

The fit stage of the pipeline assumes PCA behaves, and PCA behavior degrades with sample count. The community literature raises the caution directly: for factor analysis there is substantial literature questioning the old rules of thumb on the number of observations, and sample-size adequacy should be measured rather than assumed (https://stats.stackexchange.com/questions/45820/minimum-sample-size-for-pca-or-fa-when-the-main-goal-is-to-estimate-only-few-com, jev weight 0.06, weak). The same thread's practical remedy is to test stability directly: bootstrap or cross-validate the PCA, disturbing the dataset and building surrogate models, with instability signaling that the sample is too small (https://stats.stackexchange.com/questions/45820/minimum-sample-size-for-pca-or-fa-when-the-main-goal-is-to-estimate-only-few-com, jev weight 0.06, weak). These are forum sources and carry weak backing; the bootstrap remedy is standard statistical practice, but it should be labeled as such.

Choosing how many components to retain is the adjacent decision: the first few components usually explain most of the variability in the data, and dimension reduction proceeds by discarding the rest (https://communities.sas.com/t5/SAS-Communities-Library/How-many-principal-components-should-I-keep-Part-1-common/ta-p/948949, jev weight 0.10, weak). Tutorial literature frames the goal as reducing the number of dimensions without losing too much information, with the count of retained components decided as the first step (https://bookdown.org/lien_lamey/R_tutorial/5-2-how-many-factors-should-we-retain.html, jev weight 0.42, weak; https://www.baeldung.com/cs/pca, jev weight 0.35, weak).

## Scaling experiments as the validation instrument

Synthetic scaling is the controlled way to study corpus-size effects. A documented experimental framework for corpus sampling analysis and scaling studies enables researchers to understand how corpus properties change as collection size varies, and to generate synthetic corpora at different scales while maintaining statistical fidelity to the original (https://deepwiki.com/microsoft/SynthaCorpus/3.3-sampling-and-scaling-experiments, jev weight 0.31, weak). For a docs-archive skill, a scaling experiment would re-fit the pipeline on synthetic subsets of the archive and observe where the fit metrics break, rather than waiting for real growth to expose the boundary.

## The tier rule, grounded

Assembling these sources into the granularity rule:

1. Small corpora (below roughly 20 files): section-level decomposition. With too few rows, PCA is unreliable, and the instability test above (https://stats.stackexchange.com/questions/45820/minimum-sample-size-for-pca-or-fa-when-the-main-goal-is-to-estimate-only-few-com, jev weight 0.06, weak) is the check that would expose it. The fallback is a qualitative multi-axis sweep per file instead of a geometric fit.
2. Mid-size corpora (roughly 20 to 30 files): one file per row is sufficient, with the geometric fit kept simple and stable.
3. Large corpora (30 or more files): one file per row, refinement enabled, and re-fit cadence tied to corpus growth rather than the calendar.

The re-fit trigger should follow the vocabulary-capture logic: when the corpus has grown by a large fraction, the sample's vocabulary coverage has changed enough that the fit's assumptions deserve rechecking, the same reasoning the gold-standard sizing method uses for corpus adequacy (https://www.sciencedirect.com/science/article/pii/S1532046411002243, jev weight 0.76, high). A corpus that doubles has different language properties than the one the fit was tuned on (https://arxiv.org/abs/2601.15846, jev weight 0.64, high), so the fit, not just the data, needs refreshing.
