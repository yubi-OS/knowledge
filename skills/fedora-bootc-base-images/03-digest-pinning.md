# 03 - Deriving yubiOS with digest pinning

Scope: how yubiOS derives from the Fedora standard bootc image, why digest pinning is mandatory, and the exact commands used to pin and verify the base image.

Ground source: `yubi-OS/yubiOS skills/fedora-bootc-base-images/SKILL.md`. This doc explicates the source doc's "yubiOS base image" section.

## The pinning rule

The source doc is unambiguous: yubiOS derives from Fedora standard and "Always pin to digest" (source doc). The derivation starts from a Dockerfile line of this shape (source doc):

```dockerfile
FROM quay.io/fedora/fedora-bootc:42@sha256:<digest>
LABEL containers.bootc 1
```

Two elements matter in that line. First, the tag (`42`) is kept in addition to the digest, so a human reading the Containerfile can tell which Fedora release the digest belongs to; the digest is what the build actually resolves to. Second, the `LABEL containers.bootc 1` declaration is part of the derived image contract that marks the result as a bootc image (source doc).

## Why pinning matters for a derived OS

A derived bootc image inherits its entire userspace, kernel, and boot stack from the base image. If the base reference floats, 2 builds of the same Containerfile on different days produce different operating systems, and an upstream rebase can change the boot chain silently. Digest pinning makes the base a fixed input: `@sha256:<digest>` resolves to one immutable artifact.

This is also where the skill connects to yubiOS's immutability primitive. The source doc's own immutability coverage note states that "digest pinning is the immutability anchor for the derived yubiOS image" and that yubiOS's immutability stack composes dm-verity on /usr, the composefs signed catalog, sysext overlays, and IMA appraisal on top of that pinned base (source doc). In other words, everything above the base image assumes the base cannot shift underneath it.

## Getting the current digest

The source doc gives the exact command for reading the digest of a tag before pinning it (source doc):

```bash
skopeo inspect --format '{{.Digest}}' docker://quay.io/fedora/fedora-bootc:42
```

Skopeo is the tool for "manipulating, inspecting, signing, and transferring container images and image repositories on Linux systems, Windows and MacOS" (https://www.redhat.com/en/topics/containers/what-is-skopeo, jev weight 0.75). Its inspect output carries a `Digest` field in `sha256:...` form; the upstream skopeo documentation shows exactly that shape for a Fedora registry image, for example `"Name": "registry.fedoraproject.org/fedora", "Digest": "sha256:0f65bee..."` (https://github.com/podman-container-tools/skopeo, jev weight 0.73). The digest returned by inspect is what goes into the `FROM` line.

The pinning workflow is therefore: inspect the tag, record the digest, commit the digest into the yubiOS Containerfile, and let the next rebuild resolve against that fixed artifact. A tag is only ever a label; the digest is the contract.

## The artifact pattern for derived images

Fedora's own documentation for building derived bootc images describes the "artifact pattern", where a custom bootc image references other container images as reusable components so software pieces can be managed independently across multiple container images instead of duplicating configuration in each (https://docs.fedoraproject.org/en-US/bootc/building-containers/, jev weight 0.93). yubiOS's single `FROM` with a pinned digest is the simplest instance of that pattern: the base image is one referenced artifact, the yubiOS layer is another.

## What the derived layer must own

Because the base is pinned, everything yubiOS-specific must be added explicitly in the derived layer rather than inherited by drift. The source doc's package-set section (explicated in doc 04) lists the YubiKey tooling, FIDO2 PAM stack, and cloud agents as items the standard tier does not include and yubiOS must add (source doc). Pinning is what makes those additions auditable: a diff against the pinned digest is the complete set of changes yubiOS introduces.

## Verification discipline

Two checks keep the pin honest over time. One, confirm the digest recorded in the Containerfile still matches the tag you believe you are tracking whenever you deliberately move the pin, using the same skopeo inspect command. Two, when upstream publishes a new digest for the same tag, treat that as an upstream event to review (doc 07), not an automatic upgrade. The source doc's upstream tracking section exists precisely because a floating pin would make that review impossible (source doc).
