# appendix-D-manifold-coord

Knowledge corpus on manifold-coordinate benchmarking for corpus audits: the rigorous re-test of manifold coordinate systems (stereographic projection, sphere embedding, learned latents) as measurement instruments. Minted 2026-10-05 from yubi-OS/yubiOS refs/appendix-D-manifold-coord-2026-08-06.md.

## Docs

| NN | doc | scope |
| --- | --- | --- |
| 01 | 01-stereo-lift.md | Stereographic projection and its inverse as a lifting map between the sphere and flat coordinates: conformality, pole handling, and where the lift fails to wrap. |
| 02 | 02-spherical-harmonics.md | Real spherical harmonics as an orthonormal, complete functional basis on the 2 sphere: degrees, span properties, and use as fitting functions in regression. |
| 03 | 03-flat-periodic-fourier.md | Tensor product periodic Fourier bases on flat manifold coordinates: effective rank, degenerate zero columns, and span limits versus harmonic bases. |
| 04 | 04-bias-vs-capacity.md | How to disentangle inductive bias from raw capacity when comparing representations. |
| 05 | 05-partial-in-span-design.md | Designing targets that mix in-span and out-of-span components so topology signal separates from capacity signal, including least-squares floors on the combined target. |
| 06 | 06-paired-statistics.md | Paired per-seed analysis for benchmark evaluation: seeded replication, paired deltas, t-tests, win counts, and what they do and do not establish. |
| 07 | 07-topology-manifolds.md | How genus, periodic coordinate wrap, and manifold topology change what coordinate representations can express, and how topology is detected empirically. |
| 08 | 08-learned-latents.md | Autoencoder and manifold learning latent spaces used as coordinate systems for functions on manifolds: evaluation criteria and failure modes. |

## Research summary

- Results collected: 90 (top 6 per query kept per query, deduplicated within each subtopic's two queries; 16 searXNG queries over 8 subtopics).
- Weight split: 49 high (weight >= 0.5) / 41 low (weight < 0.5) of 90. Low-weight results are listed in each doc's weak backing section and back no factual claim.
- Jev requests: 21 total (1 preflight probe, 1 outline validation with 8 score questions, 18 weighting requests of 5 noul questions each, plus 1 recorded HTTP 429 retry attempt that was resent after 30 seconds and answered on attempt 2). Usage: 16642 input tokens, 0 output tokens.
- Redos: 0 dig redos. All 16 first-attempt queries returned 45 to 62 raw results, above the thin-dig threshold, so no redo was needed.
- Skipped docs: none. All 8 subtopics authored.

## Outline validation

All 8 subtopics scored above the drop threshold (scores 1.2367 to 1.8580 on the 0/1/2 clef score metric); none dropped. Subtopics 02 and 03 scored in the marginal band (1.3598 and 1.2367) and were kept because their digs came back strong (10 and 12 kept results each, 6 primary sources each).

## Preflight

2026-10-05: searXNG 68 results healthy (13 engines unresponsive: boardreader, brave, duckduckgo, fastbot, fireball, gmx, google, google cse, privacywall, qwant, searchmysite, yacy, yep); /api/decide (clef) 200 with probe answer noul = 0.9343.

## Gaps / skips

None. No doc skipped, no dig fell back to direct primary-source fetching.
