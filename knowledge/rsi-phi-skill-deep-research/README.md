# rsi-phi-skill-deep-research

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS refs/rsi-phi-skill-deep-research-2026-08-07.md. The corpus backs the rsi-phi-skill (the Fibonacci-sphere variant of recursive-self-improvement): the investigation that produced it, the design choices taken, and the provenance of the Vogel-sampling and spherical-harmonic basis decisions.

## Docs

| # | doc | scope |
|---|---|---|
| 01 | 01-fibonacci-vogel-sampling.md | Provenance of the golden-angle sphere sampling: Vogel 1979, Saff-Kuijlaars 1997, closed form in i, why i = t works |
| 02 | 02-spherical-harmonics-y33.md | The Y_3^3 native basis: real form, Condon-Shortley phase, NIST DLMF and SciPy normalization chain |
| 03 | 03-sphere-vs-flat-parameterization.md | Why azimuthal corpora need the Riemann sphere instead of flat [0,1]^2, and the manifold-fitting literature behind the swap |
| 04 | 04-rsi-loop-structure.md | The bounded RSI loop: gap-map, hypothesis, edit, re-map, fixpoint, cycle cap, and evidence-gap-map methodology |
| 05 | 05-pca-gate-polar-sharpening.md | The PCA gate, the three 384-D variants, why the native sin^3 basis fails at high dimension, polar sharpening |
| 06 | 06-fixed-vs-learned-basis.md | Fixed versus learned bases for the curve fit, the family's learned-latent branch, and why the fixed probe was chosen |
| 07 | 07-dispatch-and-verification.md | Per-cycle dispatch to parallel deep-research subagents and adversarial verification before human-approved edits |

## Research summary

- Results collected: 84 (14 searXNG queries, 2 per subtopic, top 6 kept per query, deduped by URL)
- Weight split: 43 authoritative (weight >= 0.5), 41 weak (weight < 0.5), of 84 total
- Jev requests: 19 (1 preflight probe, 1 outline validation of 7 subtopics, 17 weighting batches of 5), usage 15102 input / 0 output tokens
- Redo counts: 0
- Skipped docs: none. All 7 validated subtopics were authored.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Notes and gaps

- Every factual claim in the docs carries its source URL and jev weight. Claims backed at weight < 0.5 are labeled weak in text.
- Skill-internal design facts (the variant test numbers, the loop skeleton, the i = t choice) are sourced from the skill's own SKILL.md on GitHub, which the weighting model scored 0.4717 (weak); these are labeled weak rather than laundered through stronger-looking citations.
- Noise results in the dig (Evan Williams bourbon, South Asian Football Federation, gap.com, realtor.com, flat.io, and similar) were weighted low by the model and are excluded from all claims.
- No dig needed a redo; all 14 queries returned 6 usable results each.

## research-db

- preflight.json: searXNG and /api/decide probes
- outline.json: 7 subtopics with seed queries and the jev score validation
- archive.json: all 84 collected results with weights and full decision records
- digs/01..07: per-subtopic dig records
- jev-log.json: every jev HTTP request with usage tokens
- db.ts: TypeScript interfaces for all shapes
