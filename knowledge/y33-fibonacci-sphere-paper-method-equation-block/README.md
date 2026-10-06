# y33-fibonacci-sphere-paper-method-equation-block

Knowledge corpus on the Y_3^3 spherical harmonic and Fibonacci sphere sampling method: the equation block behind learned-latent-curve fits, extracted and formalized for a paper's methods section.

Source doc: yubi-OS/yubiOS refs/y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md (Duck.ai conversation 7, prompts 5 and 6, two equivalent LaTeX block forms).

## Corpus index

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-y33-closed-form-normalization.md](01-y33-closed-form-normalization.md) | The (l=3, m=3) harmonic: complex form K sin^3(theta) e^{i3phi}, Condon-Shortley normalization K = sqrt(245/(64 pi)), real form Re{Y_3^3} = K sin^3(theta) cos(3 phi). |
| 02 | [02-fibonacci-sphere-sampling-indexing.md](02-fibonacci-sphere-sampling-indexing.md) | Canonical Fibonacci sphere indexing z_i = 1 - (2i+1)/N, phi_i = 2 pi i / phi; Vogel and Saff-Kuijlaars provenance; why index i doubles as the latent parameter. |
| 03 | [03-spherical-discrepancy-uniformity.md](03-spherical-discrepancy-uniformity.md) | What the discrepancy literature proves for spherical Fibonacci lattices and where the O(1/N) uniformity claim sits. |
| 04 | [04-latent-projection-sphere.md](04-latent-projection-sphere.md) | The projection step z_i = f_theta(t_i), u_i = z_i / norm(z_i) connecting the learned latent curve to S^2. |
| 05 | [05-harmonic-radial-modulation.md](05-harmonic-radial-modulation.md) | The modulated embedding x_i = (1 + alpha Re{Y_3^3}) u_i: the single tunable scalar alpha and radial-shape precedent. |
| 06 | [06-ablation-baseline-design.md](06-ablation-baseline-design.md) | The four-arm ablation suite (lat-long, Fibonacci alpha=0, Fibonacci+Y_3^3, flat [0,1]^2) and matched-parameter discipline. |
| 07 | [07-sphere-quadrature-integration.md](07-sphere-quadrature-integration.md) | Fibonacci nodes as an equal-weight quadrature grid over S^2, and the t-design / Gauss-Legendre / Lebedev comparators. |
| 08 | [08-convention-constraints-variants.md](08-convention-constraints-variants.md) | Golden-ratio vs Vogel pi variant vs Saff-Kuijlaars psi variant; Condon-Shortley phase; the five non-substitution rules. |

## Research summary

- Results collected: 85 unique results from 16 searXNG queries (2 per subtopic, top 6 per query kept).
- Weight split (jev noul via clef on /api/decide): 39 high (weight >= 0.5), 46 low (weight < 0.5), 0 unweighted. Every archive entry carries a non-null weight.
- Jev requests: 18 total (1 outline score validation + 17 noul weighting batches of 5). Usage: 14792 input tokens, 0 output tokens as reported by the API.
- Redo counts: 0 dig redos; 1 decide request retried once after a transient 502 (batch 45), recovered on attempt 2.
- Skipped docs: none. All 8 subtopics scored >= 0.45 on the outline validation with no score-0 drops; subtopics 05 (score 0.59) and 06 (score 0.45) were marginal and were kept because their digs returned 5 and 3 primary sources respectively.
- Known tension recorded rather than smoothed: the source artifact claims O(1/N) sampling uniformity, while cited cap-discrepancy literature quotes order N^{-1/2} rates for spherical Fibonacci lattices. Doc 03 flags this and recommends citing the specific rate.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
