# 02 - The 17 Design Goals

Scope: the 17 design goals of Lennart Poettering's image-based OS vision as tabulated by the 0pointer-mastery skill, each mapped to its yubiOS implementation, grouped by what the goals are trying to guarantee.

Grounding spine: yubi-OS/yubiOS skills/0pointer-mastery/SKILL.md (source doc). This is an internal-record subtopic, no dig; the goals table and the yubiOS implementation column are the project's own decision record, reproduced and organized here from the source doc.

## Image fundamentals

Goals 1, 11, 12, 16, and 17 define what the OS physically is (source doc):

1. Image-based, not package-based. yubiOS implements this with bootc OCI images plus mkosi disk images.
11. No installer, live image. The image is dd'ed to disk; systemd-repart creates the root on first boot.
12. Minimal shipped image. Ship only the ESP and the /usr A partition; the root and /usr B are created on first boot.
16. Uniform format. All images are GPT disk images with DPS UUIDs, Verity, and PKCS#7 signatures.
17. Built from distributions. yubiOS is based on Debian Trixie packages; mkosi builds from apt.

The pattern across these 5 goals: one artifact serves as installer image, live image, and shipped image simultaneously. There is no separate installer program because there is nothing for an installer to do that first-boot repart does not already do (source doc).

## Trust chain

Goals 2, 3, 4, and 14 define who can run what (source doc):

2. Trust chain from firmware to apps. UEFI SecureBoot validates the UKI, the UKI is signed by YubiKey PIV slot 9c, and dm-verity protects /usr.
3. Offline security (evil maid). LUKS2 plus YubiKey FIDO2, not TPM2.
4. Cryptographic measurement. NvPCR, IMA, the dm-verity Merkle tree, and boot phase words.
14. Democratic/hackable. Local sysext keys plus custom Secure Boot enrollment via systemd-sbsign.

Goal 14 is the counterweight to goals 2 through 4: the same chain that locks the system down is designed so the owner can enroll their own keys rather than being locked to a vendor's chain (source doc).

## Lifecycle

Goals 6, 7, 8, and 13 define how the system changes over time (source doc):

6. Self-updating. systemd-sysupdate A/B plus bootc upgrade.
7. Robust against failed updates. Boot Assessment with a counter in the UKI filename plus A/B fallback.
8. Factory reset. systemd-repart erases flagged partitions; the root fs is rebuilt hermetically.
13. Local key generation. systemd-repart generates the LUKS key on-device; the YubiKey is enrolled on first boot.

Goal 13 pairs with goal 8: because keys are generated on the target device at first boot, a factory reset can regenerate them without any trust in the factory (source doc).

## Separation and modularity

Goals 5, 9, 10, and 15 define the boundaries inside the system (source doc):

5. Self-descriptive. The Discoverable Partitions Specification: GPT UUIDs describe every partition's role.
9. Vendor/system/user separation. /usr is immutable with verity, /etc and /var live on the LUKS2 root, and homes live in systemd-homed.
10. Adaptive (bare metal/VM/container). systemd-repart runs on first boot, nspawn provides container mode, and PKCS#7 signatures in the GPT allow container validation.
15. Modular. sysext, portable services, and nspawn, ranked by the modularity ladder (doc 03).

## Why the table is load-bearing

The skill's own usage method (doc 01) treats this table as layer 1: every yubiOS design question is first located in one of the 17 goals, then the trust chain rule is applied to that goal, then the systemd version table is checked for a newer mechanism (source doc). The table is also the audit surface: goal 4 (cryptographic measurement) is what the attestation coverage section credits, and goal 14 (democratic/hackable) is what makes owner-held root of trust possible at all (source doc).

## Reading the table honestly

Two properties of the table are worth stating plainly because they are easy to miss (source doc):

- Goal 3 names YubiKey FIDO2 in bold in the source doc, marking the single deliberate divergence from the standard Poettering design, which uses TPM2. This is the same one-line delta the usage method compresses to `--fido2-device=auto` instead of `--tpm2-device=auto`.
- Goals 11 and 12 are not independent conveniences; they are consequences of goal 16. A uniform self-describing GPT image is what allows the shipped image to be minimal and the first boot to grow it.

No external dig was run for this doc: the table is an internal-record subtopic and every entry above is attributed to the source doc. Where the goals reference external mechanisms (UKI, dm-verity, DPS, cryptenroll), docs 03 through 05 carry the digged, weighted sources for those mechanisms.
