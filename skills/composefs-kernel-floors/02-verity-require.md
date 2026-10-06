# 02 verity=require: the kernel 6.6 floor

Scope: the kernel 6.6 floor for the overlayfs verity mount option, what it enforces at mount time, and the exposure when it is absent.

## The floor in the source doc

The source doc (yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md) places the second floor at 6.6 for the verity=require mount option. Per the source doc, verity=require tells the kernel to refuse to mount the overlay if the composefs catalog is not signed by a trusted key; without it, the catalog is informational only and the kernel will mount an unsigned composefs layer. yubiOS compiles the trusted composefs-signing public key into the kernel, and systemd-dissect passes the key and the verity=require flag at mount time. These are source-doc claims.

## Upstream version evidence for 6.6

The mount.composefs manual page states the verity option needs support for the overlayfs "verity" option in the kernel, which was added in 6.6rc1 (https://www.mankier.com/1/mount.composefs, weight 0.21, weak backing; the same man page mirrored at https://manpages.opensuse.org/Tumbleweed/composefs/mount.composefs.1 scored 0.82). The same man page also records that composefs uses an EROFS image file to store metadata, which anchors the EROFS-plus-overlayfs shape used later in this corpus.

## What verity=require enforces, per the digs

The bootc project's sealed-images writeup describes the enforcement directly: the overlayfs verity=require mount option tells the kernel to enforce that every file served through the mount has an fs-verity digest matching what the EROFS metadata expects, and fs-verity is the kernel feature providing per-file integrity verification (https://bootc.dev/blog/2026-may-04-sealed-images-security-chain/, weight 0.57). The composefs repository adds the mechanism: composefs supports fs-verity validation of content files, with digests stored in trusted.overlay.metacopy extended attributes that tell overlayfs to validate (https://github.com/composefs/composefs, weight 0.87).

LWN's 2022 composefs article adds the anchoring pattern: the fs-verity digest of the image file can be retrieved from a secure location, for example a signed kernel command line, and passed to the mount command so composefs can ensure the integrity of the entire tree (https://lwn.net/Articles/917097/, weight 0.63). The bootc composefs backend documentation describes the same seal: the digest is baked into the kernel command line of a UKI and required to match at boot (https://bootc.dev/bootc/experimental-composefs.html, weight 0.74).

## Dated correction note (2026-10-06)

The source doc frames verity=require as refusing to mount when the composefs catalog is not signed by a trusted key. The upstream framing surfaced by the dig is per-file digest enforcement: the EROFS image (trusted via its own fs-verity) specifies what digest each file must have, and the kernel enforces it at access time; a composefs-focused writeup calls this secure mode, where every file access is cryptographically verified (https://scrivano.org/posts/2026-06-05-sealing-with-composefs/, weight 0.28, weak backing). These framings are compatible (the signed catalog is the metadata layer; the enforcement is per-file), but an implementer reading only the source doc could over-trust mount-time signature checking alone. The upstream mechanism is the stronger guarantee and the source doc's "signed catalog" wording should be read through it. Recorded here as a dated correction with dig sources.

## The exposure without 6.6

Per the source doc, on a kernel older than 6.6 the catalog is informational only: an unsigned or tampered composefs layer can be mounted. Combined with the 6.5 floor (data-only OverlayFS), the practical minimum for a composefs deployment that enforces integrity is 6.6, which is exactly the tier the yubiOS convention assigns to its LTS channel (see doc 05).

## Sources used in this doc

- https://github.com/composefs/composefs (weight 0.87)
- https://manpages.opensuse.org/Tumbleweed/composefs/mount.composefs.1 (weight 0.82)
- https://bootc.dev/bootc/experimental-composefs.html (weight 0.74)
- https://lwn.net/Articles/917097/ (weight 0.63)
- https://bootc.dev/blog/2026-may-04-sealed-images-security-chain/ (weight 0.57)
- https://www.mankier.com/1/mount.composefs (weight 0.21, weak)
- https://scrivano.org/posts/2026-06-05-sealing-with-composefs/ (weight 0.28, weak)
- Source doc: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md
