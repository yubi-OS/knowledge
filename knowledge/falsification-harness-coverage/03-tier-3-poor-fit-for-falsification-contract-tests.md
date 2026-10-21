# 03. Tier 3: poor fit for falsification (contract tests, not corpora)

**Scope:** Tier 3 - poor fit for falsification (contract tests, not corpora): detailed analysis grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-harness-coverage-2026-10-06.md, no external web dig

## The classification rule

The ground source draws a sharp line: an endpoint belongs in a falsification harness only if it produces a measurement that could be wrong in a way a known-answer corpus can expose. Endpoints that relay, store, list, or acknowledge have no measurement to falsify. For them the right tool is a contract test: schema, auth, idempotency, and fail-closed behavior. Calling a contract test a falsification corpus would inflate harness coverage without adding any evidence about instrument validity, which is exactly the self-deception the falsification discipline exists to prevent.

## The Tier 3 inventory

The source groups Tier 3 into six families:

| Family | Endpoints named in the source | Why no corpus applies |
|---|---|---|
| Public relays | `/api/tts`, `/api/stt`, `/api/contact`, `/api/chat`, `/api/site-assistant`, `/api/brain/preview` | Pass-through to a provider or inbox; correctness is delivery, not measurement |
| Site pages and asset pass-throughs | Static and rendered site routes | Content serving; checked by status and content-type |
| CRUD surfaces | tasks, approvals, maps, fits, automations, learnings | State storage; checked by read-after-write and schema |
| Control surfaces | evolution directives, pause, summary | Operator controls; checked by auth and idempotency |
| Webhooks | Inbound event receivers | Checked by signature verification and replay handling |
| Health endpoints | Liveness and readiness | Binary up or down; no band to calibrate |

## What the contract tests should cover

The source names four contract dimensions, and each maps to a concrete assertion:

1. **Schema.** Response bodies match the documented shape. A field present in the contract must be present in every 2xx response; an unknown field should be documented or rejected.
2. **Auth.** Unauthenticated calls to protected routes are refused. The bearer-connection pattern used across the worker makes this a one-line negative test per route.
3. **Idempotency.** Repeating a write with the same key or payload does not duplicate state. For CRUD surfaces this is the primary correctness property.
4. **Fail-closed behavior.** On malformed input or an internal error the route refuses rather than proceeding with a default. This is the property that, if broken, turns a relay into a silent data leak or a control surface into an unguarded switch.

The source notes that several of these checks already exist as selftest checks, so Tier 3 is less a backlog than a classification: these routes are covered by a different and cheaper kind of evidence.

## The borderline case: POST /api/jev/route

One endpoint straddles the line. `POST /api/jev/route` has two legs:

- **The dispatch leg is gate behavior.** Given an artifact, the route selects a band and returns one of four outcomes (dispatch, needs_approval, blocked, reroute_not_converged). That is a decision that can be wrong, so it belongs in Tier 2 item 2, with a pre-registered family to band to outcome table and a deliberate mis-correction negative.
- **The transport leg is Tier 3.** The bands table and the runs listing are read surfaces. They need schema and pagination contract tests, not planted-answer corpora.

This split is the template for any future endpoint that mixes a measurement with a CRUD wrapper: falsify the decision, contract-test the plumbing.

## Why the boundary matters operationally

Keeping Tier 3 out of the harness column has three concrete benefits recorded or implied by the source:

- **Honest coverage numbers.** The ENDPOINTS.md Harness column reports falsification coverage. Counting contract-tested relays would make the column look fuller while saying nothing about measurement validity.
- **Correct effort allocation.** Contract tests are cheap and mostly exist; corpora cost authoring and pre-registration time. The build order (doc 04) spends that time only where a wrong measurement could mislead a verdict.
- **No category errors in review.** A reviewer reading "harness-backed" should be able to assume pre-registration, gold corpus, gate windows, anchors, and parity. Tier 3 routes have none of those and should not borrow the label.

## Scope note

Tier 3 is a claim about fit, not about quality. A Tier 3 route can still be broken, and its contract tests can still fail. The claim is only that a falsification corpus is the wrong instrument for finding out. If a Tier 3 route later grows a measurement (for example, a summary endpoint that starts computing a statistic), it should be re-classified and enter the Tier 2 list with its own harness design.
