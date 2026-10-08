# single-action-curve-rsi Knowledge Corpus

Knowledge corpus explicating the yubiOS skill `single-action-curve-rsi` (ground source: yubi-OS/yubiOS `skills/single-action-curve-rsi/SKILL.md`, 34956 bytes fetched 2026-10-08). The skill is the atom of the curve-RSI family: ONE corpus item maps to ONE point on S2 via 9-D binary primitive coverage, PCA top-2, stereographic lift, and Mobius reparameterization; the single-action target is the missing primitive whose flip reduces geodesic distance to the ideal pole the most; ONE edit per cycle.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | [01-atom-pipeline.md](01-atom-pipeline.md) | The atom model: one item, one point, one flip, one delta; the 3 defining properties; when to use and when not to |
| 02 | [02-primitive-basis.md](02-primitive-basis.md) | The 9-D binary primitive basis, regex patterns, weighted section aggregation, the 0.5 threshold |
| 03 | [03-s2-lift.md](03-s2-lift.md) | PCA top-2, stereographic projection from the south pole, optional Mobius reparameterization, the numerical contract |
| 04 | [04-ideal-pole.md](04-ideal-pole.md) | The all-ones ideal pole lifted through the same pipeline; chordal versus great-circle distance; the Frechet-mean alternative |
| 05 | [05-action-selection.md](05-action-selection.md) | Argmin over simulated flips; cost-impact divergence; negative-delta and local-minimum handling |
| 06 | [06-composition-theory.md](06-composition-theory.md) | Lemma 1, Theorem 1, Corollary 1, the atom-based dispatch rule, the self-archaeology anti-pattern |
| 07 | [07-nss-coupling.md](07-nss-coupling.md) | NSS proposes, atom disposes: the Extend/Pair/Accept filter, gap-to-primitive mapping, atom-only fallback |
| 08 | [08-validation-lifecycle.md](08-validation-lifecycle.md) | Pre-fit asserts, red flags, the 10-item checklist, lifecycle cadence, persistence, rollback |
| 09 | [09-empirical-validation.md](09-empirical-validation.md) | The 20-cycle experiment: divergence, 12-cycle sweep, shifting peak, diminishing marginal value, fixpoint detection |

## Research summary

- Results collected: 132 (18 primary dig queries + 4 redo queries for 07; top 6 per query)
- Weight split (noul metric, DefAPI typesafe/jev-1.13): 46 high (>= 0.5) / 86 low (< 0.5)
- jev requests: 11 (1 outline score validation, 8 weighting batches of 14, 2 redo-07 weighting batches); usage 14859 input / 2555 output tokens
- Redo counts: 07-nss-coupling 2 redos (original dig and redo 1 were thin; redo 2 recovered 4 usable sources); all other digs 0
- Skipped docs: none (9 of 9 authored)
- Gaps: none

## Method

Outline decomposed by the ground source's own sections into 9 subtopics, validated with the jev score metric (all kept, lowest 0.86 for 07-nss-coupling, kept because redo dig came back with 4 sources at weight >= 0.5). Every result weighted with the noul metric; claims carry their source URL and weight; sub-0.5 weights are labeled weak in the doc text. The ground source is the primary source of record; claims from it are attributed as "source doc" and never contradicted.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI typesafe/jev-1.13 200 (agent-side probe skipped for speed).
