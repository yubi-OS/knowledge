# 04 - The Trusted Boot Chain

Scope: the boot chain as the 0pointer-mastery skill lays it out, from UEFI firmware through systemd-boot and the UKI to the unlocked root and per-user homes, with the PCR assignments, boot phase words, and the TPM2 versus YubiKey decision.

Grounding spine: yubi-OS/yubiOS skills/0pointer-mastery/SKILL.md (source doc). External mechanism claims carry their dig source URL and jev weight.

## The chain, step by step

The source doc draws the full chain (source doc):

1. UEFI firmware validates and measures systemd-boot into PCR 4.
2. systemd-boot picks the newest UKI by strverscmp() on the filename.
3. systemd-boot measures all UKI sections into PCR 11, except the .pcrsig section, and measures the kernel command line into PCR 12.
4. The initrd phase begins: initrd-enter is measured into PCR 11.
5. The initrd discovers sysext images and validates them via verity and IMA, measuring into PCR 13.
6. System credentials are decrypted (PCR 12-bound, or YubiKey FIDO2).
7. /usr is mounted via dm-verity; the usrhash= kernel parameter locates the partition by UUID.
8. initrd-leave is measured into PCR 11.
9. The root fs is unlocked (LUKS2 with YubiKey FIDO2 via cryptenroll) and the root volume key is measured into PCR 15.
10. The sysinit and complete boot phases are measured into PCR 11.
11. systemd-homed unlocks per-user homes, each a LUKS2 volume unlocked by that user's YubiKey FIDO2.

## What the official tools confirm

The measurement machinery is documented by systemd itself. systemd-measure is the tool that pre-calculates and signs the expected TPM2 PCR 11 values that should be seen when a UKI based on systemd-stub is booted (https://www.freedesktop.org/software/systemd/man/latest/systemd-measure.html, weight 0.72). That matches the source doc's claim that secrets are bound to PCR 11 so they are only accessible with the specific signed UKI (source doc).

systemd-stub's man page documents the handoff artifacts: the expected PCR values and their signatures land as tpm2-pcr-signature.json and tpm2-pcr-public-key.pem, copied into /run/systemd/ where they remain accessible after the system transitions out of the initrd environment (https://man7.org/linux/man-pages/man7/systemd-stub.7.html, weight 0.56). The systemd project's own issue tracker shows these artifacts in live use, with a user verifying the policies and signatures in /.extra/tpm2-pcr-signature.json with tpm2_verifysignature and asking how PCR 11 can hold a non-zero value if the stub did not extend it (https://github.com/systemd/systemd/issues/35820, weight 0.72).

The conceptual background is Lennart's own trusted boot writing: PCRs, measurements, the SRK, boot loaders, the shim binary, Linux, initrds, UEFI firmware, PE binaries, and SecureBoot form the problem space of the trusted boot chain (http://0pointer.net/blog/brave-new-trusted-boot-world.html, weight 0.59).

## Key PCR rules

The source doc compresses the rules to 3 lines (source doc):

- Secrets bound to PCR 11 are only accessible with the specific signed UKI.
- The root fs data-encryption key is bound to PCR 11 plus the boot phase word initrd-enter, making it inaccessible once the initrd transitions to the root fs.
- YubiKey FIDO2 replaces PCR-hash binding for secrets, which means secrets survive OS updates without re-enrollment.

The boot-phase words (initrd-enter, initrd-leave, sysinit, complete) are measured into PCR 11 at each transition (source doc).

## TPM2 versus YubiKey

The source doc states the divergence plainly (source doc): the standard design uses TPM2 for secrets because the chip is soldered to the board and needs no physical presence. yubiOS uses a YubiKey instead: it is portable, requires physical possession, and supports FIDO2, not just PCR hashes. PCR rollback counters can still live in TPM NV if a hardware TPM exists; that does not conflict with the YubiKey design.

Two clarifications the source doc attaches to this decision (source doc):

- FIDO2 hmac-secret provides equivalent sealing without requiring hardware attestation of PCR values.
- The YubiKey approach survives OS updates without re-enrollment and is not OEM-dependent.

A weakly-weighted third-party overview of the same divergence exists (https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot, weight 0.14, weak; https://docs.siderolabs.com/talos/v1.13/platform-specific-installations/bare-metal-platforms/secureboot, weight 0.22, weak) but the load-bearing claims above come from the source doc and the official tooling pages.

## Where the chain meets the rest of the corpus

The chain is the trust-chain rule of doc 01 made concrete: every layer in the 11-step chain cryptographically validates the next one (source doc). It is also why goal 4 (cryptographic measurement) of the 17 design goals names NvPCR, IMA, the dm-verity Merkle tree, and boot phase words together: they are the measurement instruments at 4 different layers of this one chain (source doc, doc 02). The root unlock step of the chain is the subject of doc 05's FIDO2 versus TPM2 why answer, and the homed step reappears in the source doc's home directory management section (source doc).

For general systemd context: systemd is the system and service manager that runs as PID 1 (https://systemd.io/, weight 0.82; https://github.com/systemd/systemd, weight 0.81 to 0.82; https://www.man7.org/linux/man-pages/man1/systemd.1.html, weight 0.65). Generic overview pages found by the dig (https://en.wikipedia.org/wiki/Systemd, weight 0.34, weak; https://www.geeksforgeeks.org/linux-unix/linux-systemd-and-its-components/, weight 0.10, weak; https://linuxvox.com/blog/systemd-in-linux/, weight 0.12, weak; https://sourlemonjuice.github.io/posts2/2025/08/linux-x86-bootloader-and-tpm2, weight 0.09, weak; https://athenaos.org/en/security/tpm/, weight 0.11, weak) carry no load-bearing claims in this doc.
