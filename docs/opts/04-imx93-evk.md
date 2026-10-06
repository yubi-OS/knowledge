# 04 i.MX93 EVK: the conditional Priority 2 lane

Scope: the NXP i.MX93 EVK, whose U-Boot integration is unusually strong but whose pre-owner trust boundary includes NXP EdgeLock Enclave firmware, making it a conditional candidate rather than a strict Path A match.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, section "Priority 2, NXP i.MX93 EVK", plus the i.MX93 row of the comparison matrix.

## Why it surfaced

The source doc records a strong integration story (source doc):

- `imx93_11x11_evk_defconfig` already enables `CONFIG_EFI_MM_COMM_TEE`, `CONFIG_CMD_OPTEE_RPMB`, `CONFIG_SUPPORT_EMMC_RPMB`, `CONFIG_TEE`, and `CONFIG_OPTEE`. It lacks only the board-level fTPM selection from the most visible yubiOS integration set.
- OP-TEE's i.MX configuration has an `mx93evk` flavor and EdgeLock Enclave integration.
- The active i.MX93 EVK contains 16 GB eMMC.
- NXP documents owner-signed AHAB containers, while the current board config exposes U-Boot fuse commands and secure storage transport.

The comparison matrix row compresses the same picture: the early owner-verification path is "AHAB/ELE + SPL" with "owner-versus-vendor authority unresolved"; RPMB and EFI MM are both yes; fTPM is missing; the principal blocker is "EdgeLock/Sentinel trust boundary and vendor firmware"; the lane is Priority 2 conditional (source doc). The result section adds the sharper framing: it has unusually strong current U-Boot integration, but the pre-owner trust boundary includes NXP EdgeLock Enclave firmware and TF-A supplies BL31 only (source doc).

## The AHAB container reality

The dig results show exactly where the owner boundary sits in the i.MX93 boot chain. NXP's SPSDK documentation for the signed and encrypted AHAB image on i.MX 93 lists the build inputs: LPDDR4 firmware files, U-Boot SPL and U-Boot built with AHAB support, BL31 from ARM Trusted Firmware, the ELE firmware binary, the AHAB container, and signing keys (the example uses 4 ECC keys, ECC384) [https://spsdk.readthedocs.io/en/v2.3.0/examples/imx93/imx93_signed_ahab_uboot.html] (w 0.82) and [https://spsdk.readthedocs.io/en/latest/examples/ahab/imx93/imx93_signed_ahab_uboot.html] (w 0.80).

The container layout is the crux: the first container set loads to OCRAM via the ROM's SDPS protocol and contains the U-Boot SPL binary, the ELE firmware, and DDR firmware plus training data; the second container set contains the full U-Boot and ATF image and loads to DDR [https://spsdk.readthedocs.io/en/latest/examples/ahab/imx93/imx93_signed_ahab_uboot.html] (w 0.80). That means vendor firmware (ELE, DDR) sits in the first, earliest-authenticated container set, before any owner-owned code executes.

The EdgeLock Enclave is the SoC's integrated secure element: NXP's product page positions the i.MX 93 as the first i.MX portfolio part integrating the scalable Arm Cortex-A55 core with "advanced security with integrated EdgeLock secure enclave" [https://www.nxp.com/products/i.MX93] (w 0.71). NXP maintains ELE application examples including key import flows for i.MX93 [https://github.com/nxp-imx-support/imx_sec_apps/blob/master/imx-ele-apps/key_import/test/i.MX93/LF-6.6.36_2.1.0/boot.txt] (w 0.67).

## The 3 boundary questions

The source doc poses the questions that must be answered before this board can be called Path A (source doc):

1. Is every boot-critical image before the first owner-authenticated container covered by the owner's root, or is an NXP-only signing root still authoritative?
2. Can all required vendor executables be hash-pinned, licensed, reproduced or independently verified, updated safely, and included in the threat model?
3. Does closing the owner lifecycle make wrong-key failure fatal without removing the documented recovery path?

The SPSDK container layout above makes question 1 concrete: the ELE firmware and DDR firmware in the first container set are exactly the pre-owner executables the gate analysis would have to cover (see 01-path-a-candidate-gates.md, gates 2 and 3). Question 2 maps to the source doc's cross-cutting conclusion on binary firmware; question 3 is the standard closure-versus-recovery tension recorded for every destructive lane.

## What the chain-of-trust model looks like once resolved

A third-party secure-boot guide for i.MX93-class parts (TQ Systems, TQM93xx) describes the target model: a previously established chain of trust verifies the origin of the U-Boot and Linux kernel, and with the mechanisms described only the owner of the generated private key can sign software and boot it on the device [https://www.tq-group.com/filedownloads/files/products/embedded/other_downloads/How-to-Secure_Boot-TQMa93.0002-eng.pdf] (w 0.73). That is the owner-root property Path A wants; the open question is not feasibility of the model but authority over the pre-owner container contents.

## Verdict as recorded

Excellent integration prototype and possibly a conditional Path A board, but not a strict owner-root candidate until the EdgeLock/Sentinel trust boundary is resolved (source doc). The source doc's recommended next work routes this lane through CI first: prototype i.MX93 in CI before buying hardware, with the explicit trust-boundary decision for EdgeLock firmware as the precondition (source doc). The same boundary reason defers the newer i.MX9 variants (i.MX91/95/943) in the rejected table (source doc).
