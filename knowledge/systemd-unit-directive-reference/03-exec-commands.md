# Exec Commands: the ExecStart Family and Failure Semantics

Scope: the ExecStart command family (ExecStart, ExecStartPre, ExecStartPost, ExecCondition, ExecStop, ExecStopPost, ExecReload, ExecReloadPost), their ordering, prefix modifiers and failure or skip semantics.

## Start path ordering

The start path runs in a fixed order: ExecCondition=, then ExecStartPre=, then ExecStart=, then ExecStartPost=. The Debian manpage for systemd.service(5) describes this section as covering "command line parsing and variable and specifier substitutions for ExecStart=, ExecStartPre=, ExecStartPost=, ExecReload=, ExecStop=, and ExecStopPost= options" (https://manpages.debian.org/buster/systemd/systemd.service.5.en.html, weight 0.53), and the upstream page documents each directive's position in the sequence (https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html, weight 0.96).

Two properties of the pre and post commands matter for design. First, ExecStartPre= commands run serially and must not be long-running; the man page excludes daemons from ExecStartPre=. Second, a failure in ExecStartPre= stops the start job unless the command is prefixed with `-`, which downgrades the failure to a warning (https://man7.org/linux/man-pages/man5/systemd.service.5.html, weight 0.83). ExecStartPost= runs after the main process has been started, and `$MAINPID` is available to it, which makes it the hook for post-start wiring that needs to know which process became the main one (recorded in the yubiOS systemd reference: session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md).

## ExecCondition= exit codes are not failure codes

ExecCondition= has a deliberately different exit-code contract from ExecStartPre=. The man page text is exact: if the "ExecCondition= command exits with 255 or abnormally (e.g. timeout, killed by a signal, etc.), the unit will be considered failed (and remaining commands will be skipped). Exit code of 0 or those matching SuccessExitStatus= will continue execution to the next" command (https://man7.org/linux/man-pages/man5/systemd.service.5.html, weight 0.83). The gap is the 1 to 254 range: those exit codes skip the rest of the start commands, including ExecStart=, without marking the unit failed. A unit whose condition finds the world not yet ready exits with 1 and the unit simply does not proceed.

This distinction is a real source of confusion in the field. Stack Overflow and Unix StackExchange threads record the same surprise: an ExecCondition= that exits with status 1 does not prevent the unit from being considered successful, which the posters initially read as a bug (https://stackoverflow.com/questions/68491889/execcondition-doesnt-prevent-start-of-service, weight 0.03, weak backing; https://unix.stackexchange.com/questions/659647/execcondition-doesnt-prevent-start-of-service, weight 0.19, weak backing). The practical consequence documented in those threads: if a guard script must abort the start as a failure, it should exit 255, and choosing ExecCondition= over ExecStartPre= also changes how Restart=on-failure interacts with the guard, since a skipped condition is not a failure (https://unix.stackexchange.com/questions/726729/run-systemd-service-only-if-script-condion-is-true, weight 0.04, weak backing).

## Stop path: ExecStop= versus ExecStopPost=

ExecStop= is the ordered-shutdown hook: it runs on stop, and only if the service started successfully, with KillMode= still applying afterwards to whatever remains (recorded in the yubiOS systemd reference: session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md). ExecStopPost= is the unconditional hook: it runs on every stop path, including failure and crash paths, which is where cleanup that must always happen belongs. A Stack Overflow question about ExecStop firing immediately after ExecStart illustrates the ordering confusion users hit here (https://stackoverflow.com/questions/30640717/systemd-script-does-execstop-right-after-execstart, weight 0.03, weak backing).

## Reload path and the ExecReload family

ExecReload= defines what `systemctl reload` runs; the manager passes $MAINPID so the command can signal the right process. Since v259 an ExecReloadPost= runs after a successful reload (recorded in the yubiOS systemd reference: session/refs-mint/refs_corpus/systemd-unit-directive-reference-2026-07-23.md). For services speaking the notification protocol, the Type=notify-reload path supersedes the ExecReload= signal pattern entirely; see the service-types doc in this corpus.

## Prefix modifiers and scoping

Three single-character prefixes change how an Exec command is executed. A leading `-` ignores the command's failure. A leading `+` runs the command with full privileges, bypassing the unit's user and sandboxing restrictions. A leading `:` suppresses environment variable substitution in the command line. These prefix semantics are documented in the command-line parsing rules of systemd.service(5) (https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html, weight 0.96).

One scoping detail bites in chrooted setups: `RootDirectoryStartOnly=` controls whether the root directory "as configured with the RootDirectory= option (see systemd.exec(5) for more information), is only applied to the process started with ExecStart=, and not to the various other ExecStartPre=, ExecStartPost=, ExecReload=, ExecReloadPost= or ExecStopPost= commands" (https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html, weight 0.96). Without it, the helper commands must exist inside the chroot too.
