# 06 Failure triage and the two real bugs

Scope: the symptom-to-suspect table, the guard refusals that must never be worked around, and the build-path lesson from PRs 102 and 125.

Grounding spine: source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Mechanism section (symptom table, do-not rules) and Verified working section.

## The symptom table

The source doc pairs each failure symptom with its first suspect:

| Symptom | First suspect |
|---|---|
| `pamu2fcfg: command not found` in-guest | the subpackage was dropped from the production `Containerfile` (check that file, not `mkosi.conf`) |
| `homectl create` hangs about 5 min | missing `--enforce-password-policy=no` |
| `/dev/hidraw0` absent | `--swu2f` not passed, or the host uhid load failed |
| CTAP2 `hmac-secret` unsupported | the `passless` pin moved (pinned immutably for exactly this reason) |
| passless tests skipped, guard message about a real device | a physical key is attached; the refusal is correct |
| lane green but assertions skipped | read the log for skip lines; `success` with skips is not coverage |

(source doc)

Two of the six rows are the same lesson in different clothes: a green or skipped status can look healthy while proving nothing, so the log, not the conclusion, is the evidence surface (doc 04).

## The guard: never work around a refusal

The playbook gives two explicit do-not rules (source doc):

1. Do not "fix" a guard refusal by unplugging the key or patching `assert_passless_only`. When the passless tests skip with a guard message about a real device, a physical key is attached and the refusal is correct behavior. The guard exists to keep the software-lane evidence clean: if a real device participated, the run would no longer prove the software path in isolation (doc 01).
2. Do not move the enrollment fix back to `mkosi.conf`. That build path does not ship the image, which is exactly why the first attempt had no effect.

Both rules protect evidence integrity rather than convenience: working around the guard would fabricate a passing lane, and moving fixes to a non-shipping build path produces changes that look merged but never reach the image.

## The two real bugs

Getting the lane green took two real bug fixes, both recorded in the source doc:

1. `pamu2fcfg` missing from the built image. On Fedora Rawhide, `pamu2fcfg` is split into a separate subpackage from `pam-u2f` (source doc; independently: pamu2fcfg is a subpackage of pam-u2f providing a command line tool for configuring PAM authentication over U2F, weak backing, 0.39: https://packages.fedoraproject.org/pkgs/pam-u2f/pamu2fcfg/). The first fix (PR #102) changed `mkosi.conf` and had no effect because that build path does not ship the image; the effective fix (PR #125) added the subpackage in the production `Containerfile` (source doc).
2. `homectl create` hanging about 5 minutes on an empty `NEWPASSWORD=`. Fixed with `--enforce-password-policy=no` (PR #102) (source doc).

The upstream packaging behavior behind bug 1 is why the symptom row points at the `Containerfile` first: the subpackage split means `pam-u2f` alone does not bring the configuration tool into the image.

For bug 2, the homed behavior sits in the systemd-homed stack the recipe depends on; the general mechanism of systemd-homed managing LUKS2-backed home directories is covered by the systemd project documentation (weak backing, 0.26: https://systemd.io/). The recipe's contribution is the concrete fix and the failure signature: a hang of roughly 5 minutes instead of a fast failure means the flag is missing.

## Triage workflow

With the table, the workflow for a red lane is short: read the failing leg in the chain (doc 03), match the symptom to the first suspect, and fix at the layer the suspect names: the production `Containerfile` for image packaging, the `homectl` invocation for the hang, the bcvk launch for enumeration, the `passless` pin for protocol support. Only after the fix re-enters the image should the CI dispatch of doc 04 be repeated, and the same skip-reading discipline applies to the verification run.
