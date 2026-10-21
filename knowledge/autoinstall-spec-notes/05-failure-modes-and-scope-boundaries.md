# 05. Failure modes and scope boundaries

**Scope:** Documented failure modes, negative results, and explicit non-claims. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md, no external web dig

## Documented failure modes

The audit names several ways the seed files could fail or misbehave even though they pass the current schema.

### F1: typo becomes fatal

Unrecognized keys warn in v1. In future versions they will be a fatal validation error. Because the user-data is a machine export that humans then edit, a misspelled key added during an edit would install cleanly today with only a warning in installer logs, then break the install outright when the format version advances. Mitigation: pre-validate on every edit and treat warnings as failures in CI.

### F2: silent kdump memory reservation

On 24.10+, `kernel-crash-dumps.enabled` defaults to `null`, meaning dynamic enablement. On arm64 boxes meeting minimum requirements, `kdump-tools` gets enabled. On a small single-board computer that silently reserves crashkernel memory. The failure is quiet: the install succeeds and the system runs, with less usable memory than expected. Mitigation: set `enabled: false` if kdump is unwanted.

### F3: repository suite drift

`cloudflare.sources` pins `Suites: noble` on a `questing` (25.10) target. Works today; drifts over time as the two releases diverge. The failure mode is a future package install or upgrade that breaks on dependency mismatch with no change to the seed file.

### F4: redundant writers

Both `bootcmd` and `apt.sources.cloudflare.sources` write `/etc/apt/sources.list.d/cloudflare.sources`. The failure mode is an edit to one writer that is silently overridden by the other.

### F5: installed-but-not-enabled auth

`libpam-u2f` and `fido2-tools` are installed with no PAM wiring in `late-commands`. If the yubiOS auth layer does not wire PAM afterward, a reader could believe FIDO2 login is enforced when it is not.

### F6: TPM-FDE and layout assumptions

`storage.layout.name: hybrid` is the modern TPM-backed FDE path but is not usable on the Rockchip flow. Copying a desktop example that uses `hybrid` into the Rockchip seed would fail. Relatedly, `storage.layout.accepted-errors` only works for errors where snapd offers a `proceed` action; it is not a general error suppressor.

### F7: multi-layout unlock

With TPM-FDE plus passphrase, only the primary keyboard layout can unlock the disk. A comma-separated layout list could lock out a user typing the passphrase in the secondary layout.

### F8: geoip misunderstanding

`apt.geoip: false` only disables country-mirror selection, not the geoip lookup itself. A reader expecting it to suppress the lookup for privacy reasons would be wrong.

## Explicit non-claims

The audit is careful about the edges of its verdicts:

- **It does not claim the install works end to end.** Schema validity was checked against the reference; the source does not record a test install on hardware.
- **It does not claim runtime validation passes.** The schema is used for pre-validation, and runtime validation is more involved (it is staged around early commands).
- **It does not audit content beyond the five flags.** Package lists, late-commands logic, and network-config were not reviewed for correctness beyond the noted items.
- **It does not judge PAM policy.** Flag 3 explicitly defers to the yubiOS side, which owns authentication.
- **It does not cover a v2 format**, because none exists.

## Scope boundaries

| Boundary | In scope | Out of scope |
|---|---|---|
| Files | `Deploy/ubuntu/{user-data,meta-data,network-config,vendor-data}` and the oem-2026 arm64 desktop-minimal variant | Other provisioning assets |
| Branches | Docker, oem-2026, Docker-Dev-26.04 | Other branches |
| Spec version | Subiquity main at 2026-09-30, targeting 26.04 development | Released-version docs for older LTS lines |
| Architecture | arm64 relevance noted (Rockchip flow) | IBM Z (`zdevs`), x86-only paths |
| Encryption | Passphrase LUKS on `lvm` | TPM-backed FDE (`hybrid`), unusable on this flow |
| Identity | Interactive identity section | `identity.groups` |

## Negative results

The audit's key negative results are useful in their own right: there is no v2 format; there is no TPM-backed FDE support on the Rockchip path; there is no questing suite in the WARP repository; and there is no PAM wiring in `late-commands`. Each negative result closes off an assumption a future maintainer might otherwise make.
