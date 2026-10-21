# 02. What the live surface offers (read only)

**Scope:** 1. What the live surface offers (read only): detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md. External dig: dig_context_02.json (10 Clef-weighted searXNG results).

## Read-only discipline

The feasibility check touched the live worker only with reads: document fetches and a settings GET. No deploy, no KV writes, no D1 writes. All facts below come from `yubi-OS/yubiOS refs/arr-premap-feasibility-2026-10-16.md` unless a dig source is cited.

## Documents fetched on 2026-10-16

| Artifact | Size |
|---|---|
| AGENT.md | 92,569 bytes |
| ENDPOINTS.md | 133,890 bytes |
| Repo tree | 2,242 entries |

**Finding: arrangement is absent from the live docs.** Neither AGENT.md nor ENDPOINTS.md mentions arrangement. The arrangement round exists only in the repo: tools/lens-standard/arrangement_warp.py, falsification/ARRANGEMENT-RESPONSE-2026-10-06.md, and PREREGISTRATION-arrangement-response-2026-10-06.md, merged via PR #292. Any agent reading only the live docs would not know the round exists.

The AGENT.md size recorded here (92,569 bytes) is the same figure the adoption record later reports for the live KV copy, against an 85,085-byte git mirror. That drift predates both builds.

## Live routes that matter

- POST /api/jev/corpus/oracle (modes: gray, bitmap, gold)
- POST /api/jev/corpus/spectral/walk (points mode)
- POST /api/jev/corpus/lens/correct
- POST /api/jev/route
- The GET selftests for each

These are the four surfaces a deployed arrangement-response or premap line would sit beside or call.

## Worker settings (read-only GET)

| Setting | Value |
|---|---|
| Custom limits | none (`limits: null`) |
| Compatibility date | 2026-09-01 |
| Usage model | standard |
| Bindings | 15 |

**Consequence.** Neither line needs a new binding. Both only need a run row through the existing `recordRun` path. That keeps deploy risk low: no binding metadata changes, which is where modules uploads are most fragile.

## Sources of record for the JS ports

- tools/lens-standard/jev-lens-math.js
- tools/spectral-standard/jev-spectral-centroid.js and jev-spectral-math.js
- tools/edge-standard/jev-edge-standard.js

These are the repo copies the deployed parts are built from. Doc 04 ran the deployed modules unchanged against the Python source of record.

## The Delaunay stability question

The seed query probed Delaunay triangulation stability under vertex perturbation, because the live spectral walk builds a Delaunay graph of droplet centres and the arrangement arms perturb those centres. The research section of the ground-source doc treats as established that Delaunay edges flip at cocircular events under point motion (Rubin, DOI 10.1007/s00454-013-9512-2). The dig results relate to that, all with weak backing. A paper on the stability of Delaunay triangulations introduces a parametrized genericity notion and studies stability under perturbation of the metric and the vertex positions, per [The stability of Delaunay triangulations](https://arxiv.org/pdf/1304.2947) (clef weight: 0.0928) (weak backing, clef weight < 0.5), mirrored on ResearchGate, per [(PDF) The Stability of Delaunay Triangulations - ResearchGate](https://www.researchgate.net/publication/258841743_The_Stability_of_Delaunay_Triangulations) (clef weight: 0.1072) (weak backing, clef weight < 0.5). A companion paper presents an algorithm that perturbs a point set so that its Delaunay triangulation becomes stable, per [[1310.7696] Delaunay stability via perturbations - arXiv.org](https://arxiv.org/abs/1310.7696) (clef weight: 0.1545) (weak backing, clef weight < 0.5), also mirrored, per [(PDF) Delaunay Stability via Perturbations - ResearchGate](https://www.researchgate.net/publication/258113768_Delaunay_Stability_via_Perturbations) (clef weight: 0.1485) (weak backing, clef weight < 0.5). One result was an unrelated forum thread, per [/thread/20846328-burt-reynolds-on-wwhl - the Data Lounge](https://www.datalounge.com/thread/20846328-burt-reynolds-on-wwhl) (clef weight: 0.0225) (weak backing, clef weight < 0.5).

The bearing on the live surface: a perturbation-based fix is one way to make a triangulation robust, but it moves the points. The path the project chose instead (exact predicates plus Simulation of Simplicity tie-break, see the adoption record) keeps the points fixed and makes the decision on degenerate configurations deterministic.

## The rasterization question

The second seed query probed rasterization aliasing and disk lattices, because the oracle and lens routes measure D on a rasterized mask of droplet disks. Weak-backing graphics references describe the standard pipeline. Scratchapixel covers aliasing and anti-aliasing in a practical rasterizer, per [Rasterization: a Practical Implementation - Scratchapixel](https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-practical-implementation.html) (clef weight: 0.2107) (weak backing, clef weight < 0.5). Microsoft's Direct3D rules specify which pixels a primitive covers, including multisample rules, per [Rasterization Rules - Win32 apps / Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-rasterizer-stage-rules) (clef weight: 0.1924) (weak backing, clef weight < 0.5). Stanford lecture slides summarize the rasterization pipeline, per [PDF Lecture 5: The Rasterization Pipeline - gfxcourses.stanford.edu](https://gfxcourses.stanford.edu/cs248a/winter25content/media/rastpipeline/05_pipeline.pdf) (clef weight: 0.2580) (weak backing, clef weight < 0.5), and Cornell slides describe walking from pixel to pixel over a polygon's area, per [PDF Rasterization and Antialiasing - Department of Computer Science](https://www.cs.cornell.edu/courses/cs4620/2013fa/lectures/09rasterization.pdf) (clef weight: 0.2555) (weak backing, clef weight < 0.5). A file-downloads help page is off-topic, per [¿Dónde están mis descargas? Va a encontrar y abrir mis ... - EaseUS](https://es.easeus.com/recursos/donde-estan-mis-descargas.html) (clef weight: 0.0348) (weak backing, clef weight < 0.5).

The relevance is specific: the coverage rule decides which pixels a disk sets, and for fractional centres the rule must be well-defined. Doc 05 shows the deployed JS renderer has no valid rule for fractional centres at all, and that the Python to_rows rule (trunc bounds, pixel set when squared distance is at most r squared) is the one that reproduces the record.

## Summary

| Question | Answer |
|---|---|
| Do live docs describe arrangement? | No, repo only (PR #292) |
| Which routes are involved? | oracle, spectral/walk, lens/correct, route, plus selftests |
| New bindings needed? | No; recordRun suffices |
| CPU limits configured? | None (`limits: null`) |
| Where is the JS source of record? | tools/lens-standard, spectral-standard, edge-standard |

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | The stability of Delaunay triangulations | https://arxiv.org/pdf/1304.2947 | 0.0928 | weak (< 0.5) |
| 2 | [1310.7696] Delaunay stability via perturbations - arXiv.org | https://arxiv.org/abs/1310.7696 | 0.1545 | weak (< 0.5) |
| 3 | (PDF) Delaunay Stability via Perturbations - ResearchGate | https://www.researchgate.net/publication/258113768_Delaunay_Stability_via_Perturbations | 0.1485 | weak (< 0.5) |
| 4 | (PDF) The Stability of Delaunay Triangulations - ResearchGate | https://www.researchgate.net/publication/258841743_The_Stability_of_Delaunay_Triangulations | 0.1072 | weak (< 0.5) |
| 5 | /thread/20846328-burt-reynolds-on-wwhl - the Data Lounge | https://www.datalounge.com/thread/20846328-burt-reynolds-on-wwhl | 0.0225 | weak (< 0.5) |
| 6 | Rasterization: a Practical Implementation - Scratchapixel | https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-practical-implementation.html | 0.2107 | weak (< 0.5) |
| 7 | Rasterization Rules - Win32 apps / Microsoft Learn | https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-rasterizer-stage-rules | 0.1924 | weak (< 0.5) |
| 8 | PDF Lecture 5: The Rasterization Pipeline - gfxcourses.stanford.edu | https://gfxcourses.stanford.edu/cs248a/winter25content/media/rastpipeline/05_pipeline.pdf | 0.2580 | weak (< 0.5) |
| 9 | PDF Rasterization and Antialiasing - Department of Computer Science | https://www.cs.cornell.edu/courses/cs4620/2013fa/lectures/09rasterization.pdf | 0.2555 | weak (< 0.5) |
| 10 | ¿Dónde están mis descargas? Va a encontrar y abrir mis ... - EaseUS | https://es.easeus.com/recursos/donde-estan-mis-descargas.html | 0.0348 | weak (< 0.5) |
