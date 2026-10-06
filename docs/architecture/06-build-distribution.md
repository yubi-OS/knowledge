# 06. Build and distribution: two active build paths

Scope: the dual bootc and mkosi build paths, the OCI publication targets, the practical sealed composefs build flow, the partition layout, and the update model.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## The build-path table

The project keeps both build paths active (source doc):

| Path | Output | Purpose |
|---|---|---|
| bootc / OCI | docker.io/0mniteck/yubios:latest, <sha>, and test tags | Day-2 update stream and VM test source |
| mkosi | signed systemd-boot, UKI, and disk image | Installer validation plus retained ARM64 canonical unsigned-filesystem equality evidence; signature-bearing root and ESP wrappers are recorded separately |
| firmware OCI tags | firmware-qemu-arm64, firmware-rock5b-rk3588, firmware-rockpro64-rk3399, and per-commit variants | Variant-scoped ARM64 secure-world bundle publication |
| dev OCI tags | dev, dev-<sha> | TEST-only swu2f-enabled boot validation image |

## The practical sealed composefs build flow

The published image carries bootc 1.16.3 with a traditional kernel and initramfs layout, so the existing install workflow proves a strict composefs repository through an unsealed BLS entry. The production sealed target starts when the pinned base provides the released bootc v1.16.4 split capability and the repository has a Secure Boot VM proof (source doc).

The sealed build has four isolation boundaries (source doc):

1. Build and policy-check the exact rootfs, then run bootc container lint --fatal-warnings.
2. Move the raw kernel and initramfs out with bootc container split-kernel-and-rootfs --rootfs / --output /kernel.
3. Derive a clean final-rootfs stage with neither /kernel nor raw vmlinuz or initramfs.img; mount that tree at /target and the kernel-artifact tree at /kernel in a tools or signing stage.
4. Have bootc compute the composefs digest and pass it to ukify; sign the resulting UKI through the protected signing boundary and copy only the UKI into /boot/EFI/Linux/ in the final image.

The source doc includes the exact bootc container ukify invocation, where --kernel-dir belongs to bootc and everything after --, including --output, belongs to ukify; /target must be the same clean rootfs that becomes the final image, and every rootfs change produces a new composefs digest so the UKI must be regenerated and re-signed (source doc). Signing keys enter only as protected build secrets or through external signing infrastructure (source doc).

bootc's own documentation of the experimental composefs backend shows the same split and sealed-UKI Containerfile shape (https://bootc.dev/bootc/experimental-composefs.html, jev weight 0.41, weak backing), and the ukify integration module documents building UKIs by computing the necessary arguments from a container image and invoking ukify (https://bootc-dev.github.io/bootc/internals/bootc_lib/ukify/index.html, jev weight 0.43, weak backing). Red Hat's RHEL 10 documentation describes cryptographic sealing of bootc images as computing a digest of the root filesystem and embedding it in a signed UKI, providing end-to-end integrity (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/cryptographic-sealing-of-bootc-images-technology-preview, jev weight 0.51). A community CentOS bootc composefs reference implementation demonstrates the same rebuild-on-every-change discipline and warns that a plain dnf update inside the container without re-sealing would produce an image whose UKI digest no longer matches (https://github.com/rkollataj/centos-bootc-cfs, jev weight 0.08, weak backing).

## Install layout

The installer prepares a writable ext4 filesystem with the verity feature or a suitable Btrfs filesystem plus an ESP, then runs bootc install to-filesystem. The installed physical sysroot contains /composefs/{images,objects,streams} and /state/deploy: EROFS describes the immutable metadata, fs-verity authenticates the metadata and content objects, and writable /etc and /var state is assembled from /state. A signed systemd-boot and signed UKI authenticate the digest anchor. Full promotion also requires a Secure Boot boot test and a negative tamper test; offline installation alone cannot prove the seal (source doc).

## The mkosi partition image path

The separate mkosi DDI path ships a fixed partition set: ESP with systemd-boot and UKI, /usr A as read-only EROFS with dm-verity and a PKCS7 signature, the /usr A verity Merkle tree, and the /usr A signature partition. On first boot, systemd-repart creates /usr B (empty until first update), the root fs as LUKS2 Btrfs with FIDO2 enrollment sized to disk, per-user homed home filesystems, and encrypted swap (source doc). The systemd-repart manual describes repart as mostly incremental, growing existing partitions or adding new ones without shrinking, deleting, or moving, and intended to run on every boot (https://www.freedesktop.org/software/systemd/man/latest/systemd-repart.html, jev weight 0.47, weak backing).

## The update model

The update sequence recorded in the source doc runs: bootc upgrade fills /usr B (version yubiOS_0.y) with its verity and PKCS#7 signature partitions and the new UKI on the ESP; a boot counter of +3 allows a maximum of 3 boot attempts; systemd-boot's strverscmp picks the newest UKI and decrements the counter on each boot, falling back to yubiOS_0.x when the counter reaches 0; after boot, yubiOS-upgrade.service verifies health and runs bootctl set-boot-good, after which the counter is stripped and yubiOS_0.y becomes permanent (source doc). This is systemd's Automatic Boot Assessment model: boot counting plus bootctl set-automatically-revert or set-boot-good lets the system revert to the previous OS version when boots consistently fail (https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/, jev weight 0.27, weak backing). The A/B partition pattern is documented in the systemd-sysupdate ecosystem, where repart creates the images and sysupdate manages atomic updates (https://x86.lol/generic/2024/08/28/systemd-sysupdate.html, jev weight 0.2, weak backing).

## Pins and the base image

PINNED.md is the single source of truth for base-image digests and tool pins; run-specific digests in old workflow logs or historical ADRs are evidence, not evergreen requirements (source doc). The build chain from base to registry runs: fedora-bootc:45 digest-pinned base, Containerfile with yubiOS packages and usr/ overlay, docker buildx bake through yubiOS-bake.hcl, gated by yubiOS.rego OPA Build Policy (isCanonical plus dhi.io registry), producing the OCI image published as docker.io/0mniteck/yubios with latest plus immutable commit-sha tags (source doc). The registry output feeds three consumers: bcvk native-to-disk for physical disks, bcvk to-disk for qcow2 VM images, and bcvk ephemeral run with YubiKey passthrough for the CI and dev loop (source doc).
