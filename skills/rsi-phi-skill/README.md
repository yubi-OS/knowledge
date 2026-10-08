# rsi-phi-skill knowledge corpus

A minted knowledge corpus explicating the yubiOS skill `rsi-phi-skill` (recursive self-improvement on the Fibonacci sphere: Vogel golden-angle sampling with i = t, native Y_3^3 real spherical harmonic basis, extension to 384 azimuthal lobes, deep-research subagents per cycle).

Ground source: yubi-OS/yubiOS skills/rsi-phi-skill/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md, 15526 bytes fetched 2026-10-08). The source doc is the primary source of record; every doc cites it for its grounding spine and labels which claims come from digs versus the source doc.

## Index

| Doc | Scope |
|---|---|
| [01-when-to-use.md](01-when-to-use.md) | The 4 use triggers, the 4 exclusions, sibling-skill routing |
| [02-fibonacci-sphere-sampling.md](02-fibonacci-sphere-sampling.md) | Vogel golden-angle sampling, the i = t closed form, O(1) mapping |
| [03-y33-spherical-harmonic-basis.md](03-y33-spherical-harmonic-basis.md) | Native Y_3^3 basis, K = sqrt(245/(64 pi)), Condon-Shortley convention hazards |
| [04-azimuthal-lobe-extension.md](04-azimuthal-lobe-extension.md) | 384 lobes via m = 3k, dual (l, m) orderings, PC1+PC2 gate, coverage delta |
| [05-rsi-pipeline-cycle.md](05-rsi-pipeline-cycle.md) | The 5-step per-cycle pipeline and the 3-cycle cap |
| [06-self-mode-bias.md](06-self-mode-bias.md) | Self-mode, self-author bias, fresh-context subagent per cycle |
| [07-constraints-invariants.md](07-constraints-invariants.md) | The 7 hard rules and the conventions they pin |
| [08-sources-prior-art.md](08-sources-prior-art.md) | Vogel 1979, Saff-Kuijlaars 1997, DLMF, the two y33 refs papers |

## Research summary

- Results collected: 120 (96 from the first dig pass across 16 queries, 24 from redo passes across 4 redo queries), 6 kept per query.
- Weight split: 6 high (>= 0.5) / 114 low (< 0.5), 0 unweighted. The high set: Wolfram MathWorld Spherical Harmonic (4 entries), SciPy sph_harm Condon-Shortley docs, SHTOOLS real spherical harmonics.
- jev requests: 10 total (1 outline score-validation of 8 questions, 8 noul weighting batches of 12, 1 noul redo batch of 24), 16284 input / 2536 output tokens, endpoint https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13.
- Redos: 2 digs redone (04 azimuthal-lobe-extension, 06 self-mode-bias), 1 redo each, different queries per redo; both logged in research-db/digs/.
- Skipped docs: none. All 8 subtopics authored. Subtopic 06 carries the weakest external corroboration (all dig sources below 0.5); its substance rests on the source doc.
- No em dashes anywhere in the corpus; numbers as digits.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); weighting endpoint (DefAPI direct, typesafe/jev-1.13) healthy in-run, 10/10 requests HTTP 200.
