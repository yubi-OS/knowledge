# complex-ginzburg-landau-skill-emergence

Knowledge corpus minted from `yubi-OS/yubiOS refs/complex-ginzburg-landau-skill-emergence.md`: the Complex Ginzburg-Landau equation as a model for skill emergence, phase transitions in capability coverage during recursive self-improvement cycles, and what the CGL framework predicts about skill-corpus dynamics.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | gl-free-energy-functional | The static GL free energy functional: complex order parameter, alpha/beta/gamma, the alpha=0 second-order transition, mean-field exponents. |
| 02 | tdgl-relaxational-dynamics | Time-dependent GL: relaxational dynamics, kinetic coefficient, and the Lyapunov property dF/dt <= 0. |
| 03 | coherence-length-type-classification | Coherence length, penetration depth, the GL parameter kappa, type-I versus type-II, critical fields, Abrikosov vortices. |
| 04 | cgle-nonequilibrium-dynamics | The generic CGLE with c1 and c3: plane waves, defect chaos, and the equal-coefficient Lyapunov exception (erratum E1). |
| 05 | stochastic-tdgl-noise | Stochastic TDGL: Langevin noise, fluctuation-dissipation, and how noise seeds, rounds, and shifts emergence thresholds. |
| 06 | corpus-mapping-dictionary | The GL-to-corpus variable dictionary: 9-primitive coverage vector as order parameter, corpus size as inverse-temperature-like control variable. |
| 07 | pc-variance-stiffness-diagnostic | Why PC1+PC2 is an observable stiffness-like diagnostic and not a free energy; what an empirical F_eff with a measured Hessian would be. |
| 08 | empirical-climb-record | The 0.2993 to 0.7657 climb across cycles 4 to 23, a candidate critical range N = 80 to 500, saturation, and defect rows. |
| 09 | testable-predictions-diagnostics | The eight cycle-24 diagnostics plus the 2/9 bound erratum (2/9 = 0.222 is an isotropic floor, not a 0.78 ceiling). |
| 10 | analogy-limits-falsifications | The seven standing caveats, vortex glass versus Abrikosov lattice, and the falsifications that remain standing. |

## Research summary

- Results collected: 134 (searXNG via the n8n proxy, top 6 per query, deduplicated by URL)
- Weight split: 70 high (>= 0.5) / 64 low (< 0.5)
- jev requests: 42 logged (1 outline score request with 10 questions, 41 noul weighting requests in batches of 5 with single-retry fallbacks), plus 1 preflight probe. Usage: 24696 input tokens, 0 output tokens.
- Redos: 3 (doc 03 attempt 2 with new queries after search-engine noise; doc 08 attempt 2 with a metric-artifact query; doc 10 attempt 2 with a vortex-glass review query)
- Skipped docs: none. All 10 kept subtopics dug strongly enough to author honestly.
- Weighting integrity: every archive entry carries a non-null jev weight. A 429 on batch 15 of the initial sweep was retried per the redo rule (30 s backoff, succeeded on attempt 3).
- Per-doc sources: 01 kept 10 (6 primary), 02 kept 12 (7 primary), 03 kept 21 (7 primary), 04 kept 11 (7 primary), 05 kept 12 (7 primary), 06 kept 12 (5 primary), 07 kept 12 (7 primary), 08 kept 16 (7 primary), 09 kept 12 (5 primary), 10 kept 16 (9 primary).
- Claims sourced only from the source doc's internal measurement record (cycle tables, cycle-22 scoring distribution, errata) are labeled "record" in the docs and are not presented as independently verified web facts.

## Outline validation

All 10 subtopics scored by clef (score metric, one request). Lowest score: 0.56 (doc 03, kept as marginal on a strong redo dig). No subtopic dropped.

## Preflight

Preflight 2026-10-05: searXNG healthy (127 results on probe query); /api/decide (clef) 200.

## Gaps / skips

None. Note for readers: the source doc's errata (E1 to E3) already falsify or retire parts of the original model; this corpus carries those corrections forward rather than the superseded claims.
