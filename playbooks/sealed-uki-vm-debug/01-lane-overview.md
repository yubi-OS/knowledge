# 01 - The sealed-UKI VM lane: what ci_test_sealed-uki-vm.yml builds and runs

Scope: what the sealed-UKI VM lane is, the three jobs it runs, the 6 assertions it checks, and the canonical workflow it must be diffed against.

## The lane in one paragraph

The sealed-UKI VM lane is the GitHub Actions workflow `.github/workflows/ci_test_sealed-uki-vm.yml` (source doc). It builds a UKI signed through PKCS#11, with the signing key living in a SoftHSM slot that emulates a YubiKey PIV 9c slot, boots that UKI under OVMF with Secure Boot enabled, and then runs negative tamper tests against the booted VM (source doc). The workflow has three jobs: `build-and-verify-uki`, `boot-secure-vm`, and `negative-tamper-tests`, and it checks 6 assertions in total (source doc). The playbook does not enumerate the 6 assertions itself; it points at `refs/sealed-uki-vm-test-2026-07-30.md` as the doc that records the 3 jobs and 6 assertions (source doc). Do not reconstruct the assertion list from memory; read the ref doc.

## What a UKI is, in the terms the lane needs

A Unified Kernel Image (UKI) is a single PE-format EFI binary that combines components, usually a kernel, an initrd, and the kernel command line, together with the systemd-stub UEFI stub, into one executable the firmware or a bootloader can start directly (https://www.mankier.com/1/ukify, weight 1.00). When the UKI is executed, the stub extracts and boots the embedded kernel; with qemu a UKI can also be executed through direct kernel boot (https://www.mankier.com/1/ukify, weight 1.00). The `ukify build` verb assembles the image and can sign it in the same pass, for example with `--secureboot-private-key` and `--secureboot-certificate`; `ukify genkey` generates the Secure Boot and PCR signing key material (https://www.mankier.com/1/ukify, weight 1.00). This is the shape the lane exercises: a signed UKI, booted by virtual UEFI firmware, with the signature verification turned on.

## Why the signing path is PKCS#11 and SoftHSM

The lane signs through PKCS#11 because the point of the exercise is to rehearse the production key ceremony, where the Secure Boot key lives on a YubiKey PIV 9c slot, without requiring a physical key in CI. The source doc states the SoftHSM slot emulates PIV 9c. SoftHSM itself is a software implementation of a cryptographic store accessible through the PKCS#11 interface, built so PKCS#11 workflows can run without a hardware HSM (https://www.softhsm.org/, weight 0.36, weak backing). PKCS#11 is the OASIS Cryptoki C interface for creating and manipulating cryptographic tokens that hold secret keys (https://docs.oasis-open.org/pkcs11/pkcs11-base/v2.40/os/pkcs11-base-v2.40-os.html, weight 0.49, weak backing).

## The canonical pattern to diff against

The playbook names `ci_mkosi-installer.yml` as the canonical pattern: it contains the SoftHSM bootstrap and the `mkosi --secure-boot-key-source provider:pkcs11` invocation (source doc). Rule 1 of the doctrine (doc 02) is to diff the sealed-UKI stub against this canonical and never improvise: the stub diverged from it in 7 or more ways, and the canonical was right every time (source doc).

## What the lane is for in the bigger picture

The lane is the Secure Boot end-to-end validation vehicle for the sealed-UKI flow: build a UKI the way production would seal it, prove the VM refuses to boot a tampered image, and prove the honest image boots. As of the playbook's Verified working date of 2026-08-01 the lane had not yet produced a green signed-UKI build; the green state arrived later at V83 (doc 08). The OVMF-level enrollment gap that still stood between the signing path and a full green run is doc 07.

## Debug history as a size hint

V25 to V39 burned about 15 runs over 2 days, and roughly half of those failures were not what the log appeared to say (source doc). That ratio is why the playbook exists: the lane's failure modes are mostly environmental (mounts, container state, YAML parsing, PKCS#11 provider behavior), and each one hides behind a plausible-looking log line. The decision tree in docs 03 to 05 is the distilled map of those rows.
