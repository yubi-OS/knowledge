# 06 - Direct workflow downloads: wcurl payloads and the SHA-512 gate

Scope: bumping directly downloaded CI payloads (static Docker binaries, buildx releases): URL updates per platform, mandatory SHA-512 recomputation, and the strict-check failure behavior.

## The pin pair: URL plus hash

Direct workflow downloads are pinned as a pair: an artifact URL and a SHA-512 hash recorded next to it. The yubiOS table lists platform rows separately (`linux/amd64` and `linux/arm64`), and a version bump must update both, not just the one platform the bumper happened to test (yubiOS refs: digest-bump-checklist-2026-07-25.md). The hash is the verification half of the pin: the URL says what to fetch, the hash says what is allowed to arrive.

This pairing is the standard integrity pattern for downloaded artifacts. Kubernetes' release documentation walks through verifying binary artifacts by their recorded checksums and signatures before installation, treating the checksum step as part of the download procedure rather than an optional extra (https://kubernetes.io/docs/tasks/administer-cluster/verify-signed-artifacts/, jev weight 0.66). Maven's resolver documentation is more precise about the limit: checksums retrieved over the same transport as the artifact provide integrity verification only, and do not by themselves establish that the checksum is trustworthy or protect against a man-in-the-middle on both (https://maven.apache.org/resolver/about-checksums.html, jev weight 0.73). That limit is why the hash is recorded in the repo rather than fetched next to the artifact: the pin's authority comes from the repo, not the download.

## The wcurl convention

The fetch tool is `wcurl`, a curl wrapper that picks sane defaults for downloading files so the caller does not have to remember the parameter set (https://github.com/curl/wcurl, jev weight 0.71). Using a wrapper rather than raw curl in the workflow keeps the download command uniform across payloads, which makes the record in the pinned-downloads table readable as a specification: same tool, same options, different URL and hash.

## The strict gate

The yubiOS policy statement is unambiguous: "Every `wcurl` request must be followed by a matching `sha512sum --check --strict` verification before the payload is consumed" (yubiOS refs: digest-bump-checklist-2026-07-25.md). Two properties of that command matter. `--strict` makes any malformed checksum file a failure rather than a silent skip of uncheckable lines, so a half-updated checksum table fails loudly. And the check runs before consumption, not after: a hash mismatch stops the payload from ever being used by the build.

The consequence for the bumper is mechanical: a version bump without a matching hash update will fail the check at build time. The checklist's phrasing is "correct behavior, but confirm it's not skipped," which targets the real hazard: someone noticing the red build and marking the checksum step as skippable to get green, rather than recomputing the hash of the artifact they actually intend to ship (yubiOS refs: digest-bump-checklist-2026-07-25.md).

## SHA-512 versus SHA-256 in this context

The table pins SHA-512 rather than the more common SHA-256. For integrity checking of downloaded payloads, both are collision-resistant choices; the practical differences are tooling and convention. `sha512sum` is part of coreutils and works identically across the Linux CI images these payloads are consumed in, and practitioner writeups of binary checksum verification in CI describe the same detect-verify-execute pattern regardless of digest strength: detect the architecture, select the correct recorded hash, download, verify, and only then make the binary executable, with a verification failure stopping the build entirely (https://brandonwie.dev/posts/binary-checksum-verification, jev weight 0.48, weak backing). The yubiOS choice of 512 is a consistency decision, and the checklist's point is that the hash length does not matter if the recompute step is skipped.

## The buildx cross-reference

The table's special case is `docker/buildx`: its release version appears both here as a downloaded payload with a SHA-512 and in the External GitHub Source Refs table as a pinned source commit. A buildx version change requires updating both tables in the same PR (yubiOS refs: digest-bump-checklist-2026-07-25.md). The reason is traceability in both directions: the source commit explains what code the binary was built from, and the hash proves the binary fetched is the official artifact for that release. Updating one without the other leaves the repo claiming a version whose two halves disagree.

## The checklist items, in order

1. Identify every platform row for the artifact being bumped; both `linux/amd64` and `linux/arm64` rows need the new URL.
2. Download the new artifact once, compute its SHA-512, and update the recorded hash for each platform row in the same change.
3. If the artifact is a buildx release, apply the same version to the External GitHub Source Refs table in the same PR.
4. Run the build once and confirm the `sha512sum --check --strict` gate passes against the recorded hashes; investigate any failure rather than skipping the check.

The unit of change here is the pair, and the gate is the proof. A PR that updates URLs without hashes, or hashes without URLs, or one platform without the other, is incomplete by construction, and the checklist exists so the reviewer can reject it on sight rather than debug it in CI.
