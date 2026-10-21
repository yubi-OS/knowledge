# 04. Falsification gates and empirical results

**Scope:** Pre-registered gates, measured empirical numbers, and verification verdicts. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md, no external web dig

## Framing

The ground source is an audit, not a pre-registered experiment, so it does not define numeric gates the way the falsification-harness records do. It does, however, make a set of falsifiable claims about the seed files, each checked against a named source of truth. This doc restates those claims as gates, gives the verdict the source records for each, and states what evidence would overturn it.

## The source of truth

Every verdict is pinned to one artifact: canonical/subiquity `doc/reference/autoinstall-reference.rst` at main, 2026-09-30 head, targeting 26.04 development (https://github.com/canonical/subiquity/blob/main/doc/reference/autoinstall-reference.rst). Pinning the head date is what makes the audit reproducible: a later head could add fields or change defaults, and the verdicts would need to be re-run.

## Gates and verdicts

| Gate | Claim | Verdict recorded | What would falsify it |
|---|---|---|---|
| A1 Version | `autoinstall: version: 1` is the only version | PASS: no v2 exists | A v2 in the reference |
| A2 Schema validity | Nothing in the yubiOS files is invalid against the current schema | PASS | A schema error on pre-validation of any of the 4 files |
| A3 Field currency | The export carries the 24.04+ fields | PASS: `interactive-sections`, `mirror-selection`, `error-commands`, `oem/codecs/drivers`, deb822 `sources` present | A required modern field absent |
| A4 Layout validity | `lvm` + `encrypted: yes` remains valid | PASS | Deprecation of named `lvm` layout |
| A5 Pinned values still accepted | `apt.fallback: abort`, `oem.install: false` still valid | PASS: no longer defaults, still accepted | Removal of `abort` or `false` as values |
| A6 Single-map match | `storage.layout.match` single-map form | PASS: ordered list optional since 24.08.1 | Single-map form removed |
| A7 Error path | `error-commands` writing to `/target` | PASS: target mounted at `/target` in error path | Change to error-path mount point |
| A8 Shim handling | Hold plus EFI overwrite consistent | PASS: schema unchanged here | Schema change around boot assets |

## Empirical numbers recorded

The audit is mostly categorical, but it does carry concrete numbers:

- **Seed file set:** 4 files (`user-data`, `meta-data`, `network-config`, `vendor-data`), identical across 3 branches, with 1 extra variant on oem-2026.
- **New fields catalogued:** 13 rows, with dates from 2024-08-19 (`apt.fallback` default change) to 2026-09-30 (`apt.geoip` clarification).
- **Reset partition example size:** `12G`.
- **Swap example:** `size: 0`.
- **Interactive sections:** 2 (`storage`, `identity`).
- **Adjacent flags:** 5, of which 2 are confirmations and 1 requires a decision.

## Conditional findings (gates that pass with a caveat)

Three verdicts pass today but carry a condition that changes the outcome under a plausible change:

1. **Unknown keys.** v1 warns on unrecognized keys; future versions will make them fatal. The file passes A2 today but would fail on a future version if any typo exists. The mitigation is pre-validation against the schema on every edit.
2. **kdump default.** `kernel-crash-dumps.enabled` defaults to `null` on 24.10+, which enables `kdump-tools` on qualifying arm64 boxes. The file is valid, but its behavior on small SBCs (reserved crashkernel memory) is a side effect the file does not opt out of. Setting `enabled: false` is the explicit opt-out.
3. **Keyboard multi-layout under FDE.** If the layouts ever become comma-separated with a toggle, only the primary layout can unlock a TPM-FDE plus passphrase disk. yubiOS uses passphrase LUKS on `lvm`, not TPM-FDE, so this is informational unless the layout changes.

## Not-applicable verdicts

Some gates are recorded as N/A rather than PASS, which is a different claim: `identity.groups` (no identity section; identity is interactive), `zdevs` (IBM Z only), and `storage.layout.name: hybrid` on the Rockchip flow (no TPM-backed FDE support in that path). An N/A verdict should be re-checked if its precondition changes, for example if identity stops being interactive.

## Reproducing the audit

To re-run these gates against a newer upstream head: fetch the reference at the new head, record its date, pre-validate each of the 4 seed files against the published JSON schema, diff the reference's field list against the 13-row table, and re-check each conditional finding's default. Any change in A1 through A8 should produce a new dated spec-notes record rather than an edit to this one.
