# QEMU ARM64 bring-up for firmware TPM (fTPM) testing, the Phase F0 plan for emulating ARM64 secure-world firmware with fTPM support, OP-TEE, and measured boot in VMs (ADR-018 context)

Knowledge corpus minted from yubi-OS/yubiOS refs/arm64-ftpm-phase-f0-2026-07-23.md (Phase F0: QEMU ARM64 bring-up, ADR-018 context) on 2026-10-05.

## Docs

- [01-tfa-qemu-aarch64.md](./01-tfa-qemu-aarch64.md): ARM Trusted Firmware-A as BL1/BL2/BL31 on QEMU ARM64 with SPD=opteed, FIP packaging, and the non-secure to secure handoff that anchors the whole chain
- [02-optee-qemu-armv8a.md](./02-optee-qemu-armv8a.md): OP-TEE OS as BL32 on QEMU virt using the vexpress-qemu_armv8a platform, opteed dispatch, and secure-world bring-up specifics
- [03-ftpm-early-ta.md](./03-ftpm-early-ta.md): ms-tpm-20-ref built as an OP-TEE Early TA, its fixed UUID, Early TA embedding in BL32, and RPMB-backed persistent NV storage
- [04-rpmb-bootstrap-hazard.md](./04-rpmb-bootstrap-hazard.md): The first persistent NV write to RPMB happening before tee-supplicant is available, and the initramfs or deferral strategies that avoid a bricked NV state
- [05-uboot-bl33-measured-boot.md](./05-uboot-bl33-measured-boot.md): U-Boot as BL33 in UEFI mode with CONFIG_TPM2_FTPM_TEE and CONFIG_MEASURED_BOOT, extending PCRs for kernel, DTB and initramfs through the fTPM TA
- [06-linux-guest-tpm0.md](./06-linux-guest-tpm0.md): Linux guest integration: TEE and OP-TEE config, the tpm_ftpm_tee module, /dev/tpm0 and /dev/tpmrm0 appearing, and a successful TPM2_Startup
- [07-pcr-conventions-measured-boot.md](./07-pcr-conventions-measured-boot.md): TCG measured boot PCR allocation used by the plan: PCRs 0,1 for firmware, 7 for Secure Boot policy, 8,9 for kernel and initramfs, 10 for IMA, 16 as the resettable verifier PCR
- [08-reproducible-build-verify.md](./08-reproducible-build-verify.md): The reproducible build script over the pinned OP-TEE qemu_v8 manifest set plus pinned ms-tpm-20-ref, and the in-guest verify-tpm0-pcr-extend.sh done condition
- [09-ftpm-yubikey-trust-split.md](./09-ftpm-yubikey-trust-split.md): Why the fTPM owns platform integrity and attestation while the YubiKey stays the disk-unlock root via FIDO2 hmac-secret and LUKS2, and the danger of merging them

## Research summary

- Results collected: 108 (18 searXNG queries, 2 per subtopic, top 6 kept per query)
- Weight split: 72 high (>= 0.5) / 36 low (< 0.5) of 108
- Jev requests: 24 (1 preflight probe, 1 outline validation, 22 weighting batches of 5), usage 19582 input / 0 output tokens
- Redos: 0 (all 9 subtopics dug strong on first attempt; marginal-scored subtopics 04, 07, 08, 09 each returned 8 to 10 high-weight results)
- Skipped docs: none

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
