# lensing-question-space-findings

Consolidated findings on lensing the question space and spherical diffusion (SLERP extension): the verified conclusions from the brainstorm, what anchors hold, and the remaining gaps. Minted 2026-10-05 from the yubiOS refs doc `lensing-question-space-findings-2026-08-13.md`. Framework-internal numbers (Delta V2 = +0.0144 at z = +12.3, T_x = 0.0411, the 2286 x 9 corpus, the 14 exact-1.0000 rows) come from that source doc; every external factual claim in the docs carries a dig source URL and its jev weight.

## Docs

| doc | scope |
|---|---|
| [01-optical-conformal-lens-mapping.md](01-optical-conformal-lens-mapping.md) | The Mobius chart phi_theta as a literal optical lens (Leonhardt conformal mapping) and the atom as a discrete Fermat/Snell ray tracer |
| [02-null-standardization-as-deflection.md](02-null-standardization-as-deflection.md) | The curveball null as the unlensed background, the residual as deflection, and the random-matrix medium behind the null |
| [03-caustics-catastrophe-degeneracy.md](03-caustics-catastrophe-degeneracy.md) | Exact-1.0000 gate passes as caustics; Thom-Arnold classification; Brenier singularities as the transport analog |
| [04-achromatic-parseval-coordinates.md](04-achromatic-parseval-coordinates.md) | Parseval shares as scale-free, dimension-invariant (achromatic) coordinates for cross-ladder comparison |
| [05-question-space-chain.md](05-question-space-chain.md) | The Q, N0, I, latent chain: Fisher-Rao intent geometry via Cencov, NPE prior art, the effective-dimension dial |
| [06-lens-gaps-test-agenda.md](06-lens-gaps-test-agenda.md) | The Part I gap map A to F with the cheapest test for each, and the merged order of attack |
| [07-slerp-geodesic-interpolation.md](07-slerp-geodesic-interpolation.md) | Shoemake slerp as the constant-speed geodesic, the three discrete slerps in the framework, and why geodesic beats linear |
| [08-heat-kernel-spectral-diffusion.md](08-heat-kernel-spectral-diffusion.md) | Spherical harmonics as Laplace-Beltrami eigenfunctions; closed-form spectrum diffusion; the null as the t to infinity endpoint |
| [09-riemannian-diffusion-lensing.md](09-riemannian-diffusion-lensing.md) | RSGM and Riemannian diffusion models on symmetric spaces; reverse diffusion read as the general lens |
| [10-langevin-vmf-scale-space-bridge.md](10-langevin-vmf-scale-space-bridge.md) | Sphere Langevin and the compass atom, von Mises-Fisher families, the z(t) scale-space channel, and the Schrodinger bridge |

## Research summary

- Results collected: 118 unique results across 20 searXNG queries (2 per doc, 10 docs), all 10 outline subtopics kept after jev score validation (scores 1.18 to 1.89 on the 0 to 2 load-bearing scale, none dropped).
- Weight split: 63 results at weight >= 0.5 (primary/authoritative backing), 55 below 0.5 (weak, labelled as such wherever cited).
- jev requests: 26 total (1 outline score request over 10 questions, 1 noul smoke probe, 24 noul weighting batches of 5). Usage: 20992 input tokens, 0 output tokens recorded.
- Redo counts: 0 dig redos (every doc kept 11 or 12 results with 4 or more at weight >= 0.5); 2 jev 429 retries inside the normal backoff path (batches 15 and 22).
- Skipped docs: none. All 10 docs authored.
- Honesty gaps carried in-doc: the Lyu-Mukherjee paper (arXiv:2407.14942), Kalaba-Ueno and Tyc corner-condition papers, Huang et al. Riemannian Diffusion Models details, Zhang effective dimension, Johnson-Lindenstrauss, and the Schrodinger bridge / Diffusion Schrodinger Bridge literature did not surface in this dig and are marked as source-doc attributions in docs 02, 01, 09, 05, and 10.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200. (This run's own probe: searXNG returned 59 results for the probe query with no unresponsive engines; /api/decide returned 200 with an answers object.)

## Research-db

`research-db/` holds the typed audit trail: `preflight.json`, `outline.json`, `archive.json` (118 fully weighted entries), `digs/` (one ledger per doc), `jev-log.json` (26 request records), and `db.ts` (interfaces).
