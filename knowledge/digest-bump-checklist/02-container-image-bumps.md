# 02 - Container image digest bumps: index, children, and every reference

Scope: the update flow for digest-pinned container images: named refresh workflows, multi-arch index versus child digests, consumer reference updates, and preserving the superseded-digest audit trail.

## The three-row pin structure

A multi-arch container image is not one digest. The pinned record is a manifest list: one top-level index digest that addresses the multi-arch manifest list, plus one child digest per platform (`linux/amd64`, `linux/arm64`) addressing each platform-specific manifest. Docker's Hardened Images documentation describes digests as content-addressed identifiers carrying signed metadata and provenance for the image, which is the property that makes the index row the meaningful pin (https://docs.docker.com/dhi/explore/security-concepts/digests/, jev weight 0.85).

The yubiOS convention, recorded in its digest bump checklist, resolves the child-digest question operationally: child rows are marked "resolved automatically; do not pin directly unless an amd64-only job requires it," so the person bumping updates the index row and confirms the refresh workflow refreshed both child rows rather than hand-editing them (yubiOS refs: digest-bump-checklist-2026-07-25.md). Hand-editing child digests separately is the classic error here: it produces an index that disagrees with its children and a build that either fails closed or silently builds a different platform mix than the index promises.

## Step 1: fetch through the named workflow

The yubiOS procedure names the fetch mechanism per image: `fetch-dhi-manifest` for `dhi.io/debian-base` and `fetch-fedora-bootc-manifest` for `quay.io/fedora/fedora-bootc:45` (yubiOS refs: digest-bump-checklist-2026-07-25.md). The point of a named fetch workflow rather than a manual `docker pull` and `docker inspect` is reproducibility of the record: the workflow is the auditable place where the new index digest was obtained, so the PR's diff on PINNED.md is backed by a workflow run rather than terminal history.

This matters specifically for bootc images, where the image is the operating system transport: bootc applies the same container transport to bootable host systems, and updates happen in the form of pulling a new image and rebooting into it (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.87). Red Hat's image-mode documentation describes the same flow at the enterprise level: `bootc upgrade` fetches transactional in-place updates from the registry (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-rhel-bootc-images, jev weight 0.93). When the base image is an OS, a digest bump is a platform rollout, which justifies the heavier checklist.

## Step 2: update the consumer references

The pinned index digest in the source-of-truth table is not where the digest is consumed. Every Containerfile `FROM` statement and every workflow `image:` field referencing the old digest must be updated in the same change; the yubiOS policy line is explicit: "update repo references to the old digest" (yubiOS refs: digest-bump-checklist-2026-07-25.md). This is the step most likely to be missed when automation rewrites only the table, and its failure mode is quiet: the table says the new digest while builds still consume the old one, and the two drift until the next audit.

Automating this step is an established pattern. Guides for automated base-image updates describe a scheduled job that resolves the digest a base tag currently points at, rewrites the pinned `FROM` line, and opens a pull request that existing checks run against (https://www.warpbuild.com/guides/base-image-update-workflow-github-actions, jev weight 0.52). Wiz's base-image patching guidance frames the same update flow as a security practice, keeping the base image current so vulnerabilities are patched at the source (weak backing for the security framing: https://www.wiz.io/academy/container-security/how-to-patch-container-base-images, jev weight 0.64).

## Step 3: preserve the superseded digest

The old index digest is not deleted. It moves into the "Superseded... kept for audit only" block at the bottom of the Container Images section, because the previous value is the answer to "what did we build on before this bump" when an incident needs to be scoped to builds made before a date (yubiOS refs: digest-bump-checklist-2026-07-25.md). Overwriting the row in place destroys that linkage; the checklist treats preserving it as a required step, not a nicety.

## Step 4: confirm the policy gate outcome

A bump that is not policy-approved fails closed at build time, which is correct behavior, but the checklist requires confirming that the observed pass or fail is expected rather than a silent break (yubiOS refs: digest-bump-checklist-2026-07-25.md). In practice this means running or reading the CI build after the PR is opened and checking that the policy verdict against the new digest is the one the bumper intended. If the new registry is not in the policy's approved list, the policy itself must be updated in the same PR, which is the one conditional step in the container-image flow.

## Why bump PRs rather than batches

The project convention is that automated agents commit bump PRs continuously for the tracked base image rather than accumulating bumps (yubiOS refs: digest-bump-checklist-2026-07-25.md). Small, frequent bump PRs keep each change reviewable: one index digest, its resolved children, a bounded set of consumer references, and one superseded row to preserve. A batched quarterly bump inverts that, turning a routine rotation into a multi-image review that reviewers rubber-stamp. The operational lesson generalizes: the digest bump procedure is designed so that the common case is boring, because boring is what keeps the audit trail trustworthy.
