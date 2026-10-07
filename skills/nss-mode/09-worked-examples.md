# 09 - Worked scoring examples

Scope: the three worked examples embedded in the source doc: a bare interactive shell script, a systemd service unit, and a GitHub Actions workflow, each scored dimension by dimension to a 0-20 total.

Note: this is an internal-record subtopic; the grounding spine is the source doc (yubi-OS/yubiOS skills/nss-mode/SKILL.md, Examples section). No searXNG dig was run for this doc because the examples are records of the rubric applied, not external facts; all claims below are attributed to the source doc.

## Example 1: a bare interactive shell script (2/20, Narrow)

The script under review does one thing: `read -p "Continue? [y/N] " ans`. The source doc scores it:

- interaction: 0. The prompt fires with no isatty(stdin) check, so under a pipe or CI the script hangs or consumes EOF.
- tty_terminal: 0. No piped-output handling at all.
- confirmation: 0. There is no `--yes` or `--force`; the prompt is the only gate.
- preview_check: 0. No `--dry-run` or `--check`.
- idempotency_force: 0. No convergence story, no force.
- failure_exit: 1. The script may have `set -e`, giving it a minimal failure posture.
- shell_errexit_pipefail: 0. No pipefail, no documented exceptions.
- duration: 1. It is a one-shot, and that much is clear.
- batch_streaming: 0. No input/output flow contract.
- lifecycle_daemon: 0. Nothing to own.

Total: 2/20, label Narrow. The source doc's verdict sentence carries the rubric's philosophy: "The interactive prompt is a liability under CI / pipe / agent invocation. Mode coverage is absent; needs a TTY check and `--yes`/`--force` flags minimum." The example demonstrates the scoring floor: even the most trivial script earns 1 point somewhere (duration), because one-shot is a real mode even when undocumented in detail.

## Example 2: a systemd service unit (9/20, Useful)

The unit is `Type=simple` running a foreground process. Scores:

- interaction: 1. It is a service entry; there is no stdin, but the mode is stated.
- tty_terminal: 2. TTY is irrelevant to the contract and logs go to journald, a documented non-TTY output path.
- confirmation: 0. Services take no confirmation flags.
- preview_check: 0. No check mode.
- idempotency_force: 1. The systemd restart policy gives partial rerun-safety.
- failure_exit: 2. `Restart=on-failure` is a real, observable failure contract.
- shell_errexit_pipefail: 0. No shell in the unit.
- duration: 2. Long-running, fully stated.
- batch_streaming: 1. Streaming by design.
- lifecycle_daemon: 2. Systemd owns the lifecycle.

Total: 9/20, label Useful. The doc's growth path is explicit: "Ready signal (`Type=notify`) and timeout (`TimeoutStartSec`) would push to Strong." Note how the dimension profile differs from Example 1: the service cannot prompt or preview, so those dimensions are structurally 0, while lifecycle and failure dimensions, invisible in the script, are where the service earns its score. The rubric is fair across artifact types because it scores the contract, not the artifact class.

## Example 3: a GitHub Actions workflow (9/20, Useful)

The workflow triggers on push (`if: github.event_name == 'push'`) with no `workflow_dispatch`. Scores:

- interaction: 2. CI only; no human in the loop.
- tty_terminal: 2. No TTY; logs are machine-readable.
- confirmation: 0. Nothing to confirm.
- preview_check: 0. No plan mode.
- idempotency_force: 1. Reruns work.
- failure_exit: 2. Step-level exit codes gate the run.
- shell_errexit_pipefail: 1. The runner's default `bash --noprofile --norc -eo pipefail` if set.
- duration: 1. One-shot per event.
- batch_streaming: 1. Batch per run.
- lifecycle_daemon: 0. No daemon involvement.

Total: 9/20, label Useful. The stated growth path: "Adding `workflow_dispatch` for manual trigger and `concurrency:` group cancellation would push to Strong." The interesting teaching point is that the workflow scores interaction and TTY higher than the human-facing script ever can: full automation is the strongest possible interaction contract, which is why the Mode axis treats CI as a first-class invocation context rather than an edge case.

## What the three examples prove together

1. The 20 points are distributed so that no artifact type can max every dimension: a service cannot do interactive confirmation, a script cannot have supervisor lifecycle. Cross-context comparisons remain honest because each dimension is judged against the tool's own class.
2. The label bands (Narrow at 0-3, Useful at 8-12) put a trivial prompt-only script at the floor and a competent one-context automation at mid-table; Strong requires multi-context behavior, not just more features in one context.
3. Every example names its concrete next steps (TTY check plus `--yes`/`--force`; `Type=notify` plus `TimeoutStartSec`; `workflow_dispatch` plus `concurrency:`), which is the lens format's delta field in prose form: the gap list is the output, not the score alone.
