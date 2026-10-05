# 02: CI batch mode: unattended rootless builds on ephemeral runners

Scope: unattended batch execution on ephemeral CI runners: a runner user whose rootless store is not visible to wrapper tools, PATH appended not replaced, NO_COLOR and --quiet for non-TTY output, and idempotency across runner restarts.

## A thinner environment than any developer shell

Batch mode runs the same rootless tooling under a service account with no login profile. The podman rootless tutorial draws the distinction that matters here: running podman as a rootless user and building a container that runs rootless are two different properties, and a batch job has to get both right without a human watching (w=0.97, https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md).

The classic batch failure is the runtime directory. Podman refuses to run rootless when XDG_RUNTIME_DIR points at a directory the current user does not own, which is exactly the situation on a CI runner where the account was never logged in interactively (w=0.86, https://github.com/podman-container-tools/podman/issues/13338). The failure compounds under nesting: inside a podman-in-podman setup, XDG_RUNTIME_DIR gets set within the container to /run/user/0 and podman then checks the uid against that directory's owner, breaking the rootless assumption a second time (w=0.84, https://github.com/podman-container-tools/podman/discussions/21016). A CI troubleshooting checklist confirms the sweep that batch mode demands: user namespace support, subuid/subgid mappings, XDG_RUNTIME_DIR, and storage driver compatibility (w=0.18, weak, https://oneuptime.com/blog/post/2026-03-18-configure-rootless-podman-ci-environments/view).

User services are the second gap. Managing user-scoped systemd services on GitHub Actions runners is not obvious, because the runner user has no interactive login session to host a user manager (w=0.08, weak, https://www.linkedin.com/pulse/how-run-rootless-podman-service-github-actions-%D0%B4%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9-%D0%BC%D0%B8%D1%88%D0%B0%D1%80%D0%BE%D0%B2). The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) encodes this as the batch column's daemon-owner row: the runner user owns a rootless store, but tools that expect a live user manager cannot see it, so batch jobs run container tools directly rather than through user services.

## PATH: append, never replace

The yubiOS convention for batch PATH is append-only (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01, recorded as the PR #132 lesson): the job prefixes or appends the directories it needs (for example sbin paths for tooling) and never replaces PATH wholesale, because the runner's default PATH is the only shared contract across steps. This mirrors what the interactive mode gets for free from the login environment and what daemon mode declares explicitly (doc 03).

## Non-TTY output contracts

Batch jobs run without a TTY, and CLI behavior changes under that condition. A CLI design reference treats this as a core contract: interactive vs non-interactive is one of the first things a command-line program must detect (w=0.65, https://clig.dev/). Concrete failure mode: a tool that prints a quiet-mode banner but still prompts for a y/n answer hangs automated environments indefinitely, which is the mechanism behind jobs that sit until the runner timeout kills them (w=0.80, https://github.com/openai/codex/issues/1340). The purpose-built fix is a real non-interactive entrypoint: a dedicated exec subcommand designed to run from scripts and CI jobs without opening an interactive UI (w=0.82, https://learn.chatgpt.com/docs/non-interactive-mode).

Tools that do handle non-TTY mode follow a common pattern: prompts fall back to matching flags, defaults, or optional values, a required value with no flag exits with a usage code instead of waiting, spinner animations stop, progress prints as sequential lines, and ANSI styling is stripped automatically (w=0.20, weak, https://www.oscli.dev/docs/non-interactive-and-ci). A widely requested variant of the same contract is gating on the CI environment variable: when it is set, skip prompts, disable colors, and avoid clearing the terminal (w=0.04, weak, https://github.com/vitejs/vite/issues/1673).

The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) applies these as batch requirements: NO_COLOR=1 and --quiet flags in batch legs, and the structural rule that no batch step may contain a prompt. The hang risk is not theoretical: a single tool that insists on a prompt holds the runner for hours, which is why the mode contract is enforced before a tool is wired into a workflow (doc 08).

## Idempotency across runner restarts

Batch mode requires idempotency because runners restart mid-job. The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) is that every batch step must be re-runnable after a runner restart: no step may depend on prior in-memory state, and each step either completes or leaves state that a re-run can absorb. This is the batch-side expression of the same property daemon mode gets from Restart=on-failure (doc 03): both modes assume the process can be killed and restarted at any point, so the work must tolerate it.

## Exit codes under set -e

The yubiOS batch pattern wraps risky commands with set +e, captures rc with $?, then restores set -e (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01), so that a SKIP outcome (rc 77) propagates as data rather than killing the job. Exit-code inspection in bash is the enabling mechanics: $?, status checks after commands, and conditional handling are the standard toolkit (w=0.57, https://linuxsimply.com/bash-scripting-tutorial/process-and-signal-handling/exit-codes/check-exit-code/). What systemd does with those codes is doc 04's subject.

## Summary

Batch mode is the mode that exposes environment assumptions. It hits the XDG_RUNTIME_DIR ownership invariant immediately (w=0.86, https://github.com/podman-container-tools/podman/issues/13338), it cannot rely on user services (w=0.08, weak, https://www.linkedin.com/pulse/how-run-rootless-podman-service-github-actions-%D0%B4%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9-%D0%BC%D0%B8%D1%88%D0%B0%D1%80%D0%BE%D0%B2), its non-TTY contract must suppress prompts or the job hangs (w=0.80, https://github.com/openai/codex/issues/1340), and it requires idempotency because the runner can restart under it.
