# 04. Boot flow: from firmware to a verified root

Scope: the sealed boot chain the source doc records, the role each stage plays, and the sealed versus unsealed status of the current paths.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## The chain

The source doc's boot-flow diagram records the sequence: UEFI firmware validates and measures systemd-boot; systemd-boot picks the newest UKI and validates its PE signature; the UKI measures into PCR 11 and carries a signed composefs digest; the composefs deployment is stored on a physical sysroot of ext4 or Btrfs with fs-verity, optionally inside LUKS2; the initrd unlocks that sysroot through YubiKey FIDO2 with PIN and touch; systemd-homed user volumes unlock the same way (source doc).

Each hop has a specific job:

1. UEFI firmware: validates the bootloader signature against Secure Boot db and measures it.
2. systemd-boot: bootloader selection plus signature validation of the UKI, which is UEFI PE signed via PIV slot 9c (source doc).
3. UKI: the single sealed object carrying .linux, .initrd, .cmdline, .pcrsig, and .pcrpkey (source doc).
4. composefs deployment: EROFS metadata plus fs-verity objects, with /etc and /var assembled from writable /state (source doc).
5. Physical sysroot: the writable carrier, optionally LUKS2-wrapped (source doc).

The UKI structure follows systemd's unified-kernel-image model, where a PE executable combines kernel, initrd, command line, and PCR signature data into one signed artifact; the systemd-measure manual documents pre-calculating and signing the expected TPM2 PCR 11 values for a UKI at build time (https://www.freedesktop.org/software/systemd/man/latest/systemd-measure.html, jev weight 0.41, weak backing). The authoritative list of what systemd measures into which PCRs, including PCR 11 for kernel and initrd images and boot phases, is maintained in the project's PCR documentation (https://systemd.io/TPM2_PCR_MEASUREMENTS/, jev weight 0.57).

## Sealed versus unsealed: the honest status

The source doc is unusually explicit here, and the distinction is load-bearing for CI triage. Native bootc composefs uses fs-verity-protected files and an EROFS metadata image inside a writable physical sysroot; it does not use a dm-verity EROFS root partition. The separate mkosi and systemd-repart image path may use dm-verity for fixed partition images. The current to-filesystem workflow validates strict fs-verity through a traditional BLS entry and is therefore still an unsealed boot proof (source doc).

In the sealed bootc target, the signed UKI binds the composefs digest and the bootc initramfs assembles the verified root from EROFS metadata and fs-verity objects (source doc). composefs itself combines EROFS, overlayfs, and fs-verity to provide cryptographic verification of an entire filesystem tree (https://bootc.dev/blog/2026-may-04-sealed-images-security-chain/, jev weight 0.23, weak backing; the composefs project describes itself the same way at https://github.com/composefs/composefs, jev weight 0.12, weak backing). A detailed technical writeup walks the mount chain, Merkle tree structure, and trust chain of composefs image sealing (https://scrivano.org/posts/2026-06-05-sealing-with-composefs/, jev weight 0.14, weak backing).

## Why PCR 11 matters even when measurement exists

On systems with a TPM or fTPM, the UKI measures its components into PCR 11 and the boot phases run from initrd-enter onward (source doc). The measured value lets policy (and later attestation) tie secret release to exactly the kernel, initrd, and command line that were signed. The 0pointer essay on the trusted boot stack describes this division: the OS vendor measures UKI components and boot phases at build time with zero per-boot cost, and later measurements cover the kernel command line and runtime configuration (https://0pointer.net/blog/brave-new-trusted-boot-world.html, jev weight 0.25, weak backing).

## What a reviewer should check

The source doc implies a checklist for any boot-flow change:

- Is the UKI still signed through PIV slot 9c, and does the signature cover the current composefs digest? Every rootfs change produces a new digest, so the UKI must be regenerated and re-signed (source doc).
- Does the path under test claim sealed or unsealed semantics? The BLS-entry lane is strict but unsealed (source doc, Open Edges).
- Is the sysroot fs-verity enabled (ext4 with the verity feature, or suitable Btrfs), and is /etc plus /var still assembled from /state (source doc)?
- If a TPM or fTPM is present, are PCR 11 measurements being taken, and is ConditionSecurity=measured-os the gate for services that depend on them (source doc)?

## Boot flow versus firmware flow

The boot flow above is deliberately shared between ARM64 and x86-64 once execution reaches systemd-boot: the source doc states systemd-boot loads the same signed UKI used on x86-64 on the ARM64 primary path (source doc). The divergence is entirely upstream of that point, in the secure-world firmware chain documented in the ARM64 sections. That shared tail is what makes the same install artifacts valid across both platform families.
