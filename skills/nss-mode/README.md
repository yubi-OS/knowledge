# nss-mode knowledge corpus

Minted from the ground source [yubi-OS/yubiOS skills/nss-mode/SKILL.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/nss-mode/SKILL.md) (14,139 bytes, fetched 2026-10-07). The corpus explicates the eleventh NSS axis: scoring a file's breadth and correctness of execution modes (interactive vs non-interactive CLI, dry-run, daemonization, one-shot, idempotency, exit semantics, TTY handling, batch vs streaming).

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-mode-axis-rubric.md](01-mode-axis-rubric.md) | The 0-5 coverage levels, breadth-and-correctness principle, label bands, POSIX anchoring |
| 02 | [02-interaction-tty.md](02-interaction-tty.md) | Dimensions 1-2: isatty prompt gating, piped output, NO_COLOR, TERM=dumb |
| 03 | [03-confirmation-bypass.md](03-confirmation-bypass.md) | Dimension 3: --yes/-y/--no-input/--force; skip-prompts vs override-safety-checks |
| 04 | [04-dry-run-idempotency.md](04-dry-run-idempotency.md) | Dimensions 4-5: --dry-run/--check side-effect-freeness, convergence, force vs idempotency |
| 05 | [05-exit-semantics.md](05-exit-semantics.md) | Dimensions 6-7: exit-code vocabulary, differences-found codes, errexit/pipefail |
| 06 | [06-duration-concurrency.md](06-duration-concurrency.md) | Dimensions 8-9: one-shot vs service, signals and drain, batch vs streaming, backpressure |
| 07 | [07-lifecycle-daemonization.md](07-lifecycle-daemonization.md) | Dimension 10: double-fork vs systemd Type=notify, sd_notify READY=1, restart, logs |
| 09 | [09-worked-examples.md](09-worked-examples.md) | The three worked scoring examples: shell script 2/20, systemd unit 9/20, CI workflow 9/20 |
| 10 | [10-composition-antipatterns.md](10-composition-antipatterns.md) | Composition map, anti-patterns, red-flag table, verification checks |

Docs 09 and 10 are internal-record subtopics (grounded in the source doc only, no dig). Docs 01-07 carry searXNG dig evidence with jev weights.

## Research summary

- Results collected: 132 (84 attempt-1, 48 attempt-2 redo results across docs 01, 03, 04, 05)
- Weight split: 26 high (>= 0.5) / 106 low (< 0.5)
- jev requests: 12 (1 outline score, 11 noul weighting batches), usage 14,911 input / 2,706 output tokens
- Redo digs: 4 (01, 03, 04, 05), one redo each, all with different queries; all redos recovered at least one >= 0.5 source
- Dropped at outline validation: 08-lens-format-patches (score 0.32, padding probability 0.76) - recorded as a gap below
- Skipped docs: none. All 9 kept subtopics were authored.
- Primary sources landed during the run: POSIX Utility Conventions (0.87), QNX Utility Conventions (0.83), exit(3) (0.82), no-color.org (0.59), apt-get manpages (0.85/0.64), Terraform plan reference (0.92) and tutorial (0.86), rsync man page (0.80), Bash Exit Status manual (0.92), GNU Coding Standards (0.86), Databricks batch-vs-streaming (0.83), Tokio graceful shutdown (0.83), sd_notify freedesktop (0.90) and man7 (0.83), systemd-notify (0.86), systemd.io container interface (0.72)

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide endpoint https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), agent-side probe skipped for speed per the skills-variant brief.

## Gaps

- 08-lens-format-patches: dropped at outline validation by the jev score metric (score 0.32, dominant padding verdict 0.76). The lens schema is still described in the source doc and referenced from docs 01 and 10 where the corpus needs it.
