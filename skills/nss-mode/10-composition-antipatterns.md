# 10 - Composition, anti-patterns, and verification

Scope: how the Mode axis composes with the surrounding yubiOS skills, the anti-pattern list, the red-flag table, and the verification checks that gate the sweep output.

Note: this is an internal-record subtopic; the grounding spine is the source doc (yubi-OS/yubiOS skills/nss-mode/SKILL.md). No searXNG dig was run: composition edges, anti-patterns, and red flags are records of the skill's own design, not external facts. All claims below are attributed to the source doc.

## Composition map

The source doc's composition table defines six edges:

| Partner | How it composes | Direction |
|---|---|---|
| `negative-skill-space` | Provides the 12-axis sweep framework; nss-mode owns axis #4 (Mode). NSS sweeps this axis on every cycle that asks for mode-gap finding. | negative-skill-space -> nss-mode |
| `curve-compass-skill` | Provides the lens-format patch generator and the Sigma ladder; nss-mode emits one lens per file in the same JSON shape. | curve-compass-skill <-> nss-mode |
| `github-actions` | Defines what `--check` / `workflow_dispatch` / `concurrency:` mean in yubiOS CI context; nss-mode scores workflows against these. | nss-mode -> github-actions |
| `systemd-hardening` | Defines `Type=notify` / `Type=oneshot` / `Type=simple` usage; nss-mode scores units against these. | nss-mode -> systemd-hardening |
| `recursive-self-improvement` | The closing loop: nss-mode proposes gaps; RSI applies the per-file patch. | nss-mode -> recursive-self-improvement |
| `context-isolation` | When running the cycle-11 sweep, run each file's lens in a fresh-context subagent so author bias from prior cycles does not re-anchor. | context-isolation -> nss-mode |

Two of these edges are consumption (nss-mode scores against github-actions and systemd-hardening conventions), two are framework (it is one axis inside NSS and one lens producer for curve-compass), and two are process (RSI closes the gaps it finds; context-isolation keeps the scoring honest). A maintainer adding an eleventh partner should decide which of those four roles the new edge plays before editing the table.

## Anti-patterns

The source doc lists seven:

1. Awarding points for keywords alone ("mentions `--dry-run`" = full credit). The rubric is behavior-first; a keyword without a contract is level-1 evidence at most.
2. Confusing `--check` with `--dry-run`. A check may validate drift without constructing the exact execution plan; the two have different semantic commitments.
3. Confusing `--force` with idempotency. Force bypasses; idempotency converges.
4. Confusing `&` (background) with daemonization. A daemon has ownership, readiness, signals, logs, and restart semantics.
5. Treating `set -e` as sufficient error handling. Errexit has exceptions in conditional contexts and pipelines; pipefail and explicit checks are still needed.
6. Reading "supports daemon mode" as full lifecycle coverage without foreground behavior, detachment or supervisor ownership, readiness, signals, logs, restart.
7. Shipping templated `## Mode -- cycle 11` sections without lens format. The patch is the lens; prose-only sections are disqualified.

Items 2 through 5 are also "important distinctions" in the source doc, stated positively; the anti-pattern list is the same content phrased as scoring errors, which is how a fresh-context scorer should hold them: as traps, not as trivia.

## Red flags

The red-flag table pairs an observation with its meaning. The nine rows:

| Observation | Meaning |
|---|---|
| `--dry-run` mutates state | the dry-run claim is false |
| `&` at end of `ExecStart` | not a real daemon, missing systemd lifecycle |
| No `Type=notify` / `READY=1` for a service with a readiness requirement | service accepts traffic before ready |
| `--force` resets state to a default | force is hiding non-idempotency |
| Color emitted when `NO_COLOR=1` | TTY handling broken |
| `set -e` without `set -o pipefail` | upstream pipeline failures hidden |
| Interactive prompt without `isatty(stdin)` | script hangs in CI |
| Lens has `delta: {}` or `score: 0` | the experiment did not run; lens is aspirational |
| 40+ lenses all verdict=YES score=50 | experiment is degenerate |

The last two rows are meta-level: they flag a broken sweep rather than a broken file. They make the rubric self-policing; a sweep that produces uniform perfect lenses has measured nothing, and the red-flag row for `delta: {}` catches lenses written to look like experiments without running one.

## Verification

The source doc defines two verification layers.

The structural check on the skill file itself: a python one-liner asserts the frontmatter matches `name: nss-mode` and a description line exists (source doc, Verification). It is deliberately minimal: the file's contract is enforced by the lens schema, not by prose linting.

The lens output schema: every lens carries lens, file, hypothesis, method, parameters, delta, verdict, score, caveat, all present; verdict is in {YES, PARTIAL, NO}; score is 0-50; and `parameters.axis == "mode"`. Anything missing a required field, with an out-of-range verdict or score, or with the wrong axis label, fails verification. This is the machine-readable half of the "patch is the lens" rule: the eight required fields are checkable, while their content quality is the scorer's responsibility.

## Changelog and provenance

The skill is version 1.0.0, dated 2026-08-12, built for RSI cycle 11 on PR #207. It was authored by Sauna (wave 2) against `negative-skill-space` SKILL.md, `curve-compass-skill` v1.1.0 (lens-format patch generator), a deepresearch output on mode-axis coverage covering CLI Guidelines, systemd, daemon, Bash, NO_COLOR, and The CLI Spec, and the cycle-7 PR #207 baseline of 391 atomic per-file NSS patches already on the branch (source doc, Changelog and Maintainer).

## Scoring notes

- Composition does not add points; it constrains them. A lens that scores `--check` using github-actions semantics must match what github-actions says `--check` means in yubiOS CI, or the score is wrong even if locally consistent.
- The anti-pattern list is the scorer's checklist; any of the seven observed during scoring should lower the relevant dimension, not just be noted.
- The red-flag table is the pass/fail layer beneath the 0-20 score: a file can score Useful and still fail on a red flag, which forces a rewrite rather than a tune-up.
