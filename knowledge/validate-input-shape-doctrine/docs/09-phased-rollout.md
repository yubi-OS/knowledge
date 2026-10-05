# Phased Rollout: Warn-Only to Required, and How to Roll Back

Scope: the three-phase migration plan for making the validate-input-shape gate mandatory, the branch-protection dependency, and the rollback story at each phase boundary.

## Why phases instead of a flag flip

A validator that starts as a merge-blocking gate on day 1 fails loudly on pre-existing debt and gets disabled. The rollout therefore moves enforcement in three small phases, each landable in one PR and shippable directly to main if needed, each with a quantitative pass criterion (source doc migration plan, per the project's minimal-targeted-fixes CI posture).

## Phase 1: land the action, warn-only (target 2026-08-08)

Scope: create the composite action directory (`action.yml`, `validate_input_shape.py`, `lex_sort_check.py`, `tag_set_check.py`, schemas, fixtures, README) and the invoking workflow, with `fail-on: warning`. Findings are reported as PR comments (one deduplicated comment per PR with stable anchors). A one-time audit run via `workflow_dispatch` on main produces a findings artifact to triage into separate Linear issues.

Pass criterion: the validator runs on every PR touching `.github/workflows/**`, findings are reported, no PR is blocked, and the tracker issue moves from Backlog to In Progress.

Risk mitigations: the parser must handle the existing workflow YAML without crashing (multi-line strings, anchors, comments), verified by one run against the live tree before the PR opens; and the validator must finish 25 workflows well inside the PR trigger's 5-minute timeout (rough estimate: under 2 seconds per workflow).

Phase 1 is additive only: 8 new files in the action directory, 1 new workflow file, about 600 lines, 0 changes to existing workflows.

## Phase 2: required for new workflows (target 2026-08-22)

Scope: `fail-on: error` for workflows that do not exist on main before the PR (new workflows), `fail-on: warning` for edits to existing ones. The validator detects "new" by comparing the PR's workflows directory against origin/main (`git diff --name-only origin/main -- .github/workflows/`), which needs the full checkout.

Pass criterion: any PR adding a new workflow is blocked if it has R1 through R5 errors; existing-workflow edits stay warn-only.

Risks: a renamed workflow counts as new (filename comparison, acceptable at this phase); intentionally relaxed experimental workflows get an opt-in per-workflow flag with strict as the default. About 80 new lines plus one edit each to the gate workflow and the action manifest.

## Phase 3: required for all PRs touching workflows/ (target 2026-09-05)

Scope: `fail-on: error` for any PR touching `.github/workflows/**`, full-diff re-validation of edited workflows, a second gate on push to main, and the weekly cron retained as the drift net.

Pass criterion: zero unaddressed R1 through R7 errors land on main over a rolling 30-day window, measured by asserting `summary.errors == 0` on the most recent main-branch run's findings artifact.

The dependency that makes Phase 3 different: branch protection must include `validate-input-shape` as a required check. Required status checks on a protected branch must pass before a pull request can be merged (https://docs.github.com/en/pull-requests/reference/status-checks, jev weight 0.96, high), and protected branches with required checks are the standard mechanism for preventing both bad merges and force pushes (https://github.blog/2015-09-03-protected-branches-and-required-status-checks/, jev weight 0.90, high). This is a maintainer decision, not a self-serve one: the check stays advisory until the branch-protection change is confirmed.

## The false-positive trade-off

Every linter rollout lives with false positives, and rules do not all agree with each other; some are right for one context and wrong for another (https://dart.dev/tools/linter-rules, jev weight 0.85, high). The gate's posture is deliberate: err on the side of false positives (find things that might be wrong) rather than false negatives, because a missed violation burns CI runners while a false positive costs a review comment. Opt-out flags (`--allow-experimental` per workflow, `--allow-dynamic` for legitimate dynamic dispatchers) are the pressure valve, and each is explicit and visible rather than silent.

## Rollback at every boundary

Each phase is independently revertible by reverting the relevant PR:

- Phase 1 rollback: delete the action directory and the gate workflow file.
- Phase 2 rollback: revert the `fail-on` default change in the gate workflow.
- Phase 3 rollback: revert the branch-protection change and set `fail-on: error` back to `warning`.

Nothing in the doctrine's data model (the findings schema, the fixtures) changes between phases, so a rollback never orphans state: findings artifacts from earlier phases remain valid JSON under the same schema.

## The deferred fourth phase

A scheduled registry-level reconciliation job (query Docker Hub or GHCR for the actual tag inventory of the image and assert it matches the in-scope tag forms) is explicitly deferred. It requires registry API access and its own credential connection, and it catches push-workflow bugs at the registry layer rather than the workflow YAML layer. It is recorded as a noted-but-deferred gap with its own single-intent trigger condition, not silently dropped (source doc Phase 4).

## What the phase gates buy

The phase design converts a cultural problem (implicit contracts in operators' heads) into a mechanical one (a required check) without a hard cutover: Phase 1 builds trust with findings-as-comments, Phase 2 applies enforcement only where there is no pre-existing debt (new workflows), Phase 3 extends it everywhere once the debt is triaged. The 30-day zero-error window is the empirical claim that the doctrine holds, not just that the gate is enabled.
