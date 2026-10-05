# envharness-lean-replacement-audit

Knowledge corpus on auditing whether a Lean kernel-checked formalization can replace an evaluation harness's inner workings (envharness): what the harness computes, what the Lean port covers, and where the replacement holds or fails. Minted 2026-10-05 from the source audit of google-research/envharness at HEAD (pushed 2026-08-21).

## Docs

1. 01-envharness-wrapper-algebra.md: what the envharness wrapper algebra is (stacked plug-in layers, delegation, checkpoint walk) and why the audit ranks it the core of the replaceable contract layer.
2. 02-mutation-loop.md: the LLM-driven mutation loop (HarnessAgent, three hooks, code_loader, BudgetPolicy, MutationObjective) and why it stays execution-side.
3. 03-implicit-trust-story.md: the five invariants envharness states in prose but never machine-checks, and what replacing them with theorems found.
4. 04-lean-contract-replacement.md: what the section 15 Lean port proves: composition laws, blocked_is_noop over every transition, the band iff.
5. 05-budget-termination.md: the halting theorems for the three budget policies, and why termination is decidable here when it is undecidable in general.
6. 06-acceptance-stats-upgrade.md: the highest-value replacement: raw window means swapped for the curveball null and dBc deflection gate.
7. 07-weights-normalization-gap.md: the one false claim the audit found: fixed-precision weights need not sum to 1, the kernel-checked counterexample, the largest-remainder repair.
8. 08-execution-boundary.md: Tier 3: what Lean cannot and should not replace, and the policy-plus-sandbox posture for model-written code.
9. 09-replay-checkpoint-laws.md: the PARTIAL rows (Setup replay determinism, checkpoint round-trip) and the three open follow-ups.

## Research summary

- Results collected: 835 raw searXNG results across 18 queries (9 subtopics x 2 queries), 108 kept (top 6 per query, deduplicated by URL per subtopic) and weighted with the jev decision model.
- Weight split: 50 results at weight >= 0.5 (authoritative backing), 58 below 0.5. Sub-0.5 results are cited in docs only with an explicit weak-backing label, or dropped.
- Jev requests: 23 total (1 outline validation score request, 22 noul weighting batches), usage 18587 input tokens / 0 output tokens.
- Redos: 0 (every dig returned 40+ raw results on attempt 1).
- Skipped docs: none. All 9 subtopics digged strong enough to author honestly.
- Every factual claim in the docs carries its source URL and the jev weight that backed it. Claims about the audited repo's internals derive from the source audit (google-research/envharness, HEAD 2026-08-21), whose repository identity was itself a collected, weighted result.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
