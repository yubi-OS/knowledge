# 03. The digest refresh workflow

Scope: how a pinned base-image digest gets re-resolved and refreshed in a repository workflow, and how the refresh cadence interacts with pin staleness.

## The yubiOS refresh path

The source ref records that `fetch-fedora-bootc-manifest.yml` is the workflow used to refresh the digest pinned in `PINNED.md`, and that re-resolution goes through that workflow rather than through manual copying of a digest from a doc, an ADR, or a PR note (source ref, no external weight for the internal file layout). The design intent is that the pinned digest has exactly one update path and one owner.

## The general pattern: automation proposes, review disposes

The broader ecosystem solves the same problem with automated dependency tooling. Renovate is an automated dependency update tool that, when run on a repository, looks for references to dependencies and offers updates when newer versions exist (https://github.com/renovatebot/renovate, noul 0.88). Its Docker support explicitly understands registry references and release streams, including Debian codenames and rolling update schedules (https://docs.renovatebot.com/docker/, noul 0.88). The practical question practitioners ask is whether such tools will open a pull request when only the digest changes but the tag stays the same; the silent-rebuilds test repository exists specifically to compare how Dependabot, Renovate, and Chainguard's digestabot handle tag watching and digest updates (https://github.com/BretFisher/silent-rebuilds/blob/main/README.md, noul 0.73). Guidance on configuring these tools recommends grouping updates, automerging safe patches, and pinning Docker images by digest, so the automation re-resolves the digest on a schedule instead of letting the pin go stale silently (https://infra.furybee.org/articles/renovate-dependabot-automated-dependency-updates/, noul 0.62, weak-ish backing).

## GitHub Actions as the re-resolution engine

A workflow like `fetch-fedora-bootc-manifest.yml` fits the standard GitHub Actions container patterns. GitHub's own documentation covers running jobs in a container where the job's image can point at a registry reference (https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container, noul 0.88), and Docker publishes guidance for configuring GitHub repositories to build and push images from Actions workflows (https://docs.docker.com/guides/gha/, noul 0.92). Docker also maintains a set of official reusable GitHub Actions workflows for securely building container images using Docker best practices (https://github.com/docker/github-builder, noul 0.81). A manifest-fetch workflow is the pull-side of the same machinery: instead of pushing a build, it queries the registry for the current index digest of the pinned tag and writes the result back to the pin file.

## Why cadence matters: the staleness failure mode

A digest pin removes tag mutability from the build, but it introduces a maintenance obligation: the pin must be re-resolved when the team wants to move, and the fact that upstream has moved must be discoverable. If the refresh workflow does not run, or its result is not merged, the repository's pin drifts away from the registry's current tag content. That drift is not hypothetical for this corpus: the source ref records that a 2026-09-18 drift check found the yubiOS pin stale, with the pinned digest no longer matching the upstream tag (source ref, no external weight). The registry side of re-resolution is covered in doc 08.

## What a good refresh loop looks like

Combining the evidence: the pin lives in one file (doc 02), a scheduled or dispatched workflow re-resolves the registry's current digest for the pinned tag and proposes it as a reviewable change (noul 0.88, 0.92, 0.73), and the team accepts or rejects the bump through review rather than through manual copying (source ref). The verification gate on the proposed digest, `docker buildx imagetools inspect` followed by a functional smoke check, is the next link in the chain and is covered in doc 04.

The discipline the source ref encodes, one pin file, one refresh workflow, no copied digests, matches the industry pattern: automation keeps the pin fresh, review keeps it intentional, and the gate keeps it tested.
