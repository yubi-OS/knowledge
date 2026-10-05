# 05 - Fisher-Rao Information Geometry: The Geometry That Survives Compression

**Scope.** The statistical-geometry anchor for the intent-space stage of the chain: Fisher-Rao as the unique metric invariant under sufficient statistics (Cencov), Efron's statistical curvature, and the corpus's per-family z-scores as a diagonal approximation of the Fisher-Rao distance.

## Cencov's uniqueness theorem

The theorem the brainstorm leans on: the Fisher metric is the unique metric on a statistical manifold that is invariant under sufficient statistics, up to monotone rescaling (Cencov/Chentsov's theorem). Expository treatments of the theorem are in the dig corpus [https://cims.nyu.edu/~gromov/Fall%202026/cencov_theorem_expanded.pdf, jev weight 0.57], and a Scholarpedia article documents the Fisher-Rao metric itself, including its role as the canonical information geometry [https://www.scholarpedia.org/article/Fisher-Rao_metric, jev weight 0.85]. Lecture-note treatments of information geometry cover the Lp-Fisher-Rao metrics and the alpha-connection structure surrounding the uniqueness result [https://www.esi.ac.at/uploads/6074f7c8-3794-4729-9a89-48b8dcf8e20a.pdf, jev weight 0.89].

The consequence for the chain: any quotient of the question space by sufficiency (the proposed definition of intent space, "what any sufficient compression must preserve") inherits exactly the Fisher-Rao geometry. No other metric is admissible. That is what makes the intent-space stage principled rather than decorative.

## Efron's statistical curvature

Efron, "Defining the Curvature of a Statistical Problem (with Applications to Curvature of Exponential Families)," Annals of Statistics 3(6):1189 (1975) [https://projecteuclid.org/journals/annals-of-statistics/volume-3/issue-6/Defining-the-Curvature-of-a-Statistic, jev weight 0.94; open PDF mirror http://www.yaroslavvb.com/papers/efron-defining.pdf, jev weight 0.43, weak backing for the mirror only], defines the statistical curvature of a family and connects it to information loss in estimation. The brainstorm's bridge: family standardization (the paper's per-family z-scores) is a diagonal approximation of the Fisher-Rao distance to the family manifold. Each family's z-score vector measures displacement in local Fisher coordinates, ignoring the off-diagonal (cross-family) structure. Upgrading the max|z| > 3 exclusion rule to a geodesic distance in the full Fisher metric is well-posed by these results and is listed in the source document as a partially built bridge.

## The intent-space reading

The chain stage "question space to intent space" is where Cencov does real work:

- Question space Q is the is-this-x triple (Phi, M, V) over corpora and families [source document, Section 2].
- Intent space I is the sufficient-statistic quotient of Q. The axiomatic construction: quotient by sufficiency, whose unique invariant geometry is Fisher-Rao [https://cims.nyu.edu/~gromov/Fall%202026/cencov_theorem_expanded.pdf, jev weight 0.57].
- The learned construction (an NPE-style embedding, doc 06) is the alternative; Cencov predicts that a sufficient learned compression converges to Fisher geometry, which is a testable agreement between the two constructions.

## Honesty constraint

The source document's own membership rule applies to intent space: it is inadmissible until it has a construction under which it could have been different (Gap C). The Fisher-Rao result supplies the geometry of the quotient once the quotient exists; it does not by itself supply the non-degenerate null for intent space. Until Gap C's proposal is run (the same embedding trained on curveball draws), "intent space" lives in this brainstorm and not in results.

## Notes on source weights

The Fisher-Rao metric article and the Efron paper carry the strongest weights in this dig (0.85 and 0.94). A blog treatment of Chentsov's theorem [https://agustinus.kristia.de/blog/chentsov-theorem/, jev weight 0.31] and a personal notes page [https://lihanqing1997.github.io/notes/information-geometry/cencov-theorem/, jev weight 0.27] are weak-backing orientation material and are not cited for any load-bearing claim.
