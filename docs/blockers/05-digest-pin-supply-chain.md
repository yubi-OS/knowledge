# 05 - Digest Pin Supply Chain (B-PINS)

Scope: the base-image digest pinning discipline behind B-PINS, the package-floor checks it implies, and PINNED.md's role as the only live digest source.

Grounding spine: source doc `yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), row B-PINS.

## The blocker as stated

The register states that base-image digest changes require explicit PINNED.md updates and package-floor checks (source doc). The next step is to treat stale run-specific digests as historical evidence only (source doc). The root-cause class is supply-chain drift: base images move under the project (new upstream releases, digest churn), and every unmanaged digest change silently changes what the OS is built from.

The inconsistency log shows this discipline was earned, not assumed: the 2026-07-11 planning cycle found stale base-image digest examples in old TODO and run notes, and corrected them so PINNED.md is now called out as the only live digest source (source doc). That correction is what makes "stale run-specific digests are historical evidence only" a real rule: any digest seen in a run log is evidence of what that run did, never a source for what a future build should pull.

## Why digest pinning is the mechanism

A container image digest is the manifest hash that identifies content exactly. The supply-chain rationale is that the digest is the identity: any tampering, whether at the registry, on the CDN, or in flight, produces a different digest and the pull fails; this is the SHA-pinning model applied to containers, and SLSA Level 3 effectively requires it for the build base image (source: https://docs.ozarksecuritylabs.com/supply-chain/tier-2-hardened/container-image-digests/, jev weight 0.56).

SLSA frames the same requirement from the provenance side: provenance is verifiable information about software artifacts describing where, when, and how something was produced, and it must be present from the very beginning to trace software back to source and define the moving parts of a complex supply chain (sources: https://slsa.dev/provenance/, jev weight 0.79; https://slsa.dev/spec/v0.1/provenance, jev weight 0.81; https://slsa.dev/, jev weight 0.75). Digest pinning is the concrete act that ties a build to that provenance: a pinned digest is the unambiguous input that provenance describes.

## The yubiOS context: bootc images from a registry

The pinned digests in yubiOS are bootc-compatible base images pulled from registries such as quay.io. The mechanism these images follow is documented by Fedora and bootc upstream: a bootc image is built and pushed to a registry (the Fedora IoT bootc example walks through pushing to Quay.io with podman push, then queueing an update with bootc upgrade on a booted system) (sources: https://docs.fedoraproject.org/en-US/iot/fedora-iot-bootc-quay-example/, jev weight 0.76; https://docs.fedoraproject.org/si/iot/fedora-iot-bootc-quay-example/, jev weight 0.77, a language-mirror of the same page). bootc upstream describes the same model: bootable host systems using standard OCI/Docker containers as the transport and delivery format for base OS updates (sources: https://github.com/bootc-dev/bootc, jev weight 0.61; https://bootc.dev/bootc/booting-local-builds.html, jev weight 0.67). In that model, a digest change is a base OS change: whoever unpins or lets a digest drift has changed the kernel, systemd, and every package floor the image carries.

## Package-floor checks

The register couples digest changes to package-floor checks (source doc). The dependency logic is direct: a new base-image digest is a new set of package versions, and yubiOS maintains minimum supported versions for capabilities it depends on (for example, the composefs kernel floors tracked elsewhere in the project's docs). A digest bump can raise floors, keep them, or violate them; only a check after the bump tells the project which happened. B-PINS therefore treats the pair, digest pin update plus package-floor check, as one atomic operation, and BLOCKERS.md stays open until both are routine.

## The dependency-management lesson

B-PINS teaches that in an image-based OS, the base image is the single largest dependency the project has, and a digest is the only name that cannot drift. The register's discipline has 3 parts:

1. One source of truth: PINNED.md is the only live digest source; run logs are evidence, not configuration (source doc).
2. Explicit change: digest changes require a deliberate PINNED.md update, never an implicit re-pull (source doc).
3. Verified consequence: every digest change is paired with package-floor checks so the project knows what it actually inherited (source doc).

This is the same fail-closed instinct documented in B-RK3588-TPL, applied to the supply chain: when an input changes outside the project's control, the safe behavior is to stop and record, not to continue and hope.
