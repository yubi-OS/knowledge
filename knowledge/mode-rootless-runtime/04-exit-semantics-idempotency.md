# 04: Exit semantics and idempotency: rc=77 and the contract across modes

Scope: exit-code contracts across modes: capturing rc under set -e, the rc=77 SKIP-not-FAIL convention, SuccessExitStatus listing 77 in units, and why idempotency is mandatory in batch and daemon modes.

## The SKIP contract

The yubiOS convention (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01) fixes one exit code, 77, as SKIP rather than FAIL. The distinction is operational, not cosmetic: a FAIL should restart a daemon and fail a batch job, a SKIP should not. In daemon mode the unit lists 77 in SuccessExitStatus so a skipped run does not count against Restart=on-failure; in batch mode the rc is captured as data and branched on; in interactive mode a human reads it. The brief that this convention must be honoured in all three modes is the reason exit codes are a mode-axis concern at all.

## Batch mechanics: capture, do not abort

Batch scripts run under set -e for fail-fast behavior, but the SKIP contract needs the opposite for specific commands, so the yubiOS pattern toggles it: set +e, run the command, capture rc with $?, restore set -e (source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01). Checking the exit code of a command is the enabling mechanics: $? holds the status of the last command, and scripts branch on it or propagate it (w=0.57, https://linuxsimply.com/bash-scripting-tutorial/process-and-signal-handling/exit-codes/check-exit-code/). Setting custom exit codes from bash scripts and functions is likewise standard practice (w=0.14, weak, https://linuxsimply.com/bash-scripting-tutorial/process-and-signal-handling/exit-codes/set-exit-code/).

Trap-based cleanup preserves this contract across interruptions: as long as an EXIT trap does not call exit itself, the original exit value is preserved through cleanup (w=0.07, weak, https://stackoverflow.com/questions/5312266/how-to-trap-exit-code-in-bash-script). Capturing both output and the correct exit code from remote scripts is the same discipline applied over ssh (w=0.16, weak, https://unix.stackexchange.com/questions/66581/bash-shell-ssh-remote-script-capture-output-and-exit-code).

## Daemon mechanics: SuccessExitStatus

On the daemon side the contract is unit configuration. The systemd.service manpage specifies that an exit code of 0, or one matching SuccessExitStatus=, counts as success and execution continues to the next commands; it also documents systemd-analyze exit-status for translating between numeric statuses and names, a mapping added in version 189 (w=0.92, https://manpages.debian.org/testing/systemd/systemd.service.5.en.html).

Two systemd behaviors matter for anyone wiring the contract. First, SuccessExitStatus= affects only how the exit status is classified for the unit result; it does not change the textual FAILURE display, which always shows the numeric code and its table name (w=0.37, weak, https://github.com/systemd/systemd/issues/15757). Second, combining an exit status with a signal in one SuccessExitStatus= entry is a known limitation, filed as an enhancement request against the option (w=0.34, weak, https://github.com/systemd/systemd/issues/33431).

Exit-code provenance is where the SKIP contract earns its keep in monitoring. A monitor that pages on a raw process exit cannot distinguish a real failure from a legitimate stop such as a deploy, a reboot, or systemctl stop; systemd treats SIGTERM as clean termination for a normal service but not for a Type=oneshot job, so a periodic oneshot killed by an external SIGTERM trips alerts (w=0.65, https://max.nardit.com/articles/an-exit-is-not-a-verdict). The same article's framing explains the daemon failure mode in the source ref: when systemd restarts a unit after every nonzero exit, a recurring benign failure becomes a heartbeat and stops looking like a failure at all.

When the daemon wraps third-party executables, exit codes cannot be trusted blindly, and operators need to treat unexpected exits as failures deliberately (w=0.05, weak, https://unix.stackexchange.com/questions/734114/make-systemd-treat-unexpected-exit-as-failure). The yubiOS convention is the inverse discipline: define which codes mean SKIP, list them in SuccessExitStatus, and let everything else be a failure.

## Idempotency: the shared precondition

Idempotency is what makes exit semantics survivable. In batch mode, every step must be re-runnable after a runner restart, because the runner can die mid-job and re-run the step (yubiOS convention, source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01). In daemon mode, Restart=on-failure assumes the same property, so a service that is not idempotent corrupts state on every restart cycle. The yubiOS rule is that both modes require it structurally, and interactive mode does not, because a developer simply retries by hand.

The two requirements interlock: a SKIP result (rc 77) must leave state identical to not having run at all, otherwise the batch re-run and the daemon restart both misbehave. This is why the contract is written once and honoured in all three modes rather than per mode.

## Generic exit-code reference

Background reference material on reading exit codes from the terminal, from scripts, and with logical operators rounds out the mechanics (w=0.31, weak, https://www.geeksforgeeks.org/linux-unix/how-to-use-exit-code-to-read-from-terminal-from-script-and-with-logical-operators/), and capturing output plus exit codes in wrapped shells is the same pattern applied to remote execution (w=0.16, weak, https://unix.stackexchange.com/questions/66581/bash-shell-ssh-remote-script-capture-output-and-exit-code).

## Summary

The mode axis changes who reads an exit code: a human, a pipeline, or a unit manager. The rc=77 SKIP contract makes that reader agree with the intent, batch mode implements it with set +e capture (w=0.57, https://linuxsimply.com/bash-scripting-tutorial/process-and-signal-handling/exit-codes/check-exit-code/), daemon mode implements it with SuccessExitStatus= (w=0.92, https://manpages.debian.org/testing/systemd/systemd.service.5.en.html), and both batch re-runs and daemon restarts assume idempotency (yubiOS convention, source ref: yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01).
