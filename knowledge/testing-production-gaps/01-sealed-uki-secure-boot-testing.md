# 01 - Sealed UKI and Secure Boot testing

## Scope

Proving signed UKI and Secure Boot with negative tamper evidence: the sealed-UKI VM lane, OVMF/swtpm limits, PCR golden values, and the three unproven tamper assertions for yubiOS.

## What a UKI is and what Secure Boot verifies

A unified kernel image (UKI) is a single PE executable that combines the kernel, initrd, and kernel command line, bootable directly from UEFI firmware or sourced by systemd-boot with little or no configuration (source: https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.95). Because the command line lives inside the signed image, Secure Boot verification covers the arguments a tamperer would most want to change. Standard tooling builds and signs UKIs with systemd-ukify or sbctl; the sbctl workflow enrolls keys into the UEFI key database and signs every image that kernel-install produces (source: https://edu4rdshl.dev/posts/uki-secure-boot-on-archlinux-systemd-boot-walkthrough/, jev weight 0.70). The KERNEL_INSTALL_LAYOUT=uki setting flips kernel-install into UKI mode so every kernel upgrade produces a signed image instead of a split kernel and initrd pair (source: https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/, jev weight 0.60).

## What QEMU with OVMF and swtpm can prove

QEMU with OVMF firmware and swtpm is the standard harness for measured boot experiments on commodity CI hardware. A documented reference setup shows how OVMF measures boot events into a virtual TPM backed by swtpm, which is enough to verify that the measurement chain fires and that TPM-based policies can be evaluated at runtime (source: https://github.com/anpep/qemu-tpm-measurement, jev weight 0.58; detail page: https://github.com/anpep/qemu-tpm-measurement/blob/trunk/README.md, jev weight 0.51). OVMF itself is the Tianocore firmware for virtual machines and supports Secure Boot variable enforcement, so a guest can be provisioned with a custom key exchange key (KEK) and signature database (db) before boot (source: https://github.com/tianocore/tianocore.github.io/wiki/OVMF, jev weight 0.74).

Measured boot state is exposed through TPM PCRs. systemd-boot extends PCRs with the UKI hash and the loaded initrd, and the TPM2-based policy that systemd-stub applies can bind disk unlocking to those measurements (source: https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot, jev weight 0.39, weak backing). A common pitfall in this class of testing is PCR bank misconfiguration: the virtual TPM may compute SHA1 bank values while the policy expects SHA256, which produces confusing policy failures during CI runs (source: https://raymo200915.github.io/2025/02/01/Measured-Boot-Pitfall-PCR-Bank-Misconfiguration.html, jev weight 0.25, weak backing).

## What QEMU cannot prove

QEMU proves build shape: that a signed image exists, that OVMF rejects unsigned or wrongly signed images, and that PCRs extend as expected. It does not prove vendor firmware behavior, real NVRAM variable enforcement, or the firmware's handling of a physically tampered SPI flash. That distinction is exactly why yubiOS treats the sealed-UKI boundary as its long pole: the sealed path (composefs digest bound through a signed UKI) is designed to be verified against real firmware before any production claim (yubiOS source: refs/testing-production-gaps-2026-08-01). A static audit of the hardening configuration cannot substitute for a boot where the policy actually fires.

## The three negative tamper assertions

The yubiOS test design defines three negative assertions for the sealed-UKI lane: a tampered UKI must fail boot, a tampered composefs root hash must fail boot, and an unsigned UKI must fail boot (yubiOS source: refs/testing-production-gaps-2026-08-01). Two of the three were still TODO-only at the time the gap audit was written. The concrete test recipe each assertion needs is straightforward to express in the VM lane:

1. Sign a good UKI with a test key, put the key hash in the OVMF db, boot it green, then flip one byte in the PE payload and boot again. Expected: firmware refuses the image.
2. Boot a sealed image, then swap the composefs EROFS blob so its digest no longer matches the roothash passed in the signed kernel command line. Expected: the initramfs verifies the root hash and drops to an emergency shell instead of mounting.
3. Present an unsigned UKI with the same filename convention as the signed one. Expected: Secure Boot enforcement in OVMF rejects it before systemd-stub runs.

Each green negative run is CI evidence in the same sense a positive run is: it must be captured as a saved log with the firmware variables and the PCR state attached. The yubiOS lane landed as a workflow file and stub fill-in across two PRs (PR #154 and PR #155, yubiOS source: refs/testing-production-gaps-2026-08-01), and the first green signed-UKI build arrived in run 30652859000 (V83).

## Gap and fix for yubiOS

The critical gap (Gap 1 in the yubiOS audit) is real-firmware Secure Boot negative-tamper evidence: a signed UKI could in principle pass sbverify but still be accepted by a mis-provisioned firmware that never actually enforces its db. The mitigation ordering matters: the amd64 OVMF lane goes first because it is automatable in CI, the arm64 lane waits behind the board bring-up blocker (B-ARM64-PATHA), and the final sign-off requires a physical sign-off ceremony because fuse and key-DB provisioning on real hardware is irreversible (yubiOS source: refs/testing-production-gaps-2026-08-01). The fix set is: land the sealed-UKI workflow, capture 3 green negative-tamper runs against the dev channel image tag, and add a Bats unit test asserting the sealed lane's artifacts exist, so the negative assertions cannot silently regress to green-only coverage.

## Sources

- https://wiki.archlinux.org/title/Unified_kernel_image (weight 0.95)
- https://github.com/tianocore/tianocore.github.io/wiki/OVMF (weight 0.74)
- https://edu4rdshl.dev/posts/uki-secure-boot-on-archlinux-systemd-boot-walkthrough/ (weight 0.70)
- https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/ (weight 0.60)
- https://github.com/anpep/qemu-tpm-measurement (weight 0.58)
- https://github.com/anpep/qemu-tpm-measurement/blob/trunk/README.md (weight 0.51)
- https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot (weight 0.39, weak backing)
- https://raymo200915.github.io/2025/02/01/Measured-Boot-Pitfall-PCR-Bank-Misconfiguration.html (weight 0.25, weak backing)
- https://mylinux.work/guides/secure-boot-uki/ (weight 0.20, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
