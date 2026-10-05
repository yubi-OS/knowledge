# 08 - OVMF Provisioning Gap

Scope: The missing OVMF provisioning stage in yubiOS CI: sourcing OVMF_CODE.fd and OVMF_VARS.fd from the edk2 build artifact and enrolling the yubiOS ROTPK into OVMF db with virt-fw-vars before any Secure Boot VM test.

## The gap

Neither `ci_test_sealed-uki-vm.yml` (the stub) nor `ci_test-vgpu-vm.yml` (working) provisions `OVMF_CODE.fd` / `OVMF_VARS.fd`, and no workflow in the org enrolls the yubiOS root of trust into the OVMF variable store. Without both, a QEMU OVMF Secure Boot step refuses the signed UKI with an OVMF-level rejection that masks the actual enrollment gap: the image may be perfectly signed, but the firmware has no key database entry to verify it against.

## Sourcing the firmware from the edk2 artifact

The natural source is the `ci_fork_edk2.yml` build artifact. The upstream OvmfPkg documentation states that for Secure Boot-enabled guests, QEMU must run OVMF with the `-pflash` parameter so UEFI variables persist across boots (source: https://github.com/tianocore/edk2/blob/master/OvmfPkg/README, weight 0.84). The split layout is the modern form: `OVMF_CODE.fd` holds the firmware code and `OVMF_VARS.fd` the variable store, and the code build without secure boot support ships with a blank varstore (weak backing: https://www.kraxel.org/blog/2022/07/edk2-firmware-packaging/, weight 0.44). Distribution packaging shows the two files plus the secboot variants ship together (source: https://developer.fedoraproject.org/tools/virtualization/fetching-ovmf-uefi-from-the-correct-source., weight 0.79), and Fedora documents OVMF as the standard UEFI firmware for QEMU guests (source: https://docs.fedoraproject.org/en-US/quick-docs/uefi-with-qemu/, weight 0.90).

For yubiOS the provisioning step belongs in the `boot-secure-vm` job of `ci_test_sealed-uki-vm.yml`, between the existing `Fetch OVMF firmware` step and `Boot signed UKI in QEMU OVMF Secure Boot VM`. The edk2 artifact provides the code image; the vars image must be prepared per run, because enrollment is per-trust-domain.

## Enrolling the ROTPK with virt-fw-vars

The enrollment tool is `virt-fw-vars`, which can print and modify UEFI variable stores in standard edk2 format as used by OVMF (source: https://manpages.debian.org/trixie/python3-virt-firmware/virt-fw-vars.1.en.html, weight 0.58). Its manual documents the secure-boot mode options and signature-database printing used to construct and verify the store (source: https://man.archlinux.org/man/extra/virt-firmware/virt-fw-vars.1.en, weight 0.87). The tool is part of the virt-firmware package, a collection of tools for OVMF and armvirt firmware volumes that support decoding, printing, and modifying firmware content (weak backing: https://pypi.org/project/virt-firmware/, weight 0.49).

The established workflow for generating a secure-boot-enabled vars file starts from a vendor X.509 certificate and generates the store through ovmf-vars-generator (weak backing: https://github.com/rhuefi/qemu-ovmf-secureboot/blob/master/README.md, weight 0.28). For yubiOS the same shape applies with the org's own root key: take a blank `OVMF_VARS.fd`, enroll the yubiOS ROTPK certificate into the `db` signature database (and set the platform key policy), then hand the customized vars image to QEMU alongside `OVMF_CODE.fd`. Community walkthroughs of custom secure-boot enrollment in QEMU document the same order: install OVMF, then enroll the custom key configuration into the vars image before boot (weak backing: https://kernal.eu/posts/secure-booty/, weight 0.41).

## Why the gap masks itself

The failure mode is the reason this gap ranks with the stub divergences: when the vars store has no matching `db` entry, OVMF rejects the UKI at firmware level. An operator debugging that run sees "Secure Boot violation" and reaches for the signing lane, which is already correct. The real fix is upstream of the boot: provision the vars image and enroll the ROTPK, and the OVMF rejection disappears for the right reason.

## Takeaway

Secure Boot VM testing needs 3 artifacts aligned: a signed UKI (doc 06 lane), firmware code (`OVMF_CODE.fd` from the edk2 artifact), and a vars store (`OVMF_VARS.fd`) with the org's root enrolled. The yubiOS fleet has the first and can build the second; the third is missing everywhere. The fix is a small job step using virt-fw-vars, placed between firmware fetch and VM boot in the sealed-UKI-VM workflow.
