# 06 - Time-series library

**Scope:** the 5-dim per-cycle fit library the regime produces at papers/data/series/, indexed by INDEX.json, and the PC1+PC2 gate outcome recorded for each dimension.

This is an internal-record subtopic: the dimensions, basis definitions, and gate numbers below are recorded outputs of regime runs, verifiable only against the source doc (yubi-OS/yubiOS playbooks/rsi-regime.md) and the repo's papers/data/series/INDEX.json it names. No web dig was run, so no external weights apply; all claims carry "source doc" attribution.

## What the library is

The regime produces a per-cycle fit at 5 dimensions, indexed by papers/data/series/INDEX.json (source doc). Each entry is the same corpus measured under a different basis width, so the library is simultaneously a result set and an ablation record of which basis dimensionality is informative for which corpus.

## The 5 dimensions

| Dim | Basis (source doc) | Gate (PC1+PC2) |
|---|---|---|
| 7-D | repo-refs-skill 7-D basis (problem_statement, recommendation, and more) on refs/*.md | 1.0000 (boundary) |
| 9-D | internal-big-picture 9-D basis (attestation, trust_chain, and more) on self + docs + refs sections | 0.4565, pass |
| 16-D | Real SH basis values evaluated at each item's S2 point (L=3 gives 16 functions) | 0.4627, pass |
| 24-D | 9-D primitives + 12 NSS axes + 3 metadata (size_log, age_log, is_rsi) | 0.2993, fail |
| 384-D | Fibonacci-sphere phi basis sin^3 theta * cos(m phi) with m = 3..384 step 3, i.e. 384 symmetric azimuthal lobes on Y_3^3, with (l=128) and (l=384) variants tested per rsi-phi-skill constraints | chosen variant (l=384, m=3, sin^384 polar): 1.0000, pass |

## How to read the gate column

The fit gate is PC1+PC2 >= 0.40 (source doc; see 05-math-conventions.md). Against that floor:

- 7-D at 1.0000 sits on the boundary of the fit. A perfectly separable 2-component structure is convenient for a curve map but leaves no residual variance, which is worth remembering when comparing it against the 9-D and 16-D results.
- 9-D at 0.4565 and 16-D at 0.4627 pass the gate with margin. These are the two dims where the sphere projection carries real 2-D structure.
- 24-D at 0.2993 fails the gate. The source doc records the failure rather than hiding it: concatenating the 9-D primitives with the 12 NSS axes and 3 metadata fields spreads variance over too many directions for the top-2 PCA to carry. The regime treats this as evidence the 24-D basis is not a sphere-shaped projection of this corpus, not as a bug to fix by re-tuning the gate.
- 384-D at 1.0000 for the chosen (l=384, m=3, sin^384 polar) variant passes at the boundary. The source doc notes both (l=128) and (l=384) variants were tested per the rsi-phi-skill constraints, which is hard rule 3 applied to this library.

## Provenance note

The 2026-08-07 changelog entry in the source doc dates this library's current state: "rsi-phi-skill added, 384-D Fibonacci-sphere variant tested, keystone diagram built" (source doc). Anything the corpus does with these dims after that date postdates the playbook and should be checked against INDEX.json before being asserted.
