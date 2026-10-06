# 02 i.MX8M Mini: the Priority 1 lane

Scope: the CompuLab IOT-GATE-iMX8 / SBC-IOT-iMX8 and NXP i.MX8M Mini EVKB, the split of the yubiOS firmware feature set across their upstream defconfigs, and the HABv4 fuse-closure work that remains unproven.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, sections "Result" and "Priority 1, i.MX8M Mini".

## Why this lane surfaced

The source doc's headline result is that the NXP i.MX8M Mini family is the best new source-level opportunity, with the CompuLab IOT-GATE-iMX8 / SBC-IOT-iMX8 as the most interesting device and the NXP i.MX8M Mini EVKB as its reference-board companion (source doc). The reason is a materially smaller source-integration gap than any newly surveyed Rockchip board: current upstream U-Boot splits almost the complete yubiOS firmware feature set across two configurations (source doc).

- `imx8mm-cl-iot-gate-optee_defconfig` enables UEFI Secure Boot, FIT signatures, OP-TEE, eMMC RPMB transport, and `CONFIG_TPM2_FTPM_TEE` (source doc).
- `imx8mm_evk_defconfig` enables OP-TEE, `CONFIG_CMD_OPTEE_RPMB`, eMMC RPMB transport, and `CONFIG_EFI_MM_COMM_TEE` for StandaloneMM-backed UEFI variables (source doc).
- Current TF-A has an i.MX8MM BL2/TBBR path and HABv4 integration, while current OP-TEE has board flavors for both devices (source doc).

## Primary-source confirmation from the dig

- The CompuLab OP-TEE defconfig is real and inspectable in upstream U-Boot trees; bootlin's cross-reference shows it targeting `imx8mm-cl-iot-gate-optee` with `CONFIG_ARCH_IMX8M=y` in the v2024.04-rc5 tree [https://elixir.bootlin.com/u-boot/v2024.04-rc5/source/configs/imx8mm-cl-iot-gate-optee_defconfig] (w 0.84), and the same 159-line file is mirrored in the Xilinx U-Boot fork [https://github.com/Xilinx/u-boot-xlnx/blob/master/configs/imx8mm-cl-iot-gate-optee_defconfig] (w 0.82) and the Beckhoff v2026.01 branch [https://github.com/Beckhoff/u-boot/blob/bhf/v2026.01/configs/imx8mm-cl-iot-gate-optee_defconfig] (w 0.70).
- `CONFIG_EFI_MM_COMM_TEE` is documented in U-Boot's UEFI documentation as the interface between U-Boot and OP-TEE for variable services, linking Tianocore EDK II's standalone management mode driver for variables to OP-TEE [https://docs.u-boot-project.org/en/latest/develop/uefi/uefi.html] (w 0.81). This is the mechanism the EVKB config enables and the CompuLab config lacks.
- The fTPM TA the CompuLab config reaches through `CONFIG_TPM2_FTPM_TEE` is the OP-TEE integration of the Microsoft TPM 2.0 reference implementation, maintained as a fork of the MS sample ARM32-FirmwareTPM [https://github.com/OP-TEE/optee_ftpm] (w 0.60).
- NXP's own security user guide (UG10158) documents the SRK hash fuse procedure used across the i.MX 8M family, noting it is the same for i.MX 8M Mini, 8M Nano, 8M Quad, and 8M Plus, executed from U-Boot command mode after booting a signed image [https://docs.nxp.com/bundle/UG10158/page/topics/get_cst_tool_and_keys_configuration.html] (w 0.89) and [https://www.nxp.com/docs/en/user-guide/UG10158.pdf] (w 0.88). A third-party walkthrough of the same flow shows the sequence: program SRK public keys to eFuses, verify with `hab_status`, then close the device [https://dev.variscite.com/var-som-mx8m-plus/mx8mp-b2qt-kirkstone-5.15-2.0.x-v1.0/high-assurance-boot-mx8/] (weak, w 0.58).

## What stays unproven

The source doc is explicit that none of this is proof (source doc):

- No reviewed upstream defconfig contains the entire set at once. The CompuLab OP-TEE config lacks `CONFIG_EFI_MM_COMM_TEE` and `CONFIG_CMD_OPTEE_RPMB`; the EVK config lacks `CONFIG_TPM2_FTPM_TEE` (source doc).
- TF-A contains the BL2/TBBR implementation, but its current i.MX8M documentation still says the matching U-Boot/imx-mkimage packaging work will be upstreamed later; the complete SPL FIT to TF-A BL2 to authenticated FIP build is an explicit feasibility item, not an integrated board flow (source doc).
- Neither config proves OP-TEE `CFG_RPMB_FS`, one-time RPMB key programming, StandaloneMM deployment, or the repository-pinned ms-tpm TA (source doc).
- Current board build documentation still consumes NXP DDR firmware, which must be pinned, licensed, and placed explicitly in the trust boundary (source doc).
- HAB development-mode success is not production closure; a sacrificial board must show owner SRK hash programming, closed/enforcing lifecycle state, wrong-key rejection, recovery behavior, and debug policy (source doc).
- The CompuLab device supplied for testing must expose the needed fuse and recovery interfaces; a production gateway can be less convenient than the EVKB for destructive provisioning work (source doc).

## Verdict as recorded

Highest-priority new SoC/device feasibility lane (source doc). The recommended sequence: start on the EVKB for fuse and recovery observability, then validate the same firmware policy on the CompuLab device if an industrial target is desirable (source doc). The concrete first engineering step is to build both reviewed upstream defconfigs and create one board config that combines `CONFIG_EFI_MM_COMM_TEE`, `CONFIG_CMD_OPTEE_RPMB`, `CONFIG_SUPPORT_EMMC_RPMB`, `CONFIG_TEE`, `CONFIG_OPTEE`, and `CONFIG_TPM2_FTPM_TEE`, verifying dependency closure with `olddefconfig` rather than treating a hand-edited fragment as proof (source doc).
