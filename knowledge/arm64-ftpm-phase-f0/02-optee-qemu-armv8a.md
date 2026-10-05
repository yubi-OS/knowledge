# 02 - OP-TEE OS on QEMU virt: vexpress-qemu_armv8a as BL32

Scope: OP-TEE OS as the BL32 secure payload on QEMU `virt`, the platform naming correction behind `vexpress-qemu_armv8a`, the qemu_v8 manifest build flow, and the debug knobs that matter during bring-up.

## What OP-TEE is and why it sits at BL32

OP-TEE is a trusted execution environment designed as a companion to a non-secure Linux kernel running on Arm A-Profile systems using TrustZone technology (https://www.trustedfirmware.org/projects/op-tee/, weight 0.881). In the Armv8-A boot chain, BL32 is the slot for a trusted OS (https://jovin555.github.io/firmware-daily-log/trustzone/day-11, weight 0.114, weak backing), and the Phase F0 plan places OP-TEE OS there with the SMC dispatch provided by TF-A's opteed secure payload dispatcher.

## The platform name correction

The Phase F0 plan retains an explicit correction: the OP-TEE platform is `vexpress-qemu_armv8a`, not `vexpress-qemu_virt`, while the QEMU machine remains `virt`. The external record supports the distinction: OP-TEE's officially supported platforms list includes `PLATFORM=vexpress-qemu_virt` (https://optee.readthedocs.io/en/latest/general/platforms.html, weight 0.955), which is the Armv7-A QEMU platform, and the separate Armv8-A build is driven by the `qemu_v8.xml` manifest (https://github.com/OP-TEE/optee_docs/blob/master/building/devices/qemu.rst, weight 0.899). Conflating the two platform strings is a classic first-bring-up failure, because the Armv7 platform builds a 32-bit secure world that cannot serve an AArch64 chain.

## The manifest build flow

OP-TEE's build documentation states that picking the v8 manifest, `qemu_v8.xml`, and following the get and build the solution steps is all that is needed to build and boot QEMU v8 (https://github.com/OP-TEE/optee_docs/blob/master/building/devices/qemu.rst, weight 0.899). The `OP-TEE/build` repository carries the Makefiles used to build OP-TEE on various platforms, which is the glue layer a reproducible script wraps (https://github.com/OP-TEE/build, weight 0.870). The manifest repository itself exists to clone all source code needed for a full OP-TEE developer build (https://github.com/OP-TEE/manifest, weight 0.924), which is what makes pinning a manifest revision the natural way to make a Phase F0 build reproducible.

The general build-and-run documentation covers building OP-TEE as a whole developer setup or as individual components, and running it on various devices (https://optee.readthedocs.io/en/latest/building/index.html, weight 0.960). For Phase F0, the whole-setup path is the one that matters: the chain needs OP-TEE OS, optee_client, and the build glue in one tree.

A third-party walkthrough of the same flow describes building toolchains via the OP-TEE build system and notes that the default manifest targets the QEMU v7 Armv7-A platform (https://github.com/chxrbh/OP-TEE-QEMU-Simulation, weight 0.419, weak backing), reinforcing that the v8 target must be selected explicitly.

## Bring-up and debug facts

Once QEMU with OP-TEE is up, the OP-TEE QEMU documentation notes that you can mount a host folder in QEMU from the normal world UART, and that debugging the TEE core with GDB requires disabling TEE ASLR with the `CFG_CORE_ASLR=n` flag (https://optee.readthedocs.io/en/latest/building/devices/qemu.html, weight 0.932). A Phase F0 verifier that needs symbolized secure-world backtraces should plan for that flag from the start rather than discovering it mid-debug.

The QEMU ARMv8 platform in the OP-TEE build tree is described as the primary validation target for OP-TEE features, including support for advanced virtualization capabilities and automated testing frameworks (https://deepwiki.com/OP-TEE/build/2-qemu-armv8-platform, weight 0.160, weak backing). That framing matches the plan's intent: prove the stack in the environment OP-TEE itself validates against.

OP-TEE's release cadence is active; version 4.2.0 alone merged 145 pull requests across the optee_os, optee_client, optee_test, and build repositories (https://www.trustedfirmware.org/blog/op-tee-release-4-2-0/, weight 0.901). Pinning matters more than usual in such a fast-moving tree.

## Why BL32 placement is load-bearing for fTPM

The fTPM plan depends on OP-TEE hosting the fTPM trusted application as part of the secure world. The fTPM TA is documented as part of the OP-TEE binary, allowing early access on bootup and running only in secure DRAM (https://docs.nvidia.com/networking/display/bluefieldbsp480/ftpm-over-op-tee.pdf, weight 0.911). If OP-TEE does not come up correctly at BL32, nothing downstream, including U-Boot's TPM commands and the Linux `/dev/tpm0` device, can exist. OP-TEE bring-up is therefore the first checkpoint in any Phase F0 verification order: confirm the optee dispatch banner and the OP-TEE boot messages before attempting any TPM interaction.
