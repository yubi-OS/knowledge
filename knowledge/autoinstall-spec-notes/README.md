# Autoinstall spec notes - 2026-10-07

This corpus documents the 2026-10-07 audit of the yubiOS Ubuntu autoinstall seed files (`Deploy/ubuntu/{user-data,meta-data,network-config,vendor-data}`) against the current upstream Subiquity autoinstall reference at canonical/subiquity main (2026-09-30 head, targeting 26.04 development). It covers the status of the seed files, autoinstall fields added since the file was generated, adjacent content flags, the verification verdicts, failure modes, and how the seeds are governed.

**Ground source:** `yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md`

## Documents

| NN | File | Scope | Clef outline score |
|---|---|---|---|
| 01 | [01-status-of-our-seed-files.md](01-status-of-our-seed-files.md) | Status of our seed files: detailed analysis grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md. | 1.5670 |
| 02 | [02-new-fields-in-the-autoinstall-format-since-our-f.md](02-new-fields-in-the-autoinstall-format-since-our-f.md) | New fields in the autoinstall format since our file was generated: detailed analysis grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md. | 1.7393 |
| 03 | [03-adjacent-flags-content-not-spec.md](03-adjacent-flags-content-not-spec.md) | Adjacent flags (content, not spec): detailed analysis grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md. Internal-record subtopic, no dig. | 0.4537 |
| 04 | [04-falsification-gates-and-empirical-results.md](04-falsification-gates-and-empirical-results.md) | Pre-registered gates, measured empirical numbers, and verification verdicts. Internal-record subtopic, no dig. | 1.3156 |
| 05 | [05-failure-modes-and-scope-boundaries.md](05-failure-modes-and-scope-boundaries.md) | Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig. | 1.5416 |
| 06 | [06-integration-and-operational-governance.md](06-integration-and-operational-governance.md) | Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig. | 1.4584 |

Docs 01 and 02 are dig-backed (searXNG + Clef weighting). Docs 03 to 06 are internal-record subtopics grounded only in the ground-source document, with no external web dig.

## Research summary

- Results collected: 20 results collected (10 per dig-backed doc, 2 digs).
- Clef source-quality split: high >= 0.5: 7; low < 0.5: 13.
- Decision-model traffic: 5 jev requests (1 outline score request + 4 noul weighting batches).
- Redos: 0 redos.
- Skips: 0 skips.
- Weak-backing rule: every source under 0.5 is labeled `(weak backing, clef weight < 0.5)` wherever it is cited; load-bearing technical claims rest on the ground-source document.

## Preflight

Preflight 2026-10-21: searXNG 59 results healthy; /api/decide (clef) 200
