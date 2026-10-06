# Wayfinder Map Endpoints

Scope: the /api/map family - mapping texts or vectors onto the frozen pointmap/0.2 frame, preview, control and consistency diagnostics, the rayleigh, azimuth and admission trials, stored maps with KV overflow, and the /map/ browser UI.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## The instrument

The pointmap/0.2 instrument maps documents or numeric vectors onto a frozen binary/PCA/sphere frame (PCA, binary placement, stereographic lift), compares real edits against that same frame, and exposes the diagnostic family: math diagnostics, candidate preview, positive control, exact isolation ledger, radius profiles, axis-redundancy / rayleigh / azimuth admission trials, perturbation consistency, and rung placement. Geometry diagnoses movement; an independent task check always decides usefulness (source doc, weight 0.62).

The frozen-frame discipline is structural: baseline_id inherits the complete numeric frame, and unchanged vectors keep exactly unchanged positions. A frame or instrument or run_fingerprint conflict stops comparison rather than silently refitting (source doc, weight 0.62). The stereographic lift in the frame is the standard conformal projection of the sphere onto the plane (https://mathworld.wolfram.com/StereographicProjection.html, weight 0.03, weak; https://en.wikipedia.org/wiki/Stereographic_projection, weight 0.06, weak), and the rayleigh diagnostic family operates on the graph Laplacian eigenstructure where the Rayleigh quotient bounds eigenvalues (https://en.wikipedia.org/wiki/Rayleigh_quotient, weight 0.04, weak; spectral graph drawing lecture notes at https://www.cs.yale.edu/homes/spielman/561/lect02-18.pdf, weight 0.02, weak). These dig sources corroborate the mechanism classes only; every route contract below is from the source doc.

## Endpoint contract

14 endpoints (source doc, weight 0.62). All unauthenticated except the stored-map DELETE:

- POST /api/map - map texts or vectors onto the frozen pointmap/0.2 frame; optionally persist a stored map; baseline_id freezes the frame.
- POST /api/map/preview - preview ONE candidate (ADD or CHANGE) against a stored baseline's frozen frame; writes nothing.
- POST /api/map/control - the CutPaste-style positive control: seeded splice CHANGEs measured through the preview path on the frozen frame.
- POST /api/map/consistency - measure ONE candidate under 1..3 caller-supplied text variants on the frozen frame; signs an agreement report.
- POST /api/map/axis-redundancy - per-axis leave-one-out NN-vote predictability trial against a fixed-margin null.
- POST /api/map/admission - unified membership trials: rayleigh, axis trial, spectra shares, and the radius I(r) grid in one call.
- POST /api/map/rayleigh - isolation-graph components and isolates (exact), the Fiedler lambda2 and exact Rayleigh-Ritz cut witness, fixed-margin null tails.
- POST /api/map/azimuth - rotation and reflection-invariant Rayleigh Z_m for m in 2, 3, 4, 6, 12 plus the largest circular gap trial on the placement plane.
- GET /api/maps - stored map metrics list (no map_json).
- GET /api/maps/:id - the complete stored MapResult, KV-overflow aware, enriched with a radius profile on read.
- DELETE /api/maps/:id - delete one saved map plus KV overflow cleanup; operator bearer auth required (R2 patch): 503 when the JEV_API_KEY binding is missing, 401 on a missing or wrong token.
- POST /api/maps/compare - compare two stored maps on compatible frames.
- GET /map/, GET /map/pointmap.js, GET /map/app.js - the browser UI and its dependency-free numeric core, served from KV.

## Write discipline and guards

- Preview, control and consistency write NOTHING - no map row, no Vectorize. persisted:false is structural, not a flag (source doc, weight 0.62).
- The exact isolation ledger must agree with an independent recount or the result halts (source doc, weight 0.62).
- admitted:false is hard-coded for axis-redundancy and azimuth; rayleigh and admission admission is computed, never hard-coded (source doc, weight 0.62).
- Transition declaration: a corpus differing by more than the declared transition is a 409 with persisted:false (source doc, weight 0.62).
- The positive-control recipe is fixed (cutpaste-splice 0.25, centered window); tuning knobs are rejected (source doc, weight 0.62).
- Deletion is never recommended or executed; the 12 NSS axes are an explicitly unvalidated lens dictionary (source doc, weight 0.62).
- Stored maps above about 1.9 MB overflow to KV (key map-json:<id>) behind a D1 pointer (source doc, weight 0.62).

## Composition

The map family composes with Ingestion & Embeddings (every run embeds full-content texts on the frozen frame through the shared content-hash cache), the Outcome Ledger (preview and control feed pre-registration; observed_delta is recomputed via PM.explainTransition), Corpus Math (placements POSTs vectors to /api/map and relays rejections as MAP_FAILED), and the Jev Orchestrator (mapHandler is wired into handleJevRequest so orchestrator tasks can drive the map) (source doc, weight 0.62).
