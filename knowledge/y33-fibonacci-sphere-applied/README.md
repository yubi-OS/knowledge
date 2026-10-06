# y33-fibonacci-sphere-applied

A knowledge corpus on applying the Y_3^3 spherical harmonic plus Fibonacci sphere machinery to corpus audit: the applied synthesis that connects the learned-latent-curves paper's math (the equation block and revised passage insertions) to practical operational use (rsi-phi-skill, the 5-dim time-series gate, the 384-D variant selection, and the downstream consumer set). Minted 2026-10-05 from yubi-OS/yubiOS refs/y33-fibonacci-sphere-applied-2026-08-07.md.

## Documents

| NN | file | scope |
|---|---|---|
| 01 | 01-fibonacci-sphere-sampling.md | The Fibonacci sphere sampling scheme on S2: z_i = 1 - (2i+1)/N, phi_i = 2 pi i / varphi with varphi the golden ratio, theta_i = arccos z_i; why it avoids polar clustering and gives low discrepancy. |
| 02 | 02-y33-harmonic-basis.md | The Y_3^3 spherical harmonic itself: closed form Re{Y_3^3} = K sin^3 theta cos(3 phi), Condon-Shortley normalization, 3-fold azimuthal symmetry, and its role as an angular probe rather than a radial factor. |
| 03 | 03-applied-paper-insertions.md | The two applied insertions into learned-latent-curves-2026-08-06.tex (Fibonacci sampling scheme + explicit Y_3^3 identity) placed right after the Riemann-sphere sentence, plus the companion equation-block and revised-passage artifacts. |
| 04 | 04-rsi-phi-operationalization.md | Operationalizing the math as rsi-phi-skill: the paper-to-skill mapping, i = t Fibonacci parameterization, 384 azimuthal lobes m = 3..384 step 3, and the dual-ordering testing constraint. |
| 05 | 05-time-series-gate-5dim.md | The 5-dim PC1+PC2 gate table after the application: 7-D, 9-D, 16-D, 24-D, 384-D bases, their principal-component coverage values, and which dimensions passed or failed. |
| 06 | 06-variant-testing-384d.md | Why the native (l=3) 384-lobe basis failed the gate at PC1+PC2 = 0.0156: the sin^3 theta polar vanishing, how raising l to 128 or 384 sharpens equatorial contrast, and the chosen (l=384, m=3, sin^384 polar) variant at PC1+PC2 = 1.0000. |
| 07 | 07-downstream-consumers.md | Who consumes the applied y33 machinery: paper readers (runnable sampling scheme), RSI loop users (rsi-phi-skill as the operational entry point), and the render pipeline (384-D time-series entry and keystone visualization). |

## Research summary

- Results collected: 84 (14 searXNG queries, 2 per subtopic, top 6 kept per query).
- Weight split: 39 results at weight >= 0.5 (authoritative backing), 45 results below 0.5 (weak backing; cited only where labeled weak in the docs).
- Jev requests: 19 total HTTP requests to /api/decide (1 preflight probe, 1 outline validation, 17 weighting batches). Usage: 14,387 input tokens, 0 output tokens.
- Redos: 0 dig redos; 0 jev HTTP retries (no failed decide requests).
- Skipped docs: none. All 7 subtopics authored (outline scores 0.89 to 1.84, none dropped).
- Gaps: none.

Preflight 2026-10-05: searXNG 100 results healthy; /api/decide (clef) 200.
