# 09 Guidelines, constraints, anti-patterns, and composition

**Scope:** the operating discipline the skill enforces: the 12 numbered guidelines, the hard constraints, the anti-patterns and red flags tables, and the composition table that places curve-compass-skill inside the yubiOS skill family. Internal-record subtopic, no dig: every claim here is grounded in the source doc itself (yubi-OS/yubiOS skills/curve-compass-skill/SKILL.md).

## The 12 guidelines

1. Never report a statistic without its null. A number without a null is a number without a claim.
2. Never read the crossover as a claim about the historical corpus. T_x, C(T), chi(T) and Var[k](T) are properties of a designed chain on a measured ladder; the historical log is the T to 0 limit.
3. Always report split-Rhat, ESS and MCse with any mean of k. A mean with no convergence block is an anecdote.
4. Check quantization every run: the maximum absolute delta k over accepted moves must be 1.
5. Keep the entropy term visible. If you use the signed plus or minus 1 proposal you MUST carry the C(9,k')/C(9,k) Hastings factor.
6. Run at least 8 dispersed chains, and run length at least 50 tau_int.
7. Report Var[k] with its asymptote. Its interior maximum is real but is only +0.19% over the T to infinity binomial 9/4.
8. Phi is corpus-specific. Re-derive it for a new corpus.
9. State the terminal-sentinel choice explicitly. Phi(9) = 1.1547 is used; the logged 0.0 is a bookkeeping sentinel.
10. Lens-format patches only (v1.1.0). Every suggested file edit is a guided-curve-ideate-format new idea with hypothesis, method, parameters, delta, verdict, score and caveat. No templated sections.
11. Seeds are part of the result. Every subcommand takes --seed.
12. Prefer exclusion-only language: excluded, not-excluded, not-tested, void. Never PARTIAL, never "compatible with".

## Hard constraints

- stdlib plus numpy only. No scipy, sklearn, pandas, matplotlib.
- LOCAL ONLY. No network, no external API.
- The item state is binary, shaped 0/1 across N items by 9 primitives. Continuous data must be binarized under a stated rule before it touches this skill.
- The Phi ladder is corpus-specific; re-derive for any other corpus.
- The chain is on the coverage count by design.
- Lens-format patches carry their own experimental design; the patch is the lens, not prose about the file.

## Anti-patterns

- Do not call the compass's equilibrium a property of the corpus.
- Do not drop or double-count the Hastings degeneracy factor.
- Do not use Phi(9) = 0.0; the logged zero is a sentinel, not a depth.
- Do not quote the mean of k from a single chain, or from a chain shorter than 50 tau_int.
- Do not report Var[k]'s peak as a phase transition.
- Do not compare V2 across different d, ever.
- Do not cite PC1 + PC2 = 1.0000 as a good fit.
- Do not use the iid or column-permutation null to claim structure.
- Do not read a t_fold, or any z here, against a Gaussian tail.
- Do not ship templated sections in the v1.0.0 patch format.
- Do not score a lens without a delta. Score 50 means the experiment ran and measured the claimed delta; score 0 means the lens is aspirational only.

## Red flags

| Observation | Meaning |
|---|---|
| max absolute dk over 1 on accepted moves | the atom has been broken |
| empirical occupancy peaks at k = 9 at every T | the entropy term is missing |
| absolute z(J) over 3 on any k in balance | implementation error |
| split-Rhat over 1.01 with ESS in the tens of thousands | chains are stuck in different basins |
| lens has empty delta or score 0 | the experiment did not run; the lens is aspirational |
| 100+ lenses all verdict YES with score 50 | the experiment is degenerate (always passes) |

## Composition

- curved-corpus-create supplies the matrices, the curveball, column-permutation and iid nulls, the calibration pack and the IS-THIS-X placement machinery. Direction: curved-corpus-create into curve-compass-skill.
- guided-curve-ideate is the source of the lens-format scheme: cycle-34 new-ideas artifacts define the L141 to L146 structure. The compass lens subcommand emits the same JSON shape with hypothesis, method, parameters, delta, verdict, score and caveat per file. Direction: guided-curve-ideate into curve-compass-skill.
- single-action-curve-rsi is the T to 0 special case of the compass: one greedy best-flip per file per cycle, monotone, absorbing. The compass is a superset of it.
- rsi-phi-skill is the improvement loop that produced the edit log. The compass can supply it a principled exploration temperature: T slightly above T_x keeps the population off the absorbing state. Direction: curve-compass-skill into rsi-phi-skill.

## Self-containment, verification, provenance

The skill reads nothing required: the ladder and the log summary are embedded in the source doc. Optionally it takes a T3-style results JSON via history --log, or a corpus JSON via lens --corpus. It writes JSON only where told, and depends on Python 3.12 stdlib plus numpy with no network and no skill registry (source doc).

Verification is one command, python3.12 scripts/curve_compass.py --selftest: 8 assertion blocks unchanged from v1.0.0 plus the v1.1.0 lens block of 6 assertions on the lens output schema (all 9 fields present, verdict in YES, PARTIAL, NO, score between 0 and 50), exit 0 if and only if GREEN (source doc).

Provenance: v1.0.0 initial on 2026-08-12; v1.1.0 same day, changing the patch format to guided-curve-ideate-format new ideas after the first real-world use (cycle 1, PR 202) shipped templated sections that the maintainer declined to merge, adding the lens subcommand, 6 new selftest assertions, and the guided-curve-ideate composition link. Maintainer: Sauna, wave 2, built against papers/is-this-x-2026-08-12.md (sections 3 to 8, section 7 in particular), the evidence bundle's tests/T3-results.json, and the curved-corpus-create and guided-curve-ideate SKILL.md exemplars (source doc).

**Sources kept:** 0 results (internal-record subtopic, no dig); grounded entirely in the source doc.
