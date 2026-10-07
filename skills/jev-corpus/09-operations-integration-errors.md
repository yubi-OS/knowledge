# 09 - Operations, integration, and errors

Scope: running the engine day to day: authentication, the User-Agent requirement, input shapes, the classify and placements endpoints, automation builtins, evolution-cycle integration, error codes, and the selftest discipline. This is an internal-record subtopic: its content is grounded in the source doc's operational sections, with no searXNG dig.

## Authentication and transport requirements

Source doc, setup section: the jev operator key goes in `Authorization: Bearer <JEV_API_KEY>` (the jev operator connection). `/api/jev/corpus/health` is unauthenticated; everything else returns 401 without the bearer. Every call must carry a User-Agent header; Cloudflare rejects User-Agent-less requests with error 1010. Guideline 1 makes it absolute: "Every call carries a User-Agent header, no exceptions."

Base URL: `https://steady-orbit.systems-a.workers.dev/api/jev/corpus` (source doc flow section).

## Input shapes

Source doc: the input matrix is either JSON `[[0,1,...],...]` or `{rows, cols, data}`. Binary 0/1 values are required for atom and lens; real values are allowed for audit. Malformed shapes get 422 or 400.

## The remaining endpoints

`GET /health` returns `{ok, corpus: "ready", modules: {math, atom, lens}}` with no auth, so it is the cheap liveness and module-presence probe before anything else. `GET /runs` returns the last 50 run rows (kind, input_hash, result), which is the window into what the engine has measured recently and what the prony and mobility mining consume.

`POST /classify` takes `{sentence}` and returns `{verdict: "tautology"|"falsifiable"|"paradox"|"undecidable", refuter, run_id}`, with exact parity to the tautology discerner tool (source doc). The documented usage: gate a claim before publishing it; `undecidable` means no concrete observable was supplied, and the claim is refused publication until it carries one (source doc examples). This is the engine's only route that operates on prose directly rather than on a matrix.

`POST /placements` takes `{matrix, labels}`, audits, then POSTs vectors to the worker's own `/api/map`, returning `{map_id, map_url: "/map/?id=N"}`. Fewer than 10 rows or D greater than 768 relays the map endpoint's 422 as `MAP_FAILED` (source doc). Runbook lesson 8 adds the operational caveat: in refs5 the placements route 404ed with upstream `/api/map` error 1042, and the direct `/api/map {texts, names}` flow is the working path for the baseline map. The runbook also pins `/preview` semantics: it requires exactly one changed name versus its baseline, and after a keep you re-map with `POST /api/map {baseline_id}` so the next cycle's preview compares against the current corpus (source doc).

## Automation builtins

Source doc: four pure builtins are registered in the automation engine, usable as `{"type": "builtin"}` stages or builtin-only defs: `corpus_audit` (input `{matrix, nulls?}`), `corpus_lens` (input `{matrix, top?}`), `corpus_drift` (input `{matrixA, matrixB}` or two spectra), and `tautology_gate` (input `{text}`). All read-only. `{ref}` and `{source_ref}` inputs are rejected at the routes layer, and purity is tested: any fetch during a builtin run fails.

The drift builtin deserves a note: it measures how far two corpus states have moved relative to each other, either from two matrices or from two precomputed spectra. The evolution cycle's measure step carries `metrics.corpus` with `{dbc, z, verdict, drift_vs_prev}` (source doc).

## Evolution integration

Source doc: the hourly cycle's measure() carries `metrics.corpus` when a matrix is available from cycle history. Until 5 completed cycles of history accumulate, it records an honest `corpus: {error: "no matrix available this cycle"}` instead of fabricating numbers. Lens candidates flow into the cycle's proposals as `note`-kind directives through the existing fail-closed kinds code.

Two boundaries repeat across the source doc: the math never authorizes anything (audit and lens results are data; only directives through the gate act), and atom execution is a gated directive, never inline. The evolution integration respects both: measurement flows freely, action flows through the fail-closed kinds.

## Errors

Source doc error table:

- `401 UNAUTHORIZED`: wrong or missing bearer, except on `/health`.
- `503 CORPUS_NOT_CONFIGURED`: `deps.corpus` missing, a deploy-time condition.
- `503 DB_NOT_CONFIGURED`: D1 binding missing.
- `422` / `400`: malformed input shapes; placements relays `/api/map`'s own rejection as `MAP_FAILED`.
- Selftest failure: the port deviates from the fixtures. The instruction is to stop, not trust results, and re-run the fixture generator (`fixtures/generate_fixtures.py` in the build bundle) against the current `papers/data/lean` sources.

The selftest failure case is qualitatively different from the HTTP errors: it invalidates the instrument itself rather than one call. Treat any selftest failure as a halt on all corpus measurement until fixtures are regenerated and parity is restored.

## The flow, end to end

Source doc's worked flow, condensed: audit a corpus matrix to learn whether its structure is distinguishable from the null; request lens candidates for the cycle; send the chosen candidate into the evolution loop as a directive (note and record_learning kinds auto-execute; repo_push, skill_push, and worker_change kinds need approval); verify the engine is honest with a selftest before trusting any result. An RSI-cycle caller attaches the top candidate as a directive proposal, and the next cycle's `metrics.corpus` shows whether the executed edit moved the corpus level.

## Boundary

Source doc closing line: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job." The engine measures and classifies; policy changes, gated executions, and anything requiring authorization live in the orchestrator and automations layers, not here.
