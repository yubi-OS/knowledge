# 08 - Variant Scoring and the Ideation Record

Scope: the ideation record: 4 interpretations (3-D parameter on S3, 1-jet differential, Blaschke products, hyperspherical harmonics) scored on a rubric, and the 10 advisor revisions that reshaped the design before implementation.

## The scoring rubric

The record was produced by an autonomous ideation pass that generated 4 interpretations and scored each on 4 axes: painkiller (does it remove a real constraint), switching (can it be adopted incrementally), defensibility (is the mechanism claim defensible), and testability (can the claim fail). Structured scoring of design variants against a rubric is established practice in engineering design education: a validated design rubric gives programs a common design language for navigating design knowledge (https://peer.asee.org/a-pathway-to-create-and-validate-an-engineering-design-rubric-across-all-engineering-programs.pdf, weight 0.67). The generic idea-scoring-matrix workflow places the matrix after ideation, once there is a meaningful set of concepts to compare (https://www.emerge-creatives.com/post/idea-scoring-matrix-the-ultimate-guide-to-evaluating-and-prioritising-ideas, weak backing, weight 0.20).

The scores from the record (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05): interpretation A, a 3-D parameter on S3, scored 15 of 20; interpretation B, a 1-jet differential, scored 11 and was dropped below the threshold of 12, with testability flagged low because holonomy is hard to compute numerically; interpretation C, Blaschke products on the Riemann sphere, scored 16 and was the runner-up; interpretation D, hyperspherical harmonics on S^N with the Moebius reparameterization, scored 18 and won.

## The runner-up: Blaschke products

A Blaschke product is a bounded analytic function in the open unit disk, a product of disk automorphisms (https://en.wikipedia.org/wiki/Blaschke_product, weak backing, weight 0.23). Finite Blaschke products are genuine approximation tools: recent work proves the existence of a finite Blaschke product approximating a prescribed holomorphic function in simultaneous-approximation settings in classical Banach spaces (https://arxiv.org/abs/2511.06543, weak backing, weight 0.42), and approximation theory is the framing under which bounded analytic functions in the unit disk are studied (https://arxiv.org/html/2305.10870, weight 0.58). The record's reason for ranking C second rather than first: the Blaschke path requires a 2-D-to-complex projection pipeline, which injects a new failure mode at exactly the boundary the variant is trying to harden (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). A compact summary of Blaschke products' approximation role matches that framing (https://facts.net/mathematics-and-logic/mathematics/30-facts-about-blaschke/, weak backing, weight 0.11).

## The advisor revisions

Ten advisor revisions were applied between the raw interpretation and the written design (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). The load-bearing ones, each grounded elsewhere in this corpus:

1. Replace the spectral identity epsilon_spec with a stack of pre-fit basis test, spectral-mass gate, holdout R2, and matched-parameter ablation (docs 04 and 09). The stated ground: epsilon_spec holds for any smooth gamma in C2(S^N) and cannot detect silent degradation.
2. Add the Moebius reparameterization; without it the model is ordinary OLS spherical-harmonic regression (doc 02).
3. Default to N=2, L=3 on corpus-size and PC3 grounds (doc 07).
4. Set Stage 2 to equal-area partition with chordal radius about 0.095, not 0.05 (doc 05).
5. Use the domain coordinate x on S2 as the audit-trail primary key instead of recovered (u, v) from principal components (docs 03 and 05).
6. Delete three loss terms: L_eq (forces gamma constant, encoding silent degradation as an objective), L_LB (identically zero, a free index), and L_K (scale arbitrary).
7. Freeze degree weights at 1; learnable w_l creates a gauge redundancy with the harmonic coefficients that defeats the spectral check.
8. Correct the parameter counts to 6532 at S2/L=3 and 11908 at S3/L=3, and reframe the smaller count as a truncation choice at equal degree rather than a curvature dividend (docs 01 and 04).
9. Downgrade the novelty verdict to NOVEL at the application layer and BORDERLINE at the mechanism layer unless the Moebius term is added; the Moebius is added (doc 02).
10. Pin the basis library and convention to scipy sph_harm_y with argument-order assertion, and reject hand-rolled S3 bases without epsilon_basis validation (doc 06).

## What the record chose not to do

The record explicitly defers: the (gamma, d-gamma, nabla-squared gamma) triple extension to v2; a full empirical validation rewrite with actual fit numbers (marked pending at ideation time); re-targeting the variant to any feature space other than the 9-D binary primitive coverage it was built for; and separate family members for the 1-jet and Blaschke directions, to be pursued independently if D becomes operational (yubiOS design record, refs/hyperspherical-harmonic-curve 2026-08-05). Rubric-matrix methods for scoring generative outputs against weighted rubric profiles are an active research area that later cycles could borrow from (https://arxiv.org/html/2610.00389v1, weak backing, weight 0.48).
