# 05 - U-Boot as UEFI firmware (the architectural unlock)

Scope: running U-Boot with EFI_LOADER so it is a real UEFI environment, which lets yubiOS reuse its x86-64 Secure Boot artifacts (systemd-boot, UKI, shim, GRUB) unchanged on ARM64.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc).

## The unlock itself

The source doc's central architectural claim: with `CONFIG_EFI_LOADER=y` and `CONFIG_CMD_BOOTEFI=y`, U-Boot is a real UEFI environment, providing boot and runtime services, the UEFI system table, `Boot####` and `BootOrder` variables, and PE/COFF EFI binary loading. systemd-boot, a UKI, shim, or GRUB then run unmodified. ARM64 stops being a special boot path; U-Boot just speaks UEFI in place of vendor EDK2.

The third-party architectural analysis of the U-Boot tree matches this framing: the EFI Loader subsystem enables U-Boot to act as a UEFI firmware implementation, loading and executing UEFI applications such as GRUB and other UEFI-compliant loaders (https://deepwiki.com/u-boot/u-boot/8.1-efi-loader, weight 0.10, weakly backed). U-Boot's own bootefi command documentation shows the boot-variable mechanics behind the claim: boot options are defined by UEFI variables with names consisting of the letters Boot followed by a 4 digit hexadecimal number, for example Boot0001 or BootA03E, each defining a label and the device path of the binary to execute (https://docs.u-boot-project.org/en/latest/usage/cmd/bootefi.html, weight 0.19, weakly backed).

Why this matters to yubiOS specifically, per the source doc: the same artifacts yubiOS signs for x86-64 UEFI Secure Boot run on ARM64 without a separate signing pipeline, and the boot flow converges with the x86-64 path instead of forking.

## EFI Secure Boot on U-Boot

The source doc requires `CONFIG_EFI_SECURE_BOOT=y` (which needs `EFI_LOADER` plus `FIT_SIGNATURE`) and states that it authenticates PE/COFF binaries against the standard `PK`, `KEK`, `db`, and `dbx` databases.

An upstream U-Boot patch series on secure boot variable measurement confirms the same variable set is the live surface: it adds measurement of the `SecureBoot`, `PK`, `KEK`, `db`, and `dbx` variables, and notes the implementation assumes secure boot variables are pre-configured and are not set or updated at runtime (https://lists.denx.de/pipermail/u-boot/2021-July/454809.html, weight 0.31, weakly backed). That assumption is directly relevant to yubiOS: it is another argument for the protected-variable service in the next document, since variables that cannot be updated at runtime must be provisioned correctly once, in a tamper-resistant store.

## EFI TCG2 measurement

With `CONFIG_EFI_TCG2_PROTOCOL=y` plus `TPM_V2`, the UEFI/UKI stage measures into the fTPM via the TCG2 protocol, exactly as it would on a physical-TPM box (source doc). U-Boot's measured boot documentation describes the same contract: the EFI subsystem implements the EFI TCG protocol and the TCG PC Client Specific Platform Firmware Profile Specification, which defines which binaries are measured and which PCRs are used (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, weight 0.29, weakly backed).

The TCG specifications behind that protocol are public: the TCG EFI Protocol Specification defines the data structures and APIs an OS uses to interact with UEFI firmware, including querying whether a TPM is present, which PCR banks are active, changing active PCR banks, obtaining the TCG boot log, extending hashes into PCRs, and appending events to the TCG boot log (https://trustedcomputinggroup.org/resource/tcg-efi-protocol-specification/, weight 0.28, weakly backed). The PC Client Platform Firmware Profile fixes the PCR usage model, including the rule that when the TPM is hidden, platform firmware must cap PCR[0-7] and must not log measurements in the TCG event log (https://trustedcomputinggroup.org/wp-content/uploads/TCG_PCClient_PFP_r1p05_v23_pub.pdf, weight 0.22, weakly backed).

## Capsule updates

The source doc adds `CONFIG_EFI_CAPSULE_*` for capsule-on-disk firmware updates (FMP) covering U-Boot, FIP, and OP-TEE images. This is what lets an ARM64 yubiOS device take firmware updates through the same UEFI capsule machinery x86-64 firmware uses, instead of a board-specific flashing flow.

## What this collapses

Before this unlock, an ARM64 port had to maintain a parallel boot story: FIT images, board-specific boot commands, and a separate signing path. The source doc's position is that UEFI-on-U-Boot removes that fork. The pieces that remain board-specific are only the ones below U-Boot: BL1, BL2, BL31, and OP-TEE, which is exactly the span the rest of this corpus covers.
