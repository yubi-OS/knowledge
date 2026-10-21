# 05. Improvement plan

**Scope:** Improvement plan: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md, no external web dig

## Structure

The plan has four tiers, ordered by size and urgency. P0 fixes the defects found live. P1 adds live selftest endpoints for the harness-No sections. P2 builds falsification corpora for the Partial sections. P3 keeps the documentation honest as coverage changes.

## P0: defect fixes (small, ship first)

| Item | Change | Finding |
|---|---|---|
| P0-1 | POST /api/jev/tasks validation returns 422 with field errors; strip stack traces from error bodies. One-site fix in routes-jev.js, added to the repo test suite. | F3 |
| P0-2 | Evolution v2 cron-leg persistence: instrument the cron path (log the cycle id it persists) and diff against the working manual path. | F5 |
| P0-3 | searxng route pre-validates `qs` and returns 400 before the relay hop. | F4 |
| P0-4 | Embed validation error names the real parameter, `texts`. | F6 |
| P0-5 | ENDPOINTS.md doc sync: drop the /contact row, correct the corpus/health auth cell, note the searxng 4xx change after P0-3. | F1, F2 |

**Why first.** Each is small and local. P0-1 is the most consequential because it touches the orchestrator's entry point and removes an information leak. P0-2 is diagnostic rather than a fix: it compares the cron path against the manual path, which F5 already proved works, to isolate the difference. P0-5 depends on P0-3 because the doc should describe the new 4xx behavior.

## P1: live selftest endpoints

Each P1 item is a new route that replays seeded fixtures in-process, with zero external effects. One item maps to each harness-No section ranked in doc 04.

| Item | Route or scope | Section |
|---|---|---|
| P1-1 | /api/jev/selftest: orchestrator lifecycle replay | 1, task lifecycle |
| P1-2 | /api/jev/automations/selftest: definition, stage, gate, and cron-CAS probe | 2, automations |
| P1-3 | Evolution cycle-replay selftest plus candle positive control | 3, evolution v2 |
| P1-4 | Outcomes ledger integrity selftest | 4, outcome ledger |
| P1-5 | /api/relay/selftest: decide, chat, tts, stt contract probes | 5, public relays |
| P1-6 | Ingestion recall selftest | 6, ingestion |

**Design constraints carried from the audit.** The "zero external effects" rule mirrors the audit's own safety boundary: no approvals touched, no outcome rows written, no leads sent, no automations run. A selftest that wrote to the real outcomes ledger would violate the append-only discipline it is meant to protect, so P1-4 must validate chain shapes without committing rows. P1-3 depends on P0-2, because a replay harness for a broken cron leg would encode the bug.

## P2: falsification corpora

P2 draws from refs/falsification-harness-coverage-2026-10-06.md, in that document's value-per-effort order. Item numbers in parentheses refer to that coverage doc.

| Item | Corpus | Note |
|---|---|---|
| P2-1 | Scorer extractor gold set (#3) | Doubles as the v2.3 recall pass gold |
| P2-2 | Router end-to-end gate-outcome corpus (#2) | Closes the router Partial |
| P2-3 | Audit/lens planted-effect standard candles (#1) | Generator already exists |
| P2-4 | Map planted-placement corpus (#10) | Highest research upside |
| P2-5 | Visco prony recovery envelope (#4), snapback verdict-class corpus (#5, partially shipped in PR #296), hysteresis analytic fixtures (#6) | Visco family |
| P2-6 | Taste 8-axis gold corpus (#7), persistence planted-noise (#8), classify adversarial tautology corpus (#9) | Remaining instruments |

**Why corpora rather than selftests here.** Sections 7 to 10 already pass selftests or parity tests. What they lack is data with a known answer that could make them fail. A scorer with 0/4 recall (section 7) is already measured as failing; P2-1 provides the gold set the v2.3 fix will be scored against.

## P3: doc maintenance

- History item 17 documents this audit.
- The Falsification Harness column in ENDPOINTS.md updates as P1 and P2 land, moving routes from No to Yes one at a time.

P3 makes harness coverage a tracked quantity. The baseline is 15 Yes, 19 Partial, 93 No across 127 rows; each landed item should move that count.

## Dependency graph

1. P0-3 precedes P0-5 (doc describes the new 4xx).
2. P0-2 precedes P1-3 (fix the cron leg before replaying it).
3. P0-1 precedes P1-1 (a lifecycle replay should exercise the corrected validation path).
4. P2-1 is the gold for the scorer v2.3 recall work.
5. P3 updates trail every P1 and P2 landing.

## Expected effect on coverage

If all six P1 items land, every load-bearing harness-No section gets a live selftest. If the P2 corpora land, the four Partial sections gain known-answer tests. The plan does not claim a target count; it ties each item to a specific route group so progress is measurable in the ENDPOINTS.md column.

## What the plan leaves out

The Documented-vs-Code gap table was explicitly excluded from this audit and is tracked separately (history item 16). Destructive-path live tests are not proposed; the plan relies on sandboxed replay instead.
