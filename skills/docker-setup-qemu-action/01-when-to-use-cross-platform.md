# 01. When to use: cross-platform builds on amd64 runners

**Scope:** when docker/setup-qemu-action applies in a GitHub Actions workflow: the runner's native architecture does not cover the platforms a build must produce.

The skill's front matter scopes it to one job: register QEMU emulators for cross-platform Docker builds in GitHub Actions, typically building linux/arm64 or other non-native architectures on standard amd64 runners (source doc: yubi-OS/yubiOS skills/docker-setup-qemu-action/SKILL.md). The upstream repository states the mechanism plainly: docker/setup-qemu-action is a GitHub Action to install QEMU static binaries, and it registers QEMU emulators with binfmt_misc so later steps can run containers built for another architecture on the GitHub-hosted runner (https://github.com/docker/setup-qemu-action, jev weight 0.95).

The trigger condition in the source doc is the one to internalize: the action is required when docker/build-push-action targets platforms beyond the runner's native architecture (source doc). A standard ubuntu-latest runner is amd64 only. Without registered QEMU interpreters, a build step that declares linux/amd64,linux/arm64 fails or silently skips the foreign platform, because the kernel has no way to execute arm64 binaries inside the RUN steps of the arm64 build (https://github.com/docker/setup-qemu-action, jev weight 0.95).

Three corollaries follow from the skill's framing:

1. Single-architecture builds never need it. If the platforms list matches the runner's native architecture, the action is dead weight and adds setup time without value (source doc, reinforced by the yubiOS note: for single-arch CI unit tests, QEMU is not needed).
2. The action is a prerequisite step, not a build tool. It changes no build outputs; it only makes foreign-architecture execution possible for the steps that follow (https://github.com/docker/setup-qemu-action, jev weight 0.95).
3. The alternative path exists. GitHub now ships native arm64 hosted runners, which GitHub's own announcement describes as powering faster, more efficient builds (https://github.blog/news-insights/product-news/arm64-on-github-actions-powering-faster-more-efficient-builds-and-increased-runner-options/, jev weight 0.69). When CI time matters, the emulation route should be weighed against the native-runner route (source doc Notes; see doc 05 and doc 06).

Docker's official CI documentation frames the broader context: the default Docker setup for GitHub Actions runners supports building and pushing multi-platform images, with QEMU as the piece that extends platform coverage beyond the host (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.93).

**Grounding spine:** the source doc's When to use section. The dig confirmed the mechanism (binfmt_misc registration, user-mode emulation) and the existence of the native-runner alternative that bounds when emulation is the right choice.
