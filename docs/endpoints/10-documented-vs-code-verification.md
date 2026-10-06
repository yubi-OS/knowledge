# Documented vs Code and the Verification Map

Scope: the Lane B/R3 documented-versus-code cross-reference, the Lean verification map with its endpoint-to-Lean and tool-to-CI mappings, the cross-domain flows, and the resource map.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## The cross-reference

Lane B parsed AGENT.md (72997 bytes as a JSON-quoted string, decoded to 71810 chars of markdown) and cross-referenced every documented row against the actual dispatch comparisons in the 42 module parts under parts/ (source doc, weight 0.62). The refresh of 2026-10-05 re-ran the cross-reference fresh against the updated KV AGENT.md (76399 bytes, byte-identical to the resolved doc R1 deployed) and the patched bundle (source doc, weight 0.62):

| Measure | Lane B (before) | R3 (after) |
|---|---|---|
| AGENT.md sections | 23 | 23 |
| Documented endpoints | 85 | 110 |
| Code-only endpoints | 14 | 0 |
| Doc-only endpoints | 0 | 0 |
| Actionable discrepancies | 12 | 0 |

The code route set was unchanged by the refresh: the R2 patch touches index.js in exactly 4 hunks (the requireOperatorAuth/timingSafeEqual helper, the n_controls usage-block comment changed from 2..12 to 2..6, and one auth guard before each of the two destructive DELETE handlers). No route was added or removed (source doc, weight 0.62).

The 14 previously flagged code-only endpoints were all resolved by R1 documentation: GET /api/jev/pause (the fail-closed read contract), GET|POST /api/tts, POST /api/stt, POST /api/contact, GET|POST /api/decide, POST /api/chat (marked legacy), POST /api/site-assistant, POST /api/brain/preview, the /sos family, the site surfaces (/index.html, /sitemap.xml, /robots.txt, /AGENT.md, /agent.md, /map/app.js, /audio/reply-N.mp3), the CORS preflight block, POST /api/jev/approvals/:id/guide, and the /api/fits/:id GET and DELETE rows (source doc, weight 0.62). The DELETE-auth stale AUTH GAP wording R3 flagged as R3-1/R3-2 landed after the R3 read, and the refreshed document reflects the fixed wording (source doc, weight 0.62).

## The Lean verification map

The math is a port, never a re-derivation: the JavaScript worker (jev-corpus-math.js, jev-taste-math.js, jev-visco-math.js, jev-edge-standard.js) is parity-tested against the Python sources of record in tools/ and papers/data/lean/. On any fixture mismatch the JavaScript is wrong until proven otherwise (source doc, weight 0.62). The verification chain runs (source doc, weight 0.62): Lean 4.33.0 kernel check of CurvedCorpus, WayfinderBounds, RadiusBounds, RayleighBounds, AzimuthBounds plus the axiom gate; Python verify scripts (verify_claims.py CLAIM_1..8, verify_rayleigh_claims.py M1..M4) resolving the measurement-side claims Lean deliberately does not make; tool selftests and fixture parity (verify-tools); then worker endpoint selftests (GET /api/jev/corpus/selftest, GET /api/jev/corpus/taste/selftest); then CI green means the endpoint serves.

The 12 Lean files carry these theorem counts (source doc, weight 0.62): CurvedCorpus.lean 90 theorems (the corpus-math algebra kernel-side, core Lean 4.33.0 with no Mathlib), WayfinderBounds.lean 11, RadiusBounds.lean 18, RayleighBounds.lean 16, AzimuthBounds.lean 14, plus 4 axiom scope manifests and the verify scripts. The endpoint-to-Lean map ties 15 endpoint groups to their Lean files and verify scripts: corpus audit, atom and lens to CurvedCorpus.lean with verify_claims.py; the map preview, map, compare, control and consistency family to WayfinderBounds.lean; radius diagnostics to RadiusBounds.lean; rayleigh to RayleighBounds.lean with verify_rayleigh_claims.py; azimuth to AzimuthBounds.lean (source doc, weight 0.62). The tool-to-CI map backs the endpoints with 11 tools under verify-tools, the 11th entry being edge-standard, the taste-engine source of record (source doc, weight 0.62).

5 CI jobs close the chain (source doc, weight 0.62): check (lean-check.yml, 15 min), verify-measurements (30 min), verify-tools (45 min), run-real-corpus (lean-run.yml, 60 min, asserts v2_real = 0.7235293731 within 1e-6, z > 6, corpus level above the +15.6 dBc floor), and run-real-statements (10 min, tautology-discerner over the docs corpus). None of the newly documented endpoints from the refresh has a Lean connection - they are not corpus math (source doc, weight 0.62).

## Cross-domain flows and the resource map

16 flows connect the capability domains (source doc, weight 0.62): automations propose_actions and guard reviews into the orchestrator gate; corpus builtins as pure stages; evolution directives through the gate with jev-quality wrapping decide; the hourly cycle measuring dbc, z, verdict, drift_vs_prev after 5 completed cycles; placements POSTing vectors to the worker's own /api/map with MAP_FAILED relays; preview and control pre-registered as pending outcome rows; hysteresis closing supersedes chains; ingestion embedding every map run; the execute stage performing resend.send with the shared credential; mapHandler wired into handleJevRequest; the /jev/ console as the human surface; the scheduled handler dispatching runJevScheduled by cron expression; lead_research producing gated resend.send outreach closed by the reply webhook; and the searxng proxy as the dig endpoint for external research pipelines.

The resource map assigns bindings (source doc, weight 0.62): DB (D1) with key tables jev_tasks, jev_approvals, jev_events (append-only audit), jev_automations, jev_learnings, jev_policy_changelog, jev_corpus_runs (idempotent per sha256), the evolution tables (sweeps, directives with CAS claim, cycles, atoms, standard candles), the outcomes ledger, stored maps with KV-overflow pointers above 1.9 MB, FIT reports, and scheduler last_fired_at state; SITE (KV) holding AGENT.md no-cache, llms.txt, the map UI assets, map-json overflow keys, the console HTML and the v19 website; AI (Workers AI) with models @cf/baai/bge-base-en-v1.5, @cf/meta/llama-3.3-70b-instruct-fp8-fast, llama-3.1-8b, llama-guard-3-8b and the @cf/cloudflare/* decision-model route; VEC and EVEC (Vectorize) for document vectors and evolution memory; WEBSITE_RATE_LIMIT with buckets tts 15, stt 15, contact 5; and the secrets JEV_API_KEY, DEFAPI_API_KEY, ELEVENLABS_API_KEY, RESEND_API_KEY, GITHUB_API_KEY, NORTHFLANK_API_KEY, GOOGLE_PLACES_API_KEY and DAYTONA_API_KEY (source doc, weight 0.62).
