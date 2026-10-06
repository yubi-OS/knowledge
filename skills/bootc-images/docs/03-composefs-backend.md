# 03 - The composefs backend: a read-only EROFS root

Scope: enabling composefs in prepare-root.conf, what `enabled = true` and `enabled = verity` mean, and the kernel requirement behind the EROFS root.

## What composefs changes

Without composefs, a bootc deployment boots a traditional root where OSTree manages hardlinked files and the kernel enforces read-onlyness only as a best effort. With composefs, "the entire / is a read-only EROFS image" (source doc: yubi-OS/yubiOS skills/bootc-images/SKILL.md). The booted root stops being a mutable directory tree and becomes an image-like object assembled at boot from the deployment's content.

The composefs project describes the mechanism as combining "several underlying Linux features to provide a very flexible mechanism to support read-only mounts with full data and metadata verification" (github.com/composefs/composefs, w=0.54). The OSTree project documents composefs integration for exactly this purpose: verified, immutable boots of content-managed trees (ostreedev.github.io/ostree/composefs/, w=0.80).

bootc's own documentation treats the composefs backend as the modern image layout, booting via a traditional vmlinuz/initramfs pair or a UKI (bootc.dev/bootc/experimental-composefs.html, w=0.84). Unsealed composefs boots through the traditional layout are the common case; UKI-based sealed boots are the stronger variant.

## Enabling it

The enablement is a config file in the image:

```ini
# /usr/lib/ostree/prepare-root.conf
[composefs]
enabled = true
```

(source doc). The file is part of the image content, so enabling composefs is a build-time decision baked into every deployment derived from the image, not a boot-time toggle.

## Verity mode

For maximum integrity, the stronger setting is:

```ini
[composefs]
enabled = verity
```

(source doc). Two constraints from the source doc govern when this is safe:

1. `verity` mode errors at install time if the target filesystem does not support fsverity. Installation fails loudly rather than silently degrading, which is the correct behavior, but it means verity mode requires checking the target filesystem before rollout.
2. Verity does not cover /etc or /var. The mutable and merged trees sit outside the verified root by design; they are covered by other integrity mechanisms in the yubiOS stack (IMA appraisal and dm-integrity per the dm-verity-and-integrity skill, not by composefs).

## Kernel requirement

The EROFS root requires `CONFIG_EROFS_FS` in the kernel the image ships (source doc). The EROFS filesystem project is upstream kernel work with its own documentation tree (erofs.docs.kernel.org, w=0.47, weak), and modern distribution kernels ship it enabled; the requirement matters most for custom or stripped kernels where the config may have been dropped. yubiOS builds on distribution kernel packages, which include EROFS support.

The composefs-kernel-floors skill records the version floors for yubiOS: kernel 6.12+ for file-backed EROFS as the composefs backing store, 6.6+ for the verity=require mount option, 6.5+ for data-only OverlayFS. The source doc's CONFIG_EROFS_FS requirement is the floor beneath those floors.

## Why yubiOS defaults it on

The immutability invariant yubiOS maintains is "/usr is immutable at every boot" (source doc). composefs is the mechanism that makes this structural rather than advisory: the root is mounted read-only from an EROFS image assembled from verified content, so a modified /usr is not "discouraged", it is not even representable in the booted tree. This composes with the rest of the stack: dm-verity on /usr volumes, signed composefs catalogs, and sysext overlays on top of the verified base.

## Practical notes

- Keep `enabled = true` as the yubiOS default and reserve `enabled = verity` for targets whose filesystem support is verified; the install-time error is a feature, but it turns rollout into a hardware-audit problem (source doc).
- The transient /etc option lives in the same prepare-root.conf ([etc] transient = true) and pairs with composefs; doc 04 covers its semantics (source doc).
- Do not confuse the bootc composefs setting with standalone composefs tooling; the enablement point for bootc systems is prepare-root.conf, not mount units (source doc; ostreedev.github.io/ostree/composefs/, w=0.80).
