# 05 Test scripts and unit assertions

Scope: the VM scripts the recipe runs and the bats unit tests that lock the PAM configuration in.

Grounding spine: source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Mechanism section.

## The three VM scripts

The source doc names three VM test scripts with their roles:

- `tests/vm/test-luks-fido2-ci.sh`: passless plus swtpm, covering LUKS2 and homed, CI, passless-only (source doc).
- `tests/vm/test-fido2-enrollment.sh`: the CTAP2 `hmac-secret` legs (source doc).
- `tests/vm/test-luks-fido2.sh`: the hardware-in-the-loop variant (source doc).

The split mirrors the two lanes of doc 01: the first two scripts are the software lane exercised in CI (passless-only means they refuse to run against a physical key, per the guard), and the third is the hardware variant that belongs to the open `B-REAL-FIDO2` work rather than this recipe. The verified run in doc 07 exercised the software lane; the source doc records that both scripts report PASS.

The enrollment script's focus on CTAP2 `hmac-secret` is grounded in the protocol: the hmac-secret extension is part of the FIDO CTAP2 specification and is the mechanism behind offline uses such as disk unlock (weak backing, 0.47: https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/Integration_Review_Standard_FIDO.html). The FIDO Alliance CTAP specification defines the extension in section 9.1, with MakeCredential requests advertising `"hmac-secret": true` (strong backing, 0.78: https://fidoalliance.org/specs/fido-v2.0-rd-20180702/fido-client-to-authenticator-protocol-v2.0-rd-20180702.html).

## The bats unit tests

Alongside the VM scripts, the recipe pins unit-level invariants with bats:

- `bats tests/unit/test-pam-u2f-stack.bats`: asserts `required` plus the 1.3.1 floor (source doc).
- `bats tests/unit/test-enroll-{luks,pam,ssh,unit}.bats`: the enrollment-related unit tests (source doc).

Bats is the Bash Automated Testing System, a TAP-compliant testing framework for bash scripts (weak backing, 0.24: https://github.com/bats-core/bats-core); it is a common choice for shell script unit testing in CI (weak backing, 0.08: https://www.commandinline.com/shell-script-unit-testing-bats/).

The division of labor is the point. The VM scripts prove behavior end to end in a booted guest; the bats tests prove the configuration artifacts stay correct without booting anything. Concretely, `test-pam-u2f-stack.bats` is what turns the two frozen PAM decisions from doc 02 (the `required` control flag and the 1.3.1 version floor) into enforced invariants: if someone edits the PAM stack to `sufficient` or drops the floor, the unit test fails before any VM run is spent. The `test-enroll-*` bats files likewise pin the enrollment units at the file level.

## Mapping the enroll tests to the chain

The four `test-enroll-{luks,pam,ssh,unit}.bats` files line up with the tail of the mechanism chain in doc 03, which is what makes them a unit-level mirror of the CI legs: `luks` guards the LUKS2 enrollment configuration, `pam` guards the PAM wiring that `pamu2fcfg` registers into, `ssh` guards the `ssh-keygen -t ed25519-sk` leg, and `unit` guards the enrollment unit files themselves (source doc for the file names; the mapping to chain legs follows the chain as recorded in the source doc). Because each file owns one leg's configuration, a failure in a bats run names the broken leg before any VM boot is attempted.

Bats itself produces TAP output and runs each test in an isolated subshell (weak backing, 0.24: https://github.com/bats-core/bats-core), which suits CI use: one failing assertion fails its file without corrupting the rest of the suite.

## How the layers compose

The composition rule follows from the recipe's verification discipline (doc 04): a green CI conclusion is not accepted until the inner runs show no skip lines. The same logic applies at the unit layer, where the bats assertions are the fast guard that keeps the frozen PAM decisions from drifting between VM runs. Reading the two layers together: unit tests hold the configuration, VM scripts hold the behavior, and neither substitutes for the other. A change that passes bats but breaks the guest enumeration would still fail `test-luks-fido2-ci.sh` at the `/dev/hidraw0` leg; a change that breaks the PAM floor fails bats before the VM is even launched.
