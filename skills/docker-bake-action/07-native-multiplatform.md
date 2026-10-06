# Native multi-platform distribution: runner mapping and no QEMU

Scope: how the github-builder workflow builds multi-platform bake targets on native runners: the `runner` platform-to-runner mapping, the `distribute: true` default that gives each platform its own runner, and why this replaces QEMU emulation. Grounded in the source doc `yubi-OS/yubiOS skills/docker-bake-action/SKILL.md` plus weighted dig results.

## The runner mapping from the source doc

The source doc's mapping is short:

```yaml
with:
  runner: |
    default=ubuntu-24.04
    linux/arm64=ubuntu-24.04-arm
```

(source doc, Runner mapping). `default` names the runner for unspecified platforms, and the `linux/arm64=` line routes arm64 builds to GitHub's dedicated arm64 runner image. The `distribute` input defaults to `true`, and with it on, "each platform in the bake target gets its own native runner. This is significantly faster than QEMU emulation" (source doc).

Docker's multi-platform GitHub Actions documentation describes the two routes for arm64 builds: QEMU emulation on an amd64 runner, or native arm64 runners (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.91 across two dig queries). The native route is what the runner mapping expresses; QEMU is the fallback it avoids.

## Why QEMU is slow and native runners fix it

The mechanism is emulation overhead: under QEMU every containerized instruction runs translated, and builds that touch compilers, package managers, or Rust/C toolchains can be an order of magnitude slower or simply time out. Docker's multi-platform page covers this trade-off directly as the reason both routes exist (https://docs.docker.com/build/ci/github-actions/multi-platform/, 0.91). The source doc compresses the same point to its operational conclusion: per-platform native runners, no emulation (source doc).

The arm64 runner capacity itself is a GitHub-provided fact: GitHub's changelog announced the Ubuntu 24.04 image availability for arm64 runners in June 2024 (https://github.blog/changelog/2024-06-24-github-actions-ubuntu-24-04-image-now-available-for-arm64-runners/, jev weight 0.21, weak backing: the changelog page is a legitimate primary source but the dig weight fell below 0.5, so cite it as contextual confirmation only).

## How it composes with bake targets

The distribution happens per platform inside a bake target, not per target in the file. The source doc's bake example declares `platforms = ["linux/amd64"]` on the base target (source doc), so a single-platform yubiOS build today gets one runner either way. The mapping starts earning its keep when a yubiOS variant adds `linux/arm64` to its `platforms` list: with `distribute: true` the arm64 half runs on `ubuntu-24.04-arm` in parallel with the amd64 half on `ubuntu-24.04` (source doc, Runner mapping and distribute).

For bare `bake-action` (without github-builder), there is no built-in distribute: multi-platform builds run through QEMU on one runner unless the workflow itself is hand-split across jobs. Docker's multi-platform page shows the manual pattern of separate per-platform jobs with digest merging (https://docs.docker.com/build/ci/github-actions/multi-platform/, 0.91). That hand-splitting is exactly what `distribute: true` automates, which is one of the four github-builder advantages the source doc lists as "Native parallelization: one runner per platform, no emulation" (source doc).

## Configuration rules for yubiOS

1. Keep the mapping even for amd64-only builds. Declaring `default=ubuntu-24.04` and `linux/arm64=ubuntu-24.04-arm` now means adding arm64 later is a one-line change to the target's `platforms` list, not a workflow rewrite (source doc mapping).
2. Never trade `distribute: true` away for a runner-count concern. The default is true and the source doc calls the native path significantly faster (source doc); the cost is more runner minutes in parallel, not more serial time.
3. Platform strings must match the mapping keys exactly (`linux/arm64`, not `arm64`); a mismatched key silently falls back to the `default` runner and reintroduces emulation (derived from the mapping syntax in the source doc).

## Relationship to the rest of the corpus

This doc is the performance half of doc 06 (github-builder inputs: `distribute` and `runner`). The attestation half lives in doc 08: native per-platform builds each produce their own attestation-bearing image, and the digest merge happens before signing. The QEMU avoidance also matters for bootc images specifically: yubiOS builds run package-manager and container-tooling steps that are exactly the workload class QEMU handles worst (source doc yubiOS context: standard + minimal + IoT variants built in one pipeline).

## Summary

The source doc's contribution is the mapping snippet plus the `distribute: true` default: each platform gets a native runner, no QEMU (source doc). Docker's multi-platform documentation supplies the underlying route choice (https://docs.docker.com/build/ci/github-actions/multi-platform/, 0.91), and GitHub's arm64 runner availability is the platform fact underneath it (https://github.blog/changelog/2024-06-24-github-actions-ubuntu-24-04-image-now-available-for-arm64-runners/, 0.21, weak). For yubiOS, declare the mapping once and let platform lists grow; the runners follow automatically (source doc).

Primary sources: source doc (`yubi-OS/yubiOS skills/docker-bake-action/SKILL.md`); https://docs.docker.com/build/ci/github-actions/multi-platform/ (0.91). Weak backing (< 0.5): https://github.blog/changelog/2024-06-24-github-actions-ubuntu-24-04-image-now-available-for-arm64-runners/ (0.21).
