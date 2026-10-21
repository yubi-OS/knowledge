# 03. Live findings

**Scope:** Live findings: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md, no external web dig

## Overview

The audit logged eight findings, F1 to F8. They fall into four classes: doc-vs-live drift (F1, F2), code defects (F3, F4, F6), a narrowed diagnostic on a long-running issue (F5), and positive or neutral observations (F7, F8). Each is restated below with its evidence, severity, and the fix path from the improvement plan.

## F1: GET /contact returns 404 (doc-vs-live)

**Evidence.** GET /contact returns 404. The sitemap carries 8 URLs and does not list /contact.

**Cause.** The page was dropped in the v19 batch; contact routing now lives on /booking and /audit. ENDPOINTS.md still lists GET /contact[/].

**Fix.** Doc fix (P0-5): drop the /contact row. The appendix records it as "doc fixed here".

## F2: corpus/health requires auth (doc-vs-live)

**Evidence.** GET /api/jev/corpus/health returns 401 without a bearer.

**Cause.** The endpoint table documents its auth as "none", which has been stale since the 2026-10-08 auth pass.

**Fix.** Doc fix (P0-5): correct the auth cell. Note the direction of the drift: the live route is stricter than documented, which is the safe direction.

## F3: tasks validation returns 500 with a stack trace (defect)

**Evidence.** POST /api/jev/tasks with a missing `source` or a missing `payload` returns 500 "uncaught" with a stack trace in the body.

**Why it matters.** This is a plain validation error. It should be 422 with the field error. Two problems ride on one bug: the status code misclassifies a client error as a server fault, and the stack trace leaks internals in an API response. The tasks route is the entry point to the orchestrator's system of record for gated actions.

**Fix.** P0-1: one-site fix in routes-jev.js returning 422 with field errors, strip stack traces from error bodies, and add the case to the repo test suite.

## F4: searxng without params passes through a relay 500 (low)

**Evidence.** GET /api/searxng with no params returns the n8n relay's 500 "Error in workflow" passthrough.

**Fix.** P0-3: the worker should pre-validate `qs` and return 400 before the relay hop. That keeps a client mistake from consuming a relay call and from surfacing as a server error. ENDPOINTS.md should note the 4xx change once it lands (P0-5).

## F5: evolution v2 ledgers read empty (resolved diagnostic, upgrade finding)

**Background.** The evolution v2 cycles and atoms ledgers had been reading empty since 2026-10-01.

**Evidence.** A manual POST /api/jev/evolution/cycle/run DID persist: cycle `cyc_6602a3d078858281` and atom `ea_f03fc882406cae66` were read back on /cycles and /atoms.

**What this rules out.** Writes persist, and the read path works. The remaining question narrows to the **hourly cron leg**: why cron-fired cycles do not appear.

**Second issue.** POST /cycle/run has no input schema at all. An empty body executes a real cycle. Every other mutating route in the audit fails closed on an empty body; this one does real work.

**Fix.** P0-2: instrument the cron path to log the cycle id it persists, and diff it against the working manual path. P1-3 later adds a cycle-replay selftest.

## F6: embed error names the wrong parameter (minor)

**Evidence.** POST /api/jev/map/embed's validation error says "need docs", while the accepted parameter is `texts`.

**Fix.** P0-4: the error should name `texts`. Small, but misleading errors cost debugging time for every caller.

## F7: maps/compare 409 on frame mismatch (observation)

**Evidence.** POST /api/jev/map/maps/compare correctly returns 409 when the two maps carry different frame_ids. Adjacent ids 569 and 570 differ.

**Reading.** Honest fail-closed behavior. The comparison refuses to produce a number across incompatible frames.

## F8: all six selftests pass, append-only enforced (positive)

**Evidence.** All 6 selftests pass live: corpus (92 checks), spectral, lens, taste, timeseries (G1 to G6 plus WAE write and read-back), and router (24 checks). Outcomes ledger append-only enforcement (405) was live-verified.

## Severity map

| Finding | Class | Severity | Plan item |
|---|---|---|---|
| F1 | Doc drift | Low | P0-5 |
| F2 | Doc drift | Low (safe direction) | P0-5 |
| F3 | Defect | Highest of the set | P0-1 |
| F4 | Defect | Low | P0-3 |
| F5 | Diagnostic plus schema gap | Medium | P0-2, P1-3 |
| F6 | Defect | Minor | P0-4 |
| F7 | Observation | None | None |
| F8 | Positive | None | None |

## Pattern

Every defect sits on an error path or an unscheduled path: validation errors (F3, F4, F6), a missing input schema, and a cron leg (F5). The happy paths were all healthy. That pattern is what motivates the harness work in docs 04 and 05: the failures that slip through are the ones nobody routinely exercises.
