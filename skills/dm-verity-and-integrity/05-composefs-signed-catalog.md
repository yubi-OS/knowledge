# 05 - composefs signed digest catalogs and sysext/confext layering

**Scope:** how composefs layers multiple immutable /usr variants over a dm-verity base, what the signed catalog contains, why the signature is load-bearing, and when yubiOS reaches for it.

**Ground source:** yubi-OS/yubiOS `skills/dm-verity-and-integrity/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/dm-verity-and-integrity/SKILL.md). Claims marked "source doc" come from this file.

## The composition flow

The source doc gives the flow in five steps:

1. The /usr base image is dm-verity-protected.
2. A sysext image contains extra packages layered on /usr.
3. A confext image contains configuration layered on /etc.
4. composefs composes a signed catalog that lists the digests of (base, sysext, confext) and of the resulting composed /usr.
5. The kernel mounts the composed /usr via overlayfs (data-only) or via fs-verity.

The signed catalog is the load-bearing artifact: per the source doc, without it the composed /usr cannot be mounted. The catalog is signed with the yubiOS signing key.

## What composefs actually is

The upstream repository states the mechanism (weight 0.64, https://github.com/composefs/composefs): composefs combines several underlying Linux features to provide a flexible mechanism supporting read-only mountable filesystem trees stacked on top of an underlying lower filesystem. The key technologies are overlayfs as the kernel interface, EROFS for a mountable metadata tree, and optional fs-verity from the lower filesystem.

That maps directly onto the source doc's step 5: the "overlayfs (data-only)" mount is the overlayfs-as-interface half, and the fs-verity half shows up in how content is validated. The same repository documents the content-validation path (weight 0.61, same URL): composefs supports fs-verity validation of content files, where the digest of the content file is stored in the `trusted.overlay.metacopy` extended attributes, telling overlayfs to validate that the content file it uses has a matching enabled fs-verity digest. In other words, the catalog is not the only integrity carrier; individual content files can carry their own fs-verity digests that overlayfs re-checks at use time.

## Why the signature matters

The source doc's anti-pattern list includes "composefs without a signed catalog": an unsigned catalog can be swapped by an attacker, and the entire layering model breaks down. The reason is structural. A composefs catalog is a digest list; if an attacker can replace the digest list, they can point the composed /usr at content of their choosing, and no amount of dm-verity on the base image helps, because the attack modifies the composition metadata rather than the base blocks. The signature on the catalog is what closes that gap: mounting requires the catalog to verify against the yubiOS signing key.

bootc's experimental composefs documentation describes the boot integration (weight 0.60, https://bootc.dev/bootc/experimental-composefs.html): an unsealed composefs most commonly boots via a traditional `vmlinuz`/`initramfs.img` and a BLS boot entry, and a UKI built with `--allow-missing-verity` is also unsealed in this sense, so packaging as a UKI is a boot convenience and not by itself a security boundary. The security boundary lives in the verity/composefs validation chain, which is exactly the catalog signature in the yubiOS model.

## When yubiOS reaches for composefs

The source doc lists three triggers:

- Shipping a sysext image (for example a developer toolchain or GPU drivers) that should not require rebuilding the base image.
- Shipping a confext for a multi-tenant configuration, where different deploys share one base but carry different configs.
- Supporting `bootc switch` to a different /usr variant without re-running dm-verity over the full image.

The economics behind all three are the same: the base image is already verified once, the variant layers are small, and re-verification is per-layer digests rather than a full-image Merkle rebuild.

## Boundaries

- The composefs layer assumes the base /usr is already dm-verity-protected (source doc, step 1); composefs is not a substitute for the base verification.
- The yubiOS convention for kernel support floors for composefs (data-only overlayfs versus file-backed EROFS backing) is tracked in the `composefs-kernel-floors` skill rather than re-derived here (source doc references section).
- The composed result is a /usr, not a full root: /etc and /var remain mutable paths under their own mechanisms (fs-verity for selected /etc files, IMA audit for the rest, per the source doc).
