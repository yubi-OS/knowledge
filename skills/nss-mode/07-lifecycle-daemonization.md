# 07 - Process ownership and daemonization

Scope: dimension 10 of the Mode axis: foreground versus background, fork-and-detach versus systemd service types, readiness signaling, signals, logs, restart, and shutdown.

## What the dimension scores

The source doc defines dimension 10 as: "foreground vs background; signal handling; PID ownership; logs; readiness; restart; shutdown. For systemd: `Type=oneshot`, `Type=notify`, `Type=forking`, `Type=simple`." The scoring rule that follows from the distinctions list is strict: "Background (`&`) is not daemonization. A daemon has ownership, detachment or supervisor ownership, readiness, signals, logs, restart semantics" (source doc, Important distinctions). A file whose entire lifecycle story is an `&` at the end of `ExecStart` scores near 0; the red-flag table names that exact pattern as evidence the process is "not a real daemon, missing systemd lifecycle".

## The traditional fork-and-detach pattern

The classical daemonization recipe exists for a reason and a scorer should know it before grading whether a file documents it. The steps: fork so the parent can exit and the child is reparented, call `setsid()` to escape the controlling terminal and process group, and fork a second time so the daemon is not a session leader and can never accidentally reacquire a controlling terminal by opening a tty (https://0xjet.github.io/3OHA/2022/04/11/post.html, weight 0.11, weak backing; https://stackoverflow.com/questions/881388/what-is-the-reason-for-performing-a-double-fork-when-creating-a-daemon, weight 0.14, weak backing; https://unix.stackexchange.com/questions/715248/double-fork-why, weight 0.15, weak backing). The weak weights on these sources reflect that they are community explainers rather than primary documentation; the behavior itself is standard POSIX process-session semantics.

A file that documents this pattern with its whys (detach from terminal, reparent to init, lose session leadership) scores creditably on the traditional half of dimension 10. A file that says "supports daemon mode" without ownership, readiness, signals, logs, or restart scores at the red-flag level: the source doc calls out "reading 'supports daemon mode' as full lifecycle coverage" as an anti-pattern.

## The systemd alternative: stay foreground, signal readiness

The source doc's guideline is unambiguous for modern services: "Systemd `Type=notify` > `Type=forking` for new services. Prefer foreground + readiness signal over fork-and-detach."

The mechanism is sd_notify. The freedesktop sd_notify(3) manual page documents the wire format and the gating: "This is only used by systemd if the service definition file has Type=notify or Type=notify-reload set" (https://www.freedesktop.org/software/systemd/man/latest/sd_notify.html, weight 0.90). The assignment vocabulary is defined on the man7 page: "READY=1 Tells the service manager that service startup is finished, or the service finished re-loading its configuration" (https://man7.org/linux/man-pages/man3/sd_notify.3.html, weight 0.83). The systemd-notify command-line wrapper is the shell-script route to the same message, with `--ready` equivalent to sending READY=1 (https://www.freedesktop.org/software/systemd/man/latest/systemd-notify.html, weight 0.86). The same notification channel extends into containers: systemd running inside a container can report boot-up completion and functionality through sd_notify under the container interface (https://systemd.io/CONTAINER_INTERFACE/, weight 0.72).

The service-type matrix the source doc references maps directly onto readiness behavior: `Type=simple` runs a foreground process and considers the service started immediately; `Type=notify` waits for the READY=1 message before marking the service started; `Type=oneshot` runs a batch job once; `Type=forking` expects the process to fork and the parent to exit, the legacy pattern. The source doc's Example 2 scores a `Type=simple` service lifecycle_daemon: 2 because "systemd owns lifecycle", while noting that a ready signal (`Type=notify`) would push the unit from Useful toward Strong. That is the dimension in miniature: supervisor ownership is baseline, readiness is the differentiator.

## Signals, logs, restart, shutdown

The remaining five sub-contracts separate level 3 from level 4-5 files:

- Signals: which of SIGTERM/SIGINT/SIGHUP are handled and what each triggers (drain, reload, exit). SIGTERM-driven graceful shutdown is the long-running half of the contract (covered with dimension 8 in doc 06 of this corpus).
- PID ownership: who holds the PID file or whether systemd's cgroup tracking replaces it. Under Type=notify, systemd owns the process identity; no PID file needed.
- Logs: where output goes when no TTY exists (journald under systemd, a log file, or stdout to the supervisor).
- Restart: Restart=on-failure or equivalent policy, documented.
- Shutdown: what a clean stop looks like and how long it may take.

Example 2 of the source doc is the scoring model: interaction 1, tty_terminal 2 (TTY irrelevant, logs to journald), idempotency_force 1 (restart policy), failure_exit 2 (Restart=on-failure), duration 2, batch_streaming 1, lifecycle_daemon 2, total 9/20 Useful.

## Scoring notes

- Daemonization credit requires all of: ownership, readiness, signals, logs, restart. Missing any one caps the dimension.
- `&` inside ExecStart is a red flag, not a shortcut.
- Fork-and-detach and systemd are alternative answers to the same question; a file should pick one and document it fully rather than half-document both.
- Numbers as digits: dimension 10 is the last of the 10 dimensions, 0-2 points, of the 20-point total (source doc).
