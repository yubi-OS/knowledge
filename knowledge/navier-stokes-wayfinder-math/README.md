# navier-stokes-wayfinder-math

Knowledge corpus minted from `yubi-OS/yubiOS` refs doc `navier-stokes-wayfinder-math-2026-09-10.md`: the research phase findings on fluid-dynamics-inspired instruments for corpus wayfinding analysis, what was excluded, and what carried to implementation.

## Docs

- `01-pr230-statistical-reconciliation.md` - What the merged wayfinding PR actually establishes: verified isolation deltas, quantization-silent vs attaching ADD outcomes, baselines, and the honesty limits of interval claims on adaptive trials.
- `02-external-claim-verification.md` - Verifying external research artifacts before adoption: the OpenAI Navier-Stokes paper and Lean repository audited against the Clay/Fefferman official problem formulation, with compile-level limits stated.
- `03-threshold-margin-bounds.md` - Equation A: signed threshold margins with conditional perturbation stability bounds, explicit error allowances, abstention regions, and the rejected unsigned flip-predictor.
- `04-exact-isolation-identities.md` - Equations B and C: exact local graph identities for the isolation-count change under ADD and CHANGE point-map operations, including the neutral-ADD explanation and the one-vertex CHANGE certificate.
- `05-reduction-ratio-bookkeeping.md` - Equation D: the trust-region-style reduction ratio rho as a bookkeeping diagnostic for predicted reductions, its eligibility rules, and its small-sample interpretation limits.
- `06-graph-diffusion-deferred.md` - Equation E: optional symmetric graph diffusion with the Laplacian energy identity, explicit Euler stability bounds, and why the diffusion extension stays deferred pending a matched-null admission test.
- `07-lean-ci-integration.md` - The Lean 4 and CI integration plan: a scoped WayfinderBounds proof file, scope manifests with printed-axiom checks, preserved negative gates, and why the external PDE library stays out of the dependency chain.
- `08-research-methodology-streams.md` - The multi-stream research discipline: independent verification streams, audited rather than accepted recommendations, pre-registration of held-out comparisons, and a rejected accuracy claim kept out of the evidence chain.

## Research summary

- Results collected: 96 searXNG results kept (top 6 per query, 16 queries across 8 subtopics, 978 raw results seen).
- Weight split: 40 results at weight >= 0.5 (authoritative backing), 56 results below 0.5 (weak backing, labeled as such in the docs), 0 unweighted.
- Jev requests: 22 (1 preflight probe, 1 outline score validation, 20 weighting batches), usage 16562 input / 0 output tokens.
- Redos: 0 dig redos. 1 transient 429 on /api/decide was retried once after a 30s sleep; no result shipped unweighted.
- Skipped docs: none. All 8 subtopics passed outline validation (score > 0) and all 8 dig results were strong enough to author honestly.

## Method

Every collected result carries a jev (clef) noul quality weight; every factual claim in the docs carries its source URL plus the weight that backed it, with weights below 0.5 labeled weak. yubiOS-internal claims are cited to the pinned research record URLs they came from.

Preflight 2026-10-05: searXNG 98 results healthy; /api/decide (clef) 200
