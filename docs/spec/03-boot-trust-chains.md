# Boot trust chains

**Scope line:** the 2 boot trust chains of sections 3.3 and 3.4: the ARM64 chain with its owner-burned ROTPK (Path A) and dev-board U-Boot variant (Path B), and the x86-64 chain with owner-enrolled Secure Boot, both landing in the same downstream stack of systemd-boot, signed UKI, composefs over dm-verity, and LUKS2.

Grounding spine: `yubi-OS/yubiOS docs/SPEC.md` (source doc). External mechanisms carry their own URL and jev weight below.

## The ARM64 chain, stage by stage

Section 3.3 lays out the ARM64 chain as an ordered pipeline (source doc):

1. TF-A Trusted Board Boot, with the ROTPK either burned to SoC OTP/eFuse (Path A) or U-Boot FIT verified boot plus fTPM measurement (Path B, dev boards).
2. BL31, the EL3 Secure Monitor.
3. BL32, OP-TEE, running the fTPM Trusted Application plus StandaloneMM.
4. BL33, U-Boot, providing the UEFI environment via EFI_LOADER.
5. systemd-boot, a PE signed via PIV 9c.
6. The UKI, described as "same signed artifacts as x86-64".
7. /usr: composefs over a dm-verity-checked erofs, with usrhash= in the signed cmdline.
8. Root fs: LUKS2 btrfs, FIDO2-enrolled, with touch plus PIN at boot.
9. /home: systemd-homed per-user LUKS2, FIDO2 per user.

The stage names follow the ARM firmware convention where BL1 and BL2 are the earliest stages, BL31 runs at EL3, BL32 is the secure-world payload, and BL33 is the first non-secure payload. TF-A's own design documentation describes Trusted Board Boot as the feature that "prevents malicious firmware from running on the platform by authenticating all firmware images up to and including the normal-world bootloader" (https://tf-a.docs.trustedfirmware.org/en/latest/design/trusted-board-boot.html, jev weight 0.39, weak). OP-TEE's documentation covers verifying OP-TEE itself using the authentication framework in TF-A (https://optee.readthedocs.io/en/latest/architecture/secure_boot.html, jev weight 0.33, weak). Both weak-backed sources are consistent with the chain as the source doc draws it.

## Path A versus Path B

The spec's ownership boundary lives in the ROTPK placement (source doc). On Path A, the ROTPK hash is owner-burned into SoC OTP/eFuse, so no vendor key and no OEM signature exist anywhere in the chain from the boot ROM onward, per ADR-018/019/020/021. Boot stages are measured into the yubiOS-owned fTPM's PCRs. The source doc calls this "the only configuration where yubiOS controls every trust anchor down to hardware".

On Path B, a dev board gets U-Boot FIT verified boot plus fTPM measurement instead of the burned-in ROM key; use case UC-7 describes a Path B board as getting "measured-boot attestation instead of enforcement", documented as such under ADR-019 (source doc). Hardware bring-up on real boards is post-launch per FUTURE.md, while the chain itself is accepted design (source doc). This split lets the design be normative before the silicon work lands: the ADRs accept the chain; the hardware delivery schedule is tracked separately.

## The x86-64 chain

Section 3.4 gives the shorter secondary chain (source doc):

1. UEFI firmware with an owner-enrolled Secure Boot db.
2. systemd-boot, PE signed via PIV 9c.
3. The UKI: .linux, .initrd, and .cmdline combined into a single signed PE.
4. /usr: composefs over dm-verity-checked erofs, usrhash= in the signed cmdline.
5. Root fs: LUKS2 btrfs, FIDO2-enrolled, touch plus PIN at boot.
6. /home: systemd-homed per-user LUKS2, FIDO2 per user.

The UKI as a single signed PE matches the upstream concept: a unified kernel image combines kernel, initrd, and command line into one executable, and ukify is the systemd tool whose primary purpose is combining those components (https://www.freedesktop.org/software/systemd/man/ukify.html, jev weight 0.19, weak; https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.09, weak). The dm-verity side follows the standard shape of a verity hash tree whose root hash binds the read-only filesystem image (https://wiki.archlinux.org/title/Dm-verity, jev weight 0.19, weak); in yubiOS the root hash is carried as usrhash= inside the signed cmdline, so the hash itself is under the PIV-9c signature rather than delivered out of band.

## Measurement and the no-TPM fallback

The spec states that boot phases are measured into PCR 11 where a TPM or fTPM is present (source doc). On the no-TPM configuration, integrity rests on the signed UKI plus the dm-verity chain and physical possession of the YubiKey (source doc). This is the practical consequence of the trust-model split in doc 02: enforcement comes from signatures and possession; the TPM adds measured-boot evidence where present but is never the unlock gate.

## Where ownership ends on x86-64

The spec is explicit about the asymmetry: below the UKI, x86-64 depends on the platform's own UEFI firmware and optional TPM, which are trust anchors yubiOS does not own end to end (source doc). The platform is "fully supported" but is "not the platform where the mission's owner-owned-hardware-root-of-trust goal is fully realized" (ADR-023) (source doc). The owner-enrolled Secure Boot db is the closest x86-64 comes to Path A: the owner replaces the vendor key database, but the firmware verifying that db is still vendor silicon.

## Shared tail, divergent head

Both chains converge after the bootloader: same systemd-boot, same UKI signing via PIV 9c, same composefs/dm-verity /usr with usrhash= in the signed cmdline, same LUKS2 and homed enrollment. The divergence is entirely in the head of the chain, and the divergence is a statement about who owns the verifying hardware: burned OTP on ARM64, vendor firmware on x86-64. This is why the conformance checklist can demand the same downstream properties of every build while treating platform firmware as an environmental variable.
