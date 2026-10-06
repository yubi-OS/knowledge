# 06. Alternatives: native arm64 runners and the matrix strategy

**Scope:** the non-QEMU paths the skill points at: platform-specific runners in a matrix strategy, and the native arm64 runner options now available on GitHub Actions.

The source doc's Notes section states the boundary condition: the QEMU action is not needed when using a matrix strategy with platform-specific self-hosted runners (source doc). In that pattern, each matrix leg runs on a runner whose native architecture matches the platform being built, so every RUN step executes natively and no binfmt_misc registration is ever required.

That alternative has become materially cheaper on GitHub-hosted infrastructure. GitHub announced arm64 hosted runners for GitHub Actions, positioning them as powering faster, more efficient builds (https://github.blog/news-insights/product-news/arm64-on-github-actions-powering-faster-more-efficient-builds-and-increased-runner-options/, jev weight 0.69). ARM's own learning paths document the full pattern: using GitHub Arm-hosted runners to build multi-architecture container images for arm64 and amd64 platforms (https://learn.arm.com/learning-paths/cross-platform/github-arm-runners/, jev weight 0.71), with the actions-level walkthrough covering checkout, Docker Hub login, and the docker build and push steps running on the Arm-hosted runner (https://learn.arm.com/learning-paths/cross-platform/github-arm-runners/actions/, jev weight 0.62). Windows coverage exists too: MSYS2's changelog notes that GitHub added Windows ARM64 runners to GitHub Actions, which the project used to produce native ARM64 packages (http://www.msys2.org/news/, jev weight 0.67).

Decision shape for a maintainer:

1. QEMU route: one amd64 job, emulated arm64 legs, no extra runners, 5 to 10x penalty on emulated RUN steps (source doc; https://github.com/docker/setup-qemu-action/issues/22, jev weight 0.68).
2. Native-runner route: a matrix with an amd64 leg and an arm64 leg on arm64-capable runners, native speed on both, at the cost of runner provisioning and per-leg caching (source doc Notes; https://learn.arm.com/learning-paths/cross-platform/github-arm-runners/, jev weight 0.71).
3. Hybrid: keep QEMU for light architectures and move only the heavy ones to native runners, which matches the source doc's guidance to use native runners when CI time matters (source doc).

Weakly backed runner-vendor references (jev weights 0.09 to 0.23, labeled weak; marketing pages, excluded from claims above) advertise third-party arm64 runner fleets as a QEMU alternative; this corpus does not lean on them. The strong-backed record is the first-party evidence: GitHub-hosted arm64 runners exist, ARM documents the pattern end to end, and the source doc already anticipated it with the self-hosted matrix note.

**Grounding spine:** the source doc's Notes section, third bullet. Digs grounded the native-runner alternative with first-party sources (GitHub announcement, ARM learning paths, MSYS2 changelog).
