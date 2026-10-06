# The 5-Dim Time-Series Gate

Scope: the PC1+PC2 gate table recorded after the y33 application, dimension by dimension, and how to read a principal-component coverage gate honestly.

## The gate table

After the applied insertions, the project tracks five basis dimensions with a PC1+PC2 gate, where the gate value is the fraction of variance the first two principal components explain (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md):

| Dim | PC1+PC2 | Gate | Basis |
|---|---|---|---|
| 7-D | 1.0000 | pass | repo-refs-skill on refs/*.md, 7-D basis |
| 9-D | 0.4565 | pass | internal-big-picture on self+docs+refs |
| 16-D | 0.4627 | pass | SH basis values at S2 coords |
| 24-D | 0.2993 | fail | 9-D + 12 NSS + 3 meta |
| 384-D | 1.0000 | pass | Fibonacci sphere Y_3^3, chosen (l=384, m=3) |

Two readings follow directly from the table. First, a high PC1+PC2 is not automatically good: 7-D and 384-D both sit at 1.0000, meaning the basis is fully explained by 2 principal components, which for a 7-dimensional basis means the gate is at its boundary and for the 384-D basis means the variant selection worked (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). Second, the operative pass threshold sits somewhere between 0.2993 and 0.4565, since the 24-D basis failed at the former and the 9-D basis passed at the latter.

## What PC1+PC2 measures

The gate reads standard PCA output. The proportion of variance each component explains, together with the eigenvalues and the component loadings, is the key output for interpreting a principal components analysis (https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/multivariate/pca/interpret-the-key-results, weight 0.82). Course material frames the question the gate is answering directly: how many principal components are enough, decided by the proportion of variance (https://web.stanford.edu/class/stats202/notes/Unsupervised/PCA.html, weight 0.83). Tutorial material makes the interpretation explicit: the first principal component captures the largest possible variance, and the explained variance ratio determines how much information each component retains (https://nayelbettache.github.io/documents/STSCI_3740/PCA_tutorial.pdf, weight 0.51).

A PC1+PC2 gate on a corpus basis is therefore asking: do the first two principal directions carry the structure, or is the basis's variance smeared across many directions? The 24-D basis (9-D plus 12 NSS axes plus 3 meta dimensions) failed with 0.2993, meaning less than a third of its variance lives in the top 2 components (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). General-purpose explanations of the same ratio circulate widely but weight poorly as sources (https://statisticsglobe.com/what-is-explained-variance-pca, weight 0.23, weak; https://en.wikipedia.org/wiki/Principal_component_analysis, weight 0.13, weak).

## Gate status after the application

The applied doc records the 384-D entry as the one the application changed: the Fibonacci sphere Y_3^3 basis with the chosen variant (l=384, m=3) reached PC1+PC2 = 1.0000 and passed, and the keystone visualization shows that gate status (internal ref: refs/y33-fibonacci-sphere-applied-2026-08-07.md). The remaining rows are carry-over status for the other bases the project tracks; the 24-D failure is pre-existing and not attributed to the y33 work.

## How to use this doc

Treat the table as a status snapshot tied to the 2026-08-07 application, not a permanent property: the 24-D row is a live failure the project records rather than explains away, and the threshold between 0.30 and 0.46 is inferred from the table's pass/fail boundary rather than stated as a number anywhere in the source doc.

## Sources considered

| source | weight |
|---|---|
| https://web.stanford.edu/class/stats202/notes/Unsupervised/PCA.html | 0.83 |
| https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/multivariate/pca/interpret-the-key-results | 0.82 |
| https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-pca/ | 0.54 |
| https://nayelbettache.github.io/documents/STSCI_3740/PCA_tutorial.pdf | 0.51 |
| https://www.geeksforgeeks.org/data-analysis/principal-component-analysis-with-python/ | 0.21 (weak, not cited) |
| https://statisticsglobe.com/what-is-explained-variance-pca | 0.23 (weak, not cited) |
| https://en.wikipedia.org/wiki/Principal_component_analysis | 0.13 (weak, not cited) |
| https://stats.stackexchange.com/questions/22569/pca-and-proportion-of-variance-explained | 0.04 (weak, not cited) |
| https://fastercapital.com/content/Explained-Variance--Explained-Variance--Measuring-PCA-s-Effectiveness | 0.06 (weak, not cited) |
| https://www.pca.org/ | 0.21 (off-topic, not cited) |
