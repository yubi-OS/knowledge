# 06 - Protected UEFI variables: EDK2 StandaloneMM on OP-TEE with RPMB

Scope: keeping PK, KEK, db, and dbx persistent AND protected from the normal world by running EDK2's StandaloneMM variable service as an OP-TEE module backed by RPMB.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc).

## The problem

Secure Boot databases must survive power cycles and must not be writable by the normal world. If PK, KEK, db, or dbx live in writable U-Boot environment storage, any compromised normal-world component can rewrite the trust databases and defeat the EFI Secure Boot layer from document 05. The source doc's answer is to move the variable service into the secure world.

## The architecture

Per the source doc, the protected-variable stack has three pieces:

1. U-Boot dispatches variable operations to the secure-world service over the MM (management mode) protocol, enabled with `CONFIG_EFI_MM_COMM_TEE=y` plus `CONFIG_OPTEE=y`, with `CONFIG_CMD_OPTEE_RPMB=y` for the RPMB path.
2. OP-TEE runs EDK2's StandAloneMM module as the secure-world variable service. The build passes `CFG_STMM_PATH=BL32_AP_MM.fd`, with `CFG_RPMB_FS=y`, `CFG_RPMB_WRITE_KEY=y`, and `CFG_CORE_DYN_SHM=y`.
3. Storage lands in RPMB, the same replay-protected partition that backs the fTPM.

The official OP-TEE documentation confirms the central mechanism: StandAloneMM is a PE/COFF binary produced by EDK2, and on Arm platforms it can be compiled and used in combination with OP-TEE to store EFI variables in an RPMB partition of the eMMC (https://optee.readthedocs.io/en/latest/building/efi_vars/stmm.html, weight 0.74; the same statement appears at https://optee.readthedocs.io/en/latest/building/efi_vars/stmm.html?highlight=j32, weight 0.75).

U-Boot's own UEFI documentation confirms the U-Boot side: instead of implementing UEFI variable services inside U-Boot, they can be provided in the secure world by a module for OP-TEE, and the interface between U-Boot and OP-TEE for variable services is enabled by `CONFIG_EFI_MM_COMM_TEE=y` (https://docs.u-boot-project.org/en/latest/develop/uefi/uefi.html, weight 0.19, weakly backed).

## RPMB key provisioning is one-time

A Linaro engineering writeup on protected UEFI variables with U-Boot documents the provisioning hazard the source doc folds into device provisioning: OP-TEE will program the RPMB key, which is one-time programmable, and if the platform port has no way of retrieving a secure key from the hardware the build may fall back to the default `CFG_RPMB_TESTKEY`. The same writeup notes that U-Boot at the time supported only dynamic shared memory to communicate with OP-TEE (https://www.linaro.org/blog/protected-uefi-variables-with-u-boot/, weight 0.33, weakly backed).

The source doc says the same thing in yubiOS terms: `CFG_RPMB_WRITE_KEY=y` writes the RPMB key once per device, effectively irreversible, and must be folded into provisioning. Two practical consequences:

- The RPMB key must come from a real hardware source, or the protected-variable store rests on the well-known test key.
- A board that has programmed its RPMB key with the test key cannot be re-keyed; it is a sacrificial-board candidate, like the fuse burns in document 07.

## Shared RPMB with the fTPM

The source doc's design point: the tamper-resistant Secure Boot variables share the same RPMB that backs the fTPM. That keeps one replay-protected store for both the secure-boot trust databases and the fTPM's NV state, and it means the RPMB provisioning step gates both features. A board whose RPMB is not yet keyed can run the fTPM with degraded (non-RPMB) storage but cannot claim protected UEFI variables.

## Relationship to the UEFI variable model

The upstream secure-boot variable measurement patch (document 05) assumed variables are pre-configured and not updated at runtime (https://lists.denx.de/pipermail/u-boot/2021-July/454809.html, weight 0.31, weakly backed). A StandaloneMM-backed RPMB store is the component that makes a stronger runtime model defensible: updates to db or dbx can be authenticated and persisted by the secure-world service rather than by writable normal-world storage. The deeper third-party analysis of the edk2-platforms tree covers this integration surface from the EDK2 side, tying StandaloneMM environments to RPMB-backed secure variable storage (https://deepwiki.com/tianocore/edk2-platforms/8.2-secure-boot-and-standalonemm, weight 0.11, weakly backed).
