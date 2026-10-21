# 04. Load-bearing sections without a selftest or falsification harness

**Scope:** Load-bearing sections without a selftest or falsification harness: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md, no external web dig

## Ranking rule

The audit ranked ten sections by one criterion: how much rides on them failing silently. A section ranks high when it is both consequential (it gates real actions or underpins other verdicts) and unprotected (no in-worker selftest, no falsification corpus). The list below follows the source's order.

## 1. Jev orchestrator task lifecycle

- **Surface.** routes-jev.js, 21 routes, harness No.
- **Why load-bearing.** It is the system of record for every gated action, including real sends.
- **Current protection.** 239 repo tests exist, but the deployed worker has no selftest endpoint. A gate regression, for example the empty-approvals-adapter class of bug, would only surface on a real task.
- **Proposed harness.** GET /api/jev/selftest replaying a seeded lifecycle in a sandboxed driver (seed, gate, approve-like, verify, terminal) without any real dispatch or send. Gate invariants become assertions: policy-bound approval expiry and payload-hash duality.

## 2. Automations engine

- **Surface.** 7 routes, a cron, and a 3-tier Llama runtime; harness No.
- **Why load-bearing.** It executes the real lead machine.
- **Gap.** No selftest; cron double-fire CAS (compare-and-set) is untested live.
- **Proposed harness.** POST /api/jev/automations/selftest: validate the definition schema, compile stages, preview the gate decision per stage, and probe cron CAS against a scratch definition.

## 3. Evolution v2 cycle

- **Surface.** 5 routes and an hourly cron; harness No.
- **Why load-bearing.** It is the self-improvement loop.
- **Gap.** F5 narrows the open defect to the cron leg (doc 03).
- **Proposed harness.** Fix cron-leg persistence first, then add a cycle-replay selftest and a standard-candle positive control: plant a candle and assert the planter detects it on demand.

## 4. Outcome ledger

- **Surface.** outcomes, harness No.
- **Why load-bearing.** It is the pre-registration instrument every round's verdict rides on.
- **Current protection.** Append-only is enforced (F8, 405 on DELETE, PUT, PATCH).
- **Gap.** No integrity harness validates supersedes-chain shapes at write time.
- **Proposed harness.** A ledger-write selftest for chain shape validation and supersedes referential checks. The source calls it cheap.

## 5. Public relays

- **Surface.** decide, chat, tts, stt, contact, site-assistant, brain-preview; harness No.
- **Why load-bearing.** /api/decide is the shared decision relay every skill depends on.
- **Proposed harness.** GET /api/relay/selftest: a known calibration question with a pinned answer band, a TTS/STT round-trip byte check, and a chat grounding probe.

## 6. Ingestion and embeddings

- **Surface.** embed, repo-items, vector-search; harness No.
- **Why load-bearing.** It is the recall substrate.
- **Proposed harness.** Embedding determinism (same text, same vector) and recall (a planted doc returns as the expected top match).

## 7. Scorer v2.2

- **Status.** Partial. Specificity gold PASS, recall 0/4 FAIL, the known v2.3 extractor-recall gap.
- **Proposed harness.** An extractor gold set (coverage doc item #3).

## 8. Map engine core

- **Surface.** POST /api/jev/map and /preview; Partial.
- **Status.** Lean bounds cover the math. The statistical layer (does a doc authored for a cell land there?) is not covered.
- **Proposed harness.** The planted-placement corpus candidate (coverage doc item #10).

## 9. Router

- **Status.** Partial. Band selection is calibrated, but the full gate-outcome path per class has no pre-registered corpus (coverage doc item #2). An F1 bands-doc defect is open in the router's own records.

## 10. Corpus audit, lens, atom, classify

- **Status.** Partial. Parity-tested, but no planted-effect standard candles (coverage doc item #1) and no adversarial tautology corpus (item #9).

## Two kinds of harness

| Kind | Sections | What it catches |
|---|---|---|
| Live selftest (replay seeded fixtures in-process) | 1 to 6 | Regressions in code paths that act or relay |
| Falsification corpus (known-answer data) | 7 to 10 | Instruments that run but measure the wrong thing |

Sections 1 to 6 have no harness at all; the fix is a route that replays fixtures with zero external effects. Sections 7 to 10 already have partial protection; the fix is a corpus with known answers that can make the instrument fail.

## Positive controls

Two proposals include a planted signal: the evolution standard candle (section 3) and the planted-doc recall check (section 6). A selftest that only checks that code runs can pass while the detector is blind. A planted positive must be found, which proves the detector can see what it claims to see.

## Where this leads

Doc 05 converts this ranking into the P1 and P2 tiers of the improvement plan, one item per section, in the same order.
