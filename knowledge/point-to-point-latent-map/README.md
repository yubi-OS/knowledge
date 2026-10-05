# point-to-point-latent-map

Knowledge corpus on point-to-point latent mapping for unlabeled corpora: binarization under a stated rule, placement on the 2-sphere, fixed-margin null models, two-class certificates shadowing Lean-verified identities, and deployment as an isomorphic browser/Worker module. Minted from the yubiOS refs/ source doc `point-to-point-latent-map-2026-09-06.md`.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | 01-keys-and-identity.md | Identity keys for unlabeled items: FNV-1a and SHA-256 content hashing, ordinal injectivity, collision classes. |
| 02 | 02-binarization-rules.md | Binarizing continuous vectors under a stated rule: median splits, quantile and sign variants, PCA axes, comparability. |
| 03 | 03-sphere-placement.md | Placement: PCA top-2, inverse stereographic lift to S2, pole reference, geodesic and chordal distance. |
| 04 | 04-hamming-spectra.md | Krawtchouk polynomials and the Hamming association scheme: hypercube spectra and shell occupancy. |
| 05 | 05-spherical-harmonics.md | Spherical harmonic power spectra for point sets on the sphere: expansion, angular power, heat decay structure. |
| 06 | 06-metropolis-samplers.md | Metropolis-Hastings chains on discrete state spaces: acceptance rules, detailed balance, flux and convergence diagnostics. |
| 07 | 07-curveball-nulls.md | Fixed-margin nulls for binary matrices: curveball trades versus permutation, mixing, admissibility floors. |
| 08 | 08-verified-identities.md | Lean theorem proving and exact arithmetic versus floating point measurement: why certificates split into two classes. |
| 09 | 09-edge-transport.md | Slerp and geodesic transport between sphere points: constant-ratio rungs, monotonicity, antipodal handling. |
| 10 | 10-worker-deployment.md | Deployment on Cloudflare: Workers AI embeddings, D1 persistence, isomorphic browser/Worker numeric modules. |

## Research summary

- Results collected: 120 (2 searXNG queries per doc, top 6 kept per query).
- Weight split: 76 results at weight >= 0.5 (authoritative backing), 44 below 0.5 (weak backing, labeled in the docs).
- Jev requests: 25 logged entries (1 outline validation with 10 score questions, 24 weighting requests with 5 noul questions each). 4 additional requests failed with HTTP 429 and were retried after 30s backoff per the redo rule; they are recorded in jev-log.json. Usage: 20581 input tokens, 0 output tokens.
- Redo counts: 0 dig redos (every query returned results on attempt 1).
- Skipped docs: none. All 10 outline subtopics scored above the drop threshold (scores 1.35 to 1.89 on the 0-2 score metric) and every doc dig returned enough weighted sources to author honestly.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Research DB

`research-db/` carries the full audit trail: `preflight.json` (endpoint probes), `outline.json` (subtopics plus the score-metric validation answers), `archive.json` (all 120 results with their full noul decision records), `digs/<NN>-<slug>.json` (per-doc dig records), `jev-log.json` (one entry per jev HTTP request), and `db.ts` (TypeScript interfaces for every shape above).
