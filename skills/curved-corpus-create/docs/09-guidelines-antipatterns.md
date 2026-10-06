# 09 - Guidelines, anti-patterns, and red flags

Scope: the eleven operating guidelines, the forbidden moves, and the observation table that diagnoses a sick run.

Source of record: yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md. This is an internal-record subtopic: no external dig was run; every rule below is quoted or tightly paraphrased from the source doc.

## The eleven guidelines

1. Never report a raw V2, PC1+PC2, or R^2 without its null. A number without a null is a number without a claim.
2. Use the curveball null for the primary decision.
3. Match the null's N and d to the data. V2 nulls relax toward 2/D like Marchenko-Pastur in D/N; comparing a real N=40 value to a null computed at N=2286 manufactures a critical point that is not there.
4. Pre-register the sweep. Fix amplitudes, trials, reps, and the threshold before running.
5. Report power, not just significance. "We did not detect a curve" is only meaningful next to "at this N we would have detected amplitude >= 0.75 with probability 1.0".
6. Treat sphere R^2 and PC1+PC2 as diagnostics, not evidence.
7. Keep i = t. The Fibonacci index is the parameter.
8. Any azimuthal claim needs an ordering-permutation null.
9. Seeds are part of the result.
10. Lens-format outputs only (v1.1.0). Every measurement is a lens with hypothesis + method + parameters + delta + verdict + score + caveat. NO flat calibration tables, NO flat placement tables.
11. Verdict is YES/PARTIAL/NO (three-valued), never YES/NO. NO is "the experiment ran and the claim failed". PARTIAL is "the experiment ran but one of the criteria did not pass". YES is "all criteria passed".

Note the tension between guideline 11 and the v1.0.0-era anti-pattern phrasing "Don't emit PARTIAL": in v1.1.0 PARTIAL is a permitted verdict, the anti-pattern list's item means do not reach for PARTIAL as a soft escape when a criterion clearly failed. Use NO when a criterion fails, not PARTIAL [source doc].

## The anti-patterns

- Do not cite PC1+PC2 = 1.0000 as a good fit.
- Do not compare V2 across different d.
- Do not use the iid or column-permutation null to claim structure.
- Do not tune amplitude until detection succeeds and then report the detection. The sweep is the deliverable; the point estimate is not.
- Do not reuse a calibration pack across N, d, base rate, or mode count.
- Do not read curvature into a mixture.
- Do not skip the selftest after editing the script.
- Do not ship flat calibration or placement tables (v1.0.0 format). Use lens format.

## The red flags

| Observation | What it means |
|---|---|
| PC1+PC2 exactly 1.0000 | rank degeneracy |
| design_numrank < 16 | the SH design collapsed |
| dV2z large under iid/colperm but about 0 under curveball | you are measuring row-mass bimodality, not structure |
| dV2z large and negative | the corpus is less concentrated than its marginals allow |
| FPR at |z|>3 above 0.05 in the calibration pack | the null ensemble is under-mixed |
| sphere R^2 moves while dV2z does not | the fit is tracking the PCA embedding, not the planted signal |
| lens has delta: {} or score: 0 | the experiment did not run |
| 100+ lenses all verdict=YES with score 50 | the experiment is degenerate |

The last two rows are v1.1.0-aware: a lens with an empty delta is not a failed hypothesis, it is an experiment that never ran, and a lens pool where everything passes at full score is itself a red flag [source doc].
