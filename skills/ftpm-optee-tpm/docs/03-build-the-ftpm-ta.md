# 03 - Building the fTPM TA

Scope: the exact build flow for the fTPM Trusted Application against the OP-TEE TA dev kit, the build flags that matter, and the artifacts produced.

## The two-step flow

The source doc's build recipe has two steps (source doc, section "Building the TA"). First, check out the pinned ms-tpm-20-ref:

```sh
git clone https://github.com/microsoft/ms-tpm-20-ref
git -C ms-tpm-20-ref checkout 98b60a44aba79b15fcce1c0d1e46cf5918400f6a
```

Second, build the fTPM TA against the OP-TEE TA dev kit:

```sh
make -C optee_ftpm \
  TA_DEV_KIT_DIR=<optee_os>/out/<plat>/export-ta_arm64 \
  CFG_MS_TPM_20_REF=<abs-path>/ms-tpm-20-ref \
  CFG_TA_MEASURED_BOOT=y \
  CFG_TA_EVENT_LOG_SIZE=4096
```

The TA dev kit is not a separate download: OP-TEE's own documentation states that the Trusted Application dev kit is generated as part of the OP-TEE build process and can be found in the output directory under export-ta_arm32 and export-ta_arm64 depending on architecture configuration (https://deepwiki.com/OP-TEE/optee_os/4.2-trusted-application-build, jev weight 0.18, weak backing). OP-TEE's canonical Trusted Applications guide documents how to implement and build a TA using the so-called TA-devkit to both build and sign the TA binary (https://optee.readthedocs.io/en/latest/building/trusted_applications.html, jev weight 0.77, authoritative backing). That 0.77 source is the strongest external backing in this corpus and grounds the dev-kit part of the flow.

## The flags that matter

CFG_MS_TPM_20_REF must point at the checked-out reference source (source doc, section "Building the TA"). This is the join between the integration repo and the Microsoft reference implementation: the build compiles the pinned reference in place and swaps its platform layer for OP-TEE's, as the MSRSec fTPM README describes (the platform API under ms-tpm-20-ref/TPMCmd/Platform is swapped depending on where the TPM code runs; for the fTPM the OP-TEE API implements it) (https://github.com/microsoft/MSRSec/blob/master/TAs/optee_ta/fTPM/README.md, jev weight 0.55, authoritative backing).

CFG_TA_MEASURED_BOOT=y enables reading and extending a TCG2 event log at TA init and requires the OP-TEE PTA PTA_SYSTEM_GET_TPM_EVENT_LOG (source doc, section "Building the TA"). This flag is what turns the fTPM from a standalone TPM into a participant in the firmware measured-boot chain: the TA inherits the event log the earlier boot stages recorded and extends it.

CFG_TA_EVENT_LOG_SIZE defaults to 1024 bytes, which the source doc calls too small for a real chain and recommends bumping to 4096 or more (source doc, section "Building the TA"). A 1024-byte buffer holds only a handful of TCG2 events; a firmware chain that measures multiple boot stages overruns it and the log gets truncated, which silently breaks event-log replay later. The 4096 value in the source doc's command is the practical floor.

## Output artifacts

The build outputs bc50d971-d4c9-42c4-82cb-343fb7f37896.elf, bc50d971-d4c9-42c4-82cb-343fb7f37896.ta, and bc50d971-d4c9-42c4-82cb-343fb7f37896.stripped.elf (source doc, section "Building the TA"). The stripped ELF is the variant the Early TA build consumes (see doc 04); the .ta file is the loadable form for dynamic deployment during testing.

The build-configuration documentation for optee_ftpm covers compilation flags, library selection, source file organization, and external dependencies in detail (https://deepwiki.com/OP-TEE/optee_ftpm/9.1-build-configuration, jev weight 0.20, weak backing). The Android platform mirror of the pre-split sample shows the same structure at the source level: platform-specific code copied and modified locally in optee_ta/fTPM/platform, reference code referenced from fTPM/ref (https://android.googlesource.com/platform/external/ms-tpm-20-ref/+/08e3b32e71987a6fe4fec4e1697eae7de9476435/Samples/ARM32-FirmwareTPM/README.md, jev weight 0.31, weak backing).

## What the build does not do

Two things the TA build does not cover, and which the source doc routes elsewhere:

1. The TA build does not embed the TA into OP-TEE OS. That is the Early TA step, a separate make invocation against optee_os with CFG_EARLY_TA=y and EARLY_TA_PATHS (source doc, section "Early TA vs dynamic TA", covered in doc 04).
2. The TA build does not configure the RPMB storage backend. RPMB comes from the OP-TEE OS build via CFG_RPMB_FS=y and carries the RPMB-before-supplicant bootstrap hazard covered in doc 05.

## Verification checklist for the build

A successful build produces the three UUID-named artifacts; a failed build most commonly fails at the CFG_MS_TPM_20_REF join (wrong path or wrong commit checked out) or at TA_DEV_KIT_DIR (wrong platform directory). The source doc's pin discipline exists because optee_ftpm expects commit 98b60a44aba79b15fcce1c0d1e46cf5918400f6a specifically (source doc, section "What it is"); an unpinned or newer ms-tpm-20-ref breaks the reference-implementation layout assumptions.

Every external claim above carries its weight; the dev-kit and platform-swap claims are backed at 0.77 and 0.55 respectively, the layout-history claims are weak (0.20 to 0.31), and the flag semantics come from the source doc itself.
