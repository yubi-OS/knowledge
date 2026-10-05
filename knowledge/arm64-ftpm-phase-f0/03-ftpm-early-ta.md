# 03 - The fTPM as an OP-TEE Early TA

Scope: ms-tpm-20-ref built as an OP-TEE trusted application, its fixed UUID, what it means for a TA to be embedded as an Early TA in the OP-TEE binary, and how its persistent state lands in RPMB-backed NV storage.

## The reference implementation and its OP-TEE integration

The fTPM trusted application provides a secure firmware implementation of a TPM 2.0 using the Microsoft reference implementation, with the platform-specific integration code kept in the `OP-TEE/optee_ftpm` repository, which is a fork of the Microsoft reference implementation sample `ARM32-FirmwareTPM` maintained to work with OP-TEE (https://github.com/OP-TEE/optee_ftpm, weight 0.947). The upstream sample is also published on Android's platform mirror, which documents that platform-specific code is copied and modified locally under `optee_ta/fTPM/platform`, while `/fTPM/reference` contains files supporting WolfSSL, controlling the fTPM's functionality, and defining basic types (https://android.googlesource.com/platform/external/ms-tpm-20-ref/+/08e3b32e71987a6fe4fec4e1697eae7de9476435/Samples/ARM32-FirmwareTPM/, weight 0.735).

The Phase F0 plan pins ms-tpm-20-ref at commit `98b60a44aba79b15fcce1c0d1e46cf5918400f6a` and fixes the TA UUID at `bc50d971-d4c9-42c4-82cb-343fb7f37896`. Both are plan-internal constants: the UUID must match across the OP-TEE TA build, the U-Boot `tpm2_ftpm_tee` driver, and the Linux driver, because each of them opens a session against that UUID.

## Endorsement and the EPS

The endorsement primary seed, the EPS, is the root of trust for all TPM functions. The fTPM has two options for deriving an EPS, and the first and best option is to request one from the OP-TEE kernel: the kernel implements a vendor property `com.microsoft.ta.endorsementSeed` which returns a hashed value derived from the unique hardware ID, the hardware die ID, and the UUID of the fTPM TA, so that if the non-volatile state changes the seed derivation remains tied to hardware identity (https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md, weight 0.794). For a QEMU-based Phase F0 environment this detail has a concrete consequence: the hardware identity QEMU exposes is not a real die ID, so EPS derivation behavior in the emulator should be validated explicitly rather than assumed identical to silicon.

## What Early TA means

An fTPM over OP-TEE is an emulated TPM using an isolated hardware environment: it executes in the open-source trusted execution environment OP-TEE, and the fTPM trusted application is part of the OP-TEE binary, which allows early access on bootup while running only in secure DRAM (https://docs.nvidia.com/networking/display/bluefieldbsp480/ftpm-over-op-tee.pdf, weight 0.911). That is the substance of the Early TA designation used in the plan: the TA is embedded in the OP-TEE OS image and loaded at secure-world boot, before any normal-world user space exists. The plan's motivation is exactly this: U-Boot and Linux can use TPM services before a root filesystem exists.

The operational caveat from the same vendor documentation is direct. The fTPM trusted application is signed with a development key intended solely for testing purposes and is not securely signed; the feature is strictly for testing and should not be used in any operational environment (https://networking-docs.nvidia.com/bsp/4.5.6/ftpm-over-op-tee, weight 0.884). Phase F0 is a test environment, so this is acceptable, but the doc record should not let a QEMU-validated fTPM silently become a production trust anchor.

## Persistent state: RPMB-backed NV

TPM 2.0 semantics require non-volatile storage for keys, counters, and the NV index space. OP-TEE's secure storage architecture supports RPMB as a storage backend: trusted applications may use it by passing a storage ID equal to `TEE_STORAGE_PRIVATE_RPMB`, or `TEE_STORAGE_PRIVATE` if `CFG_REE_FS` is disabled, and the underlying RPMB mechanism is defined in the JEDEC eMMC specification JESD84-B51 (https://optee.readthedocs.io/en/latest/architecture/secure_storage.html, weight 0.942).

The coupling between OP-TEE and fTPM is tight. Vendor troubleshooting documentation notes that issues in OP-TEE/fTPM typically occur at boot time, that a variety of interrelated pieces must be available for OP-TEE and fTPM to function, and that because the fTPM is a trusted application requiring the OP-TEE transport, the entities are entirely dependent on one another; if the fTPM is not working, the typical reason is that OP-TEE is malfunctioning (https://docs.nvidia.com/networking/display/bfswtroubleshooting/OP-TEE/op-tee-ftpm.pdf, weight 0.776).

Real-world integration friction on QEMU is documented: a build following the instructions produced a system where the driver did not load, with the reporter switching between the `optee_ta` sources in `ms-tpm-20-ref` and the copies in the MSRSec repository as a suspected cause (https://github.com/microsoft/MSRSec/issues/20, weight 0.142, weak backing). The actionable lesson for a reproducible Phase F0 build is to pin one source tree for the fTPM TA and record which one.

## Verification implications

Because the Early TA runs only in secure DRAM and is loaded with OP-TEE, a guest-side verifier cannot confirm fTPM health by inspecting the TA directly. The observable surface is the TEE session path: OP-TEE bus up, the TPM command channel functional, and NV operations behaving. That is why the plan's done condition reduces to `/dev/tpm0` appearing, `TPM2_Startup` succeeding, and a PCR extend changing the value: each of those exercises one layer of the Early TA stack without requiring any TA-internal instrumentation.
