# 03: Boot Chain and UKIs

yubiOS boots a Unified Kernel Image (UKI) signed by a YubiKey over PIV/PKCS#11, and the UKI's command line binds the digest that authenticates the immutable root: dm-verity on the mkosi-built path, a strict fs-verity composefs repository on the bootc path. Signing runs through systemd-sbsign with a PIV slot 9c key (SoftHSM in CI), a sealed-UKI Secure Boot VM lane scopes the end-to-end proof in QEMU with OVMF, and composefs kernel version floors (6.5, 6.6, 6.12) decide which guarantees an image can actually enforce. This doc walks the chain link by link and states exactly which links are proven and which are still gated.

## Two build paths, one trust chain

ADR-006 keeps both build paths [1]. The mkosi path (particleos ethos) produces a signed UKI `.efi`, a dm-verity root, and a composefs image; the bootc path produces an OCI image deployed with `bootc install to-filesystem` [1]. Both consume the same `/usr` overlay tree. `mkosi.conf` pins the mkosi lane: `Format=disk` with `SplitArtifacts=uki,partitions`, `UnifiedKernelImageFormat=%i_%v_%a`, and a kernel command line of `root=dissect`, `mount.usr=dissect`, `rw` [2]. The dissect root is the particleos pattern: systemd-dissect assembles the root from discoverable partitions instead of a fstab.

A UKI bundles a UEFI boot stub, kernel, initrd, and command line into one PE binary, so a single Secure Boot signature covers the whole boot payload [12] (0.19).

## UKI signing: YubiKey PIV slot 9c, not FIDO2

ADR-002 fixes the key material: Secure Boot signing uses the YubiKey PIV slot 9c (Digital Signature) via PKCS#11 over CCID, not FIDO2 hidraw, because FIDO2 HMAC-secret key wrapping has no native support in signing tools while PIV/PKCS#11 is directly supported in all of them [1]. ADR-008 fixes the tool: `systemd-sbsign` (added in systemd v257, Dec 2024) over legacy sbsigntools, because it shares the systemd release cycle with ukify, takes `--key pkcs11:...` natively, and generates and verifies PCR 11 signatures (`--pcr-private-key` / `--pcr-public-key`) in the same invocation; upstream mkosi switched its signing backend to systemd-sbsign in v25 [1]. Version-sensitive: the yubiOS base is pinned to systemd v261 (ADR-015/ADR-016), above the v257 floor [1].

`mkosi.conf` turns this on: `SecureBoot=yes` with build-time signing via systemd-sbsign, and `SignExpectedPcr=no` [2]. The mkosi-image-builder skill documents the exact wiring: `SecureBootKey=pkcs11:token=yubiOS-sb;object=sb-key;type=private` with `SecureBootKeySource=engine:pkcs11`, supported in mkosi v26+ [4]. refs/sbsign-pkcs11-validate-2026-07-23.md cross-checks against mkosi upstream v27 confirming native `engine:pkcs11` / `provider:pkcs11` support with no drift, and pins the validation shape: `systemd-sbsign sign` with a `pkcs11:manufacturer=piv_II;id=%9c;type=private` URI, then `osslsigncode verify` as corroboration of the PE signature [3]. That ref also sets the consistency rule: build docs stay on systemd-sbsign; legacy `sbsign --engine pkcs11` examples are historical context only [3].

CI cannot hold a physical YubiKey. The skill defines the SoftHSM fallback: a token labeled `yubiOS-ci` holding an EC prime256v1 keypair labeled `sb-key` standing in for PIV slot 9c, and `SecureBootKey=pkcs11:token=yubiOS-ci;object=sb-key;type=private` in the config [4]. The sealed-UKI lane repeats that exact initialization sequence in its workflow sketch [5].

## What sealed means: the roothash in the UKI command line

ADR-007 is the integrity decision: composefs over a dm-verity-checked EROFS partition for the read-only root, following the particleos pattern [1]. The load-bearing property is where the trust anchor lives. mkosi's `Verity=yes` makes the build embed `roothash=<hash>` in the UKI `.cmdline` section, so the dm-verity root hash travels inside the signed UKI and tampering is detected before any userspace runs [4][5]. dm-verity is a per-block Merkle-tree device-mapper target designed for verified boot paths: the kernel refuses data if any block hash mismatches [13] (0.20). ArchWiki's dm-verity page states the pairing constraint the design depends on: verity protection is useless unless the kernel image itself cannot be replaced, which is what the signed UKI provides [14] (0.81).

One drift note from direct source comparison: ADR-007 claims `Verity=signed` is "already set in mkosi.conf" [1], and the dm-verity skill uses `Verity=yes` [6], but the committed top-level `mkosi.conf` carries no `Verity=` key today [2]. The verity wiring is documented at the refs/skill level rather than visible in the top-level config.

dm-verity applies to `/usr` exclusively in yubiOS. `/etc`, `/var`, and `/home` stay mutable and get other layers: IMA appraisal mode denies execve on mismatched `/usr` binaries, audit mode logs mismatches on user-writable paths, and the IMA measurement list lands in PCR 10 for attestation quotes [6].

## The bootc composefs flow is a different integrity model

refs/bootc-composefs-sealed-flow-2026-07-22.md draws a line the easy reading misses: native bootc composefs verifies individual files with fs-verity, while dm-verity authenticates a fixed block-device image and belongs to the separate mkosi/systemd-repart path [7]. The bootc install target is a writable, fs-verity-capable filesystem (ext4 created with `mkfs.ext4 -O verity`, or Btrfs); EROFS appears only as metadata-only images under `/composefs/images/<digest>`, with content under `/composefs/objects` and deployment state under `/state/deploy` [7]. bootc is the primary consumer of composefs for bootable container images [15] (0.38), and composefs verifies the mounted tree against a signed digest, with fs-verity validation of the content files [16] (0.79) [17] (0.88).

Sealing, per the same ref, requires the composefs digest to be authenticated by the signed UKI command line. The digest is a 128-hex SHA-512 value in a strict `composefs=<digest>` BLS option, no `?` marker, no `root=` argument. A traditional BLS entry with raw `linux`/`initrd` paths remains unsealed even when the digest is strict, because the anchor sits in mutable BLS configuration [7]. Production must never pass `--allow-missing-verity`, which encodes an explicitly unsealed reference; CI rejects `composefs=?` [7]. The initramfs side is the upstream `51bootc` dracut module (via `bootc-root-setup.service`) opening the composefs repository; `composefs` and `dm-verity` are not the dracut module names on this path [7]. Every rootfs content change changes the digest, so the UKI is regenerated and re-signed for every derived image [7]. The ref's build corrections also require signing systemd-boot as well as the UKI, since the firmware chain and fs-verity enforcement are separate [7].

Evidence boundary as of that ref: workflow run 29884493346 proved the strict fs-verity composefs install with a traditional BLS entry, not a sealed UKI; the pinned Fedora 45 base recorded `bootc-1.16.3-2.fc45` while `split-kernel-and-rootfs` first appears in bootc v1.16.4, so the sealed four-stage build (lint, split kernel/rootfs, clean final rootfs, ukify with systemd-sbsign) could not yet be a required production step [7]. Version-sensitive: the 2026-09-18 drift check in the same ref notes upstream bootc had reached v1.16.13 [7].

## The sealed-UKI Secure Boot VM test lane

refs/sealed-uki-vm-test-2026-07-30.md scopes the missing proof, parent issue OMN-53, status draft [5]. The existing `ci_test_bootc-filesystem.yml` proves the unsealed BLS deployment; the ref quotes that workflow's own contract: a separate Secure Boot VM lane is required to prove sealing [5]. The proposed `ci_test_sealed-uki-vm.yml` asserts six positive properties:

1. Signed UKI built with `mkosi ... ukify` plus SoftHSM PIV 9c emulation, signed via systemd-sbsign with the engine backend.
2. `roothash=` present in the UKI cmdline.
3. Boot in QEMU with OVMF Secure Boot and the yubiOS ROTPK enrolled in OVMF's `db`; assert `systemd-stub` reports `SecureBoot=yes`.
4. PCR measurement of sha256 PCRs 0,1,2,3,4,7,11 against golden values, where PCR4 covers UKI cmdline plus initrd, PCR7 covers Secure Boot policy, and PCR11 covers initrd measurements; swtpm-backed fTPM on amd64.
5. Sealed LUKS2 via `systemd-cryptenroll --fido2-device=auto --unlock-key-type=fido2 --fido2-credential-params=uv=on`.
6. FIDO2 unlock confirmed on the enrolled slot.

Plus three negative assertions: a flipped byte in the signed UKI must produce a Secure Boot violation, a changed `composefs=<sha512>` BLS byte must make dm-verity refuse the composefs store, and a missing ROTPK must make OVMF reject the unsigned UKI [5].

Status matters: the ref records that the sealed-build split and ukify capabilities were probed present in CI run #11 at `7eba4856e7`, but the BLS entry still points at `/EFI/Linux/bootc_composefs-<sha512>/vmlinuz` because yubiOS-side BLSConfig wiring (OMN-150 Phase 2) has not landed. The lane proves the primitive (signed UKI + ROTPK + dm-verity + sealed LUKS in a QEMU Secure Boot VM), not the install-time wiring; the two land separately [5]. ARM64 Secure Boot on RK3588 is explicitly out of scope for this lane, covered by the arm-trusted-firmware-optee and ftpm-optee-tpm skills [5].

## Measured boot posture

`SignExpectedPcr=no` in `mkosi.conf` means UKIs are built without expected-PCR signatures for state prediction; measurement still happens at boot via systemd-stub, and the sealed lane asserts PCRs against golden values rather than pre-signed predictions [2][5]. On TPM-present hardware the LUKS2 DEK can additionally be sealed to the PCR 11 phase word `initrd-enter`, so it cannot be unsealed from userspace once `initrd-leave` is measured; on the no-TPM configuration FIDO2 hmac-secret carries no PCR binding, and the guarantee rests on the key being derived per boot with PIN plus touch rather than stored at rest [1] (ADR-003).

## composefs kernel version floors

The composefs-kernel-floors skill makes ADR-007's implicit constraint explicit with three floors [8]. Kernel 6.5 or newer is required for data-only OverlayFS, the primary composefs backing; without it composefs falls back to a writable upper layer and the immutability invariant goes unenforced. Kernel 6.6 or newer adds the `verity=require` mount option, the mount-time enforcement that the composefs catalog is signed; without it an unsigned catalog mounts anyway. Kernel 6.12 or newer is required for file-backed EROFS, the alternate backing used for dense sysext images. Version-sensitive: the skill's 2026-08 convention maps production yubiOS to kernel 6.12+, LTS to 6.6+ (data-only OverlayFS plus `verity=require`, no EROFS), and experimental to 6.5+ (no signed-catalog enforcement), with anything under 6.5 relegated to the dm-verity-only pre-composefs path [8].

## Sources considered

Used:
1. [docs/ADR.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ADR.md) (ADR-002, ADR-003, ADR-006, ADR-007, ADR-008, ADR-015/016 pins)
2. [mkosi.conf](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/mkosi.conf)
3. [refs/sbsign-pkcs11-validate-2026-07-23.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/sbsign-pkcs11-validate-2026-07-23.md)
4. [skills/mkosi-image-builder/SKILL.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/mkosi-image-builder/SKILL.md)
5. [refs/sealed-uki-vm-test-2026-07-30.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/sealed-uki-vm-test-2026-07-30.md)
6. [skills/dm-verity-and-integrity/SKILL.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md)
7. [refs/bootc-composefs-sealed-flow-2026-07-22.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/bootc-composefs-sealed-flow-2026-07-22.md)
8. [skills/composefs-kernel-floors/SKILL.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/composefs-kernel-floors/SKILL.md)
9. [systemd-sbsign man page](https://www.freedesktop.org/software/systemd/man/latest/systemd-sbsign.html)
10. [UAPI.5 Unified Kernel Images spec](https://uapi-group.org/specifications/specs/unified_kernel_image/) (0.19)
11. [dm-verity, Linux kernel documentation](https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html) (0.20)
12. [ArchWiki: Dm-verity](https://wiki.archlinux.org/title/Dm-verity) (0.81)
13. [composefs GitHub](https://github.com/composefs/composefs) (0.79)
14. [Alexander Larsson, composefs category](https://blogs.gnome.org/alexl/category/composefs/) (0.88)
15. [Image sealing with composefs, scrivano.org](https://scrivano.org/posts/2026-06-05-sealing-with-composefs/) (0.38)

Rejected:
- [ArchWiki: Unified kernel image](https://wiki.archlinux.org/title/Unified_kernel_image) (0.08) Shallow.
- [botmonster.com UKI post](https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/) (0.17) Promotional.
- [Gentoo Wiki: Unified kernel image](https://wiki.gentoo.org/wiki/Unified_kernel_image) (0.18) Duplicate.
- [Toradex community thread](https://community.toradex.com/t/secure-boot-with-bundled-docker-images-into-torizon/26289) (0.18) Off-topic.
- [Eduard's Blog UKI walkthrough](https://edu4rdshl.dev/posts/uki-secure-boot-on-archlinux-systemd-boot-walkthrough/) (0.32) Redundant.
- [Qualcomm systemd-boot/UKI docs](https://docs.qualcomm.com/bundle/publicresource/topics/80-80022-27/configure_and_secure_boot_with_systemd_boot_and_uki.html) (0.46) Vendor.
