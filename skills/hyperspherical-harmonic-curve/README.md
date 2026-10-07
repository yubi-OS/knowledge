# hyperspherical-harmonic-curve knowledge corpus

Knowledge corpus minted from the yubiOS skill `skills/hyperspherical-harmonic-curve/SKILL.md` (yubi-OS/yubiOS). Topic: hyperspherical-harmonic basis (S2 default, gated S^N) with learned Moebius reparameterization for corpus audit, sphere geometry instead of flat 2-D Fourier, fewer parameters, measured delta at both fitness-test phases.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [basis-on-sphere](01-basis-on-sphere.md) | The S2 (default) and gated S^N hyperspherical-harmonic basis replacing the flat 2-D Fourier surface; basis-library contract and epsilon_basis. |
| 02 | [mobius-reparameterization](02-mobius-reparameterization.md) | The learned Moebius phi_theta in PSL(2,C), closed-form ridge plus L-BFGS-B fit, ad-bc=+1 normalization, cross-ratio gate. |
| 03 | [ablation-fitness-deltas](03-ablation-fitness-deltas.md) | The matched-parameter ablation vs flat 2-D Fourier at both fitness phases; measured deltas and the ship-or-null fallback. |
| 04 | [calibration-gates](04-calibration-gates.md) | epsilon_basis orthonormality test (and its test-bug story), spectral-mass rho gate, high-degree mass gate, holdout R2. |
| 05 | [sparse-cell-detection](05-sparse-cell-detection.md) | Equal-area S2 partition, cKDTree isolated-cell detector at chordal r=0.095, measured isolated counts. |
| 06 | [corpus-audit-pipeline](06-corpus-audit-pipeline.md) | How corpus items become S2 points (PCA, stereographic lift), the Stage 1/2/3 pipeline, per-file delta comparability. |
| 07 | [refinement-lifecycle](07-refinement-lifecycle.md) | Moebius refinement modes (joint per cycle vs refine-once), the selection rule, the 25 percent re-fit trigger. |
| 08 | [prior-art-novelty](08-prior-art-novelty.md) | The two depth-verified prior-art papers, the group-theoretic distinction, the composition-level novelty verdict. |
| 09 | [rsi-discipline-history](09-rsi-discipline-history.md) | The bounded RSI loop discipline: hypothesis per cycle, fixpoint rule, 3-cycle cap and override, cycles 1-5, 8, 9 as worked example. Internal-record subtopic, no dig. |

Ground source: yubi-OS/yubiOS skills/hyperspherical-harmonic-curve/SKILL.md (17405 B fetched 2026-10-07). Every doc cites the source doc for its grounding spine plus searXNG dig results for external mechanisms. Claims with jev weight below 0.5 are labeled weakly backed in text.

## Research summary

- Results collected: 132 (96 from 16 first-pass queries, 36 from 6 redo queries), top 6 kept per query.
- Weight split (jev noul, typesafe/jev-1.13): high (>= 0.5) 3, low (< 0.5) 129. The dig surfaced few authoritative pages; most corpus claims are therefore weakly backed externally and lean on the source doc for the measured numbers. This is recorded honestly per doc rather than padded.
- Jev requests: 12 total (1 outline validation, 11 noul weighting batches). Usage: 16857 input tokens, 2691 output tokens.
- Redos: 3 (subtopics 02, 03, 04; first-pass digs too thin, re-dug with different queries, all logged in digs/).
- Skipped docs: 0. Gaps: none. Subtopic 03's dig remains weak (best external weight 0.20) but sufficient to author with explicit weak labels.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator probe); DefAPI direct (typesafe/jev-1.13) 200 on every request, zero 429s.

## Research DB

Under [research-db/](research-db/): preflight.json, outline.json, archive.json (all 132 weighted results), digs/ (9 per-subtopic records), jev-log.json, db.ts (schema interfaces).
