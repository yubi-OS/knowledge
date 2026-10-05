# Knowledge corpus: acoustic-optical-phonons-bridge

Minted 2026-10-05 from yubi-OS/yubiOS refs/acoustic-optical-phonons-bridge-2026-09-01.md.

## Documents

- [01-1d-chain-dispersion.md](01-1d-chain-dispersion.md): Monatomic and diatomic 1D chain dispersion, two-branch structure, zone boundary, and the gap that closes at equal masses.
- [02-goldstone-acoustic.md](02-goldstone-acoustic.md): Acoustic phonons as Goldstone modes of broken translation symmetry and the acoustic sum rule, exact in theory and re-imposed numerically.
- [03-heat-capacity-debye-einstein.md](03-heat-capacity-debye-einstein.md): Dulong-Petit limit, Einstein single-frequency freeze-out, and the Debye cubic law from Bose-Einstein occupied modes.
- [04-lo-to-lst.md](04-lo-to-lst.md): Polar optical mode polarization, the macroscopic depolarizing field that splits LO from TO, and the Lyddane-Sachs-Teller dielectric relation.
- [05-klemens-decay.md](05-klemens-decay.md): The Klemens cubic-anharmonic decay channel of zone-center optical phonons into two acoustic phonons, its temperature dependence, and its confinement limits.
- [06-lamb-modes-spheres.md](06-lamb-modes-spheres.md): Lamb's free elastic sphere: spheroidal and torsional families, l/n labeling, 2l+1 degeneracy, and the Raman selection-rule visibility filter.
- [07-graph-laplacian-lattice.md](07-graph-laplacian-lattice.md): Coupled oscillators as matrix eigenvalue problems and the graph-Laplacian / lattice-operator equivalence.
- [08-gaunt-selection-rules.md](08-gaunt-selection-rules.md): Gaunt coefficients as triple spherical-harmonic integrals, their 3-j symbol form, and the triangle, parity, and m-sum selection rules.
- [09-phonon-transport-second-sound.md](09-phonon-transport-second-sound.md): First-principles lattice thermal conductivity and the hydrodynamic regime: phonon hydrodynamics, second sound, and wave-like heat transport.

## Research summary

- Results collected: 144 (searXNG digs, top 6 kept per query)
- Weight split: 51 high (jev noul >= 0.4) / 93 low (< 0.4)
- jev requests: 31 total (1 outline validation with 9 subtopic questions, 26 result-weighting batches of 5, 1 outline + 26 weighted... see breakdown below)
- jev model: clef via steady-orbit /api/decide; 1 retried batch after a 429, 0 results left unweighted
- Redos performed: 2, both on 07-laplacian-hamming (initial dig kept 0 results at weight >= 0.4; redo 1 kept 1; redo 2 with different queries kept 3 more)
- Skipped docs: none (all 9 validated subtopics authored)
- Gaps: the exact Laplacian eigenvalue structure of the Hamming graph H(d,2) (eigenvalues 2j at Hamming weight j with binomial multiplicities) and the role of Krawtchouk polynomials in those spectra could not be sourced at admissible weight after 2 redos, so 07-graph-laplacian-lattice.md covers only the coupled-oscillator and graph-Laplacian layer and states no unsourced numeric spectral claims

### jev request breakdown

- 1 request: outline validation (9 subtopics, all kept at noul 0.62 to 0.94)
- 22 requests: initial weighting of 108 results (batches of 5)
- 4 requests: weighting of 18 redo-1 results (subtopic 07)
- 4 requests: weighting of 18 redo-2 results (subtopic 07)

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Source attributions

Every factual claim in the documents carries its source URL and the jev weight that backed it inline. The raw archive with weights and collection timestamps is in research-db/archive.json; per-document dig records are in research-db/digs/.
