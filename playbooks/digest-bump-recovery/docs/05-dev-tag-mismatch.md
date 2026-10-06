# 05 - Adjacent case: dev tag / short-SHA mismatch

Scope: the adjacent failure the playbook records, a fresh digest whose dev image will not resolve because the `dev-<short-sha>` tag points at a pre-bump build, and the fix plus the resolve-to-digest discipline that handles it.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. External mechanisms (skopeo manifest inspection, tag-vs-digest semantics) are grounded in searXNG digs with URL and jev weight; sub-0.5 results are labeled weak backing.

## The failure shape

The source doc frames this as an adjacent case to the stale-digest recovery: a fresh digest is in place, but the dev image will not resolve (source doc). The cause is a stale pointer rather than a dead registry object: the `dev-<short-sha>` tag points at a pre-bump build (source doc). In other words, the bump commit (doc 02) fixed the `Containerfile` pin, but the dev tag that VM dispatches consume was produced by an earlier build and still names bytes built from the old pin.

A general troubleshooting writeup describes the same class: a digest mismatch where pulling an image by tag yields bytes that do not match the digest the pipeline expects (https://www.codegenes.net/blog/dockerhub-sha-digest-doesn-t-match/, jev weight 0.12, weak backing). A CI-focused post describes git-SHA-tagged images as the fix pattern for pipeline resolution failures (https://nlhmag.co.uk/2026/07/13/fix-docker-ci-pipeline-git-sha/, jev weight 0.10, weak backing). The yubiOS case is the inverse dependency: the short-SHA tag is exactly the thing that went stale.

## The fix: commit 95565a0e

The fix landed 2026-07-30 in commit `95565a0e`, titled "ci(workflows): also push dev-<short-sha> tag in merge-manifest (fixes OMN-149 verify pull)" (source doc). Mechanically it added a third `-t "$DEV_SHORT_SHA_TAG"` flag, with the tag value derived from `${GITHUB_SHA:0:8}`, to the `merge-manifest` step of `ci_dev_image.yml` (source doc). The effect: every merge-manifest run now pushes a dev tag keyed to the exact commit head that produced it, so a build at the new head carries a dev tag matching that head. This is the third tag alongside the existing dev tag push in that step (source doc).

## The discipline: resolve to a digest, pass the digest

The playbook's remaining instruction for this case is a resolution rule: resolve to a digest and pass the digest, not the tag, to VM dispatches (source doc). The command it records:

```bash
skopeo inspect --raw docker://docker.io/0mniteck/yubios:dev-<short-sha> | sha256sum
```

(source doc)

The mechanics ground in the dig results. `skopeo inspect --raw` returns the raw manifest for an image reference; the skopeo manpage documents that inspect output includes the top-level manifest Digest among low-level image information (https://man.archlinux.org/man/skopeo-inspect.1.en, jev weight 0.50, and https://github.com/podman-container-tools/skopeo/blob/main/docs/skopeo-inspect.1.md, jev weight 0.29, weak backing). Hashing the raw manifest with sha256sum recovers the digest bytes directly. The OCI image spec defines the digest as the REQUIRED content identifier, with retrieved content SHOULD being verified against that digest (https://specs.opencontainers.org/image-spec/descriptor/, jev weight 0.66, high), which is exactly what this pipeline does: it verifies the tag's content and then hands downstream consumers the digest, the immutable identifier, instead of the mutable tag.

The reason to prefer the digest downstream is the standard tag-vs-digest distinction: tags are mutable pointers and can be re-pushed to different content, while digests are immutable content hashes (https://adhdecode.com/articles/docker/docker-image-digest-vs-tag/, jev weight 0.16, weak backing; https://runbook.academy/courses/kubernetes/lessons/kubernetes-cxv-05-tag-digest/, jev weight 0.19, weak backing). Docker's own concept documentation treats tagging as the publish-time labeling step (https://docs.docker.com/get-started/docker-concepts/building-images/build-tag-and-publish-an-image/, jev weight 0.39, weak backing). In a bump-recovery context the distinction is sharp: a tag is only as fresh as the build that last pushed it, and the adjacent case is precisely a tag that was not re-pushed.

## Where this fits in the recovery flow

The adjacent case is a post-recovery hazard. The main recovery (docs 02 to 04) ends with a re-dispatched builder at the new head. If a VM dispatch was prepared against the old head's dev tag during the incident window, it can still resolve to pre-bump bytes. The playbook's answer is to never trust the tag: resolve it to a digest at dispatch time and pass the digest forward, so the VM consumes the bytes that were verified, whatever the tag currently points at.

## What this doc adds beyond the source doc

The digs supply the standards and tooling grounding: skopeo's Digest output (0.50), the OCI digest contract (0.66, high), and weak-backed context on tag mutability and SHA-tag CI patterns (0.10 to 0.39). Nothing contradicts the source doc; the fix commit and the resolve-to-digest command remain the source doc's own records.
