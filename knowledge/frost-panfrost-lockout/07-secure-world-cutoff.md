# Secure world cutoff (firmware-assisted path)

Scope: the TF-A/OP-TEE firmware-assisted cutoff sketch, the U-Boot reserved-memory handoff, a narrow SMC or mailbox quarantine-GPU command with board-specific enforcement, and RPMB/fTPM persisted lockout state.

## The SMC boundary is the right primitive

On Arm64 systems the secure monitor is the only component that can enforce a board-level cutoff the normal-world kernel cannot bypass or revoke. TF-A implements the Arm SMC Calling Convention (SMCCC), and normal world software accesses TF-A runtime services through the SMC instruction (source: https://trustedfirmware-a.readthedocs.io/en/latest/design/firmware-design.html, jev weight 0.90). On the Linux side, the OP-TEE driver exposes its own SMC function identifiers: OPTEE_SMC_FUNCID_CALLS_UID returns version information surfaced through TEE_IOC_VERSION, and OPTEE_SMC_CALL_GET_OS_UUID identifies the particular OP-TEE implementation (source: https://docs.kernel.org/next/tee/op-tee.html, jev weight 0.89). A generated overview of the TF-A SMC service framework scored just below the citation threshold (source: https://deepwiki.com/ARM-software/arm-trusted-firmware/6.1-secure-monitor-calls-(smc), jev weight 0.47, weak backing).

Two practical cautions from the field. Writing a custom SMC call into an OP-TEE example setup is done with arm_smccc_smc from Linux including linux/arm-smccc.h, against a handler defined for the board build (source: https://github.com/OP-TEE/optee_os/issues/7120, jev weight 0.19, weak backing). And the trust boundary runs both ways: community discussion of the OP-TEE and ATF relationship notes that attacks against TrustZone systems commonly exploit errors in the SMC call handlers themselves, such as buffer or string overflows, which is a direct argument for keeping the quarantine command narrow and strictly validated (source: https://stackoverflow.com/questions/77163446/relation-between-op-tee-and-atf, jev weight 0.03, weak backing). A question thread on calling the secure monitor from inside a PTA records that SMC must be issued at privileged level and that the world switch is what SMC does (source: https://github.com/OP-TEE/optee_os/issues/6299, jev weight 0.08, weak backing).

## The handoff design

The firmware-assisted path in the source design uses explicit handoff rather than hidden kernel magic, and the pieces map onto standard firmware mechanics:

1. U-Boot passes a reserved-memory region or device-tree node to Linux for Frost event and state exchange. This is the normal DT-carried handoff pattern already used for firmware tables.
2. The Linux Frost agent evaluates owner policy and asks secure world for the hard cutoff only after local logging is durable enough for owner recovery. Linux classifies and requests; it does not enforce.
3. TF-A/OP-TEE exposes a narrow SMC or mailbox command meaning "quarantine GPU", with board-specific implementation: context drain if that is safe, otherwise GPU reset, otherwise power gating.
4. The secure world records event order itself so the log survives a compromised or crashed normal world.

## Persistent lockout state

Same-boot evidence is not enough for a lockout that must survive a reboot or a malicious normal world. OP-TEE's secure storage supports RPMB-backed filesystems: with CFG_RPMB_FS=y, rollback protection is controlled by the TEE and set to level 1000; with CFG_RPMB_FS=n there is no rollback protection and the level is 0 (source: https://optee.readthedocs.io/en/latest/architecture/secure_storage.html, jev weight 0.87). The same contract is documented in the OP-TEE docs repository (source: https://github.com/OP-TEE/optee_docs/blob/master/architecture/secure_storage.rst, jev weight 0.86) and in a documentation mirror (source: https://github.com/ForgeRock/optee-os/blob/master/documentation/secure_storage_rpmb.md, jev weight 0.81). RPMB's replay protection comes from its write counter, with the OP-TEE client implementing RPMB support through the tee-supplicant daemon (source: https://deepwiki.com/OP-TEE/optee_client/2.2.2-rpmb-storage, jev weight 0.45, weak backing).

The fTPM path is the alternative sealing store: fTPM over OP-TEE integrates with OP-TEE persistent storage using multiple storage objects, each holding a block of the total NV memory space so updates can be partial (source: https://docs.nvidia.com/doca/archive/2-9-2/ftpm+over+op-tee/index.html, jev weight 0.75). A generated overview of the fTPM storage layer scored low (source: https://deepwiki.com/OP-TEE/optee_ftpm/6-storage-and-persistence, jev weight 0.15, weak backing). One integration hazard is documented from the field: on Jetson AGX Orin, Linux IMA could not extend TPM PCR[10] because the fTPM is userspace and RPMB gated, a known OP-TEE limitation fixed in Linux 6.12 (source: https://github.com/10GiC10V38/jetson-ima-attestation, jev weight 0.43, weak backing). Any design that reads lockout state through the fTPM at early boot must account for that dependency ordering.

The source design's SecTime note fits this picture: OP-TEE's secure time gives same-boot elapsed evidence only, so it is suitable for ordering events within one boot, while persistent lockout state needs RPMB or fTPM NV storage or equivalent sealed state.

## What this buys and what it costs

The cutoff command in secure world is the one action a locked-out workload cannot undo, which is the point of the primitive. The costs are board-specific firmware work, a strictly minimal SMC surface, and a recovery story (documented before enabling any automatic hard cutoff) because the same isolation that stops an abuser also stops an owner's own session.
