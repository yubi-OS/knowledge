# parallel-build-lanes knowledge corpus

Knowledge corpus for the yubiOS skill **parallel-build-lanes** (ground source: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md, 4853 B, fetched 2026-10-07). The corpus explicates the validated big-build pipeline: capability map approved in chat, ideate-solo design pass, formal SPEC doc, parallel implementation subagent lanes, advisor/integrator reconciliation, orchestrator deploy and live verification.

## Docs

| NN | doc | one-line scope |
|---|---|---|
| 01 | [01-capability-map-approval.md](01-capability-map-approval.md) | The capability map approval gate: map architecture to modules with responsibilities, dependencies, and build order, presented in chat and approved before any spec is written. |
| 02 | [02-ideate-solo-design-pass.md](02-ideate-solo-design-pass.md) | The ideate-solo one-pager: 5 to 8 variations across 5 lenses, scored and stress-tested, saved to session/<slug>-solo-YYYY-MM-DD.md before the SPEC (internal-record, no dig). |
| 03 | [03-formal-spec-contract.md](03-formal-spec-contract.md) | The formal SPEC contract: invariants up top, endpoint and schema contracts, module file contract with exact export names, testing strategy, boundaries, success criteria. |
| 04 | [04-parallel-implementation-lanes.md](04-parallel-implementation-lanes.md) | Parallel implementation lanes: one-message dispatch, general type, smart/fast model presets, self-contained prompts with RETURN contracts of paths, test counts, and interface summaries. |
| 05 | [05-deps-injection-and-lane-tests.md](05-deps-injection-and-lane-tests.md) | Lane rules: deps-injected modules, lane tests importing nothing from other lanes (documented-interface stubs), one owner for the shared data layer, node --test all-green before return, sandbox path-copy convention. |
| 06 | [06-advisor-integrator-lane.md](06-advisor-integrator-lane.md) | The advisor/integrator smart lane: reconciles interface mismatches, writes uncovered modules, runs all suites together, adds the full-lifecycle e2e test, produces the integration report and deploy checklist. |
| 07 | [07-integration-lessons.md](07-integration-lessons.md) | Integration lessons from the jev builds: test-driver vs real-backend parity, adapter full-context forwarding, hash/shape duality, binding-vs-REST response shapes, sequencing at approve/commit points (internal-record, no dig). |
| 08 | [08-workers-deploy-safety.md](08-workers-deploy-safety.md) | Deploy safety on the Cloudflare Workers modules API: multipart PUT shape, byte-safe legacy entry modules, binding-after-secret ordering, and the fail-closed invariant. |
| 09 | [09-deploy-verify-and-reporting.md](09-deploy-verify-and-reporting.md) | Deploy, live route-by-route verification, todo tracking with per-phase ids, and the single completion report: shipped, live proof points, tests, what is open. |

## Research summary

- Ground source: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md (primary source of record; claims attributed to "source doc").
- Results collected: 84 (searXNG, 14 queries across 7 web-shaped subtopics, top 6 per query; 2 subtopics are internal-record and ran no dig).
- Weight split: high (>= 0.5) 1 / low (< 0.5) 83 of 84. Low-weight sources are labeled weak in the docs; the source doc is the grounding spine.
- jev requests: 8 (1 outline score validation, 7 weighting batches of 12), usage 13462 input / 1679 output tokens, model typesafe/jev-1.13 via DefAPI direct.
- Redos: 0 (all 14 dig queries returned 200 on first attempt; all 8 jev requests returned 200 on first attempt).
- Skipped docs: none. Subtopics 02 and 07 are internal-record subtopics (source doc is the only authority), so their dig records carry no queries by design.
- Outline validation: all 9 subtopics kept, none scored 0 (scores 0.75 to 1.90; subtopic 08 scored 0.75, marginal, kept because its dig returned official Cloudflare Workers docs pages).

## Research database

Under research-db/ (schema v2): preflight.json, outline.json, archive.json (84 weighted results), jev-log.json (8 request records), db.ts (interfaces), and digs/ with one record per doc.

Preflight 2026-10-06: campaign preflight healthy (orchestrator); searXNG digs 14/14 x 200; DefAPI direct (typesafe/jev-1.13) 8/8 x 200.
