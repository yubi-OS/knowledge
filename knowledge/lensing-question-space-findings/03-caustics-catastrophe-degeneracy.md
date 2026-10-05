# 03 - The exact-1.0000 gate passes are caustics

**Scope.** The rank-2 degeneracy behind every machine-precision 1.0000 gate pass read as a caustic: the ray map degenerating under over-focus, with Thom-Arnold catastrophe theory as the classification scheme and Brenier-map singularities as the transport analog.

## The observed pattern

The source findings doc records that all 14 machine-precision 1.0000 rows in the gate passes, pure noise included, share the same structure: rank-2 degeneracy. The framework's reading is that this is the ray map degenerating, the optical signature of over-focus: a lens cranked past its design point does not sharpen the image, it collapses it. Proposal 2's red flag is therefore a caustic detector, not a tuning knob.

## Catastrophe theory is the classification scheme

Caustics are the canonical application of catastrophe theory in optics. Berry's catastrophe optics paper states the classical problem plainly: geometrical optics goes wrong in precisely the most important places, where the light is brightest, and catastrophe theory is what fixed that unsatisfactory state of affairs (weight 0.8132, https://michaelberryphysics.wordpress.com/wp-content/uploads/2022/02/berry089-1.pdf). A 2025 arXiv paper builds a catastrophe charged-particle optics framework by applying catastrophe theory to the characteristic function of the ray map, giving a working taxonomy of caustic morphologies (weight 0.8243, https://arxiv.org/pdf/2509.09551). Catastrophe theory itself originated with Rene Thom in the 1960s and was popularized by Christopher Zeeman; Vladimir Arnold developed the singularity-theoretic machinery it rests on (weights 0.0696 and 0.091, both weak, https://en.wikipedia.org/wiki/Catastrophe_theory and https://en.wikipedia.org/wiki/Vladimir_Arnold). The framework's gap E, classifying each degenerate basis by perturbing it with one column and reading fold versus structural collapse, is exactly the program these papers run on physical optics.

## The transport analog: Brenier singularities

In optimal transport, the Brenier map is the gradient of a convex potential solving the transportation problem between two densities (weight 0.1508, weak, https://en.wikipedia.org/wiki/Brenier%27s_theorem). Its regularity is genuinely fragile: regularity of the optimal map hangs on the geometry of the supports and the densities, and the map picks up singularities when the densities are not bounded away from zero and infinity (weight 0.1958, weak, https://arjun.lol/writing/optimal-transport). A 2022 Journal of Applied Mechanics and Technical Physics paper establishes a regularity theory for the singularity set of optimal transportation maps when the target is composed of two disjoint convex domains, noting the role of optimal transport in deep learning (weight 0.8391, https://link.springer.com/article/10.1134/S0965542522080097). An applied example computes a world-population cartogram as a Brenier map, showing the map's distortion concentrating exactly where the densities are mismatched (weight 0.6815, https://arxiv.org/abs/2609.14089). The transport analog of a caustic is therefore the Brenier singularity: the point where the focusing map loses regularity. The framework's prediction is that the rank-2 degeneracy and the transport singularity are the same object in two languages; the one-column perturbation test discriminates a benign fold (removable, information-preserving elsewhere) from a structural collapse (information destroyed at the focus).

## Design consequence

The anti-caustic constraint in the lens-powering agenda (doc 06, gap D) inherits its terms from here: design rank and condition number are the two monitors that separate useful focus from caustic collapse. A plain dictionary lookup of "optimal" scored 0.892 from an aggregator and is recorded here only because the archive keeps every dig result (https://www.merriam-webster.com/dictionary/optimal); it carries no claim.

## Sources considered

| result | weight | used |
|---|---|---|
| Berry catastrophe optics PDF | 0.8132 | yes |
| Catastrophe charged-particle optics (arXiv 2509.09551) | 0.8243 | yes |
| Singularity set of optimal transportation maps (Springer) | 0.8391 | yes |
| Optimal-transport cartogram (arXiv 2609.14089) | 0.6815 | yes |
| Brenier's theorem Wikipedia | 0.1508 | weak, cited as definition |
| Optimal Transport and Geometry essay | 0.1958 | weak, cited for regularity conditions |
| Catastrophe theory Wikipedia | 0.0696 | weak, cited as history |
| Vladimir Arnold Wikipedia | 0.091 | weak, cited as history |
| Caustic optics Wikipedia | 0.0666 | weak, no |
| Catastrophe theory student page | 0.2329 | weak, no |
| ResearchGate singularity set copy | 0.0877 | weak, no |
| Merriam-Webster optimal | 0.892 | no (off topic aggregator) |
