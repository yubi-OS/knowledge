# 05 - Digest Rotation Incident History

Scope: the documented fedora-bootc:45 rotations, from the quay stream truncation of 2026-07-26 through the two re-resolutions of 2026-07-29 and 2026-07-30 to the stale 404 pin discovered 2026-09-18, as the failure-mode evidence base for the package-floor protocol.

## The rotation record

The base image `quay.io/fedora/fedora-bootc:45` rotated 3 times in 7 days, and a fourth rotation later went uncaught for roughly 44 days. The incident table (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 1, updated by section 9):

| Incident | Date | Change | Trigger |
|---|---|---|---|
| 1: OMN-139 stream truncation | 2026-07-26 | `sha256:f6b5b775...` re-resolved | quay.io stream truncation on the arm64 layer at 16,045,778 bytes; rebuilt via `fetch-fedora-bootc-manifest.yml` |
| 2: re-resolution 1 | 2026-07-29 | `sha256:f6b5b775...` to `sha256:1dcca7ac54b243bef0cf65bfca165fb4a514d7891854db216a4ab6cbc10215ff` | manual refresh via `fetch-fedora-bootc-manifest.yml`; commit `8ccffa71` |
| 3: re-resolution 2 | 2026-07-30 | `sha256:1dcca7ac...` (404 on quay.io) to `sha256:2d6f1df373be1423db91dd32a217b5d99fd4940d651fc1e2477b9b660e063906` | directive to re-run the fetch group CI; commit `d2646452` |
| 4: stale pin | discovered 2026-09-18 | pin `sha256:c7e6b357...` 404s on quay; the `:45` tag resolves a new index with 4 children (`0157de4d`/`ac6f851f`/`5c1a944b`/`62c290f5`) | pin stale approximately 44 days; next main image build fails at pull until re-resolution |

## Incident 1: upstream registry truncation

The first incident was not a version change at all but a delivery failure: quay.io truncated the arm64 layer stream at 16,045,778 bytes (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 1, incident OMN-139). The recovery was mechanical: re-run the fetch workflow so the manifest resolved cleanly and the image rebuilt. The floor-relevant lesson is that an incident whose trigger is a network failure still ends in a digest change, so the bump checklist applies even when the operator did not intend an upgrade.

## Incidents 2 and 3: planned re-resolution, then tag rot

The second and third incidents show the two digest-change modes a floating tag creates. On 2026-07-29 a manual refresh resolved the tag to a new manifest and committed it (commit `8ccffa71`). One day later the 2026-07-29 digest itself was gone: `sha256:1dcca7ac...` returned 404 on quay.io, and re-resolution produced `sha256:2d6f1df3...` (commit `d2646452`). The pattern is upstream tag movement: the `:45` tag is a mutable pointer, so any pin that tracks a tag inherits every upstream republish, and the digest a pin points at can vanish from the registry without warning.

The general mechanics are well documented. Tags are mutable pointers; digests are content-addressed and immutable, and digest pinning is the way to keep a name from repointing to different bytes (source: https://containers.codeguides.io/registries-supply-chain/tagging-and-immutability/, weak backing, jev weight 0.63). Tag immutability guarantees that an immutable tagged artifact cannot be deleted or altered through re-pushing, re-tagging, or replication (source: https://www.h2security.io/secure/registry-tags-never-move/, jev weight 0.54). Upstream registries do support the behavior the incidents exploit: quay handles Docker schema 1 and 2, OCI manifests, manifest lists, and multi-architecture manifests, with conversion logic between schema types (source: https://deepwiki.com/quay/quay/2.1-manifest-handling, weak backing, jev weight 0.69).

When a manifest disappears, the failure mode is visible in registry support channels: the Quay UI shows a "Manifest not found" error whenever manifest details are requested while the tags view still shows all tags and image sizes (source: https://access.redhat.com/solutions/7077254, jev weight 0.86). That split, tags present but manifests missing, is exactly the state a stale pin can be left in.

## Incident 4: the uncaught rotation

By 2026-09-18 the re-verification pass found a fourth rotation the protocol had been built to catch but had not: the Containerfile pin at commit `a6fbbdb9` was `sha256:c7e6b357...`, last refreshed by commit `959ead70` on 2026-08-05, and that manifest now 404s on quay while the `:45` tag resolves a new 4-child index. Three refresh commits had landed on 2026-08-01, 2026-08-04, and 2026-08-05, none after. The pin was stale for approximately 44 days, and the next main image build failed at pull until `fetch-fedora-bootc-manifest.yml` re-resolved (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 9; refs/fedora-bootc-digest-drift-check-2026-09-18.md).

The re-verification pass drew the operational conclusion directly: nothing in the protocol requires a release, the quay HEAD query and the manifest digest match are one-line curl checks, and the gap between design and execution is scheduling, not tooling (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 9). The linked issue OMN-62 had been listed Done in the round-7 records of the 2026-08-04 spec cycle, yet the failure it was written to catch recurred, which is the argument for a scheduled recurring resolution check rather than a one-time checklist (same source).

## What the four incidents establish

1. Digest changes arrive both intentionally (manual refresh) and unintentionally (truncation recovery, 404 recovery, silent tag drift), so verification must run on every rotation regardless of cause.
2. Each rotation is a floor re-test: kernel, systemd, bootc, and the package set all change with the bytes.
3. The pin itself can rot: a pinned digest can 404 upstream, so pin health must be checked on a schedule, not only at bump time.
4. A done checklist with no scheduled execution does not prevent recurrence; the enforcement has to be automated (see doc 08).
