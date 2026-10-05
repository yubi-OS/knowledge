# mode-rootless-runtime

Knowledge corpus on rootless build and runtime execution modes: interactive vs batch vs daemon operation for rootless container builds and runtimes, and the mode-specific constraints. Minted 2026-10-05 from yubi-OS/yubiOS refs/mode-rootless-runtime-2026-09-01.md.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-interactive-shell-mode.md](01-interactive-shell-mode.md) | Running rootless builds in a developer login shell: user-owned daemon socket under XDG_RUNTIME_DIR, login PATH, TTY-driven prompts, why privilege problems stay hidden. |
| 02 | [02-ci-batch-mode.md](02-ci-batch-mode.md) | Unattended batch execution on ephemeral CI runners: runner user, runtime-dir ownership failures, PATH appended not replaced, NO_COLOR and --quiet, idempotency across runner restarts. |
| 03 | [03-daemon-mode-systemd.md](03-daemon-mode-systemd.md) | Long-lived rootless daemons under systemd: podman.socket user units, quadlet for nologin accounts, DynamicUser, ExecSearchPath, NoNewPrivileges, journald, Restart=on-failure. |
| 04 | [04-exit-semantics-idempotency.md](04-exit-semantics-idempotency.md) | Exit-code contracts across modes: set +e rc capture, the rc=77 SKIP-not-FAIL convention, SuccessExitStatus, exit-code provenance, and structural idempotency. |
| 05 | [05-tty-stdio-constraints.md](05-tty-stdio-constraints.md) | What TTY presence or absence does to rootless tooling: isatty-driven output contracts, batch hangs on prompts, ANSI stripping, journald as the daemon terminal. |
| 06 | [06-dry-run-verification-modes.md](06-dry-run-verification-modes.md) | Dry-run and verification surfaces per mode: bcvk --dry-run, --check legs in CI, Docker build checks, systemd-analyze verify, and what offline verification cannot catch. |
| 08 | [08-isolation-constant-mode-coverage.md](08-isolation-constant-mode-coverage.md) | The mode-invariant isolation boundary (namespaces, capabilities, seccomp) and the yubiOS rule that every rootless tool runs in at least two of the three modes. |

## Research summary

- Results collected: 96 (8 subtopics x 2 queries x top 6 kept per query)
- Weight split: 31 results at weight >= 0.5 (authoritative backing), 65 below 0.5 (weak, labeled in text)
- jev requests: 42 total (1 searxng-independent decide probe, 1 outline validation, 40 weighting across two passes), usage 32355 input / 0 output tokens
- Redos: 4 weighting requests retried on HTTP 429 and all recovered; 0 dig redos
- Skipped docs: 07-fido2-enrollment-crossing, dropped at outline validation (score 0, argmax 0.857 on "padding: drop"); its dig was executed and its results are in archive.json, but no doc was authored

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## research-db

- preflight.json: searxng probe (88 results returned) and /api/decide probe (clef, score question)
- outline.json: 8 subtopics, validation answers with raw probabilities, dropped [07], kept [01, 02, 03, 04, 05, 06, 08]
- archive.json: all 96 collected results with noul weight and full decision record each, redo_of null throughout (no result was rescored)
- digs/: one record per subtopic with queries_attempted, redo log, kept URLs, outcome
- jev-log.json: one entry per jev HTTP request with usage tokens
- db.ts: TypeScript interfaces for every shape above

## Gaps

- 07 fido2-enrollment-crossing: not authored. The source doc's FIDO2 material (systemd-cryptenroll root-plus-touch interactivity, software authenticator in the bcvk VM) is summarized inside doc 08's exception section, but a dedicated doc was dropped by the outline metric.
