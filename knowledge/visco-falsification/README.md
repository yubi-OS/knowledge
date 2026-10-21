# Round record - visco falsification fixtures (snapback + hysteresis)

This corpus documents the 2026-10-07 round record for the visco falsification fixtures: Lane C's execution of build-order items 5 (snapback) and 6 (hysteresis) from the falsification-harness-coverage record. It covers the verdict, the pre-registration discipline, the 843-case snapback corpus and its six gates, the hysteresis reference and its four gates, the dated amendments, and the live-endpoint schema surprises and honest limitations the round surfaced.

**Ground source:** `yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md`

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | [01-verdict-both-endpoints-pass-their-pre-registered.md](01-verdict-both-endpoints-pass-their-pre-registered.md) | Verdict: BOTH ENDPOINTS PASS THEIR PRE-REGISTERED FALSIFICATION GATES: detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. | 1.8308 |
| 02 | [02-1-pre-registration-written-before-any-corpus-run.md](02-1-pre-registration-written-before-any-corpus-run.md) | 1. Pre-registration (written before any corpus run): detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. | 1.8246 |
| 03 | [03-2-snapback-corpus-results.md](03-2-snapback-corpus-results.md) | 2. Snapback corpus + results: detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig. | 1.8679 |
| 04 | [04-3-hysteresis-reference-fixtures-live-contract.md](04-3-hysteresis-reference-fixtures-live-contract.md) | 3. Hysteresis reference + fixtures + live contract: detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig. | 1.8994 |
| 05 | [05-4-amendments-all-pre-gate-dated-in-amendments-md.md](05-4-amendments-all-pre-gate-dated-in-amendments-md.md) | 4. Amendments (all pre-gate, dated, in `amendments.md`): detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig. | 1.0302 |
| 06 | [06-5-live-endpoint-surprises-schema-behavior-notes.md](06-5-live-endpoint-surprises-schema-behavior-notes.md) | 5. Live-endpoint surprises (schema/behavior notes): detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md. Internal-record subtopic, no dig. | 1.1371 |

Docs 01 and 02 are dig-backed (searXNG + Clef weighting). Docs 03 to 06 are internal-record subtopics grounded only in the ground-source document, with no external web dig.

## Research summary

- Results collected: 20 results collected (10 per dig-backed doc, 2 digs).
- Clef source-quality split: high >= 0.5: 4; low < 0.5: 16.
- Decision-model traffic: 5 jev requests (1 outline score request + 4 noul weighting batches).
- Redos: 0 redos.
- Skips: 0 skips.
- Weak-backing rule: every source under 0.5 is labeled `(weak backing, clef weight < 0.5)` wherever it is cited; load-bearing technical claims rest on the ground-source document.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
