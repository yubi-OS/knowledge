# 09 Cross-cutting upstream conclusions

Scope: the 3 conclusions the source doc draws across all surveyed platforms: Rockchip Path A has no TF-A BL1/BL2, no reviewed board arrives with the complete yubiOS configuration, and binary firmware remains inside the security boundary.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, section "Cross-cutting upstream conclusions".

## Conclusion 1: Rockchip Path A does not use TF-A BL1/BL2

The source doc's first cross-cutting conclusion is that on Rockchip, TF-A BL1/BL2 are supplied by U-Boot or coreboot and TF-A builds BL31 on AArch64; the current RK3576 and RK3588 platform makefiles are BL31 ports (source doc). Current TF-A documentation states the same in its own words: "Rockchip SoCs expect TF-A's BL31 (AARCH64) or BL32 (AARCH32) to get integrated with other boot software like U-Boot or Coreboot, so only these images need to get build from the TF-A repository" [https://tf-a.docs.trustedfirmware.org/en/latest/plat/rockchip.html] (w 0.87), mirrored in the repo's docs [https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/plat/rockchip.rst] (w 0.86).

The consequence the source doc draws is a proof obligation, not an ineligibility: the Rockchip evidence chain must explicitly read BootROM owner key/eFuse, authenticated U-Boot TPL/SPL, authenticated TF-A BL31 + OP-TEE BL32 + U-Boot BL33, StandaloneMM/TAs, signed UKI. A generic assertion that "TF-A BL1 rejects the image" would be false for these ports (source doc).

## Conclusion 2: no reviewed board arrives with the complete configuration

The source doc finds that U-Boot implements the needed pieces but upstream board configs distribute them unevenly (source doc). The distribution it records:

- fTPM-over-TEE already selected on the CompuLab i.MX8MM board family.
- EFI MM + OP-TEE RPMB already selected on NXP i.MX8M EVKs, the i.MX93 EVK, and the LX2160A StandaloneMM config.
- SPL FIT authentication + eMMC RPMB transport on several RK3588/RK3576 boards.
- No reviewed candidate defconfig that combines owner secure boot, OP-TEE RPMB FS, StandaloneMM, fTPM, and the final UEFI/UKI policy.

The mechanism behind the StandaloneMM side is documented independently: StandAloneMM is a PE/COFF binary produced by EDK2 which, combined with OP-TEE on Arm platforms, stores EFI variables in an RPMB partition of the eMMC [https://github.com/OP-TEE/optee_docs/blob/master/building/efi_vars/stmm.rst] (w 0.84) and [https://optee.readthedocs.io/en/latest/building/efi_vars/stmm.html] (w 0.77). A Linaro presentation makes the security argument explicit: standalone MM runs in an isolated environment and is "ideal for securing EFI variables required for UEFI secure boot" [https://static.linaro.org/connect/lvc20/presentations/LVC20-302-0.pdf] (weak, w 0.58).

The source doc's own summary line: the gap is therefore integration and evidence, not the absence of all primitives (source doc).

## Conclusion 3: binary firmware remains inside the security boundary

Every surveyed family requires at least one early binary in its normal upstream build instructions (source doc):

- Rockchip: DDR/TPL initialization binary.
- i.MX8M: DDR firmware.
- i.MX9: DDR firmware plus EdgeLock/Sentinel firmware.
- STM32MP2: DDR PHY firmware.
- LX2160A: DDR PHY firmware/FIP.
- RB3 Gen 2: `qtiseclib` and QTI signing tooling and inputs.

For each candidate, the source doc requires recording the producer, license, exact digest, update channel, signing authority, execution privilege, and whether the owner-authenticated chain covers the binary; "upstream U-Boot supports the board" does not remove this trust dependency (source doc).

The STM32MP2 case is the most concretely documented in the dig results: the DDR PHY is trained by firmware loaded into the DDRPHYC PUB [https://www.st.com/resource/en/application_note/an5723-guidelines-for-ddr-configuration-on-stm32mp2-mpus-stmicroelectronics.pdf] (w 0.92), and ST ships that firmware as a versioned binary repository (A2022.11 in the STM32MP2 directory) [https://github.com/STMicroelectronics/stm32-ddr-phy-binary/] (w 0.67). That is exactly the producer/digest/update-channel record the conclusion asks for.

## What the 3 conclusions imply together

Read together they compress the whole survey into one statement: primitives exist, integrations are split, and the remaining work is assembling one coherent chain per board and proving it destructively on hardware. That is why the source doc's recommended next work (see 10-next-work-proof-packet.md) is a build-and-combine exercise on i.MX8MM plus disciplined sequencing for the alternates, not a search for new hardware primitives.
