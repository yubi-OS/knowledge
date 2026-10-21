# 06. What passed clean

**Scope:** What passed clean: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md, no external web dig

## The clean baseline

The source states that every other documented behavior matched live. That baseline is as important as the findings, because it defines what the improvement plan must not break. This doc enumerates the clean surface, using the summary and the full route appendix in the ground-source doc.

## Summary of clean behavior

- All selftests passed.
- All 401 gates held.
- All fail-closed validation behaved as documented.
- The append-only ledger held.
- The forecast route worked on a real series.
- Map instrument trials ran on a live frame.
- repo-items full-text recall returned 294 docs.
- Task create, execute, and cancel shape-validation held. A valid task create requires a payload object. The full lifecycle was shape-validated on nonexistent ids only in this pass, having been live-verified in prior sessions.

## Site pages: 15 of 16 at 200

From the appendix, every open site GET returned 200 except /contact (F1): `/`, `/revenue-blind-spot`, `/systems-lab`, `/founders`, `/terms`, `/privacy`, `/brain`, `/audit`, `/results`, `/booking`, `/sitemap.xml`, `/robots.txt`, `/website-vN/<file>` (real assets verified), `/AGENT.md`, `/llms.txt`, `/map/pointmap.js`, `/jev`, `/[/index.html]`, and `/audio/reply-1|2|3` (mp3 magic bytes checked). Health endpoints `/api/health` and `/api/jev/health` returned 200.

## Fail-closed validation

Open POSTs with empty bodies returned 422: site-assistant, brain/preview, stt, contact, chat, and jev/webhooks/reply. GET /api/tts and GET /api/decide without parameters returned 422. On the bearer side, dozens of POSTs returned 422 or 400 on empty or invalid bodies, including map, preview, control, consistency, outcomes, sos/assess, corpus atom, classify, placements, scorer/matrix, the taste routes, visco persistence and snapback, spectral walk and series, lens/correct, route, approvals approve, reject, and guide, pause, learnings, automations create, activate, and pause, and the evolution sweep and directive actions.

## Correct 404s on nonexistent ids

GET and DELETE on sos/fits/:id and maps/:id, POST sos/narrate without a fit id, GET tasks/:id, and every task action (execute, verify, continue, retry, reconcile, close, cancel) returned 404 on nonexistent ids, as did automations/:id/run. A correct 404 shows the route resolves the id before acting, which is the precondition for safe mutation.

## Append-only enforcement

DELETE, PUT, and PATCH on `/api/jev/map/outcomes/*` returned 405. GET outcomes returned 200 with 12 rows. This is the integrity property the outcome ledger exists for (doc 04, section 4).

## Functional probes with real data

| Route | Result |
|---|---|
| POST /api/jev/map/repo-items | 200, 294 docs full text from yubi-OS/yubiOS refs |
| POST /api/jev/map/vector/search | 200, real matches |
| POST /api/jev/map/embed | 200, real data |
| POST /api/jev/evolution/memory/search | 200, real data |
| POST /api/jev/corpus/audit and /lens | 200 on a 3x12 matrix |
| POST /api/jev/corpus/scorer/score | 200 on a real doc |
| POST map axis-redundancy, admission, rayleigh, azimuth | 200 trials on live map 570 |
| GET /api/jev/corpus/visco/hysteresis | 422 without baseline_id; 200 with real baseline 569 |
| GET /api/jev/forecast/:series | 200 on a real WAE series, h=3 |

## Selftests

| Selftest | Result |
|---|---|
| corpus | 200 ok:true, 92 checks |
| taste | 200 ok:true |
| spectral | 200 ok:true |
| lens | 200 ok:true |
| route | 200 ok:true, 24 checks |
| timeseries | 200 ok:true, G1 to G6 plus WAE probe |

## Honest refusals

POST maps/compare returned 409 on a frame mismatch between maps 569 and 570 (F7). Refusing to compare incompatible frames is counted as clean behavior.

## Plain reads at 200

sos/fits, maps, tasks, approvals, pause, summary, learnings, automations, models, evolution directives and state, corpus runs, visco prony, mobility, and policy-log, route bands and runs, and timeseries/series all returned 200.

## Why the clean list matters

1. **Regression baseline.** Every P0 and P1 change in doc 05 must keep this list intact. The P0-1 tasks fix, for example, must keep task 404s and the 401 gate while converting the 500 to 422.
2. **Calibrating the findings.** Against this broad clean surface, eight findings with one real defect of note (F3) is a narrow failure set, concentrated on error and cron paths.
3. **Separating health from coverage.** Most of these clean routes are still harness No (93 of 127 rows). Clean today is a snapshot; the improvement plan exists to make it a guarantee.
