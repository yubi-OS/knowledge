# Per-Runner Build Status Quo

Scope: The existing per-runner meson/ninja build of libvfio-user inside the vGPU VM CI workflow (PR #137, commit a53332e): its staging layout, key inputs, and repeat-build cost profile that opened the bundling question.

## Where the per-runner build came from

The current arrangement landed with yubiOS PR #137, commit a53332e (yubi-OS/yubiOS refs/libvfio-user-bundle-decision-2026-07-30.md, Linear OMN-100). Every runner that executes the vGPU VM CI workflow builds libvfio-user from source as part of its job: meson configures the build, ninja compiles it, and the resulting tree is staged at /opt/libvfio-user/<commit>, where <commit> is the pinned libvfio-user revision (37491ed9 at the time of the decision record).

That pattern is the natural default on GitHub-hosted or self-hosted runners. Self-hosted runners exist so a project can run jobs on its own infrastructure and customize the environment used to run jobs (https://docs.github.com/en/actions/concepts/runners/self-hosted-runners, jev weight 0.75). On a fresh runner environment, the only reliable way to guarantee a working libvfio-user is to build it in the job itself, which is what PR #137 does.

## The key inputs of the build

The decision record identifies three inputs that fully determine the per-runner build:

1. The pinned libvfio-user commit (37491ed9 at decision time). A different commit means a different build.
2. The base image digest, fedora-bootc:45 as pinned in the yubiOS PINNED.md. The toolchain inside the build container comes from this image, so its digest is part of the build's identity.
3. The runner OS, because the workflow's dispatcher matrix fans jobs out across runner types.

This is exactly the shape of cache-key design GitHub documents for dependency caching: a cache key can include any of the contexts, functions, literals, and operators supported by GitHub Actions (https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching, jev weight 0.81). The three inputs above are, in GitHub Actions terms, three components of a cache key waiting to be written down.

## What the per-runner build costs

The cost is repetition. Because each runner builds its own copy, every job in the dispatcher matrix pays the full meson/ninja wall time, and the same work is redone on every run as long as the three inputs stay identical. The decision record sizes the saving from eliminating this repetition at roughly 30 to 60 seconds per run on a cache hit, cumulative across the matrix. That is not heroic, but it is real and it is free to remove.

The general principle that makes this repetition wasteful is documented well in Gradle's build-optimization manual: an incremental build avoids running tasks whose inputs have not changed since the previous build, because re-executing such tasks would only re-produce the same output (https://docs.gradle.org/current/userguide/gradle_optimizations.html, jev weight 0.93). The per-runner build violates this principle across runs: identical inputs, identical outputs, full rebuild every time.

## Why the status quo is not automatically wrong

It is worth being precise about what the per-runner build buys before criticizing it:

- Correctness. The build is always fresh against the exact pinned commit and base image digest. There is no staleness failure mode.
- Simplicity. One workflow file contains the whole pipeline: fetch, build, stage, test. No external artifact to publish, sign, or refresh.
- Independence. Runners do not depend on a registry being up or a tag being current.

The decision record scores this option (Variation 2, keep the per-runner build) at 13 out of 20 on the constraint-removal lens, the highest raw score of the five variations considered, but drops it because it does not address the question the exercise was asking. Keeping the status quo removes no constraint; it preserves the repeat-build cost that motivated the review.

## The gap the status quo leaves open

The one thing the per-runner build lacks is memory. Between runs, nothing is retained: a runner that just built libvfio-user from commit 37491ed9 last hour builds it again now. GitHub's own caching machinery exists precisely to close that gap, and the dependency-caching reference describes restore-keys and cache scoping as first-class concepts (https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching, jev weight 0.81). The near-term step of the adopted decision (Variation 4) is simply the smallest change that gives the per-runner build this memory without touching anything else: keep the build exactly as it is, add a cache restore/save around it, and measure what fraction of runs stop rebuilding.

The distinction between a cache and a published artifact matters here. GitLab's CI documentation treats job artifacts as outputs produced by a job and stored for later retrieval (https://docs.gitlab.com/ci/jobs/job_artifacts/, jev weight 0.97). A cache is the same idea turned inside out: an input snapshot stored so the producing step can be skipped. Step 1 of the adopted plan stays entirely on the cache side of that line, which is why it requires no new artifact surface, no signing, and no registry coordination.
