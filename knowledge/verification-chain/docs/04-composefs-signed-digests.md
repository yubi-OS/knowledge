# composefs signed digests: carrying verification into the runtime image

Scope: how composefs carries a signed digest list into the runtime image, its OverlayFS and EROFS backing modes, and its verity enforcement.

## What composefs is

The composefs project combines several underlying Linux features to provide a flexible mechanism to support read-only mountable filesystem trees, stacking on top of an underlying lower Linux filesystem (weight 0.88, https://github.com/composefs/composefs).

A bootc project writeup describes the stack in one line: composefs is EROFS + overlayfs + fs-verity, bringing together three kernel technologies to provide cryptographic verification of the entire filesystem (weight 0.77, https://bootc.dev/blog/2026-may-04-sealed-images-security-chain/).

Image-based OS projects build directly on it: composefs-os publishes OCI container images that boot directly via a composefs overlay filesystem (weight 0.72, https://github.com/henrywang/composefs-os), and the Linux Userspace API group exists to care about interop of image-based and/or immutable Linux distributions (weight 0.72, https://uapi-group.org/).

## Where the boot chain ends and composefs begins

Red Hat's sealed-images post states the handoff precisely: Secure Boot and a signed unified kernel image already verify the boot chain, bootloader, kernel, initramfs. Sealed images extend verification into the immutable OS image itself, with file-level precision, using composefs and fs-verity so that a cryptographic digest covers the OS content (weight 0.86, https://www.redhat.com/en/blog/how-sealed-images-red-hat-enterprise-linux-extend-os-integrity-boot-runtime).

This is exactly the boundary the yubiOS chain crosses: the UKI signature proves the kernel and its pinned root hash, and composefs takes over for the runtime filesystem.

## Digests at two levels

composefs supports fs-verity validation of the content files. When using this, the digest of the content files is stored in the image in the trusted.overlay.metacopy extended attributes, which tell overlayfs to validate that the content file it uses has a matching enabled fs-verity digest (weight 0.84, https://github.com/composefs/composefs).

A DeepWiki-generated walkthrough of the verification process describes three stages: at mount time, if the digest= option is specified, verify the EROFS image fs-verity digest; at file access, overlayfs reads trusted.overlay.metacopy to get the expected digest; and the kernel's fs-verity subsystem validates the content file matches that digest (weight 0.63, https://deepwiki.com/composefs/composefs/3.4-security-and-verification).

The mount options are documented as: digest=DIGEST validates the composefs image against the specified fs-verity digest before mounting and implies the verity option; verity requires all files to have valid fs-verity digests and needs kernel support for the overlayfs verity option on Linux 6.6 or later; tryverity enables fs-verity checking if supported (weight 0.17, https://deepwiki.com/composefs/composefs/2.2-mounting-images).

## Image sealing: one digest for the whole filesystem

Image sealing is the mechanism that makes a single anchor sufficient: composefs achieves whole-filesystem integrity verification through image sealing, a single cryptographic digest authenticating an entire filesystem, covering both file contents and metadata including directory structure, permissions, ownership, symlinks, and xattrs (weight 0.40, https://scrivano.org/posts/2026-06-05-sealing-with-composefs/). The same source organizes the full boot flow from EROFS image creation through runtime verification (weight 0.28, https://scrivano.org/posts/2026-06-05-sealing-with-composefs/).

## How the digest gets its authority

A composefs digest on its own is a claim, not a proof. In the yubiOS chain the digest travels in the signed UKI cmdline or is verified against the dm-verity-protected /usr, so the same owner-signed anchor that pinned the kernel pins the runtime image. Red Hat's framing makes the dependency explicit: sealed images extend the already-verified boot chain; they do not replace it (weight 0.86, https://www.redhat.com/en/blog/how-sealed-images-red-hat-enterprise-linux-extend-os-integrity-boot-runtime).
