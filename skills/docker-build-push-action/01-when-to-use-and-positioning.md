# 01 - When to use docker/build-push-action and where it sits

Scope: when docker/build-push-action is the right tool, its role as the primary build action in Docker CI workflows, and the action family it composes with.

## The decision the source doc encodes

The ground source (`yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md`) states the job plainly: build a container image (and optionally push it) from a Dockerfile or Containerfile. The action supports caching, attestations, multi-platform builds, build secrets, and build args. The source doc is explicit about the pairing rule: use it after `docker/setup-buildx-action` for any non-trivial build. That ordering matters because build-push-action drives a Buildx builder; without a builder instance created first, the action cannot deliver cache backends, attestations, or multi-platform output. The action's frontmatter description calls it "the primary build action in virtually every Docker CI workflow", which is the positioning claim this corpus takes as its spine (source doc).

## What "primary build action" means in practice

The official repository describes the action as "GitHub Action to build and push Docker images with Buildx" (weight 0.97, https://github.com/docker/build-push-action). Docker's own CI documentation organizes its GitHub Actions material around this action as the build step, with companion actions handling the adjacent jobs (weight 0.77, https://docs.docker.com/build/ci/github-actions/ and weight 0.86, same page from the second query). Docker's introduction to GitHub Actions guide frames the same family as the default path for container CI (weight 0.7, https://docs.docker.com/guides/gha/).

The family, as assembled in the source doc's full workflow example, is:

1. `actions/checkout@v4` fetches the repository.
2. `docker/metadata-action@v5` computes tags and labels from Git metadata (branch, PR, semver, sha).
3. `docker/setup-buildx-action@v3` creates the Buildx builder.
4. `docker/login-action@v3` authenticates to the registry (quay.io in the example, with username and token from repository secrets).
5. `docker/build-push-action@v6` builds and pushes, consuming the outputs of the metadata step.

This corpus treats that five-step assembly as the canonical shape. The sibling skills in the same yubiOS skills tree (docker-metadata-action, docker-setup-buildx-action, docker-login-action, docker-setup-qemu-action) each own one of those steps; this skill owns step 5 only. Anything beyond the frontmatter description's scope is a different skill's job (source doc, Guidelines section).

## When NOT to reach for it

Three boundary cases come straight from the source doc:

- A build that should never leave the runner: use `push: false` plus `load: true` to build into the local Docker image store for testing before any push (source doc, Notes).
- A build that should be delegated wholesale to Docker's trusted pipeline: `docker/github-builder` wraps this action in a reusable workflow with trusted isolation and signed provenance; the source doc says to prefer it for production pushes. Doc 07 covers that comparison in depth.
- A repository that only needs tags and labels computed: that is metadata-action's job, not this action's.

## Weak-evidence notes

The GitHub Marketplace listing for the action confirms installability and discoverability through the marketplace UI (weight 0.48, https://github.com/marketplace/docker-build-push-action, weak, below the 0.5 threshold). A blog walkthrough of build and push with GitHub Actions exists but was scored 0.14, below the citing threshold, so its claims are not used here (https://tenki.cloud/blog/github-actions-docker-build-push). One mirror repository at a non-github host scored 0.31 and is likewise not used as backing for any claim (https://git.hubp.de/docker/build-push-action).

## Sources

- Source doc: `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (sections: When to use, Action reference, Full workflow example, Notes, Guidelines).
- https://github.com/docker/build-push-action (weight 0.97)
- https://docs.docker.com/build/ci/github-actions/ (weight 0.77 and 0.86)
- https://docs.docker.com/guides/gha/ (weight 0.7)
