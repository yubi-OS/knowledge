# 05 - Build pipeline seams

Scope: where the kernel+rootfs split touches the yubiOS build system: the new yubios-uki bake target, the Containerfile.uki FROM scratch pattern, the CI extraction step, and the bootc install config kargs.

## Multi-target publication with buildx bake

Publishing a second artifact from the same build graph is exactly what docker buildx bake exists for. Bake reads declarative HCL or compose configurations and builds multiple targets from one definition, and it supports the same build features as buildx build, including attestations and multi-platform output (https://docs.docker.com/reference/cli/docker/buildx/bake/, jev 0.95; https://docs.docker.com/guides/bake/, jev 0.93). The yubiOS build already uses a `yubiOS-bake.hcl` graph for its existing targets, so adding a `yubios-uki` target means the split artifact rides the same declarative build as the installer and OS image targets rather than gaining a separate build path (source note: https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md).

Per the source note, the new bake target publishes `docker.io/0mniteck/yubios:uki-<sha>-<arch>` as a tiny OCI image containing three files: /usr/lib/yubiOS/uki/yubios.efi, /usr/lib/yubiOS/uki/ci-secure-boot-cert.pem, and /usr/lib/yubiOS/uki/MANIFEST.txt. The tag follows the existing per-artifact tag scheme so registry consumers address the kernel artifact the same way they address installer and latest.

## The FROM scratch container pattern

The `Containerfile.uki` is built with a `FROM scratch` stage plus `COPY --from=uki-context / /usr/lib/yubiOS/uki/`, where the uki-context is the prepared inst/uki/ payload from the CI job. The source note says this pattern was lifted from the existing `installer` target, which uses the same FROM scratch plus COPY /installer/ shape (source note, unweighted). A scratch-based OCI image is the right shape for an artifact container: there is no base layer to pull, no userspace to scan, and the image is nothing more than a stable, digest-addressable envelope for the signed PE and its verification material.

## CI extraction

The `ci_mkosi-installer.yml` workflow builds the mkosi minimal disk image, mocks the YubiKey PIV slot 9c signing with SoftHSM PKCS#11, verifies the result with sbverify, and publishes the installer as `installer-<sha>`. For the split, the workflow is extended: the "Assemble /installer payload + MANIFEST" step additionally copies the signed UKI and cert into `inst/uki/` and writes a MANIFEST.txt, and a new bake step publishes the `yubios-uki` target via `docker buildx bake --file yubiOS-bake.hcl yubios-uki` (source note, unweighted).

## Install config: where kargs enter

The other seam is the bootc side. The bootc install process supports basic customization through configuration files in TOML format, discovered via drop-in files in /usr/lib/bootc/install that are processed in alphanumerical order and merged into a single final installation config (https://osbuild.org/docs/developer-guide/projects/osbuild/modules/stages/org.osbuild.bootc.install.config/, jev 0.70; same contract at https://jmarrero.github.io/bootc/man/bootc-install-config.5.html, jev 0.69). yubiOS ships its own drop-in at `usr/lib/bootc/install/50-yubiOS.toml` (bootloader=systemd, block=direct, rootfs=ext4), and the split work adds `[install] kargs = ["root=dissect", "mount.usr=dissect", "rw", "audit=0"]` so that bootc's auto-generated UKI carries the same command line as the mkosi-built UKI (source note, unweighted).

The kernel-argument model on the bootc side reinforces this approach: kargs.d files included in a container build are applied after installation, and the difference between the kernel argument sets is applied to the current boot loader configuration while preserving machine-local kernel arguments; the /boot/loader/entries files are in a standardized format that any tool can edit (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-kernel-arguments-in-bootc-systems, jev 0.89). Declaring the dissect-style kargs in the install config therefore lands them in the generated boot entry at install time, which is the earliest and most stable point in the lifecycle.

## What stays untouched in Phase 1

The source note is explicit about the blast radius: the Containerfile that builds the bootc OCI image and the Containerfile.dev variant are unchanged, and the mkosi.conf tree is unchanged. Phase 1 changes only the publication surface (bake target, Containerfile.uki, CI extraction) and the install config kargs (source note). This keeps the monolithic bootc image intact while the split artifact becomes available in parallel, deferring the deeper install-time wiring to Phase 2 (doc 06).
