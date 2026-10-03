# linear-viscoelasticity

**Minted 2026-10-02** from the viscoelastic data-layout research request (Roylance, *Engineering Viscoelasticity*, MIT 2001 as anchor doc). Purpose: the knowledge base behind reading a corpus-laying harness (the yubiOS jev / envharness program) as a viscoelastic material: rigidity (frozen frame = glassy state), creep and relaxation (metric drift under sustained directive streams), dissipation (predict-vs-realized hysteresis), and snap-back (round-3 style sign reversals).

Consumer programs: `jev-corpus` viscoelastic instrument design (missing-links analysis in `00-ideate-and-missing-links.md`), `CurvedCorpus.lean` extension candidates (doc 06), and the broader knowledge/ corpus.

## Docs

| doc | scope |
|---|---|
| 01-molecular-mechanisms-regimes.md | Molecular mechanisms and regimes: energetic vs entropic elasticity, glassy/rubbery moduli, Tg, crosslink density, kinetic theory of rubber elasticity |
| 02-creep-relaxation-dynamic-tests.md | The three canonical tests: creep compliance, stress relaxation modulus, dynamic storage/loss moduli, tan delta, dissipated vs stored work per cycle |
| 03-spring-dashpot-models.md | Maxwell, Kelvin-Voigt, Standard Linear Solid, Wiechert/Kelvin generalized models; Laplace-plane modulus operator; Prony series |
| 04-boltzmann-superposition-correspondence.md | Boltzmann superposition integral, four Duhamel forms, relaxation-compliance deconvolution, viscoelastic correspondence principle |
| 05-time-temperature-superposition.md | Thermorheologically simple materials, shift factors, Arrhenius and WLF, master curves, effective time |
| 06-lean-mathlib-formalization-path.md | What mathlib has (convolution, ODE, Mellin) and what is missing (Laplace transform, Volterra/Duhamel, Prony) for formalizing superposition |
| 07-measurement-practice-reference-canon.md | DMA measurement practice, master-curve construction, collocation fitting, and the verified reference canon (Ferry, Christensen, Tschoegl, Findley, WLF 1955) |

## Research summary

The corpus decomposes linear viscoelasticity along its own joints (mechanisms, tests, models, hereditary integrals, temperature, formalization, measurement). Anchor facts were verified against the Roylance notes directly; dig results carry jev-1.13 quality weights in `research-db/digs/`. The searXNG webhook rejected the bare `?q=` query shape for most author lanes (HTTP 500) while the `?endpoint=search&qs=` shape returned 118 results in preflight; author lanes fell back to primary-source verification and web search, documented per-dig. Doc 06 verified mathlib4 claims directly against the mathlib4 repo/docs (convolution and ODE exist; Laplace transform, Volterra/Duhamel, and Prony support absent as of mint date).

## Research DB

- `preflight.json`: Phase 0 endpoint probes (searXNG + jev /api/decide), 2026-10-02.
- `digs/01.json` .. `digs/07.json`: per-doc dig results with jev weights and task lineage.
- `archive.json`: collection summary.
- `db.ts`: typed index.
- `qc-log.json`: every jev-1.13 decision call made in this run (orchestrator + author lanes), with task_id, cost, and verdicts. All decisions in this corpus were qualified through the worker /api/decide endpoint (jev-1.13).
