# 02-variations-five-lenses-one-lens-per-variation

**Scope.** Variations (five lenses, one lens per variation): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md. External dig queries: singular value decomposition 2D point set aspect ratio; pre-registered experimental design two-arm control.

## Seven variations, five lenses

The ground source (yubi-OS/yubiOS refs/arr-premap-ideate-solo-2026-10-16.md) generates 7 variations, one lens per variation, covering five ideation lenses: Simplification (V1), Inversion (V2), Combination (V3, V5), Constraint removal (V4), and Audience shift (V6, V7). Each is a distinct answer to the two-part problem statement.

| ID | Lens | Idea in one line |
|---|---|---|
| V1 | Simplification | Add one arrangement-warp route beside the existing pixel-warp; read D and d_w per arm |
| V2 | Inversion | Fix the instrument before measuring the response: pin a degeneracy-exact Delaunay |
| V3 | Combination | Detector times template ladder: shallowest containing gasket template, predict holes, pre-register a D band at depth 6 |
| V4 | Constraint removal | No fixed template: fit an IFS or affine registration from partial observations |
| V5 | Combination | Line A times Line B: carry measured arrangement sensitivity into premap bands |
| V6 | Audience shift | Fills become gated router lane actions dispatched through policy |
| V7 | Audience shift | Real supersolid panels as the premap test set |

## V1: the arrangement arm as a simplification

V1 is the smallest change that answers the instrument question: one new route, two readings (D and d_w) per arm. It becomes the backbone of Line A. The arm design is a controlled comparison: clean is the control, pixel warp and arrangement warp are treatments. Two-arm and multi-arm designs are standard in experimental statistics; the DeclareDesign two-arm designer studies how the correlation between potential outcomes affects coverage, per [Two-Arm Experiment • DesignLibrary - declaredesign.org](https://declaredesign.org/r/designlibrary/articles/two_arm.html) (clef weight: 0.2159) (weak backing, clef weight < 0.5). Multi-arm platform designs with planned arm additions are analysed in [An Optimal Two-Period Multiarm Platform Design with New Experimental ...](https://nejsds.nestat.org/journal/NEJSDS/article/17/read) (clef weight: 0.2157) (weak backing, clef weight < 0.5) and implemented in the PlatformDesign R package, per [PDF PlatformDesign: Optimal Two-Period Multiarm Platform Design with New ...](https://cran.r-project.org/web/packages/PlatformDesign/PlatformDesign.pdf) (clef weight: 0.3539) (weak backing, clef weight < 0.5), with a duplicate listing at [An Optimal Two-Period Multiarm Platform Design with New Experimental ...](https://www.researchgate.net/publication/365937577_An_Optimal_Two-Period_Multiarm_Platform_Design_with_New_Experimental_Arms_Added_During_the_Trial) (clef weight: 0.1099) (weak backing, clef weight < 0.5). Reverse selection designs that randomise to an experimental arm or one of two control arms, then drop the worse control at interim, appear in [Reverse Selection Designs for Accommodating Multiple Control Arms](https://pmc.ncbi.nlm.nih.gov/articles/PMC11649439/) (clef weight: 0.3954) (weak backing, clef weight < 0.5). All of these are clinical-trial framings and all are weak backing; they are cited only for the general shape of pre-registered multi-arm comparison, which the record applies to deterministic image warps rather than to patients.

## V2: inversion, fixing the instrument first

V2 inverts the obvious order. Instead of measuring arrangement response on the existing walk graph, it first pins a degeneracy-exact Delaunay so that the walk leg stops depending on which implementation built the graph. The record calls this a measured defect: the feasibility benchmark showed the A1 walk verdicts flip between two implementations of the same algorithm.

## V3: containment premap

V3 combines the hierarchy detector with the gasket template ladder. Given observed sites, find the shallowest template that contains every one, predict the absent template sites as holes, and pre-register a D band at depth 6. Its virtue is testability: gasket holdouts have exact ground truth.

## V4: learned registration, and why linear algebra alone does not rescue it

V4 removes the fixed-template constraint and fits an IFS or affine map from partial observations. The affine half of that problem has a clean linear-algebra structure: the singular value decomposition factors any real matrix into a rotation, a scaling, and another rotation, per [Singular value decomposition - Wikipedia](https://en.wikipedia.org/wiki/Singular_value_decomposition) (clef weight: 0.7472). The Columbia E4620 notes illustrate this with a matrix's action on the unit sphere, per [PDF 12: Singular value decomposition - Columbia University](https://www.columbia.edu/~ja3451/courses/E4620/12_SVD.pdf) (clef weight: 0.5243), and the MIT 18.095 chapter treats the SVD as diagonalising any m by n matrix of rank r with two orthonormal bases, per [PDF Chapter 7 TheSingularValueDecomposition(SVD) - MIT Mathematics](https://math.mit.edu/classes/18.095/2016IAP/lec2/SVD_Notes.pdf) (clef weight: 0.5863). These three are the only dig results at or above 0.5 in this corpus. They support a narrow point: for a 2D point set, the SVD of the centred coordinates gives principal axes and an aspect ratio, which is how an affine stretch would be measured. They do not support V4's harder half. The record's own research pass 2 states that inverse IFS recovery from a finite, noisy, partial point set is not identifiable in general, which is why V4 scores testability 1. The 2DSVD variant for sets of images, per [Two-dimensional singular-value decomposition - Wikipedia](https://en.wikipedia.org/wiki/Two-dimensional_singular-value_decomposition) (clef weight: 0.2156) (weak backing, clef weight < 0.5), and the GeeksforGeeks tutorial, per [Singular Value Decomposition (SVD) - GeeksforGeeks](https://www.geeksforgeeks.org/data-science/singular-value-decomposition-svd/) (clef weight: 0.1232) (weak backing, clef weight < 0.5), add nothing beyond the primary SVD sources.

## V5: arrangement response as an error budget

V5 joins the two lines: the measured sensitivity of D to arrangement warps becomes the uncertainty band on premap predictions. The record keeps V5 as the Phase 2 hook, because it needs Line A's measurement to exist first.

## V6 and V7: audience shifts

V6 turns premap fills into router lane actions. It is blocked twice: by the deploy hold, and by the design rule that fills are predictions, not evidence. V7 makes real supersolid research panels the test set; it needs registration first, so it is Phase 2.

## How the lenses partition the space

Simplification and Inversion both feed Line A; Combination feeds Line B and the bridge between lines; Constraint removal and Audience shift produce the ideas that hit the record's hard limits (identifiability, deploy hold, registration). The partition is useful as a reading aid: the two lenses that stay inside the session-only constraint produced the finalists.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Singular value decomposition - Wikipedia | https://en.wikipedia.org/wiki/Singular_value_decomposition | 0.7472 | authoritative (>= 0.5) |
| 2 | PDF 12: Singular value decomposition - Columbia University | https://www.columbia.edu/~ja3451/courses/E4620/12_SVD.pdf | 0.5243 | authoritative (>= 0.5) |
| 3 | Singular Value Decomposition (SVD) - GeeksforGeeks | https://www.geeksforgeeks.org/data-science/singular-value-decomposition-svd/ | 0.1232 | weak (< 0.5) |
| 4 | Two-dimensional singular-value decomposition - Wikipedia | https://en.wikipedia.org/wiki/Two-dimensional_singular-value_decomposition | 0.2156 | weak (< 0.5) |
| 5 | PDF Chapter 7 TheSingularValueDecomposition(SVD) - MIT Mathematics | https://math.mit.edu/classes/18.095/2016IAP/lec2/SVD_Notes.pdf | 0.5863 | authoritative (>= 0.5) |
| 6 | An Optimal Two-Period Multiarm Platform Design with New Experimental ... | https://nejsds.nestat.org/journal/NEJSDS/article/17/read | 0.2157 | weak (< 0.5) |
| 7 | Two-Arm Experiment • DesignLibrary - declaredesign.org | https://declaredesign.org/r/designlibrary/articles/two_arm.html | 0.2159 | weak (< 0.5) |
| 8 | Reverse Selection Designs for Accommodating Multiple Control Arms | https://pmc.ncbi.nlm.nih.gov/articles/PMC11649439/ | 0.3954 | weak (< 0.5) |
| 9 | PDF PlatformDesign: Optimal Two-Period Multiarm Platform Design with New ... | https://cran.r-project.org/web/packages/PlatformDesign/PlatformDesign.pdf | 0.3539 | weak (< 0.5) |
| 10 | An Optimal Two-Period Multiarm Platform Design with New Experimental ... | https://www.researchgate.net/publication/365937577_An_Optimal_Two-Period_Multiarm_Platform_Design_with_New_Experimental_Arms_Added_During_the_Trial | 0.1099 | weak (< 0.5) |
