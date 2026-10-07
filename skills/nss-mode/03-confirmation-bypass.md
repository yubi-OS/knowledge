# 03 - Confirmation and input bypass

Scope: dimension 3 of the Mode axis: confirmation and input bypass flags (`--yes`, `-y`, `--no-input`, `--force`), and the required distinction between "skip prompts" and "override safety checks".

## What the dimension scores

The source doc defines confirmation/input bypass as covering `--yes` / `-y` / `--no-input` / `--force`, and scoring full credit only when the file "distinguishes 'skip prompts' from 'override safety checks'" (source doc, Scoring dimensions). Two flags that look interchangeable encode different commitments: a bypass flag answers an interactive prompt the tool would otherwise ask; a force flag overrides a condition the tool decided is unsafe. Conflating them is a mode-contract defect, not a style issue.

## The apt-get case study

The apt-get manual page is the cleanest documented example of the split. Its `-y, --yes, --assume-yes` flag means: "Automatic yes to prompts; assume 'yes' as answer to all prompts and run non-interactively. If an undesirable situation, such as changing a held package, trying to remove an essential package or removing packages that were held in the previous release, then apt-get will abort" (https://manpages.ubuntu.com/manpages/xenial/man8/apt-get.8.html, weight 0.85). Read carefully: `-y` bypasses prompts but keeps the safety checks, which abort rather than proceed. The separate `--force-yes` option is the one that overrides the safety conditions, and its man-page entry carries an explicit "Never use it unless you know exactly what you are doing" warning (https://linux.die.net/man/8/apt-get, weight 0.64). The source doc's distinction is literally operationalized here: skip prompts (`-y`) versus override checks (`--force-yes`).

The rubric rewards a file that documents which side of this line each of its flags sits on. A tool whose only flag is `--force` and whose docs cannot say whether force answers prompts or overrides checks scores 1, not 2.

## The `rm -f` lineage

The `--force` convention traces to `rm -f`, which suppresses the prompt and ignores nonexistent files. The Command Line Interface Guidelines describe it as: "-f, --force: Force. For example, rm -f will force the removal of files, even if it thinks it does not have permission to do it. This is also useful for commands which are doing something potentially destructive" (https://clig.dev/, weight 0.33, weak backing). Note that even here force has two effects at once (skip prompt, override permission complaint); a mode contract should spell out which effects its own force flag has, because downstream callers cannot discover them from the flag name.

Modern agent-facing CLI specs push the distinction further: they treat `--yes` as auto-confirming interactive prompts and define a separate flag class for destructive operations that "specifically guards destructive operations in automated contexts" (https://github.com/cli-agent-spec/cli-agent-spec/blob/master/requirements/o-021-confirm-destructive-flag.md, weight 0.53, captured in the attempt-1 dig; weak-to-marginal backing). Framework guidance in the same direction: commands declare a danger level, frameworks enforce `--dry-run` availability for destructive commands, and `--yes` / confirm flags are opt-in per operation (https://cli-agent-spec.github.io/challenges/03-critical-security/23-critical-destructive-ops/, weight 0.20, weak backing).

## Prompt ergonomics are part of the contract

The `[Y/n]` suffix convention exists so a prompt communicates both accepted answers and the default action at a glance; it is borrowed from APT and recognized across Unix tooling (https://codemia.io/knowledge-hub/path/apt_command_line_interface-like_yesno_input, weight 0.11, weak backing). A documented mode contract specifies the prompt's default (capital letter means default) so that a caller piping answers into stdin can predict the no-input behavior. The askubuntu record of `apt-get -y` ("Automatic yes to prompts; assume 'yes' as answer to all prompts and run non-interactively") shows the same contract from the user side (https://askubuntu.com/questions/805067/is-there-a-way-to-force-yes-to-any-prompts-when-installing-from-apt-get-from, weight 0.11, weak backing).

## Scoring notes

- 0: no bypass flags at all; every invocation is interactive.
- 1: bypass flags exist but the doc does not separate prompt-skipping from check-overriding.
- 2: both flag classes exist with documented, distinct semantics, including what happens on undesirable-but-detectable conditions (abort, not proceed).
- The source doc's red flag "`--force` resets state to a default" applies here: force that hides non-idempotency is a separate defect scored under dimension 5 (mutation safety), not under this dimension.
- Mode composition interacts with this dimension: `--dry-run + --yes` and piped input + `--no-input` must behave as documented (source doc, Guidelines). A file that defines `--yes` but leaves its combination with `--dry-run` unspecified is incomplete on dimension 3 even if each flag alone is documented.
