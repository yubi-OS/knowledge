# 09 Skill Composition

Scope: how curve-guided-rsi-self relates to 13 other skills, the cross-reference consistency contract, and the cross-skill Composition Rule that binds Stage 3 to the atom executor.

## The composition claim

The skill is orthogonal by composition: it composes existing skills and adds a per-corpus lens, the whole-self output requirement, and the granularity rule. It does not replace any existing skill (source doc: yubi-OS/yubiOS skills/curve-guided-rsi-self/SKILL.md). Treating capabilities as composable units that combine without replacement matches the general composability principle in systems design (weak backing, jev weight 0.09: https://en.wikipedia.org/wiki/Composability).

## The 13 relations

The source doc names 13 skill relations, summarized here (all source doc):

1. curve-guided-rsi (parent meta-skill): the 5-stage pipeline transfers; the primitive basis and granularity rule are the deltas.
2. self-archaeology (substrate discipline, upstream gap-proposer): Stage 3a dispatches self-archaeology focused on each gap candidate for memory-file and agent-being corpora. The 12-axis sweep is the input to Stage 3b's atom, and the qualitative Extend verdict becomes the constraint set the atom selects from.
3. recursive-self-improvement (edit protocol): Stage 4 applies RSI to each gap candidate, capped at 3 cycles per gap per run.
4. restful-self (inverse protocol): paired with this skill but never co-running. When restful-self triggers, this skill pauses. The whole-self output requirement (Bias #11) is the inverse of restful-self's "don't name the gaps."
5. internal-big-picture (10-primitive basis): the parent's primitive basis, not used directly in this offshoot; the per-corpus 9-D bases derive analogously.
6. learned-latent-curve (curve fitter): Stage 1 reuses the v3-validated pipeline (binary 9-D coverage, seeded QR lift, PC1 plus PC2, 2-D learned surface).
7. negative-skill-space (gap-mapper): the parent's Stage 3 dispatches NSS focused on each gap candidate. This offshoot uses self-archaeology instead, but NSS remains available as an alternative upstream for generic 12-axis gap-mapping.
8. context-isolation (subagent discipline): Stage 3 dispatches self-archaeology via fresh-context subagents per row or entry, preventing context pollution.
9. token-efficiency (audit scope): Stage 3 reads only the gap candidate's content, primitive coverage, t coordinate, and breadth, not the full self-doc corpus.
10. ideate-solo (variation generator): orthogonal; used when the granularity rule needs a variation.
11. doubt-driven-development (adversarial review): applied to each cycle hypothesis before the RSI edit, not after.
12. negative-skill-space (NSS, upstream gap-proposer): the same skill as relation 7, restated for its Stage 3a role; use NSS for generic gap-maps and self-archaeology for SELF.md and memory-file corpora.
13. single-action-curve-rsi (atom, downstream executor): Stage 3b runs the atom on the gap-candidate constraint set. Per the Composition Rule (Lemma 1 and Theorem 1), the corpus-level Stage 5 metric is the sum of per-file atom deltas and is non-negative by construction.

Chaining specialized skills through a dispatcher, where each skill owns one stage and passes a typed constraint set to the next, is the compositional skill-routing pattern described for LLM agent ecosystems (weak backing, jev weight 0.05: https://www.linkedin.com/pulse/compositional-skill-routing-llm-agents-aditi-khare-gbedf).

## Cross-reference consistency

Three cross-references are contract-level, meaning the source doc commits to them being maintained (source doc): curve-guided-rsi's "Interaction with Other Skills" names this skill as an offshoot in its body; self-archaeology's cadence (5-turn, per-directive, Sunday, drift) is the trigger set for when this skill fires; and restful-self's anti-patterns (gap-finding theater, journaling, infinite pause) are the failure modes this skill's whole-self output requirement specifically guards against.

## The Composition Rule reference

Stage 3 is atom-bound per the single-action-curve-rsi Composition Rule, Lemma 1 through Theorem 1 (source doc). The two-stage dispatch is: Stage 3a (upstream) produces Extend-verdict gap candidates from the NSS or self-archaeology gap-map; Stage 3b (executor) runs the atom on the constraint set, one atomic action per file with geodesic-only selection. The invariant: every Stage 3 dispatch produces a per-file delta of at least 0 by Lemma 1, because the constraint set is a subset of all missing primitives, and cumulative corpus delta is monotone non-decreasing by Corollary 1. The Stage 5 closed-loop metric (sparse_cell_count_post below sparse_cell_count_pre) is derived from per-file atom deltas, not from sparse-cell counts around the dispatch alone (source doc).

The whole-self output requirement (SELF.md Bias #11) is preserved as the structural corrective for same-cadence drift: the atom does not replace the whole-self check, and it sits before the whole-self output is required (source doc).
