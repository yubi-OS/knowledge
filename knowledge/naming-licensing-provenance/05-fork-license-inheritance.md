# 05 - Fork license inheritance: what each forked component carries

Scope: the licenses yubiOS inherits from its forked boot and firmware dependencies, the per-repo verification discipline before distribution, and how separately combined components avoid merging license obligations.

## U-Boot: GPL-2.0-or-later

The U-Boot project's own site states it plainly: U-Boot's source code is licensed under the GNU General Public License v2 or-later (source: https://u-boot-project.org/, weight 0.97). A weakly backed wiki-derived analysis of an RK3566 U-Boot fork agrees that the majority of U-Boot, including core bootloader functionality and device drivers, is GPL-2.0-or-later (source: https://deepwiki.com/yjr-jack/u-boot-rk3566/6-licensing-and-legal-framework, weight 0.38, weak backing). A live example of fork practice is the ARM-software U-Boot mirror, which carries the upstream Licenses/README directory intact (source: https://github.com/ARM-software/u-boot/blob/master/Licenses/README, weight 0.60), exactly the preservation pattern the fork-attribution baseline requires.

The structural point from the yubiOS register holds: a GPL-2.0 bootloader sitting alongside LGPL-2.1 OS code as a separately built boot image is a standard distribution pattern, the same way most distributions combine differently licensed bootloaders and userspace. The Software Freedom Law Center's GPL and non-GPL collaboration guidance is the authoritative support for keeping those obligations at a boundary rather than merging them (source: https://softwarefreedom.org/resources/2007/gpl-non-gpl-collaboration.html, weight 0.77, also cited in doc 03).

## ARM Trusted Firmware and OP-TEE: BSD-3-Clause

Trusted Firmware-A's own license documentation states the software is provided under a BSD-3-Clause license and that contributions are accepted under the same license with developer sign-off (source: https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/license.rst, weight 0.80). Arm's developer page for Trusted Firmware-A repeats the BSD-3-Clause licensing and the contribution terms (source: https://developer.arm.com/tools-and-software/trusted-firmware-a, weight 0.83). The Trusted Firmware community site describes the project as a reference implementation of secure software for Armv8-A, Armv9-A and Armv8-M (source: https://www.trustedfirmware.org/, weight 0.88).

OP-TEE is documented on the same community site as a Trusted Execution Environment designed as a companion to a non-secure Linux kernel running on Arm Cortex-A cores using TrustZone technology (source: https://www.trustedfirmware.org/projects/op-tee/, weight 0.94). The TF-A GitHub mirror describes it as the reference implementation of secure world software for Arm A-Profile architectures, including the EL3 Secure Monitor (source: https://github.com/ARM-software/arm-trusted-firmware, weight 0.75).

## What the dig could not verify

Three register items remain unverified by this dig and stay on the verify list:

1. ms-tpm-20-ref. The dig surfaced no primary source for Microsoft's reference TPM 2.0 implementation license. The register's "typically a permissive BSD-style license" characterization stays unconfirmed.
2. bootc, mkosi, bcvk, particleos. The dig surfaced choosealicense's Apache-2.0 entry (weight 0.73, cited in doc 03) as the general shape of the permissive family, but no per-repo LICENSE pull for these specific forks. The register's instruction stands: pull each fork's actual LICENSE file before any GA or publication step, rather than relying on family characterizations.
3. edk2 and edk2-rk3588. No primary license source surfaced in this dig.

This is a documented gap, not a padding: asserting license strings without per-repo verification is exactly what the register forbids, and this corpus does not do it either.

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://u-boot-project.org/ | 0.97 | U-Boot official site, GPL-2.0-or-later (primary) |
| https://www.trustedfirmware.org/projects/op-tee/ | 0.94 | OP-TEE official project page (primary) |
| https://www.trustedfirmware.org/ | 0.88 | Trusted Firmware community site (primary) |
| https://developer.arm.com/tools-and-software/trusted-firmware-a | 0.83 | Arm TF-A page, BSD-3-Clause (primary) |
| https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/license.rst | 0.80 | TF-A license doc (primary) |
| https://github.com/ARM-software/arm-trusted-firmware | 0.75 | TF-A mirror description |
| https://github.com/ARM-software/u-boot/blob/master/Licenses/README | 0.60 | Fork keeping upstream Licenses/ dir |
| https://deepwiki.com/yjr-jack/u-boot-rk3566/6-licensing-and-legal-framework | 0.38 | Weak: U-Boot GPL-2.0+ analysis |
| https://www.arm.com/ | 0.29 | Weak: corporate page |
| https://akhileshmoghe.github.io/_post/embedded/linux/bootloader/u-boot | 0.21 | Weak: background |
| https://en.wikipedia.org/wiki/Das_U-Boot | 0.07 | Weak: background |
| https://handwiki.org/wiki/Software:Android_(operating_system) | 0.15 | Discarded: off-topic |
