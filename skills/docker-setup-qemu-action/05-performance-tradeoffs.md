# 05. Performance tradeoffs of QEMU emulation

**Scope:** the cost side of the skill: emulation slowdown, the blast radius of platforms: all, and when the source doc says to stay native.

The source doc's Notes section carries three performance-relevant rules (source doc):

- QEMU emulation is significantly slower, around 5 to 10x, than native; use native runners when CI time matters.
- `platforms: all` installs many interpreters; only list what you need.
- The action is not needed when using a matrix strategy with platform-specific self-hosted runners.

The 5 to 10x figure is the source doc's own claim and this corpus found no strong-backed independent measurement; treat it as the skill's planning heuristic. The direction is unambiguously confirmed by real-world reports: in the upstream repository's own issue tracker, a user reports a build step going from 9 minutes to 69 minutes when moved under QEMU emulation (https://github.com/docker/setup-qemu-action/issues/22, jev weight 0.68). That is an 11x step-level slowdown on that specific workload, worse than the heuristic band, which is consistent with slowdowns being workload-dependent: CPU-bound RUN steps and compile-heavy steps suffer most; I/O-bound and pure-copy steps suffer least.

Docker's official position frames emulation as the accessibility tradeoff: building multi-platform images under emulation with QEMU is the easiest way to get started if your builder already supports it, it requires no changes to your Dockerfile, and BuildKit automatically detects the architectures available for emulation (https://docs.docker.com/build/building/multi-platform/, jev weight 0.95). The same guide's CI page warns the flip side directly: building multiple platforms on the same runner can significantly extend build times, particularly with complex Dockerfiles or a high number of targets (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.90).

Practical reading for yubiOS workflows:

1. Cost is per-platform-pair and per-RUN-step. The emulation penalty lands on RUN steps executing foreign binaries, so a Dockerfile with heavy compile steps under arm64 emulation pays the most (https://docs.docker.com/build/ci/github-actions/multi-platform/, jev weight 0.90; https://github.com/docker/setup-qemu-action/issues/22, jev weight 0.68).
2. `platforms: all` is a setup-time cost, not primarily a build-time cost: registering many interpreters you never use slows the setup step and widens the emulation surface for no benefit (source doc).
3. The escape hatch is structural, not tuning: split the platform matrix across native runners, or move heavy architectures to native runners entirely (source doc Notes; https://docs.docker.com/build/building/multi-platform/, jev weight 0.95). Doc 06 covers the runner-side alternative.

**Grounding spine:** the source doc's Notes section. Digs added the 9-to-69-minute datapoint, Docker's official framing of emulation as easiest-but-slowest, and the same-runner multi-platform time warning.
