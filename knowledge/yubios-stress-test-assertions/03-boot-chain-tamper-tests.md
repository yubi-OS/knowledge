# 03 Boot chain tamper tests

Scope: tamper-per-link stress tests across the verified boot chain: kernel image, loader configuration, signing material, digest pin files, and the root digest, each with a fail-closed pass criterion.

## The chain model the tests must assume

A verified boot chain is a sequence of links where each stage verifies the next, starting from a hardware-protected root of trust. The Android Open Source Project definition is the cleanest available: Verified Boot "strives to ensure all executed code comes from a trusted source (usually device OEMs), rather than from an attacker or corruption" and "establishes a full chain of trust, starting from a hardware-protected root of trust" (https://source.android.com/docs/security/features/verifiedboot, jev weight 0.91, authoritative). The Tianocore firmware documentation grounds the same model in NIST publications: per NIST SP 800-147 and SP 800-193, "the system needs to maintain integrity and availability during the firmware boot process" (https://github.com/tianocore-docs/Understanding_UEFI_Secure_Boot_Chain/blob/master/introduction-to-the-secure-boot-chain.md, jev weight 0.89, authoritative).

For a UKI-based Linux system, the chain is: firmware, then the unified kernel image (a single UEFI-executable combining the UEFI boot stub, kernel, initrd, and command line), then the initrd, then the root filesystem image. The ArchWiki definition: a UKI "is a single executable which can be booted directly from UEFI firmware, or automatically sourced by boot loaders with little or no configuration" (https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.83, authoritative); the Gentoo wiki entry matches (https://wiki.gentoo.org/wiki/Unified_Kernel_Image, jev weight 0.83, authoritative). A distribution-aware UKI workflow doc enumerates the verification surface as "kernel, initrd, command line, os-release, Secure Boot signing, inspection, rollout, and rollback verification" (https://danielcosenza.com/posts/lx-howto-unified-kernel-image/, jev weight 0.63, authoritative). Each item in that enumeration is a candidate tamper target.

## The tamper matrix

The stress test decomposes into one case per link, and each case must state the tamper action and the expected terminal state:

1. UKI payload tamper. Modify the kernel or initrd inside the UKI, or alter the embedded command line. Because the UKI is a single signed executable, any payload change must invalidate the signature check. Expected terminal state: boot refused with the failure cause printed.
2. Loader entry tamper. Edit the systemd-boot loader entry or the boot selection config. The expected property is that a modified entry cannot cause an unsigned kernel path to boot; a bootloader that trusts config files it cannot authenticate is a broken link.
3. Signing material tamper. Corrupt or substitute the PIV signing material used for UKI signature creation. Expected terminal state: the next build or verification run fails loudly; an already-sealed boot must still boot only if its signature verifies against the enrolled key.
4. Digest pin tamper. Alter the digest pin file (in yubiOS, PINNED.md, 12,017 bytes, per GET https://api.github.com/repos/yubi-OS/yubiOS/contents/refs?ref=main). The pin file is the source of truth for approved image digests; a tamper test proves that a mismatched digest halts the flow rather than being skipped.
5. Root digest tamper. Modify the composefs root digest so the on-disk root no longer matches the signed catalog. Expected terminal state: mount refused. The Android Verified Boot 2.0 specification formalizes the property this case tests: "tamper-evident means that it's possible to detect if the HLOS has tampered with the data, e.g. if it has been overwritten" and "tamper-evident storage must be used for stored rollback indexes" (https://android.googlesource.com/platform/external/avb/+/master/README.md, jev weight 0.83, authoritative).

## Timing attacks: the TOCTOU class

Tampering the payload is not the only attack class. TOCTOU (time-of-check to time-of-use) attacks target the window between verification and execution. Trammell Hudson's analysis describes Intel BootGuard's Verified Boot mode as "the core root of trust and measurement during the boot process" that "preserves the chain of trust" (https://trmm.net/TOCTOU, jev weight 0.66, authoritative), in the context of attacks that swap block device contents after the check. A mature tamper test suite therefore includes at least one TOCTOU-shaped case: verify the image, then swap the underlying storage before it is read again. The pass criterion stays the same: the swap is detected or the failure is closed.

## Pass criterion and failure modes

Universal pass rule: each broken link produces a fail-closed state. The machine refuses to boot, prints the failure cause, and does not silently boot an untrusted image. The failure modes the test must distinguish:

- Fail closed with cause (pass).
- Fail closed without cause (partial pass: safe but undiagnosable; the recovery path must still be documented).
- Silent fallback to an untrusted path (fail; this is the worst outcome).
- Fail open with a bypass prompt (fail; the prompt is an attack surface).

## The yubiOS application

The yubiOS repo cross-check (GET https://api.github.com/repos/yubi-OS/yubiOS/contents/.github/workflows?ref=main) found the closest existing harness to be ci_test_sealed-uki-vm.yml, 52,561 bytes, the largest test workflow in the repository, together with tests/vm/test-luks-fido2-ci.sh and tests/verify-uki-signature.sh (1,915 bytes). The source analysis verdict for stress test 1 was COVERED at the VM level: the tamper cases can be expressed against this harness. Two caveats carry forward. First, the harness executes in a VM (bcvk/qemu), so the demonstrated property is the VM configuration, not bare-metal silicon; the platform caveat is doc 07's subject. Second, the per-link matrix above is finer-grained than any single existing script, so the assertion set should enumerate all 5 links plus the TOCTOU case as distinct rows rather than folding them into one end-to-end run.

## What a red team does with this

An external red team runs the tamper matrix in the order an attacker would: cheapest tamper first (loader config), highest-value tamper last (root digest). Any link that accepts a modification and still boots has converted the whole chain below it into decoration, because the attacker only needs one open link. The assertion set makes that property explicit: every link is tested as if the others were absent, so no link's security depends on a sibling's correctness.
