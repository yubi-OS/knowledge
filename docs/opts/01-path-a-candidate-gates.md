# 01 Path A candidate gates

Scope: the 8 evidence gates the source doc sets for calling any board a Path A candidate, and the wording rule for platforms where TF-A is not the first verifier.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, section "What counts as a Path A candidate". This is an internal-record subtopic for the gate list itself; the dig results below add primary-source definitions for the mechanisms the gates depend on.

## The 8 gates

The source doc defines 8 gates. Presence in all three upstream trees (U-Boot, TF-A, OP-TEE) is necessary but not sufficient; a candidate must eventually produce evidence for every gate (source doc).

1. Owner root at reset. The first replaceable image is authenticated by a key hash the owner can irreversibly provision in OTP or eFuse; the device is closed and enforcing; a wrong-key image fails before normal-world execution (source doc).
2. Complete chain. Every executable security-relevant stage is authenticated, including DDR and system-management firmware where applicable, TF-A, OP-TEE, U-Boot, StandaloneMM, TAs, and the UKI (source doc).
3. Owner-controlled inputs. All firmware inputs are source-built where possible and otherwise license-reviewed, hash-pinned, provenance-recorded, and explicitly included in the trust boundary. A vendor-signed executable before owner enforcement is a Path A blocker unless an architecture decision explicitly accepts it (source doc).
4. Secure state. OP-TEE runs as BL32; the production configuration disables insecure defaults; the device provides a hardware unique key; secure storage survives reset and rejects replay (source doc).
5. Persistent UEFI state. eMMC RPMB works end to end with OP-TEE `CFG_RPMB_FS`, a provisioned RPMB key, StandaloneMM, and U-Boot `CONFIG_EFI_MM_COMM_TEE`. A defconfig containing only `CONFIG_SUPPORT_EMMC_RPMB` proves transport support, not secure variables (source doc).
6. TPM and measured boot. The repository-pinned ms-tpm fTPM TA is reachable through U-Boot `CONFIG_TPM2_FTPM_TEE`; TCG2 measurements cover the same UKI chain used on x86_64; PCR and event-log evidence survives negative tests (source doc).
7. Rollback, recovery, debug. Anti-rollback policy is defined; a tested owner recovery path exists; debug access and ROM download modes are closed or policy-controlled without destroying recovery (source doc).
8. Reproducibility. Board-specific firmware pins, configs, build manifests, licenses, and negative-test logs are committed; CI emulates what it can, while hardware-only claims remain tied to durable device evidence (source doc).

## Primary-source definitions behind the gates

The dig results anchor two of the mechanisms the gates name in vendor-independent documentation.

- RPMB secure storage: OP-TEE's own architecture documentation defines the RPMB secure storage implementation, enabled by `CFG_RPMB_FS=y`, where Trusted Applications use it by passing the storage ID `TEE_STORAGE_PRIVATE_RPMB` (or `TEE_STORAGE_PRIVATE` when `CFG_REE_FS` is disabled) [https://optee.readthedocs.io/en/3.16.0/architecture/secure_storage.html] (w 0.89). This is the exact knob the gate 5 wording requires the corpus to distinguish from bare eMMC RPMB transport.
- Secure boot loader shape: OP-TEE documentation states there is no universal secure boot recipe and directs implementers to TF-A, "strongly encourage[ing]" the use of TF-A BL2 as the secure boot loader [https://optee.readthedocs.io/en/latest/architecture/secure_boot.html] (w 0.89). This supports gate 2's "complete chain" framing: BL2 is the expected first verifier on platforms that use TF-A that way.
- Early-boot secure storage: historically the tee-supplicant user-space application handled RPMB communication, which meant secure storage was unavailable until the system was fully running; Linaro's work moved OP-TEE RPMB access into the Linux kernel to make secure storage available earlier [https://www.linaro.org/blog/linaro-enables-op-tee-rpmb-access-directly-from-the-linux-kernel/] (w 0.57). For gate 5 this matters because a board whose RPMB path only comes up late cannot back the persistent UEFI state design.

## The wording rule

The source doc adds a caveat that matters on every non-NXP candidate: on platforms where TF-A is not the first verifier, "TF-A Trusted Board Boot" must be mapped to the platform's actual first-owner-verifier chain rather than assumed to mean TF-A BL1 on every SoC (source doc). The Rockchip and Qualcomm lanes in this corpus are exactly the cases where that rule bites; see 06-rk3576-watch.md and 07-lx2160a-rb3gen2.md.

## Evidence, not source presence

The gates share one property: each demands evidence that a defconfig line cannot provide. `CONFIG_SUPPORT_EMMC_RPMB` proves transport, not variables (source doc). HAB development-mode success is not production closure (source doc). The consistent unit of proof across all 8 gates is a negative test on closed hardware, which is why the hardware proof packet (see 10-next-work-proof-packet.md) is the promotion requirement.
