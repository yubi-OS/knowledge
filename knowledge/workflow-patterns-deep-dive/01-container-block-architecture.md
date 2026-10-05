# 01 - Container Block Architecture

Scope: The digest-pinned `container:` block as the security architecture of yubiOS CI: the canonical 4-key shape, the dhi.io/debian-base image discipline, and the coverage numbers across the 24 workflow files.

## The canonical 4-key shape

GitHub Actions lets a job run inside a container with `jobs.<job_id>.container`, where the image key defines the container image and the value can be a Docker Hub image name or a registry name (source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container, weight 0.95). The yubiOS convention extends that standard block with 3 more keys and places them in a fixed order. The canonical shape, quoted verbatim from `ci_mkosi-installer.yml::build`:

```yaml
container:
  options: --privileged
  volumes:
    - /mnt:/mnt
  credentials:
    username: 0mniteck42
    password: ${{ secrets.DOCKER }}
  image: docker://dhi.io/debian-base@sha256:4440cf16b142316744a7fd1c5070eb23df54c7c335d8684c8d72864f0f3eb30e
```

Every "good" job in the org places the 4 keys in that order: options, volumes, credentials, image. The image is pulled through the `docker://` prefix and pinned by full sha256 digest, never by tag.

## Coverage across the org

21 of the 24 workflow files use a `container:` block; the remaining 3 run on the bare `ubuntu-24.04` runner. Of the 21 container jobs:

- 14 carry the full canonical shape (options + volumes + credentials + image).
- 7 correctly omit `options:` and `volumes:` (the linter and reproducibility subset: no docker work, no host bind mount needed).
- 1 workflow, `ci_test_sealed-uki-vm.yml`, has no `container:` block at all. That is the regression state the v2/v3/v4 fix series on branch `sealed-uki-vm-lane-v2` is iterating on.

## Why the image is digest pinned

The image is `dhi.io/debian-base` per the repo-level `/PINNED.md` allowlist. Digest pinning means the build cannot be redirected by a tag move: the container contents are fixed by content hash. The documented authoritative entry is the multi-arch OCI index digest `sha256:9d293dad...`, with a comment in `ci_mkosi-installer.yml` noting it auto-resolves to `${{ matrix.arch }}`. The older per-arch digest `sha256:9415967...` (v2026.03.14) is superseded and still documented in AGENTS.md and the github-actions skill, which makes those documents stale (see doc 04).

Private-image pulls need authentication at the job level rather than a separate login step. The Docker GitHub Actions guide shows that pushing to Docker Hub requires authenticating with Docker credentials as part of the workflow (source: https://docs.docker.com/guides/gha/, weight 0.93). The yubiOS pattern bakes that authentication directly into the `container:` block with a `credentials:` key holding a username and a secret reference, so the image pull happens before any step runs and no login step can be skipped or reordered.

## Why `--privileged`

The `options: --privileged` key is not decorative. 14 of the 21 container jobs do docker/docker-compose work that requires the outer container to hold kernel namespace privileges so rootless dockerd can spawn its user-namespace mapping inside it (see doc 02). Self-hosted runners support this kind of container customization through runner-level options (source: https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/customize-containers, weight 0.89).

The privileged flag is a real trade: it grants the container near-full host access. Practitioner write-ups note that `--privileged` is not a standard GitHub Actions container option and must be supplied through `options:` (weak backing: https://stackoverflow.com/questions/64930928/using-github-action-with-docker-and-privileged, weight 0.21). Dedicated runner platforms document the same need: runner instances running in a container require privileged mode when the workflow needs deeper host access (source: https://namespace.so/docs/solutions/github-actions/runner-controls/privileged-workflows, weight 0.64). yubiOS confines the blast radius by pinning exactly one allowlisted image per `/PINNED.md` and requiring every container job to declare the same block shape, so the flag's use is reviewable as a deviation rather than ambient.

## The one exception

A single workflow, `yubiOS-ci.yml::hadolint`, uses `docker://ghcr.io/hadolint/hadolint:v2.14.0-debian@sha256:158cd0184...` with no credentials block. AGENTS.md currently forbids non-dhi.io containers, so this is the only exception in the entire org. It is also the only job with no authentication: the image is public, so a credentials block would be dead weight.

## Takeaway

The `container:` block is the load-bearing security primitive of the yubiOS CI fleet. The shape is uniform enough that a missing block, a tag-pinned image, or a reordered key set is an anomaly rather than a style difference. `ci_test_sealed-uki-vm.yml` failing to carry the block is the current live gap, and the canonical shape in `ci_mkosi-installer.yml` is the template the fix series restores.
