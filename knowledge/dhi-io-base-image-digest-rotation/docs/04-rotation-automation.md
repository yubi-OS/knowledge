# Rotation automation

Scope: Automating the refresh cadence: Dependabot and Renovate digest-pin updates, updatecli, and scheduled workflows that open the bump PR.

## What the bots can and cannot do today

Renovate supports digest pinning and digest updating natively for Docker. Its documentation states that Renovate can update digests for you, and that when pinning a digest it retains the Docker tag in the FROM line for readability, in the form `FROM node:14.15.1@sha256:...` [S1]. The Docker manager also documents the full file coverage: Dockerfiles, docker-compose files, dev container and Codespaces images, CircleCI configs, Kubernetes manifests, and Ansible configs [S1]. Renovate presets let you opt into digest pinning behavior per repository [S2].

Dependabot's story is different. As of the dig's evidence, Dependabot updates the tag in a `FROM ubuntu:22.04` line when a new tag appears but does NOT add digest pinning; adding digest pinning when updating Docker image tags is an open feature request, dependabot-core issue 14065, filed with the explicit motivation that digest pinning is what prevents supply chain attacks [S3]. A pipeline that relies on Dependabot alone therefore cannot maintain digest pins automatically today; it can only flag upstream tag movement.

The Containers SME Cookbook's base-image guidance splits the work the same way: resolve tags to digests, automate digest updates with tools like Renovate or Dependabot, and pair digest pinning with scheduled rebuilds for security patches [S4].

## The cadence design

A digest rotation cadence has three moving parts, each automatable:

1. Detection: a scheduled job that re-resolves each pinned reference against the registry and reports when the upstream tag points at a different digest. The Microsoft physical-ai-toolchain team describes exactly this design for their own pins: a scheduled check that, for each digest-pinned image reference in the repository, re-resolves the tag to its current registry digest and reports drift, surfaced non-gating (weight 0.82, authoritative) [S5].
2. Proposal: Renovate opening the digest-update PR [S1], or in the Dependabot case, the tag-update signal that a human turns into a rotation.
3. Landing: the bump PR updates the pin file and consuming Dockerfiles in one change, then the rego gate verifies the new digest as a build input (see doc 03).

Renovate's version-precision behavior matters for cadence tuning: by default it preserves the precision level of the existing pin, so a pin at `myimage:1.1` only proposes `1.2` or `1.3`, never `1.2.0`, and it does not yet support pinning an imprecise version to a precise one [S1].

## Where a pin-file workflow fits

The yubiOS pattern goes one step further than per-repo bots: the approved digests live in a single PINNED.md file, a workflow can refresh it, and nothing else copies digest values. The bot tooling above operates on Dockerfiles and compose files directly; a pin-file design moves the authoritative digest into one reviewed file and treats the Dockerfile as a consumer. Both designs satisfy the same invariant, that the digest is written once per rotation, but the pin-file design keeps the approval surface and the build surface in separately reviewable files.

Weak-backing notes: community write-ups of Renovate-driven base image automation exist [S6] [S7] with weak backing (weights 0.34 and 0.24), and a Renovate discussion about RegexManager-based digest pinning scored 0.07 [S8]. Treat them as anecdotal pointers only.

## Sources

- [S1] https://docs.renovatebot.com/docker/ (weight 0.89, authoritative)
- [S2] https://docs.renovatebot.com/presets-docker/ (weight 0.69, authoritative)
- [S3] https://github.com/dependabot/dependabot-core/issues/14065 (weight 0.64, authoritative)
- [S4] https://containers.codeguides.io/image-policy-vulnerabilities/base-image-pinning-by-digest/ (weight 0.61, authoritative)
- [S5] https://github.com/microsoft/physical-ai-toolchain/issues/1093 (weight 0.82, authoritative)
- [S6] https://scanrook.io/blog/automate-docker-base-image-updates (weight 0.34, WEAK backing)
- [S7] https://tomodahinata.com/en/blog/dependabot-docker-base-image-digest-pinning-updates-guide (weight 0.24, WEAK backing)
- [S8] https://github.com/renovatebot/renovate/discussions/15238 (weight 0.07, WEAK backing)
