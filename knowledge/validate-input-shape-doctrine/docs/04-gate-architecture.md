# CI Gate Architecture: The validate-input-shape Composite Action

Scope: the design of the static validator as a composite GitHub Action, its design contract, the findings report schema, the fixture suite, and the workflow that invokes it.

## Why a composite action

The gate ships as a composite action at `.github/actions/validate-input-shape/`: an `action.yml` manifest wrapping shell/Python steps, invoked by a caller workflow. Composite actions package reusable steps without a separate runtime (https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action, jev weight 0.96, high). The gate's job is purely static: parse each workflow YAML, validate each `workflow_dispatch.inputs` block against the doctrine rules, and emit a structured findings report. It reads files from the PR checkout only and makes no GitHub API calls at runtime, which makes it deterministic, fast (sub-10-seconds per workflow), and reproducible locally.

Existing off-the-shelf tools cover adjacent ground but not this contract. action-validator lints action and workflow YAML against published JSON schemas and is aimed at pre-commit hooks (https://github.com/mpalmer/action-validator, jev weight 0.62, high). json-yaml-validate validates repository JSON/YAML files against schemas in a `schemas/` directory (https://github.com/marketplace/actions/json-yaml-validate, jev weight 0.56, high). JSON Schema Validate wires schema selection into an action (https://github.com/marketplace/actions/json-schema-validate, jev weight 0.54, high). None of these encode cross-file dispatch contracts (dispatcher sends X to target Y that does not declare X), which is why the gate is a purpose-built validator rather than a schema check.

## The design contract

The primary validator is a Python module with four properties (source doc spec):

- **Deterministic.** Same input, same output. No timestamps, no random IDs, no network calls.
- **Local-first.** Runs against any directory tree; no GitHub API required for primary validation. The tag-set and dispatcher checks read multiple workflow files in the same tree, which is still local.
- **Composable.** Each rule is its own function; a finding is `(file, line, rule_id, severity, message, evidence)`. The composite output is the union of all findings, sorted by `(file, line, rule_id)`.
- **Reproducible.** A `--check-fixtures` mode runs the validator against `fixtures/` and asserts all bad fixtures fail and all good fixtures pass. This is CI for the validator itself.

Parsing uses `ruamel.yaml`, which preserves comments and key order, with the pyproject declaring `ruamel.yaml>=0.18` and `jsonschema>=4.0`. The workflow-syntax reference is the authority the validator's R1/R2 checks encode (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, jev weight 0.97, high).

## Rule checks

The validator implements eight checks, one per doctrine rule:

- **R1** (declared inputs): locate `on.workflow_dispatch`; handle the YAML 1.1 quirk where bare `on` parses as boolean `True`; emit info-level findings for `workflow_dispatch: null` and `workflow_dispatch: {}`.
- **R2** (explicit types): every input declares one of `string`, `boolean`, `choice`, `environment`; flag missing or invalid types.
- **R3** (required and defaults): required-without-default is a warning; boolean defaults must be true/false; choice inputs must declare `options`.
- **R4** (payload intersection, dispatcher side): for each dispatcher workflow, find every dispatch step, extract the inputs template, and assert every key is declared by every target the dispatcher reaches.
- **R5** (serialization): for every key bound to a `type: boolean` target input, assert the value is the JSON literal, not a quoted string.
- **R6** (lex-sort): for each drop-in directory, assert every yubiOS-prefixed file sorts where its declared intent (a header comment saying "fire after" or "fire before", defaulting to after) requires. Python's default byte-wise ASCII sort matches systemd-tmpfiles, modprobe, dracut, udev, and systemd drop-in ordering semantics.
- **R7** (tag coverage): for each build workflow, extract the tag forms emitted and assert the in-scope tag-form set is a subset.

R4 is explicitly structural and heuristic: it reads dispatcher source, so a dispatcher that computes inputs dynamically can evade it. The spec's position is to err toward false positives and offer an opt-out flag rather than attempt behavioral analysis.

## The findings report

Findings are emitted as JSON with version, validator name, ruleset version, a summary (`files_scanned`, `errors`, `warnings`, `info`), and a findings array where each entry carries file, line, rule_id, severity, message, and structured evidence (for example `target_workflow`, `undeclared_key`, and a source snippet for an R4 finding). The report is uploaded as a workflow artifact with 30-day retention, viewable in the Actions UI and downloadable for offline review.

## Directory layout and the invoking workflow

The action directory contains `action.yml`, `validate_input_shape.py` (primary validator), `lex_sort_check.py` (Rule 6 helper), `tag_set_check.py` (Rule 7 helper), `schemas/` (JSON Schema for the input block and for choice inputs), `fixtures/` (one good workflow plus four bad fixtures mirroring the four known failure rows), and a README. The gate workflow `validate-input-shape.yml` triggers on pull_request and push to main with paths limited to `.github/workflows/**` and the action directory, plus a weekly Sunday 09:00 UTC cron to catch drift from direct-to-main commits. It declares `permissions: contents: read`, runs on ubuntu-24.04 with a 5-minute timeout, checks out with `fetch-depth: 0` so the tag-set check can read historical tags, and passes a `fail-on` input (one of error, warning, never) through to the action.

Local reproduction needs no GitHub auth: install the two Python dependencies and run `python -m validate_input_shape` against any workflows directory with the drop-in dirs, push workflows, and dispatcher workflows as flags, or run `--check-fixtures` for the self-test.
