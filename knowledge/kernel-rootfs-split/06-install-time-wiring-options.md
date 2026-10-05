# 06 - Install-time wiring options

Scope: the Phase 2 problem of getting a prebuilt UKI installed at install time: mirroring bootc's secureboot-keys intake, a first-boot systemd unit, or bumping the base image to bootc v1.16.4+, with the tradeoffs of each.

## How bootc install handles boot assets today

bootc's install flow is opinionated: it takes the contents of the container image and installs them to a target block device, or an existing filesystem, in such a way that the system can boot; a Linux partition table and filesystem are used, and the bootloader and kernel embedded in the container image are also prepared (https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install.8.md, jev 0.92). The invocation of bootc install always runs bootupd to handle bootloader installation to the target disk, and the default expectation is that bootloader contents and install logic come from the container image itself in a bootc based system (https://github.com/bootc-dev/bootc/blob/main/docs/src/bootc-install.md, jev 0.93). Because the kernel already lives in /usr/lib/modules inside the image and is used to boot the machine (https://bootc.dev/bootc/, jev 0.83), everything the installer needs is in the image; what Phase 2 needs is a hook that lets a prebuilt UKI from outside the image be substituted at that moment.

The common provisioning path frames the deadline: while bootc supports installing a bootc container on top of an existing system, it is more common to convert a bootable container into a disk image such as ISO, raw, or qcow2 to provision a new system (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev 0.86). Whatever wiring mechanism is chosen must work in both the disk-image build path and the direct install path.

## Option A: mirror the secureboot-keys intake

bootc already has one image-provided install asset flow: drop-in files under /usr/lib/bootc/install, processed in alphanumerical order and merged into one final installation config (https://osbuild.org/docs/developer-guide/projects/osbuild/modules/stages/org.osbuild.bootc.install.config/, jev 0.70). The yubiOS research note observes that a parallel intake for BLS entries does not exist in bootc 1.16.3: there is no `/usr/lib/bootc/install/loader-entries/*.conf` mirror of the `/usr/lib/bootc/install/secureboot-keys` flow (source note: https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md). Option A is to patch bootc to add that intake path, so an image can ship a prebuilt UKI plus its BLS entry and have bootc copy both at install time, exactly as it already copies secure boot keys.

The advantage is symmetry: the secureboot-keys flow is the existing precedent for image-authored install-time assets, and the loader-entries flow would reuse its shape. The disadvantage is ownership: option A is a yubi-OS/bootc fork PR, so it carries upstream review and maintenance cost (source note, unweighted).

## Option B: a first-boot systemd unit

Option B keeps bootc unpatched: a yubiOS systemd unit that runs after install completes and invokes `usr/lib/yubiOS/uki/install-uki.sh`, which copies the prebuilt UKI to `/EFI/Linux/bootc/bootc_composefs-<digest>.efi` and writes the BLS `.conf` with the `uki` key (source note, unweighted). systemd already has a first-boot concept: systemd-firstboot can initialize basic system settings before or during the first boot of a newly created system (https://wiki.archlinux.org/title/Systemd-firstboot, jev 0.52, weak backing), so a first-boot unit is idiomatic territory.

The tradeoff the note names is timing: with option B the UKI is copied post-install, not at-install. And the A/B update path compounds this: A/B updates via systemd-sysupdate would need to call the same unit, so the mechanism has to work in two lifecycles (install and update), not one (source note, unweighted).

## Option C: bump the base image

Option C bumps the fedora-bootc base to a release carrying bootc v1.16.4 or later and adopts `bootc container split-kernel-and-rootfs` plus `bootc container ukify` as the sealed-flow enabler, per docs/ARCHITECTURE.md L244-278 (source note, unweighted; the split command's behavior is documented at https://bootc.dev/bootc/man/bootc-container-split-kernel-and-rootfs.8.html, jev 0.91). On this path the kernel-side artifact is produced by bootc itself, so the install-time substitution question largely dissolves.

The cost is release lag: option C is a Fedora rebuild that lags the v1.16.4 release by 1 to 2 weeks (source note, unweighted). systemd-boot itself is already present in the base: it ships with the systemd package, which is a dependency of the base meta package on typical distros, requiring no manual installation (https://wiki.archlinux.org/title/Systemd-boot, jev 0.85), so the loader side of option C is not the bottleneck.

## The recommended combination

The source note concludes that the right combination is likely (A) plus (C): patch bootc for the loader-entries intake, and bump the base so the split command exists, while (B) remains the fallback that avoids the fork. Neither (A) nor (C) is in scope for the Phase 1 PR; Phase 2 tracks them (source note, unweighted). mkosi's own behavior shows what at-install placement looks like when the builder controls it: a single UKI for the latest installed kernel is installed to EFI/BOOT/BOOTX64.EFI in the ESP during image build (https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, jev 0.72).
