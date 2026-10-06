# The CONSTRAINTS.md artifact

Scope: Step 3, the one file at the repo root that carries the bar: the floor, the enforced-with-numbers table, the measured-not-enforced table, and the exceptions table. Primary source: the skill's Step 3 section.

## One file, at the root

The source doc specifies a single `CONSTRAINTS.md` at the repo root. The rationale: any agent on any harness can read it, and a change to it shows up in review where it belongs (source doc). A companion line goes into `AGENTS.md` and `CLAUDE.md`: read `CONSTRAINTS.md` before writing code, do not weaken it to make a change pass (source doc). External practice agrees that repo-level standards files are the accepted carrier for team conventions; a 2026 guide to `AGENTS.md` describes the file as the standard way to give coding agents repo-level instructions (https://blog.buildbetter.ai/agents-md-complete-guide-for-engineering-teams-in-2026/, jev weight 0.14, weakly backed), and Microsoft's engineering playbook keeps code-review expectations as markdown recipes checked into the repo (https://microsoft.github.io/code-with-engineering-playbook/code-reviews/recipes/markdown/, jev weight 0.38, weakly backed).

## The four sections

**Floor (always enforced, no setup required).** 5 prohibitions: no new suppression comments (`@ts-ignore`, `eslint-disable`, `# noqa`, `# type: ignore`); no unimplemented stubs (`throw new Error("Not implemented")`, empty `catch {}`); no skipped or deleted tests without a reason in the commit message; no secrets in source; and the file itself does not get weakened to make a change pass (source doc).

**Enforced with numbers.** A table with 4 columns: dimension, rule, checked by (the command), runs at (when it fires). The source doc's example rows cover types (`tsc --noEmit`, every edit), lint (`biome check`, every edit), secrets (`gitleaks detect --redact`, every edit), coverage of changed lines at 80 percent or more (`vitest run --coverage` plus git diff, task end and CI), code security (no high findings from `semgrep scan --config p/default`, CI), dependency security (nothing at high or above from `osv-scanner scan source -r .`, CI), accessibility (zero critical or serious via `axe $PREVIEW_URL`, preview deploy), and performance (LCP at most 2500 ms and CLS at most 0.1 via `lighthouse $PREVIEW_URL --output=json`, preview deploy) (source doc). The operative sentence: every row names the command that produces the verdict; a dimension with a number and no command in this column is an aspiration, not a constraint (source doc).

**Measured, not yet enforced.** Metrics recorded with today's value and a direction, for example project coverage 62.4 percent must not fall, bundle size 184 kB must not grow (source doc). This is the ratchet table; 08 covers the mechanism.

**Exceptions.** A table of rule, path, reason, owner, and expiry, for example a `no-explicit-any` exception for `src/legacy/**` tracked in an issue with an owner and a 2026-11-01 expiry (source doc). Exceptions are the sanctioned way to ship anyway; an exception with no owner or an expiry more than a year out is a red flag (source doc, see 09).

## Single source of truth

The commands live in 2 places: the checked-by column in `CONSTRAINTS.md` and convenience scripts (see 05). The source doc resolves the tension: the file is canonical because it carries the reason alongside each command and it shows up in review; the scripts must mirror it, and if they drift, the file wins (source doc).
