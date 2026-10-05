# 04 - composefs digest boot argument

Scope: the composefs kernel command line contract: the strict `composefs=<128-hex SHA-512 digest>` form versus the optional `composefs=?` marker, what `--allow-missing-verity` means, and why a strict digest sitting in a mutable BLS entry is still an unsealed boot.

## Where the digest comes from

The composefs design embeds the rootfs identity in the kernel command line. Enable fs-verity on the composefs image and embed that image's digest in the kernel command line, which is what specifies the rootfs. Because composefs generation is reproducible, the digest can even be cross-checked against metadata generated when the image was built (weight 0.92, [composefs/composefs](https://github.com/composefs/composefs)).

bootc's implementation of this argument is small and explicit. The `make_cmdline_composefs` function creates a `composefs=` kernel command line argument from two inputs: `id`, the composefs object ID as a hex string, and `insecure`, which if true prepends `?` to make fs-verity verification optional (weight 0.65, [make_cmdline_composefs](https://bootc-dev.github.io/bootc/internals/composefs_boot/cmdline/fn.make_cmdline_composefs.html)). The surrounding module handles the kernel's simple quoting mechanism and provides functions to extract and create `composefs=` arguments with optional insecure-mode indicators (weight 0.59, [cmdline.rs source](https://bootc-dev.github.io/bootc/internals/src/composefs_boot/cmdline.rs.html)).

The hash behind the hex string is a SHA-512 digest: the composefs fs-verity support in bootc ships hash value types for both SHA-256 and SHA-512, and the bootc composefs path uses the SHA-512 form, whose hex encoding is 128 characters (weight 0.60, [composefs::fsverity](https://jmarrero.github.io/bootc/internals/composefs/fsverity/index.html)).

## The two integrity levels

The bootc composefs backend documentation states that the backend supports two distinct levels of integrity guarantee, controlled by whether fs-verity is strictly enforced on the root filesystem, which is decided by whether the image was built with `--allow-missing-verity` (weight 0.91, [composefs backend](https://bootc.dev/bootc/experimental-composefs.html)). In other words, `--allow-missing-verity` does not merely skip a check at build time; it encodes an explicitly unsealed composefs reference into the boot path. Production images must not pass it.

The same documentation draws the line that matters most for yubiOS: unsealed composefs most commonly boots via a traditional `vmlinuz` / `initramfs.img` pair and a BLS boot entry, but a UKI built with `--allow-missing-verity` is also unsealed. Packaging as a UKI is a boot convenience here, not by itself a sealing mechanism (weight 0.90, [composefs backend](https://bootc.dev/bootc/experimental-composefs.html)).

## Why strict digest plus BLS is still unsealed

This is the subtlety the yubiOS promotion gate hangs on. A boot entry containing the strict, no-question-mark `composefs=<digest>` argument does enforce fs-verity on the referenced tree at boot. But the argument itself lives in a Boot Loader Specification entry, which is an ordinary mutable file on the ESP or /boot. An attacker or a corrupted update that edits the BLS file can substitute a different digest, or a digest for a tree it controls, and the kernel will happily enforce verity against the wrong tree. The enforcement is strict; the anchor is not.

Sealing therefore requires that the digest reference itself be authenticated, which means it must travel inside a signed artifact: a UKI whose command line is covered by the Secure Boot signature. That is the composition the sealed flow depends on, and it is why a traditional BLS entry with a raw kernel and initramfs remains classified as unsealed even when its `composefs=` argument has no `?` (weight 0.91, [composefs backend](https://bootc.dev/bootc/experimental-composefs.html)).

## What CI should assert

Three assertions fall out of this contract, and each maps to an observable artifact:

1. The boot argument is the strict form: exactly `composefs=` followed by 128 hex characters, no `?` marker. The insecure form is the visible fingerprint of `--allow-missing-verity` (weight 0.65, [make_cmdline_composefs](https://bootc-dev.github.io/bootc/internals/composefs_boot/cmdline/fn.make_cmdline_composefs.html)).
2. No `root=` argument rides along. The composefs argument is what specifies the rootfs (weight 0.92, [composefs/composefs](https://github.com/composefs/composefs)).
3. The digest in the argument matches a measured fs-verity digest of a metadata image actually present under `/composefs/images`, not just a well-formed string (weight 0.60, [composefs::fsverity](https://jmarrero.github.io/bootc/internals/composefs/fsverity/index.html)).

And one classification rule: if the artifact is a BLS entry rather than a signed UKI, the honest result label is `unsealed-bls`. The strict digest alone does not upgrade the classification, because the digest anchor is still in mutable configuration.
