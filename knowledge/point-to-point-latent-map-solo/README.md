# point-to-point-latent-map-solo

Knowledge corpus minted from yubi-OS/yubiOS `refs/point-to-point-latent-map-solo-2026-09-06.md`: the ideation record for a proof-carrying point-to-point latent map, covering the 7 design variations considered for mapping unlabeled corpora onto sphere geometry as a deployable browser/Worker tool, and the finalist design decisions.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-ideate-solo-variation-method.md](01-ideate-solo-variation-method.md) | How the 7 variations were generated with forced lenses and scored on the P/S/D/T matrix with threshold 8 |
| 02 | [02-proof-carrying-lean-identities.md](02-proof-carrying-lean-identities.md) | The proof-carrying constraint: Lean identities may be enforced as runtime assertions but never recast as measurement claims |
| 03 | [03-identity-versus-measurement-wall.md](03-identity-versus-measurement-wall.md) | Why point-to-point identity needs a separate ordinal-keyed layer: measurement classes collide (2286 items to 176 classes) |
| 04 | [04-binarization-fixed-margin-fibre.md](04-binarization-fixed-margin-fibre.md) | The admitted binary state, the per-axis median binarization rule hashed into the map key, and the fixed-margin curveball null versus column-permutation nulls |
| 05 | [05-sphere-placement-geometry.md](05-sphere-placement-geometry.md) | Placement geometry compared: S2 stereographic lift with spherical harmonics, continuous slerp with vMF concentration, Hamming-native Krawtchouk shells |
| 06 | [06-edge-certificates.md](06-edge-certificates.md) | The three edge types and their certificates, split into identity checks (must pass) versus measurement checks (may honestly fail), plus the Rekor-style transparency-log path |
| 07 | [07-deployable-module-architecture.md](07-deployable-module-architecture.md) | One dependency-free TypeScript module: browser-first verification, then the /api/map Worker mount with D1 persistence, V5 static sphere as MVP cut |
| 08 | [08-testability-admission-nulls.md](08-testability-admission-nulls.md) | Testability discipline: pre-registered SD0 degeneracy gate, the v2 admission null, and the WebGPU reverse-diffusion bet parked at G5 |
| 09 | [09-audience-product-framing.md](09-audience-product-framing.md) | The SMB self-serve "is my data structured or noise" skin as a deployment target on top of /api/map, kept out of the core |

## Research summary

- Results collected: 119 (top 6 per query, deduped; 108 from attempt 1, 11 from the doc 09 redo)
- Weight split: 53 results at weight >= 0.5 (primary/authoritative), 66 below 0.5 (weak backing, labeled as such in the docs)
- Jev requests: 27 (1 probe, 1 outline validation, 22 weighting batches, 3 redo weighting batches), usage 20631 input / 0 output tokens
- Redos: 1 (doc 09, audience-product-framing: attempt 1 returned mostly aggregators and off-topic pages; attempt 2 used different queries and returned 7 primary sources)
- Skipped docs: none
- Gaps: none

Preflight 2026-10-05: searXNG 75 results healthy; /api/decide (clef) 200

## Notes

- Outline validation used the score metric over 9 subtopics in one request; all scored on the continuous 0..2 legend scale. Subtopic 09 scored 0.8082 (marginal, nearest legend value 1) and was kept because its redone dig came back strong (7 primary sources). No subtopic scored 0 (padding).
- Every factual claim in the docs carries its source URL and the jev weight that backed it; claims backed below 0.5 are explicitly labeled weakly backed. Project-internal facts are attributed to the source record.
