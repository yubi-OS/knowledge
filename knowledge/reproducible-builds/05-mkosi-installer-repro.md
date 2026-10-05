# 05 - mkosi installer reproducibility

Scope: reproducibility controls for source-derived OS installer images built with mkosi, covering the tool's model, the epoch and seed inputs, initrd determinism, and how a canonical manifest gate turns them into an executable test.

## What mkosi is

mkosi is a tool for building bespoke OS images, described by its own project as a fancy wrapper around dnf --installroot, apt, pacman and zypper that generates customized disk images with a number of bells and whistles (weight 0.51, https://github.com/systemd/mkosi; corroborated by the project site at weight 0.67, https://mkosi.systemd.io/). The ArchWiki adds a property that matters for CI: it can build images as an unprivileged user via no_new_privileges (weight 0.85, https://wiki.archlinux.org/title/Mkosi). An installer build that can run rootless in the same pinned environment as CI is the precondition for any equality claim between two such builds.

## Pinning the toolchain itself

The tool being deterministic is not enough; the tool's own version must be pinned. The edgelesssys reproducible-mkosi repository demonstrates the approach: it uses Nix to pin mkosi and its required tools, and builds bit-by-bit reproducible OS images (weight 0.73, https://github.com/edgelesssys/reproducible-mkosi). For an OS image contract this is the lesson: the installer build inputs include the installer tool and everything it invokes, and reproducibility requires those to be part of the pinned closure rather than resolved from the network at build time.

## Epoch, seed, and the installers' deterministic inputs

The yubiOS refs doc on reproducible build contracts specifies the mkosi installer inputs as: commit epoch, architecture-scoped deterministic seed, no incremental cache, and dracut reproducible mode, with a fixed zstd worker count, normalized payload metadata, and sorted SHA-256 records, plus finalize-time removal of the ldconfig auxiliary cache (per the yubiOS refs doc, 2026-07-22; not independently verified in this dig). The externally grounded rationale for each group: the epoch seed comes from the SOURCE_DATE_EPOCH convention of pinning timestamps to a specific value (weight 0.90, https://github.com/moby/buildkit/blob/master/docs/build-repro.md), the no-cache and fixed-worker rules remove run-dependent state, and sorted digest records make the manifest itself order-stable.

## The initrd

The initrd is part of the equality subject. dracut is the tool that generates it: it can generate a generic initramfs image in its default mode, one that starts only with the device name of the root file system or its UUID and must discover everything else at boot time (weight 0.74, https://www.kernel.org/pub/linux/utils/boot/dracut/dracut.html). dracut builds the initramfs with a modular approach; all of its builtin modules are located under /lib/dracut/modules.d and can be listed with dracut --list-modules (weight 0.64, https://wiki.archlinux.org/title/Dracut). The yubiOS contract requires dracut reproducible mode and an exact initrd digest in the equality gate (per the yubiOS refs doc, 2026-07-22), meaning the initrd is not merely recorded but is a blocking comparison subject.

## The canonical manifest gate

The yubiOS installer gate runs a second clean ARM64 build and requires an exact canonical manifest before publication. The manifest covers unsigned root filesystem bytes, modes, ownership, mtimes, hardlinks, symlinks, devices, and xattrs, plus exact initrd and package-manifest digests (per the yubiOS refs doc, 2026-07-22). The design point that generalizes: the equality subject is a canonical, sorted representation of everything that should be deterministic, and the gate fails the publication if the two builds disagree on any covered field. JSON evidence of the comparison is retained for 30 days.

## What stays outside the claim

The same gate deliberately excludes key-bound bytes. The installer creates a fresh non-production SoftHSM RSA key and certificate in each build, so the certificate, the root-resident signed systemd-boot binary, the signed UKI, the ESP, and the complete disk wrapper are recorded in both builds but excluded from equality. The systemd-boot path, mode, ownership, mtime, size, and xattrs remain equality subjects; only its key-bound content differs. Btrfs 7.0 additionally generates separate device, chunk-tree, and root UUIDs and stamps the root item at mkfs time, so the raw partition serialization is also recorded rather than used as an equality oracle. Canonical file bytes and intended POSIX/xattr metadata, the initrd, and the package manifest remain blocking equality subjects (all per the yubiOS refs doc, 2026-07-22; the btrfs behavior is treated in detail in doc 07).

The boundary is the point: an installer gate that demanded equality on signature-bearing bytes would force the build to reuse keys, which defeats the key-hygiene goal. Recording the excluded bytes with their digests keeps them auditable without pretending they are deterministic.
