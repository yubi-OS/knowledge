# knowledge/zernike-fit: Zernike polynomials as corpus-audit instruments

Minted 2026-10-05 from yubi-OS/yubiOS refs/zernike-fit-2026-08-24.md. The corpus covers where Zernike polynomials fit in a curved-corpus program, what they measure, and the audit of whether they appear in the program's papers (they do not appear in the tex sources of the three papers; the refs doc identifies 4 precise slots where the program has been circling them unnamed).

## Docs

| NN | doc | one-line scope |
|---|---|---|
| 01 | 01-zernike-basis.md | The Zernike polynomials as an orthogonal system on the unit disk: definition, completeness, Zernike 1934, Noll 1976 indexing and normalization. |
| 02 | 02-aberration-theory.md | Aberration theory and the semantics of the low-order modes; the aberrated-lens extension of slot 1. |
| 03 | 03-caustic-classification.md | Catastrophe optics: caustics as catastrophes of the aberration function (Berry and Upstill 1980, Nye 1999); slot 2 operationalization of Gap E. |
| 04 | 04-jacobi-radial.md | Radial polynomial closed forms, recurrences, evaluation practice, and the identity-type vs measurement-type split. |
| 05 | 05-disk-sphere-bases.md | The pre-lift disk basis versus the post-lift sphere basis; slot 3's pre-lift twin of the Parseval shares. |
| 06 | 06-metrology-practice.md | Zernike coefficients in industrial and standards practice: interferometry, manufacturing, ANSI Z80.28. |
| 07 | 07-spectral-audit.md | Null-standardized spectral auditing: Ripley K randomness tests, permutation and randomization nulls, the curveball z > 3 protocol. |
| 08 | 08-terminology-collision.md | The defocus naming collision: optical defocus as deterministic quadratic rephasing versus stochastic heat-flow defocus. |

## Research summary

- Results collected: 108 (96 first pass over 16 queries, 8 subtopics x 2 queries, top 6 kept per query; plus 12 redo results for doc 07).
- Weight split: 58 results at weight >= 0.5 (primary/authoritative backing), 50 results below 0.5 (weak backing; used in text only when labeled as weak). Every archive entry carries a non-null weight.
- Jev requests: 25 total (1 preflight probe, 1 outline validation with 8 score questions, 20 weighting batches of 5 noul questions, 3 redo weighting batches for doc 07's redo dig), plus 7 re-sent batches after 429 rate limiting. Usage: 18886 input tokens, 0 output tokens (clef).
- Redo counts: 1 dig redo (doc 07, first-pass dig returned unusable results including an off-topic film page scored 0.706; rerun with different queries). 7 weighting batches hit 429 and were re-sent after a 30s sleep, per the redo rule.
- Skipped docs: none. The two marginal-score subtopics (03 at 0.92, 08 at 0.85) were kept because their digs came back with 6 and 4 primary sources respectively.
- Known gaps recorded in-doc rather than skipped: doc 04 records that the Jacobi-polynomial identification of the radial parts was not independently confirmed by this dig and stands as a program assertion; doc 03 records that the explicit Zernike-mode-to-catastrophe-type mapping is the program's positioning, not a dig-confirmed formula.

## Outline validation (jev score, clef)

| NN | subtopic | score | verdict |
|---|---|---|---|
| 01 | zernike-basis | 1.92 | keep, load-bearing |
| 02 | aberration-theory | 1.64 | keep |
| 03 | caustic-classification | 0.92 | marginal, kept on dig strength |
| 04 | jacobi-radial | 1.81 | keep, load-bearing |
| 05 | disk-sphere-bases | 1.52 | keep |
| 06 | metrology-practice | 1.37 | keep |
| 07 | spectral-audit | 1.71 | keep |
| 08 | terminology-collision | 0.85 | marginal, kept on dig strength |

## Preflight

2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Research-db

research-db/ holds preflight.json, outline.json, archive.json (108 weighted entries), digs/ (8 per-subtopic dig records), jev-log.json (25 requests), and db.ts (the interfaces for every shape above).
