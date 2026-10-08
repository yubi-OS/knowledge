# 02 - Interaction and TTY handling

Scope: dimensions 1 and 2 of the Mode axis: interactive versus non-interactive invocation, and terminal-environment awareness (isatty checks, piped output, NO_COLOR, TERM=dumb).

## Dimension 1: interaction (0-2)

The source doc defines the interaction dimension as: prompts fire only when stdin is a TTY; otherwise the program refuses with an actionable alternative rather than hang. The canonical failure is the script that does `read -p "Continue? [y/N] " ans` with no isatty guard: under CI, cron, or an agent runner the prompt consumes EOF, the read fails or hangs, and the invocation stalls. The source doc's Example 1 scores such a script interaction: 0 and calls the interactive prompt "a liability under CI / pipe / agent invocation".

A mode-aware file documents both sides of the contract: when prompts appear (TTY only) and what happens instead when they cannot (explicit refusal with a flag-level alternative, typically `--yes` or `--no-input`). Scoring a prompt without a TTY check earns 0, not partial credit, because the failure mode is a hang, the worst possible CI behavior.

The mechanics of the check are standard: the POSIX `isatty()` family reports whether a file descriptor is connected to a terminal; standard streams have fixed descriptors 0, 1, 2, so a program tests stdin, stdout, and stderr independently (https://zetcode.com/python/os-isatty/, weight 0.20, weak backing; https://stackoverflow.com/questions/1312922/detect-if-stdin-is-a-terminal-or-pipe, weight 0.14, weak backing). The dimension cares that the file documents the check and its consequence, not which language binding implements it.

## Dimension 2: TTY and terminal environment (0-2)

The source doc lists what this dimension wants covered: `isatty(stdin/stdout/stderr)`, piped versus terminal output, progress/color changes, and honoring `TERM=dumb` and `NO_COLOR`. Full credit (2) requires the file to demonstrate behavior across environments; Example 2 of the source doc awards tty_terminal: 2 to a systemd unit precisely because TTY is irrelevant to it and logs go to journald, a documented non-TTY contract.

### NO_COLOR

The NO_COLOR convention is an informal standard proposed in 2017: "Command-line software which adds ANSI color to its output by default should check for a NO_COLOR environment variable that, when present and not an empty string (regardless of its value), prevents the addition of ANSI color" (https://no-color.org/, weight 0.59). That is the primary source for the convention and it specifies the exact test: presence and non-emptiness, not the value 1. A mode contract that says "respects NO_COLOR" without the non-empty-string nuance is incomplete; a scorer following the rubric checks the documented behavior against this standard.

The Command Line Interface Guidelines extend the same treatment to terminals that cannot render escape sequences: when `TERM` has the value `dumb`, when the user passes `--no-color`, and they suggest an application-prefixed `MYAPP_NO_COLOR` environment variable as an override path (https://clig.dev/, weight 0.30, weak backing). Clig.dev also instructs that color and other TTY-dependent decoration must not be emitted to non-TTY stdout, which is the piped-output half of dimension 2.

## Why both dimensions live together

Interaction gating and terminal adaptation are the same underlying test (is this stream a human?) applied to two behaviors: what the program reads (prompts) and what it writes (color, progress bars). The source doc keeps them as separate dimensions because a file can handle one and not the other: a tool that never prompts can still blast ANSI color into a log pipeline. The red-flag table captures the failure: "Color emitted when `NO_COLOR=1`" means TTY handling is broken (source doc).

## Scoring notes

- A file earns the interaction point only with an actionable alternative documented, not merely a TTY check.
- A file earns the full TTY point only when piped output, `TERM=dumb`, and `NO_COLOR` are all addressed; mentioning one of the three is partial (1).
- Environment handling is part of the contract, not an implementation detail: every process carries its own environment-variable set, and that is the documented channel for these overrides (https://en.wikipedia.org/wiki/Environment_variable, weight 0.40, weak backing).
- CI context inverts the defaults: no TTY, machine-readable output, no color. A file whose only tested mode is the interactive terminal caps at level 2 (Basic) on the 0-5 scale regardless of how polished that one mode is.
