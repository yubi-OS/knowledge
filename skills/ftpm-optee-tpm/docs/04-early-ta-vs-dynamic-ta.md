# 04 - Early TA vs dynamic TA: pick Early TA

Scope: the two OP-TEE TA deployment models, why the fTPM must be an Early TA, and the exact optee_os build that embeds it.

## The two loading models

OP-TEE supports several places a Trusted Application can reside and be loaded from, with Early TA and REE FS TAs being the relevant pair here (https://optee.readthedocs.io/en/latest/architecture/trusted_applications.html, jev weight 0.77, authoritative backing). A dynamic TA (REE FS TA) loads from the root filesystem, typically /lib/optee_armtz/<uuid>.ta, after the filesystem is mounted and tee-supplicant is running. An Early TA's binary image is found inside the OP-TEE core image itself rather than externally to the secure world (https://github.com/OP-TEE/optee_os/issues/4729, jev weight 0.40, weak backing).

The source doc states the timing constraint that decides the question: a dynamic TA loads from the rootfs after the filesystem is mounted and tee-supplicant is running, but U-Boot and Linux IMA both need the TPM before any rootfs exists (source doc, section "Early TA vs dynamic TA"). U-Boot's own measured-boot documentation describes it hashing boot components and extending results into the TPM (https://docs.u-boot-project.org/en/latest/usage/measured_boot.html, jev weight 0.26, weak backing); that work happens while the TPM must already be alive.

The consequence is categorical: build the fTPM as an Early TA, compiled into the OP-TEE binary's .rodata.early_ta section. Now the fTPM is alive the instant OP-TEE boots, with no userspace dependency (source doc, section "Early TA vs dynamic TA").

## The build

```sh
make -C optee_os \
  PLATFORM=<plat> \
  CFG_RPMB_FS=y \
  CFG_EARLY_TA=y \
  EARLY_TA_PATHS="<path>/bc50d971-d4c9-42c4-82cb-343fb7f37896.stripped.elf"
```

Three flags carry the semantics (source doc, section "Early TA vs dynamic TA"):

1. CFG_RPMB_FS=y enables OP-TEE's RPMB filesystem, which the fTPM uses for persistent NV storage (with the bootstrap hazard of doc 05).
2. CFG_EARLY_TA=y turns on the early-TA build path. Community notes on the Early TA mechanism confirm the flag relationship: setting CFG_EARLY_TA=y during the first build step is not strictly necessary but avoids rebuilding libraries, and CFG_EARLY_TA is automatically enabled when EARLY_TA_PATHS is non-empty (https://github.com/DevendraDevadiga/Early-TA, jev weight 0.14, weak backing).
3. EARLY_TA_PATHS points at the stripped TA ELF from the doc 03 build. The stripped.elf variant is the one to embed; the full .elf and .ta are for other deployment modes.

The Early TA mechanism works because the TA binary is authenticated differently from a filesystem TA: an early TA's image is inside the OP-TEE core image, so it does not need the external authentication path a rootfs TA requires, and a client application can use it as soon as OP-TEE core is up (https://github.com/OP-TEE/optee_os/issues/4729, jev weight 0.40, weak backing). That is precisely the property the U-Boot consumer needs.

## Why dynamic TA fails here specifically

The failure is not generic; it is specific to consumers that run before the rich OS exists:

1. U-Boot measures the next boot stage into the TPM. If the TPM TA cannot open a session because it lives on the not-yet-mounted rootfs, U-Boot measured boot is dead on arrival.
2. Linux IMA appraises files based on a TPM-anchored runtime measurement. If IMA starts before the TPM driver has registered /dev/tpm0, the measurements never happen and probe deferral or missing measurements result (source doc, section "Linux side").

A community issue report on communicating with early TAs during normal-world boot shows the inverse of the same constraint: the TPM driver in the normal world attempts to establish a session with the fTPM early TA during the boot process before tee-supplicant is loaded, and a panic occurs (https://github.com/OP-TEE/optee_os/issues/7339, jev weight 0.35, weak backing). Early TA removes the rootfs dependency but not the supplicant dependency for RPMB writes; that is the separate hazard in doc 05.

## Decision rule

The rule the source doc encodes: if any consumer of the TPM runs before the rootfs is mounted, the TA must be an Early TA. For yubiOS that condition holds by construction (U-Boot and IMA are pre-rootfs consumers), so Early TA is not an optimization but a requirement (source doc, section "Early TA vs dynamic TA"). The NVIDIA Jetson documentation reaches the same practical arrangement for measured boot support, which is based on PCR measurements stored in the fTPM (https://docs.nvidia.com/jetson/archives/r36.4.3/DeveloperGuide/SD/Security/FirmwareTPM.html, jev weight 0.18, weak backing).

## Weak-backing note

The authoritative backing for this doc is the OP-TEE architecture documentation at weight 0.77. The early-TA image-location claim (0.40), the flag relationship (0.14), the normal-world session timing report (0.35), the U-Boot measured-boot description (0.26), the Jetson measured-boot page (0.18), and a blog walkthrough of the early-TA build chain (https://sfeng-daydayup.github.io/posts/early-ta-of-optee/, jev weight 0.20) are all weak backing and labeled as such. The flag semantics and the Early-TA decision itself come from the source doc.
