# 07 - docker/github-builder: the reusable build workflow

Scope: the official reusable workflow that wraps build-push-action, its inputs and outputs, native per-platform distribution, signed provenance, and the comparison against bare build-push-action.

## What it is and when to prefer it

The ground source (`yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md`, docker/github-builder section) describes `docker/github-builder` as a Docker-maintained reusable workflow that wraps build-push-action "with trusted isolation, native multi-platform distribution, and signed SLSA provenance", and gives the preference rule: "Prefer it over bare build-push-action for production pushes."

The invocation is a workflow_call job:

```yaml
jobs:
  build:
    uses: docker/github-builder/.github/workflows/build.yml@v1
    permissions:
      contents: read
      id-token: write
```

Docker's documentation carries a dedicated "Docker GitHub Builder" page (weight 0.71, https://docs.docker.com/build/ci/github-actions/github-builder/) plus a build-focused page, "Build with Docker GitHub Builder" (weight 0.67, https://docs.docker.com/build/ci/github-actions/github-builder/build/), both scoring above the 0.5 threshold. The workflow file itself, `github-builder/.github/workflows/build.yml`, is browsable in the repository and scored 0.5 (https://github.com/docker/github-builder/blob/main/.github/workflows/build.yml). The repository root README scored 0.48, just below the threshold, and is labeled weak backing here (https://github.com/docker/github-builder).

## Key inputs (source doc table)

| Input | Default | Description |
|---|---|---|
| `output` | none | `image` (push) or `local` (export artifact) |
| `platforms` | none | Target platforms; `distribute: true` spawns one runner per platform |
| `distribute` | `true` | Native runner per platform, no QEMU needed |
| `runner` | see below | Platform to runner mapping |
| `file` | `Dockerfile` | Path to Dockerfile/Containerfile |
| `context` | `.` | Build context |
| `cache` | `false` | Enable GHA cache |
| `cache-mode` | `min` | `min` or `max` |
| `build-args` | `auto` | Build-time variables; supports `{{meta.version}}` template |
| `sbom` | `false` | SBOM attestation |
| `sign` | `auto` | Sign provenance when pushing |
| `meta-images` | none | Image names for metadata-action |
| `meta-tags` | none | Tag rules for metadata-action |

The runner mapping replaces QEMU emulation with real hardware per architecture:

```yaml
runner: |
  default=ubuntu-24.04
  linux/arm64=ubuntu-24.04-arm
```

The build-args input accepts metadata templates: `VERSION={{meta.version}}` picks up the computed metadata version (source doc).

## Outputs (source doc table)

| Output | Description |
|---|---|
| `digest` | Image digest (sha256:...) |
| `meta-json` | Full metadata-action JSON |
| `cosign-verify-commands` | Commands to verify signed attestations |
| `signed` | Whether provenance was signed |

The `cosign-verify-commands` and `signed` outputs are the verification handoff: the workflow tells the consuming repository exactly how to check the signatures it produced.

## Why the wrapper exists (source doc comparison)

Four properties distinguish the reusable workflow from bare build-push-action (source doc, "vs bare build-push-action"):

1. No buildx setup needed: the reusable workflow handles builder creation.
2. Native parallelization: one runner per platform, no emulation.
3. Tamper-proof: build steps live in the @docker org, so the consuming repository cannot modify them.
4. SLSA signing: automatic with `id-token: write`, activating when `push: true`.

The trusted-isolation argument is the supply-chain-relevant one: with bare build-push-action, the consuming repository owns every step of the build and can (accidentally or maliciously) alter what runs between checkout and push. With the reusable workflow, the build steps are pinned to Docker's org and the consumer only passes inputs.

## Weak-evidence notes

A fork under the crazy-max account scored 0.13 (weak, https://github.com/crazy-max/docker-github-builder), a mirrored architecture page scored 0.11 (weak, https://heisiwu.net/build/ci/github-actions/github-builder/architecture/), and a marketplace ecosystem directory scored 0.06 (weak, https://explore.market.dev/ecosystems/docker/projects/github-builder). None is cited for claims.

## Sources

- Source doc: `yubi-OS/yubiOS skills/docker-build-push-action/SKILL.md` (docker/github-builder section and subsections).
- https://docs.docker.com/build/ci/github-actions/github-builder/ (weight 0.71)
- https://docs.docker.com/build/ci/github-actions/github-builder/build/ (weight 0.67)
- https://github.com/docker/github-builder/blob/main/.github/workflows/build.yml (weight 0.5)
- https://github.com/docker/github-builder (weight 0.48, weak)
