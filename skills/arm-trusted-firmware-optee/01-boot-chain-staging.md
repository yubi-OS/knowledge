# 01 - ARM64 boot chain staging (BL1, BL2, BL31, BL32, BL33)

Scope: the five Trusted Firmware-A (TF-A) boot stages yubiOS owns on ARM64, the exception levels they run at, and how the ROTPK hash anchors the whole chain.

Grounding spine: yubi-OS/yubiOS skills/arm-trusted-firmware-optee/SKILL.md (source doc). Dig sources weighted by jev noul; weight >= 0.5 is treated as authoritative, weight < 0.5 is labeled as weakly backed.

## The chain as the source doc defines it

The source doc lays out the yubiOS ARM64 boot chain as a strict ladder rooted in the SoC itself:

1. ROTPK: the SHA-256 hash of yubiOS's own public key, burned into SoC OTP/eFuse.
2. BL1: the boot ROM or first stage. It does minimal hardware init, then verifies and loads BL2.
3. BL2: the Trusted Boot stage. It parses the FIP archive, verifies every image against the TBB certificate chain, measures each image into the TCG2 event log, then loads three successors: BL31, BL32, and BL33.
4. BL31: the EL3 runtime, also called the Secure Monitor. It provides PSCI power management and routes SMC calls between the Normal and Secure worlds. It stays resident for the life of the system.
5. BL32: OP-TEE OS running at Secure-EL1. This is yubiOS's secure-world OS and it hosts the fTPM Trusted Application.
6. BL33: U-Boot running at Non-secure EL2/EL1. It measures the kernel, DTB, and initramfs, talks to the fTPM, and hands the event log to Linux.

The goal, per the source doc, is that yubiOS owns every trust anchor from the SoC fuse key onward instead of inheriting the vendor's TF-A, TEE, and boot ROM key. The source doc frames this as the ARM64 analogue of `bootctl enroll-keys` on x86-64, and as the closure of the OEM/vendor supply chain surface documented in yubiOS MITIGATE.md.

## Exception levels

The source doc maps the stages to Arm exception levels directly: EL3 is BL31 (the monitor), Secure-EL1 is the OP-TEE kernel, Secure-EL0 is where Trusted Applications such as the fTPM run, and Non-secure EL2/EL1 is where U-Boot and then Linux run.

The official TF-A firmware design documentation confirms the architectural role of the EL3 monitor in this split: normal world software reaches TF-A runtime services through the Arm SMC (Secure Monitor Call) instruction, and PSCI (power management for secondary CPU boot, hotplug, and idle) is implemented as a runtime service in TF-A (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/design/firmware-design.rst, weight 0.83; same content mirrored at https://trustedfirmware-a.readthedocs.io/en/latest/design/firmware-design.html, weight 0.83).

## BL naming and stage structure

A weakly backed but consistent external explanation matches the source doc's model: BL means Boot Loader stage, so BL1 is stage 1, BL2 is stage 2, and BL31, BL32, and BL33 are the three parts of stage 3 (https://karolinagorna.net/hardware/, weight 0.07, weakly backed). A deeper walkthrough of the same stage decomposition, covering data flow and entrypoint logic for BL1, BL2, BL31 and their variants, is available in a third-party analysis of the TF-A tree (https://deepwiki.com/mtk-openwrt/arm-trusted-firmware/2.1-boot-loader-stages:-bl1-bl2-bl31-and-variants, weight 0.15, weakly backed).

## Where the chain actually breaks

Field reports of real TF-A boot failures are useful for porting expectations: one documented failure mode is a boot sequence stop during the BL2 to BL31 transition on Intel Agilex, where the process is designed to go from BL2 (boot loader stage 2) to BL31 (EL3 runtime firmware) and then onward (https://www.systemonchips.com/arm-trusted-firmware-boot-failure-bl2-to-bl31-transition-on-intel-agilex/, weight 0.11, weakly backed). The practical lesson for yubiOS ports: a chain that loads BL2 but never reaches BL31 is a distinct failure class from a chain that fails verification inside BL2, and the two need different debugging.

## Why the source doc insists on owning BL1 through BL33

Three reasons come straight from the source doc:

- The ROTPK hash in OTP/eFuse is the root. Everything downstream verifies against it.
- BL2 measures every image it loads into the TCG2 event log, so the firmware-stage measurements exist before any OS code runs.
- The vendor alternatives (vendor TF-A, vendor TEE, vendor boot ROM key) are exactly the supply chain surface yubiOS is trying to close.

For yubiOS this chain is the firmware-stage half of a longer trust chain: the YubiKey stays the primary root of trust for user secrets, the fTPM inside OP-TEE provides measured-boot PCRs, and the UKI, dm-verity, and bootc layers stack on top. The source doc states this explicitly and points to the sibling skills `ftpm-optee-tpm` (the fTPM TA itself) and `yubikey-operations` (the YubiKey layer).
