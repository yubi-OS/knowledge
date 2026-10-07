# 02 - The optee_ftpm integration repo and ms-tpm-20-ref

Scope: what OP-TEE/optee_ftpm is, how it wraps microsoft/ms-tpm-20-ref, the commit pin, the TA UUID, and the NVIDIA BlueField worked example the source doc recommends.

## The canonical integration repo

The source doc names OP-TEE/optee_ftpm as the canonical integration repo, split out of ms-tpm-20-ref's Historical_Samples/Samples/ARM32-FirmwareTPM in October 2024; the in-tree Microsoft sample is historical and the OP-TEE repo is the maintained home (source doc, section "What it is"). The optee_ftpm repository itself confirms the arrangement: the fTPM Trusted Application provides a secure firmware implementation of a TPM using the MS reference implementation, platform-specific integration code lives in this repository, and it is a fork from the Microsoft sample (https://github.com/OP-TEE/optee_ftpm, jev weight 0.75, authoritative backing). That 0.75 result is the highest-weighted source in this corpus's dig and matches the source doc exactly.

The wrapping works through a platform-API swap. The Microsoft TPM reference implementation defines a platform API under ms-tpm-20-ref/TPMCmd/Platform that can be swapped out depending on where the TPM code runs; for the fTPM the OP-TEE API implements that layer (https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md, jev weight 0.55, authoritative backing). In other words, the TPM 2.0 command logic is Microsoft's; only the platform plumbing (storage, entropy, RPC) is OP-TEE-specific.

ms-tpm-20-ref itself is the official TCG reference implementation of the TPM 2.0 specification, containing complete source code with various build options, including a TPM 2.0 simulator that emulates a TPM 2.0 device accessible over TCP (https://github.com/microsoft/ms-tpm-20-ref/, jev weight 0.36, weak backing; https://github.com/microsoft/ms-tpm-20-ref/blob/main/README.md, jev weight 0.28, weak backing). Weak scores here reflect aggregator-adjacent mirrors rather than the project itself; the repository is by definition primary.

## The commit pin

The source doc directs builders to wrap microsoft/ms-tpm-20-ref and pin to commit 98b60a44aba79b15fcce1c0d1e46cf5918400f6a, the commit optee_ftpm expects (source doc, section "What it is"). The pin matters because optee_ftpm's build system compiles the reference implementation in place with exact expectations about its layout; the build configuration documentation for optee_ftpm covers compilation flags, library selection, source file organization, and external dependencies (https://deepwiki.com/OP-TEE/optee_ftpm/9.1-build-configuration, jev weight 0.20, weak backing). Drift between an unpinned ms-tpm-20-ref and optee_ftpm's expectations is a build failure, not a graceful degradation.

## The TA UUID

Every OP-TEE Trusted Application is addressed by UUID, and the source doc fixes the fTPM TA UUID as bc50d971-d4c9-42c4-82cb-343fb7f37896 (source doc, section "What it is"). This UUID is the join key across the whole stack: the TA build emits bc50d971-d4c9-42c4-82cb-343fb7f37896.elf, .ta, and .stripped.elf; the U-Boot driver opens a session to that UUID; the Linux tpm_ftpm_tee driver does the same (source doc, sections "Building the TA", "U-Boot side", "Linux side"). The Linux fTPM driver documentation describes the driver as a shim for firmware implemented in ARM's TrustZone environment, allowing provisioning of a TPM functional space for services without requiring a TPM device chip (https://docs.kernel.org/6.8/security/tpm/tpm_ftpm_tee.html, jev weight 0.72, authoritative backing).

## Production pedigree: NVIDIA BlueField

The source doc states the fTPM is used in production on NVIDIA BlueField DPUs and calls that BSP doc the best worked example of the whole flow (source doc, section "What it is"). The dig corroborates this directly: NVIDIA's DOCA documentation provides an overview and configuration instructions for using fTPM over OP-TEE on NVIDIA BlueField-3 DPUs and higher, delivering secure hardware-isolated cryptographic services (https://docs.nvidia.com/doca/archive/2-9-2/ftpm+over+op-tee/index.html, jev weight 0.48, weak backing, though the underlying source is NVIDIA's official documentation). The BlueField BSP page adds a deployment constraint worth knowing: the fTPM TA is the only TA BlueField-3 currently supports, and any TA loaded by OP-TEE must be signed externally and authenticated by OP-TEE before it can load and execute (https://networking-docs.nvidia.com/bsp/453/ftpm-over-op-tee, jev weight 0.47, weak backing; https://docs.nvidia.com/networking/display/bluefieldbsp480/ftpm-over-op-tee.pdf, jev weight 0.54, authoritative backing).

NVIDIA also maintains a troubleshooting guide for OP-TEE/fTPM that starts from the dependency structure the source doc assumes: fTPM is a TA which requires the OP-TEE transport, the entities are entirely dependent on one another, and if fTPM is not working the typical reason is that OP-TEE is malfunctioning (https://networking-docs.nvidia.com/bfswtroubleshooting/op-tee-ftpm, jev weight 0.54, authoritative backing). That page is the closest public analogue to what the source doc's integration checklist tries to prevent.

## Google mirror history

The dig also surfaced the Android platform mirror of ms-tpm-20-ref, which carries the Samples/ARM32-FirmwareTPM tree and confirms the same split: platform-specific code is copied and modified locally in optee_ta/fTPM/platform, while the reference code is referenced from fTPM/ref (https://android.googlesource.com/platform/external/ms-tpm-20-ref/+/08e3b32e71987a6fe4fec4e1697eae7de9476435/Samples/ARM32-FirmwareTPM/, jev weight 0.33, weak backing). This mirrors the structure the source doc describes for the pre-split history.

## What to keep in mind

The corpus-level takeaway: optee_ftpm is integration glue, ms-tpm-20-ref is the TPM brain, the UUID is the contract between layers, the commit 98b60a44aba79b15fcce1c0d1e46cf5918400f6a is the reproducibility anchor, and BlueField is the reference deployment to imitate when debugging.
