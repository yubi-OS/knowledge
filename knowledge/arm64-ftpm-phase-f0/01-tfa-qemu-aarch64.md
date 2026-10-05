# 01 - TF-A on QEMU ARM64: the BL1/BL2/BL31 foundation

Scope: how ARM Trusted Firmware-A serves as the BL1, BL2, and BL31 layers of a QEMU `virt` ARM64 boot chain, with SPD=opteed wiring OP-TEE in as the secure payload, and what the QEMU platform port guarantees about CPU and flash startup.

## Why TF-A is the anchor layer

Trusted Firmware-A provides a reference implementation of secure world software for Armv7-A and Armv8-A class processors (https://developer.arm.com/tools-and-software/trusted-firmware-a, weight 0.948). The Trusted Firmware project positions it as a reference trusted code base for SoC developers and OEMs complying with the relevant Arm specifications (https://www.trustedfirmware.org/, weight 0.922). For the Phase F0 plan, this matters because the whole boot chain is built on a stage whose behavior is standardized rather than improvised: the plan pins TF-A with `PLAT=qemu ARCH=aarch64 SPD=opteed`.

The TF-A QEMU platform documentation confirms the core mechanism: TF-A implements the EL3 firmware layer for QEMU `virt` Armv8-A, and BL1 is used as the BootROM, supplied to QEMU with the `-bios` argument (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/plat/qemu.rst, weight 0.898). The same document records that when QEMU starts, all CPUs are released simultaneously, BL1 selects a primary CPU to handle the boot, and the secondaries are placed in a polling loop to be released by the normal world via PSCI (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/plat/qemu.rst, weight 0.898). A Phase F0 build script therefore does not need to invent SMP bring-up: the QEMU platform port handles it.

## The BL1 to BL33 stage sequence

TF-A's classic stage sequence on an application processor is BL1, then BL2, then BL31, then optionally BL32, then BL33 (https://sprchuoi.github.io/securebootloader/07-soc-secure-boot/, weight 0.787). In the generic model, BL31 stays resident in secure memory as the Secure Monitor, handling SMC calls and PSCI power management; BL32 runs a trusted OS such as OP-TEE; BL33 is the non-secure world bootloader that eventually loads Linux; and BL31 is the only stage that permanently occupies EL3, while BL1 and BL2 execute at EL3 but terminate (https://jovin555.github.io/firmware-daily-log/trustzone/day-11, weight 0.114, weak backing).

A hands-on account of the same shape on QEMU reports using OP-TEE OS as the BL32 secure payload and U-Boot as BL33 to boot a Linux kernel, noting that the ATF QEMU documentation suggests QEMU_EFI.fd for BL33 but the author substituted U-Boot when that path proved hard to debug (https://lnxblog.github.io/2020/08/20/qemu-arm-tf.html, weight 0.159, weak backing). That is exactly the shape the Phase F0 plan adopts: BL32 is OP-TEE and BL33 is U-Boot in UEFI mode, so the weak-backed anecdote and the plan agree on the substitution.

## FIP packaging and the flash image

The QEMU boot firmware is delivered as a combined image. An OP-TEE QEMU demo repository documents `out/firmware/qemu_fw.bios` as a combined BL1 plus FIP flash image used by QEMU, alongside `out/firmware/bl1.bin` as the TF-A first-stage bootloader (https://github.com/jeromehaxhiaj-qti/optee-qemu-demo, weight 0.745). This is the artifact a reproducible Phase F0 build script must produce deterministically: one bios file carrying BL1 and the FIP containing the later stages.

Because QEMU `virt` has no hardware BootROM, TF-A's BL1 stands in for one (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/plat/qemu.rst, weight 0.898). A verification harness that wants to prove the chain boots should therefore treat the bios blob as the single root artifact handed to QEMU, and everything downstream as derived from it.

## Securing the handoff to OP-TEE

The SPD=opteed setting is what makes BL31 dispatch into OP-TEE as the secure payload. OP-TEE's own architecture documentation describes enabling verification of OP-TEE using the authentication framework in TF-A, i.e. secure boot in an Armv8-A environment where TF-A verifies the OP-TEE image before handing off (https://optee.readthedocs.io/en/latest/architecture/secure_boot.html, weight 0.920). For a plan whose stated purpose is to prove the secure-world stack before irreversible hardware provisioning, wiring the authentication framework at the F0 stage is the point at which measured and verified boot begin to overlap.

## Build environment notes

A step-by-step guide for the full Linux plus QEMU plus TF-A stack lists the build prerequisites: compiler and build tools such as build-essential, bison, and flex; cross-compilation libraries including GMP, MPC, and MPFR for GCC and OpenSSL for certain firmware; the device tree compiler; QEMU for ARM and AArch64; and utilities like parted (https://github.com/BechirZalila/linux-qemu-trusted-firmware, weight 0.537). A Phase F0 build script pinned in version control should encode exactly this dependency set so the build is reproducible on a clean host.

## What Phase F0 should hold TF-A to

The plan's done condition is that a build script boots QEMU `virt` and an in-guest verifier passes. From the TF-A side, the checkable facts are: BL1-as-BootROM behavior with `-bios` (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/plat/qemu.rst, weight 0.898), secondary CPU release via PSCI (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/plat/qemu.rst, weight 0.898), and a combined BL1 plus FIP bios image (https://github.com/jeromehaxhiaj-qti/optee-qemu-demo, weight 0.745). Any deviation from those three facts during bring-up is a signal the build drifted from the pinned manifest rather than a QEMU quirk to work around.
