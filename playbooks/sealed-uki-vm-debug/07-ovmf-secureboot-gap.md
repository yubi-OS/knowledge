# 07 - Row 8: the OVMF Secure Boot provisioning gap

Scope: why boot-secure-vm fails at the OVMF level, what is actually missing, and why that failure must not be read as a signing failure.

## The row

Row 8 is the `boot-secure-vm` job failing at the OVMF level. The source doc is explicit about what is expected today: neither `ci_test_sealed-uki-vm.yml` nor `ci_test-vgpu-vm.yml` provisions `OVMF_CODE.fd` / `OVMF_VARS.fd`, and neither enrolls the yubiOS ROTPK into the `db` signature database (source doc). The job has no firmware variable store with the lane's own trust anchor in it, so the virtual firmware cannot accept the PKCS#11-signed UKI the first job just built.

The diagnostic rule that follows: an OVMF rejection here masks the enrollment gap, so do not read it as a signing failure (source doc). The UKI signature can be perfectly valid and the VM will still reject it, because the firmware has no key in `db` that would verify it. This row exists to keep a future debugger from chasing rows 1 to 7 when the missing artifact is a firmware variable store.

## What provisioning would mean

Provisioning means two artifacts and one enrollment. `OVMF_CODE.fd` is the firmware code volume and `OVMF_VARS.fd` is the non-volatile variable store that carries the Secure Boot state: the platform key (PK), the key exchange key (KEK), the allowed signature database (`db`), and the revoked signature database (`dbx`) (https://docs.bell-sw.com/alpaquita-linux/latest/how-to/use-own-keys-in-secureboot/, weight 0.24, weak backing). Enrollment means writing the yubiOS root of trust public key (ROTPK) into `db` in a vars file handed to the VM at boot.

The ecosystem has tooling shaped exactly like that gap. The `ovmf-vars-generator` script in rhuefi/qemu-ovmf-secureboot generates an OVMF vars file with default Secure Boot keys enrolled and validates that the result works (https://github.com/rhuefi/qemu-ovmf-secureboot, weight 0.22, weak backing). The ovmfkeyenroll tool enrolls PK, KEK, and db keys into a copy of `OVMF_VARS.fd` and emits an enrolled vars file (https://pypi.org/project/ovmfkeyenroll/, weight 0.20, weak backing). The mechanism such tools rely on is the emulated flash: QEMU with `-pflash` backing OVMF fully supports UEFI variables (https://github.com/tianocore/edk2/blob/master/OvmfPkg/README, weight 0.37, weak backing).

## Where the firmware artifacts come from

The source doc names the artifact source: `ci_fork_edk2.yml` produces the OVMF artifacts (source doc). So the fix path for row 8 is: take the `OVMF_CODE.fd` / `OVMF_VARS.fd` pair from the edk2 fork lane, enroll the yubiOS ROTPK into the vars file, and hand both to `boot-secure-vm`. Until that wiring exists, the row stays open.

## Relation to the lane's assertion inventory and the V83 state

The 6 assertions of the lane include the negative tamper tests; a VM that boots an honest UKI and refuses a tampered one requires the enrollment path to work first (doc 01, source doc). The playbook's Verified working section records that as of 2026-08-01 the lane had not produced a green signed-UKI build, and the later green state at V83 came from the arm64 boot-tuning commit, not from an enrollment fix recorded in this playbook (source doc, doc 08). If a green run after V83 exists in the lane, the OVMF provisioning story must be reconstructed from the workflow file itself and `BLOCKERS.md` B-BOOTC-SEAL, which tracks the remaining Secure Boot and negative-tamper evidence work (source doc, doc 09).

## Debug discipline for this row

Two practical notes from the source doc's row 8 vicinity. First, the failure is expected, so treat an OVMF rejection as a routing decision: confirm the signature is valid upstream (row 2's command succeeded), then stop and file the enrollment gap rather than iterating on signing. Second, the operational notes apply to any diagnosis here: the run logs endpoint 404s after about 15 to 30 minutes, so capture evidence from the file diff, and duplicate dispatches land 10 to 20 seconds apart and should be listed and cancelled (202) (source doc).
