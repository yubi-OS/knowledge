# 06: Dry-run and verification modes: checking work before it changes state

Scope: dry-run and verification surfaces per mode: bcvk --dry-run where supported, --check validation legs in CI workflows, systemd-analyze verify for unit files, and what each catches that the others miss.

## Verification is a mode, not a flag

Every execution mode in this corpus needs a way to validate intent without mutating state, but the mechanism differs by mode. Interactive mode can afford a partial run the developer aborts. Batch mode cannot, because a failed build inside CI wastes runner time and leaves partial state. Daemon mode cannot either, because a broken unit disrupts a live service. The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) assigns one verification surface per mode: --dry-run where the tool supports it in interactive use, --check validation legs in CI, and systemd-analyze verify for units.

## systemd-analyze verify: the daemon-mode check

systemd-analyze verify validates unit files and helps troubleshoot errors such as broken unit definitions (w=0.46, weak, https://linux-audit.com/systemd/faq/how-to-verify-a-systemd-unit-for-errors/). What it actually catches: dependency cycles, typos, and missing properties (w=0.23, weak, https://github.com/systemdemo/workshop/blob/main/workshop/ANALYZE/systemd-analyze-verify.md), plus missing executables and broken command paths (w=0.15, weak, https://dev.to/lyraalishaikh/stop-shipping-broken-systemd-units-practical-systemd-analyze-verify-for-linux-services-24dk). The timing argument for running it in batch rather than on the host: isolate the unit-file check before daemon-reload changes a running host (w=0.11, weak, https://johnburns.io/post/verify-systemd-unit-files-before-daemon-reload/), and the honest limitation: it will not replace actually starting the service, it catches the boring, expensive mistakes early (w=0.15, weak, https://dev.to/lyraalishaikh/stop-shipping-broken-systemd-units-practical-systemd-analyze-verify-for-linux-services-24dk).

Editor-side tooling extends the same idea upstream of CI: a validation feature can run systemd-analyze verify and the Quadlet generator in dry-run mode without any systemd, podman, or mkosi install on the editing host (w=0.24, weak, https://willibrandon.github.io/vscode-systemd/validation/). That matters for the interactive mode of this corpus: the developer catches unit errors before any runner sees them.

## Build checks: the batch-mode dry run

Container builds have an equivalent. Docker build checks, introduced in Dockerfile 1.8, validate build configuration and run a series of checks prior to executing the build, described as an advanced form of linting for Dockerfiles and build options, or a dry-run mode for builds (w=0.73, https://docs.docker.com/build/checks/). Guides for CI adoption describe the same feature as catching common Dockerfile mistakes before images are built (w=0.14, weak, https://oneuptime.com/blog/post/2026-02-08-how-to-use-docker-build-checks-for-dockerfile-validation/view). Buildx-based pipelines wrap this in test and validation workflows that combine build validation with dependency checks before real builds run (w=0.34, weak, https://deepwiki.com/docker/setup-buildx-action/4.2-test-and-validation-workflows).

## The yubiOS mapping

The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) maps the three surfaces as follows. Interactive: bcvk --dry-run where the tool supports it, giving the developer a state-free preview. Batch: --check legs inside the validate-input-shape job, so validation runs as a first-class pipeline stage rather than as a preflight inside a mutating step. Daemon: systemd-analyze verify against every unit before it is installed.

The reason the mapping is per mode rather than one shared flag: the cost of being wrong differs. An aborted dry-run costs a developer seconds; an unvalidated build leg costs a runner slot and leaves artifacts; an unvalidated unit costs a service. systemd's own verification utility exists precisely because unit files ship broken in ways that only surface at load time (w=0.46, weak, https://linux-audit.com/systemd/faq/how-to-verify-a-systemd-unit-for-errors/), and Docker added checks to its build path for the same reason on the batch side (w=0.73, https://docs.docker.com/build/checks/).

## What verification cannot catch

Both ecosystems are explicit that offline verification is partial. systemd-analyze verify does not replace starting the service (w=0.15, weak, https://dev.to/lyraalishaikh/stop-shipping-broken-systemd-units-practical-systemd-analyze-verify-for-linux-services-24dk), and build checks validate configuration, not the build result (w=0.73, https://docs.docker.com/build/checks/). This is the dry-run row's connection to the rest of the mode axis: verification reduces the failure rate of the first real run in each mode, but the two-of-three-modes coverage rule (doc 08) is what catches the behavioral failures verification cannot express, such as a prompt that only fires without a TTY.

## Summary

Each mode gets the cheapest check that catches its own expensive mistakes: build checks as dry-run linting before CI executes a build (w=0.73, https://docs.docker.com/build/checks/), systemd-analyze verify before daemon-reload touches a host (w=0.46, weak, https://linux-audit.com/systemd/faq/how-to-verify-a-systemd-unit-for-errors/), and tool-level --dry-run in the interactive shell. Verification is mode-specific because mutation risk is mode-specific, and none of it replaces the real run in a second mode.
