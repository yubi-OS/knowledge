# 01 - Pinning taxonomy: five categories, five different bumps

Scope: the five pinned categories a digest-pinned base image program must maintain (GitHub Actions, direct workflow downloads, internal fork refs, external source refs, container images) and why a "digest bump" is a different procedure in each.

## Why one generic checklist fails

A digest is not one thing in a real build system. The yubiOS project maintains a single pinned-dependency file, PINNED.md, that tracks five distinct categories, and the project's own digest bump checklist is explicit that the question "which file and which check must move together" has a different answer in each category (yubiOS refs: digest-bump-checklist-2026-07-25.md). A checklist written as if every bump were a container image bump would miss the SHA-512 rehash of a downloaded binary, the two-column update of a fork's release and source commits, and the policy edit needed when a new registry appears.

The underlying reason is immutability mechanics. Digest pinning works because a content-addressed digest changes when content changes: even adjusting a file permission on a single file inside an image produces a different digest, which is exactly the property that makes a pinned reference meaningful (https://candrews.integralblue.com/2023/09/always-use-docker-image-digests/, jev weight 0.81). But different artifact types expose that property through different mechanisms: OCI index digests for container images, commit SHAs for git references, SHA-512 hashes for downloaded tarballs, and release plus source commit pairs for maintained forks. Each mechanism has its own update trigger, its own verification step, and its own failure mode.

## Category 1: GitHub Actions

Actions are pinned by commit SHA in the GitHub Actions table. A bump here means replacing one SHA with another, and the critical validation is that the new reference is an immutable commit SHA rather than a mutable tag string. This category exists because reusable workflow steps are code that executes in CI with repository secrets in scope, which is why policy files reject mutable references such as `:latest` or branch names (yubiOS refs: digest-bump-checklist-2026-07-25.md). The check that belongs to this bump: confirm the pasted reference is a full SHA, and expect a fail-closed rejection if it is not.

## Category 2: Direct workflow downloads

Binaries fetched directly into CI, such as static Docker binaries and buildx releases, are pinned by artifact URL plus SHA-512. A bump here is never just a URL change: the recorded hash must be recomputed and updated in the same change, because the verification gate (`sha512sum --check --strict`) compares the downloaded bytes against the recorded digest and fails closed on any mismatch (yubiOS refs: digest-bump-checklist-2026-07-25.md). The distinguishing feature versus container images is that the hash lives in the repo as text, so a stale hash does not silently pin an old version; it blocks the build.

## Category 3: Internal fork refs

Maintained forks (TF-A, bcvk, edk2, mkosi, and others in the yubiOS tree) pin two commits per fork: an upstream release or reference commit and a pinned source commit that may carry project-specific patches. A bump here can mean moving one column, both columns, or nothing at all, depending on whether the fork's extension still re-applies on the new release. This is the category where a bump is a semantic act rather than a substitution: the refresh workflow resolves the newest stable upstream tag and then a human decides whether the extension survives (yubiOS refs: digest-bump-checklist-2026-07-25.md).

## Category 4: External GitHub source refs

Non-fork external dependencies pin a reviewed branch or tag plus a pinned commit. A bump updates both columns for the dependency, and the specific hazard is capability regression: the pinned commit was chosen because it provides a specific behavior, so the new commit must be re-verified against that behavior, not merely promoted (yubiOS refs: digest-bump-checklist-2026-07-25.md). Some of these dependencies are cross-referenced into other tables, which makes the bump a two-table update.

## Category 5: Container images

OCI images are pinned by digest, and in the multi-arch case by a three-row structure: one index digest plus per-platform child digests. A bump means fetching the new index digest through a named refresh workflow, letting the child rows resolve through the same workflow, moving the old index digest into a superseded audit block, and then updating every consumer reference in Containerfiles and workflow image fields (yubiOS refs: digest-bump-checklist-2026-07-25.md). This is the highest-traffic category because base images rebuild most often, which is why the project convention is to commit bump PRs continuously rather than batch them.

## What the categories share

Three invariants hold across all five. First, every pin is an immutable reference: content-addressed digests, full commit SHAs, or exact hashes, never mutable tags (weak backing: https://devsecopsatlas.com/guides/dependency-pinning-checklist, jev weight 0.28). Second, every bump is verified at a defined gate, whether that gate is a build-time policy, a checksum check, or a fetch-time tree validation. Third, every bump lands as a reviewable change rather than a direct push, so the audit trail captures who moved what and when. A checklist that keeps these three invariants while specializing the mechanics per category is the practical answer to "what must move together" for a digest-pinned program.
