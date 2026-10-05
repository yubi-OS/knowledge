# 04 - Revised passage edit anatomy

## Scope

The table-based revised passage itself: original text, fix, and rule per row, the verbatim LaTeX block, and the drop-in placement right after the Riemann-sphere sentence.

## The edit table

The source artifact structures the revision as a 3-row table, each row carrying the original text, the fix, and the rule or rationale. Row 1: the original sentence replacing the flat [0,1]^2 parameter manifold of equation (1) with the Riemann sphere S^2 gets one added sentence, a Fibonacci-sphere sampling sentence, because Fibonacci sampling gives near-uniform coverage of S^2 and avoids pole clustering. Row 2: the previously implicit Y_3^3 evaluation point set becomes an explicit statement of the Fibonacci nodes z_i, phi_i, theta_i and the per-node evaluation Y_3^3(theta_i, phi_i), so the reader can reproduce the diagnostic grid from the paper alone. Row 3: the previously implicit angular-versus-radial role of Y_3^3 becomes the explicit identity Y_3^3(theta, phi) proportional to sin^3 theta e^{i3 phi}, so the angular contribution is named rather than implied.

That structure follows a known revision pattern: state the exact original text, state the exact fix, and state the rule that justifies the fix. The rule column is what makes the table reviewable; a reviewer can dispute the rule without re-reading the whole section.

## The LaTeX block

The revised passage is a single LaTeX fragment: one prose sentence introducing the sampling, a display equation chain defining the three node formulas, one sentence stating the per-node evaluation, a second display equation giving the identity, and one closing sentence naming what the grid is for: a low-discrepancy diagnostic grid for angular structure, visualization, and numerical quadrature on S^2. The LaTeXRef manual documents the displaymath environment used for this kind of unnumbered display block, noting that with the fleqn global option the text renders flush-left and that no equation number is added in displaymath (weight 0.81, https://latexref.xyz/displaymath.html). The source artifact renders the node formulas inside \[ \] display chains (artifact-internal detail).

## Placement and the reproduction requirement

The drop-in point is immediately after the Riemann-sphere sentence in the hyperspherical-harmonic section. The rationale the artifact gives is reproducibility: without the sampling sentence, a reader cannot reconstruct the diagnostic grid from the paper alone, because the sampling scheme is only implied by context. The arxiv comparison of Fibonacci and latitude-longitude lattices shows precisely why the choice of lattice is observable and consequential: its figure 1 puts the latitude-longitude lattice (1014 points) and the Fibonacci lattice (1001 points) side by side in orthographic projection centered at the pole, and the two grids differ visibly in pole density (weight 0.89, https://arxiv.org/pdf/0912.4540). Baskerville's post adds the negative case: random point placement creates voids even when the distribution is correct, which is why the fix must name the lattice rather than say "spread points" (weight 0.79, https://adambaskerville.github.io/posts/SphereSampling/). Cook's variant shows the family is parameterizable, P = 2N+1 points in his indexing (weight 0.77, https://www.johndcook.com/blog/2023/08/12/fibonacci-lattice/), so the paper must pin its own N and indexing convention explicitly. The Observable notebook works the geometry as a cylindrical equal-area projection of the square, a 2-step transformation square to disk to sphere (weight 0.50, https://observablehq.com/@meetamit/fibonacci-lattices), which is the weakest-backed item here and is cited only as a visualization aid.

The verbatim passage text itself is artifact-internal (yubi-OS/yubiOS refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md); this doc documents its anatomy and the dig-backed reasons each row's rule holds.

## Sources

- https://arxiv.org/pdf/0912.4540 (weight 0.89)
- https://adambaskerville.github.io/posts/SphereSampling/ (weight 0.79)
- https://www.johndcook.com/blog/2023/08/12/fibonacci-lattice/ (weight 0.77)
- https://latexref.xyz/displaymath.html (weight 0.81)
- https://observablehq.com/@meetamit/fibonacci-lattices (weight 0.50)
