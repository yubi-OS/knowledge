# 06 - Pre-Bump Verification Protocol

Scope: the before-bump checklist: fetch the candidate digest, pull and rpm-inspect it, compare against the floors, diff the package set, then update PINNED.md and the Containerfile FROM line under the established commit pattern.

## Step 1: fetch the candidate digest

The first check queries the registry for what the tag currently resolves to. The protocol's canonical command queries the quay API and prints tag names:

```
curl -fsSL "https://quay.io/api/v1/repository/fedora/fedora-bootc/tag/?specificTag=:45" | jq -r '.tags[] | .name'
```

Alternatively, the existing `fetch-fedora-bootc-manifest.yml` workflow is the canonical recovery tool (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 3.1, per PROJECT_RULES.md). The re-verification pass on 2026-09-18 sharpened the operational point: step 2, the quay HEAD query, and step 3, the manifest digest match, are one-line curl checks, and nothing in the protocol requires a release (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 9).

Inspection tooling exists for exactly this pre-trust step. skopeo can inspect a repository on a container registry and fetch image layers; the inspect command fetches the repository's manifest and shows a docker-inspect-like JSON output about the whole repository and its images (source: https://github.com/podman-container-tools/skopeo, jev weight 0.96). This means a candidate digest can be examined before anything is pulled or booted.

## Step 2: pull and inspect the image

The protocol pulls the new digest and runs rpm queries inside it (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 3.2):

```
podman pull quay.io/fedora/fedora-bootc:45@sha256:<new-digest>
podman run --rm quay.io/fedora/fedora-bootc:45@sha256:<new-digest> rpm -q kernel
podman run --rm quay.io/fedora/fedora-bootc:45@sha256:<new-digest> rpm -q systemd
podman run --rm quay.io/fedora/fedora-bootc:45@sha256:<new-digest> rpm -q bootc
```

The podman surface for this is stable: podman run gives final control of the container process to the operator, including the command run inside the image (source: https://docs.podman.io/en/latest/markdown/podman-run.1.html, jev weight 0.97), and the image tooling covers pull, inspect, tag, save, load, redistribute, and signature definition (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/building_running_and_managing_containers/assembly_working-with-container-images_building-running-and-managing-containers, jev weight 0.94). Running a throwaway container with --rm to execute `rpm -q` turns the opaque digest into three version strings that can be compared against floors mechanically.

## Step 3: compare against the floors and abort on regression

The comparison table and its fail actions (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 3.3):

| Check | Pass criterion | Action on fail |
|---|---|---|
| kernel version | at or above the composefs-mode floor (6.5 / 6.6 / 6.12) | ABORT bump; file new issue; do not commit |
| systemd version | at or above the feature floors (target v256) | ABORT bump; file new issue |
| bootc version | at or above v1.16.4 | ABORT bump; file new issue |
| package set | diff `rpm -qa` between old and new digest | review; if the change affects signing or bootc, ABORT |
| Containerfile FROM digest | matches what PINNED.md will commit | STOP; re-fetch |

The package-set diff is the catch-all row: it catches changes the three named floors do not, such as a signing package that changes version or disappears. The abort rule is absolute rather than advisory, because the point of the pre-bump gate is that a bad digest never reaches main.

## Step 4: update PINNED.md and the Containerfile

If every check passes, the protocol's commit step follows the pattern the two July re-resolutions established (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 3.4):

1. Update the Containerfile `FROM` line to the new digest.
2. Update PINNED.md with the new digest plus a "Re-resolved YYYY-MM-DD" stamp.
3. Commit as `chore(pins): re-resolve fedora-bootc:45 to sha256:<new>`, matching commits `8ccffa71` and `d2646452`.

The commit-message pattern matters because it makes rotation history greppable: the two documented bump commits are the reference pattern the protocol codifies (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 8).

## Why pre-bump verification is a gate and not a suggestion

The digest-vs-tag principle is what makes the protocol's exactness necessary: a digest is an immutable content hash, unlike a mutable tag, and resolving a tag to a digest at pin time is what makes builds reproducible (source: https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/, weak backing, jev weight 0.70). But pinning by digest only guarantees the bytes cannot change under the pin; it does not guarantee the bytes are acceptable. Reproducibility guides make the same distinction: tags like node:24-alpine are mutable, so the base image digest is what you pin, and the pin update is a scheduled, reviewed change rather than a silent drift (source: https://oneuptime.com/blog/post/2026-02-08-how-to-build-reproducible-docker-images-with-locked-dependencies/view, weak backing, jev weight 0.28).

Automation can propose the bump but cannot evaluate compatibility. Dependabot-style tooling can follow tags and update digests, but the countermeasures for silent rebuilds are human review of what changed (source: https://tomodahinata.com/en/blog/dependabot-docker-base-image-digest-pinning-updates-guide, weak backing, jev weight 0.16). The pre-bump checklist is that review, made mechanical: the rpm queries, the floor comparison, and the package-set diff are the concrete steps, and the abort rules are the part that keeps a regression out of main.

## What the checklist does not cover

The pre-bump protocol verifies the incoming digest against the floors. It does not verify the build outputs; that is the post-bump cascade's job (doc 07). It also does not detect a stale pin before a build fails; that requires the scheduled drift check (doc 08). The division is deliberate: pre-bump is human-gated and conservative, post-bump is automated, and the scheduled gate covers the case where neither is triggered because no one is bumping at all.
