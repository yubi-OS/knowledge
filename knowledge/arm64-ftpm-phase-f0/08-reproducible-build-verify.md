# 08 - Reproducible build and verification for the F0 chain

Scope: what makes a QEMU ARM64 fTPM build reproducible, the pinned manifest plus pinned ms-tpm-20-ref approach behind `build-arm64-ftpm-qemu.sh`, and how `verify-tpm0-pcr-extend.sh` expresses the done condition as an automated in-guest check.

## The pin set

The Phase F0 plan pins three things: the OP-TEE `qemu_v8` manifest set, ms-tpm-20-ref at commit `98b60a44aba79b15fcce1c0d1e46cf5918400f6a`, and the fTPM TA UUID `bc50d971-d4c9-42c4-82cb-343fb7f37896`. The manifest approach is the right primitive for reproducibility: the `OP-TEE/manifest` repository contains repo manifests able to clone all source code needed for a full OP-TEE developer build (https://github.com/OP-TEE/manifest, weight 0.924). Pinning a manifest revision pins the TF-A, OP-TEE OS, optee_client, U-Boot, and build-glue revisions in one artifact.

The build flow itself is documented: with the v8 manifest selected, the standard get and build the solution sequence builds and boots QEMU v8 (https://github.com/OP-TEE/optee_docs/blob/master/building/devices/qemu.rst, weight 0.899), and the OP-TEE project describes itself as a TEE designed as a companion to a non-secure Linux kernel on Arm A-Profile systems using TrustZone (https://www.trustedfirmware.org/projects/op-tee/, weight 0.881). Community walkthroughs confirm the sequence shape: build toolchains via the OP-TEE build system, then build the components (https://github.com/chxrbh/OP-TEE-QEMU-Simulation, weight 0.419, weak backing; https://distrinet-tacos.github.io/documentation/optee/qemu/build.html, weight 0.561).

## Why pin ms-tpm-20-ref separately

The OP-TEE manifest set does not necessarily carry the exact fTPM revision the plan needs, which is why the plan pins ms-tpm-20-ref independently. Integration friction is documented in the wild: a builder following the published instructions ended up with a system where the driver did not load, and the debugging trail involved switching between the `optee_ta` sources in `ms-tpm-20-ref` and the copies in the MSRSec repository (https://github.com/microsoft/MSRSec/issues/20, weight 0.142, weak backing). A build script that fetches the fTPM TA from a pinned commit, rather than from whatever a manifest submodule points at, removes that ambiguity by construction.

## The QEMU side of the build

The emulator contract is stable: QEMU provides full-system emulation, running operating systems for any supported architecture (https://www.qemu.org/, weight 0.761), and the Arm system emulator documentation states that `qemu-system-aarch64` simulates a 64-bit Arm machine and that command lines that work for `qemu-system-arm` behave the same with `qemu-system-aarch64` (https://www.qemu.org/docs/master/system/target-arm.html, weight 0.883). The TF-A QEMU platform port completes the contract: BL1 is supplied as the BootROM via the `-bios` argument, and the combined BL1 plus FIP flash image (`qemu_fw.bios`) is the artifact QEMU consumes (https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/plat/qemu.rst, weight 0.898; https://github.com/jeromehaxhiaj-qti/optee-qemu-demo, weight 0.745).

A reproducible `build-arm64-ftpm-qemu.sh` therefore produces, at minimum: the combined bios image, the OP-TEE image with the fTPM Early TA embedded, the U-Boot binary with the fTPM and measured-boot configs enabled, a guest kernel with the TEE and TPM configs, and a root filesystem or initramfs image carrying `tee-supplicant` per the RPMB bootstrap strategy.

## Verification as a script, not a ritual

The plan's in-guest verifier `verify-tpm0-pcr-extend.sh` checks: OP-TEE bus up, `/dev/tpm0` and `/dev/tpmrm0` present, `TPM2_Startup` OK, and a PCR extend changing the PCR value. That decomposition maps one to one onto the stack layers documented elsewhere in this corpus: the TEE framework (OP-TEE bus), the `tpm_ftpm_tee` shim and TPM core (device nodes), the command transport (Startup), and the measurement machinery (extend).

Automating guest checks is a solved pattern. Ubuntu Core's documentation describes deploying and testing images in QEMU virtual machines with KVM, OVMF, and optional TPM emulation (https://documentation.ubuntu.com/core/how-to-guides/manage-ubuntu-core/test-on-qemu/, weight 0.920). QEMU's own testing infrastructure covers everything from unit testing to full functional tests, with most tests integrated into the meson build system and reachable via `make check-help` (https://www.qemu.org/docs/master/devel/testing/main.html, weight 0.770). A Phase F0 harness does not need to live inside QEMU's test tree, but the serial-console-driven check pattern it uses is the same one the ecosystem standardizes on.

## The human gate

The plan keeps the done condition human-gated until the firmware path is stable enough to promote. That is a deliberate ordering: the scripts make the check repeatable, and the human gate keeps the promotion decision, moving from QEMU validation toward the live ARM64 Phase F integration pipeline, an explicit judgment call rather than an automated one.

## Failure modes a verifier should distinguish

A verifier should be able to say which layer failed, not just that the guest failed. The failure classes visible from the sources are: OP-TEE and fTPM being mutually dependent, so an fTPM failure usually means OP-TEE is malfunctioning (https://docs.nvidia.com/networking/display/bfswtroubleshooting/OP-TEE/op-tee-ftpm.pdf, weight 0.776); early NV writes hitting storage before supplicant is available (https://deepwiki.com/OP-TEE/optee_client/2.2.2-rpmb-storage, weight 0.568); and the session-establishment panic when a normal-world driver reaches the fTPM Early TA during boot before supplicant loads (https://github.com/OP-TEE/optee_os/issues/7339, weight 0.509). Emitting a per-layer PASS or FAIL from `verify-tpm0-pcr-extend.sh` turns each of these from a debugging session into a one-line triage.
