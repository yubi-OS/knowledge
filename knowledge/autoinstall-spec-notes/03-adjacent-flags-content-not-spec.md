# 03. Adjacent flags (content, not spec)

**Scope:** Adjacent flags (content, not spec): detailed analysis grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md, no external web dig

## What "adjacent" means here

The audit separates two kinds of finding. Spec findings (docs 01 and 02) ask whether the files are valid against the current autoinstall schema. Adjacent flags ask a different question: the file is valid, but is its content consistent, intentional, and durable? These are content issues that no schema validator will catch. The source lists five.

## Flag 1: the WARP repository suite mismatch

`cloudflare.sources` pins `Suites: noble` (Ubuntu 24.04) while the target system suite is `questing` (Ubuntu 25.10). The Cloudflare WARP repository has no questing suite, so noble packages are installed onto a 25.10 system.

- **Status today:** works.
- **Risk:** drift. As questing diverges from noble, library and dependency expectations in the noble packages may stop matching the installed system.
- **Decision required:** the audit asks for an explicit choice, either pin noble and document why, or switch WARP to a downloaded `.deb`.

This is the only flag the audit frames as needing a decision rather than a note.

## Flag 2: two writers for the same sources file

`bootcmd` rewrites `/etc/apt/sources.list.d/cloudflare.sources`, and `apt.sources.cloudflare.sources` also writes it. One of the two is redundant. Redundant writers are a classic maintenance hazard: an edit to one silently loses to the other depending on execution order. Because `bootcmd` runs early on every boot of the ephemeral environment and the `apt.sources` key is processed by the apt configuration stage, the effective content depends on ordering that is not obvious from the file. The fix is to choose one writer.

## Flag 3: FIDO2 packages without PAM wiring

`packages` installs `libpam-u2f` and `fido2-tools`, but `late-commands` does no PAM wiring. The audit records this as fine if intentional, because the yubiOS side owns authentication, and notes it for completeness. The relevant point for yubiOS is that installing a PAM module does not enable it: no YubiKey-based login is active after install until something writes the PAM configuration. If a reader assumes otherwise, they will assume a security control that is not in place.

## Flag 4: error-commands log into /target

`error-commands` write logs into `/target`. The audit confirms this is correct per the current spec: in the error path, the target filesystem is mounted at `/target`. This flag is a positive confirmation rather than a defect, recorded so that a future reviewer does not "fix" a correct path.

## Flag 5: shim hold and EFI overwrite

`late-commands` run `apt-mark hold shim shim-signed` and then overwrite `BOOTAA64.EFI` and the shim with repository EFIs. The audit finds this still consistent with the current spec: nothing in the schema changed around this. The hold prevents a later package upgrade from replacing the custom EFI binaries.

## Summary table

| # | Flag | Severity | Action |
|---|---|---|---|
| 1 | WARP noble suite on questing | Drift risk | Decide: pin and document, or switch to `.deb` |
| 2 | Duplicate writers of `cloudflare.sources` | Maintenance hazard | Remove one writer |
| 3 | `libpam-u2f` without PAM wiring | Informational | Confirm yubiOS owns auth wiring |
| 4 | `error-commands` write to `/target` | None (correct) | Leave as is |
| 5 | Shim hold then EFI overwrite | None (consistent) | Leave as is |

## How these flags relate to the spec findings

None of the five flags makes the file invalid. That is the reason they are separated: a pre-validation step against the JSON schema would pass this file, and a reader relying on that pass would miss all five. They fall into three patterns that recur in exported installer configs:

1. **Cross-release pinning** (flag 1), where a third-party repo lags the target release.
2. **Duplicated responsibility** (flag 2), where two mechanisms configure the same artifact.
3. **Installed-but-not-enabled** (flag 3), where a package's presence is mistaken for a configured control.

Flags 4 and 5 are recorded confirmations. Recording "this is correct and here is why" is as useful as recording a defect, because it prevents well-meaning regressions.

## Scope note

The outline scored this subtopic lowest in the corpus (0.4537), marking it marginal relative to the spec findings. That fits its role: these are housekeeping items, not compatibility blockers. Flag 1 is the exception worth acting on, because it is a slow-moving failure that will not announce itself until a package breaks.
