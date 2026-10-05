# 02 - Fermat, Eikonal, and Snell: The Variational Skeleton Under the Atom Criterion

**Scope.** The variational backbone of the lensing chain: Fermat's principle on conformally flat metrics, the eikonal equation, and Snell's law as a corner condition, with the atom criterion of the source corpus read as a discrete ray tracer.

## Fermat's principle as geodesics of a conformally flat metric

The claim the brainstorm depends on is: rays are geodesics of the metric g = n(x)^2 times the flat metric, once a refractive index n(x) is named. The modern statement and its GR-flavored generalizations are documented in the dig corpus: geodesic motion in conformally flat metrics is the standard setting, treated for example in the Eisenhart (conformally flat Lorentzian) metric setting [https://arxiv.org/html/2305.20022v2, jev weight 0.88], and the Fermat principle is formulated in general relativity precisely as a light-travel-time extremization problem [https://www.researchgate.net/publication/234929607_The_Fermat_principle_in_general_relativity_and_applications, jev weight 0.67]. Textbook-level derivations connect the two halves: Fermat's principle yields Snell's law directly from the variational condition [https://link.springer.com/chapter/10.1007/978-3-031-46614-4_4, jev weight 0.75].

## The eikonal equation and its characteristics

The eikonal relation |grad S|^2 = n^2 defines the optical path function S whose level surfaces are wavefronts; rays are its characteristics. The dig corpus supports the surrounding machinery: the equivalence of Fermat-type variational principles and Hamilton-Jacobi/eikonal descriptions is the standard bridge used in field-theoretic treatments [https://en.wikipedia.org/wiki/Fermat%27s_and_energy_variation_principles_in_field_theory, jev weight 0.25, weak backing: orientation only], and the geodesic formulation of optics in curved settings is developed in the cited GR-Fermat work [https://www.researchgate.net/publication/234929607_The_Fermat_principle_in_general_relativity_and_applications, jev weight 0.67]. The brainstorm's mapping (the Phi(k) ladder is the eikonal S evaluated on coverage shells) is an analogy at this layer: the corpus names no metric yet, which is exactly Gap A.

## Snell's law as the corner condition

Kalaba and Ueno, "Snell's Law and the Calculus of Variations," JOSA 55(1):59 (1974) [https://opg.optica.org/josa/abstract.cfm?uri=josa-55-1-59, jev weight 0.90], derive Snell's law as the transversality (corner) condition of a variational problem with an index discontinuity. This is the result the brainstorm leans on for its Gap B program: refraction is what a conservation law looks like when a ray crosses an interface where the medium changes. The dig corpus contains no independent copy of Tyc's 1997 JOSA A paper, so that specific citation is carried forward from the source document without independent corroboration here and is flagged as such.

## The atom criterion is already a ray tracer

The source paper's Lemma 1 (geodesic-only atom criterion: each dispatch takes the flip that minimizes geodesic distance to the pole) is a discrete Fermat scheme:

- Each dispatch is a ray step, choosing the direction that minimizes travel distance to the target pole [source document Lemma 1, corroborated structurally by the discrete-geodesic literature in the dig: https://link.springer.com/chapter/10.1007/978-3-031-46614-4_4, jev weight 0.75].
- The condition Delta >= 0 (no improvement reverses) reads as: rays never travel backward in optical path length, the monotonicity property of Fermat geodesics.
- The Phi(k) ladder records cumulative optical path, and the T_x crossover at 0.0411 is where the ensemble changes transport regime.

This is the one place in the corpus where a metric (chordal on S^2) and a variational problem (geodesic-only argmin) are both already specified. The brainstorm's own discipline says: build outward from there [source document, Section 5].

## What is missing

The variational layer is exact only where n(x) is specified. Three candidate indices (Fisher determinant, local null SD, and |phi-theta'| as a design choice) are named in the source brainstorm as Gap A; none has yet been tested against the measured detection-power surface on the standard-candle grid [source document, Gap A; no dig result covers the grid itself]. Until that test runs, this document's statements are exact for the mathematics and hypothetical for the corpus.
