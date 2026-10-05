# 08. Pin drift and staleness

Scope: what happens to a digest pin after a bump, the drift events recorded for the v261 pin, how the registry exposes tag history for diagnosis, and who owns re-resolution.

## The drift events on record

The source ref records two drift-related events for the v261-era pin (source ref, no external weight for the internal events):

1. A 2026-09-18 drift check, part of wayfinder round 8 cycle 64, found the pin stale, with the pinned digest 404 on quay, and classified the finding as additive rather than a material change to the bump record.
2. The 2026-09-29 refresh confirmed the drift concretely: the upstream `quay.io/fedora/fedora-bootc:45` tag had moved since the pin, resolving to a different index digest with a last-modified of 2026-09-29, while the pin held a digest re-resolved on 2026-08-05. The same registry snapshot showed a `:46` tag alongside the existing streams, all refreshed 2026-09-29.

The verdict recorded alongside those findings is the governance rule: `PINNED.md` remains the source of truth, and re-resolution goes through `fetch-fedora-bootc-manifest.yml`, never through copying a digest from the doc (source ref, no external weight; the pin-file discipline itself is backed in doc 02).

## Why pins drift

A digest pin freezes the consumer's reference, not the upstream tag. The tag is mutable: the registry advances it as new builds ship, and the previously pinned digest stops matching the tag's current content (https://safeguard.sh/resources/blog/container-image-digests-vs-tags-why-pinning-matters, noul 0.57). On a fast-moving base like `fedora-bootc`, the versioned tag is rebuilt continuously, so a pin re-resolved on one date is stale by construction some time later. Drift is therefore the expected steady state, not an anomaly; the anomaly would be a pin that stays accurate indefinitely.

## What the registry gives you for diagnosis

Quay.io exposes tag history. The Quay documentation describes a time machine feature that keeps older image tags available for set periods so changes can be reverted (https://docs.redhat.com/en/documentation/red_hat_quay/3.12/html/about_quay_io/image-tags-overview, noul 0.82), and the tag operations guide documents a "View Tags History" action that displays each image a tag pointed to in the past and when it pointed there (https://docs.quay.io/guides/tag-operations.html, noul 0.89). The same history view supports reverting a tag to a previous image or permanently deleting it (https://docs.redhat.com/en/documentation/red_hat_quay/3.10/html/about_quay_io/working-with-tags, noul 0.79). For a stale-pin investigation, this is the evidence surface: it shows when the tag moved relative to when the pin was taken. The quay project itself is actively developed, with a public release stream (https://github.com/quay/quay/releases, noul 0.97).

## Drift detection as a discipline

A pin needs a detection mechanism, not just a refresh mechanism. Container drift concepts exist at two levels and they should not be conflated:

1. Reference drift: the pinned digest no longer matches the upstream tag's current content. This is the v261 case, and it is detected by re-resolving the tag against the pin on a schedule (doc 03).
2. Runtime drift: a running workload differing from its image content, detected by security tooling such as Microsoft Defender for Cloud's binary drift detection, which alerts when the running container workload differs from the image workload (https://learn.microsoft.com/en-us/azure/defender-for-cloud/binary-drift-detection, noul 0.58, weak backing and a different layer from reference drift).

The 2026-09-18 finding is an example of level 1 detection working as designed: a periodic check noticed the pin was stale, the finding was recorded and classified, and ownership was assigned to the pin-resolution audit rather than patched ad hoc into the bump doc.

## Ownership of re-resolution

The recorded rule assigns re-resolution to the dedicated workflow and the audit that tracks it, and explicitly forbids copying digests from docs into the pin. That ownership split is what keeps the drift loop honest: the drift check detects, the refresh workflow proposes, the review merges, and the pin file alone carries the result. As of the last recorded refresh, the pin remained stale relative to the upstream 2026-09-29 tag state, so re-resolution through the workflow is the standing follow-up item (source ref).
