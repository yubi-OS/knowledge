# 06. Live-endpoint surprises (schema and behavior notes)

**Scope:** 5. Live-endpoint surprises (schema/behavior notes): detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md, no external web dig

## Why surprises are a deliverable

Probing a live route with a pre-registered corpus finds more than pass or fail. It finds places where the route's actual behavior differs from what its contract or error messages imply. The record lists five such observations and recommends filing two of them for a future CONTRACTS.md clarification. None affected a gate, but each is a trap for a future consumer.

## Snapback validation is lenient

Snapback's error messages are strict in some places, but its validation accepts a wide range of inputs with a 200 response:

| Input variant | Behavior |
|---|---|
| String or float cycle values | 200 |
| String deltas | 200 |
| `null` deltas | 200 |
| NaN encoded as null | 200 |
| Negative, duplicate, or out-of-order cycles | 200 |
| Extra fields | 200 |
| Non-finite or absent deltas | 4xx |
| Non-object bodies | 400 |

The sharpest consequence: `predicted_delta: null` silently counts as a point (`n_points=1`) with no inversion. A caller that sends a malformed series could receive a clean "no flip" verdict for data that was never valid. The record recommends a contract note upstream. From a falsification standpoint, this is the kind of finding that justifies adding malformed-input classes to a future corpus, so that leniency becomes a documented and gated behavior rather than an accident.

## gate_noise_context is always null

`gate_noise_context` was `null` in every probe and in every corpus case. Its population condition is unknown. The round documented it as out of scope, and no gate depends on it. It remains an unpinned field: a future consumer should not assume it will ever carry data until its semantics are documented.

## Series wins over baseline_id

When a request supplies `{series, baseline_id}` together, the inline series wins and `baseline_id` echoes `null` in the response. This is a sensible precedence rule, but it is implicit. A caller expecting the ledger path while also sending a stale series would silently get inline behavior.

## Hysteresis accepts non-positive baseline ids

The hysteresis route performs no positivity check on baseline ids. Negative and zero ids behave as empty ledgers and return the `no_data` response that H2 verified (tested at 0, 1, 99999, and -1). This is harmless for correctness but means the route cannot distinguish "no data yet" from "invalid id".

## Active-only chain_ids

The live route's `loops[].chain_ids` carries only the ACTIVE (realized) row id, while the full chain lives in `ledger_chain_ids`. The pure-function contract does not make that split, so a consumer ported from the contract could undercount chain membership. This is the second observation the record recommends filing for CONTRACTS.md.

## Honest limitations recorded alongside the surprises

The record pairs the surprises with five explicit limitations:

1. **Synthetic ledger shapes are reference-only.** The live route reads only the production D1 outcomes ledger. Multi-realization chains and caller-supplied both-shapes rows cannot be falsified live without writing production rows, which was out of scope. H0 and H1 partially compensate.
2. **The 102.86 anchor is not re-runnable live.** Its ledger rows predate the current 12-row ledger; the maximum live rollup is now 3.90.
3. **`gate_noise_context` semantics are unpinned.**
4. **Noisy tiers certify the endpoint and the gate design, not the noise generator** beyond the G4 windows.
5. **Reruns must regenerate from pinned seeds** in the pinned order.

## Recommended next steps

The record closes with three recommendations for the orchestrator:

1. **Ship the evidence.** Land the harness JSONs under `tools/visco-instruments/fixtures/` and the round record under `refs/`, closing build-order items 5 and 6.
2. **Wire regression anchors.** Add the 843-case snapback corpus plus H0 and H1 to `/api/jev/corpus/selftest`, following the pattern of the other instruments.
3. **File the contract observations.** Lenient snapback validation and the active-only `loops[].chain_ids` shape go into a future CONTRACTS.md clarification.

## File inventory

The round's working files sat in `session/subagent/lane-c-visco/` (session artifacts, not repo-truth): `preregistration.md`, `amendments.md`, `probes.json`, `snapback-corpus.json`, `snapback-results.json`, `hysteresis-fixtures.json`, and `hysteresis-results.json`. Their durable home is the repo path named in recommendation 1.
