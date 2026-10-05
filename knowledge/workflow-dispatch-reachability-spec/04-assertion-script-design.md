# 04 - Assertion script design: parsing workflows and group tables in both directions

Scope: the algorithm of a `workflow_dispatch` reachability assertion: walking the workflow directory, detecting triggers, extracting group tables from the orchestrator's run blocks, and asserting both orphan and stale-entry directions.

## Inputs and shape

The yubiOS spec fixes the CLI surface: `--repo-root PATH` (default `.`), `--ci-yml PATH` (default `.github/workflows/ci.yml`), `--output-format` (`text`, `json`, `sarif`), and `--fail-on ERROR|WARN|NEVER` (default `ERROR`). The default fail-on of ERROR means the assertion is CI-ready from day 1: orphans fail the job, warnings do not (per the yubiOS spec, section 2.1).

## Algorithm

The 7-step algorithm (per the yubiOS spec, section 2.2):

1. Walk `.github/workflows/*.yml` and parse each YAML file.
2. For each file that declares `workflow_dispatch` (or the YAML 1.1 `True` key that a 1.1 loader yields for `on:`), record the filename.
3. Parse the orchestrator and extract the group-to-file mapping from the dispatcher's group tables.
4. For every dispatchable workflow, check whether its filename appears in any group table.
5. Flag ERROR for any orphan workflow.
6. Flag WARN for any group-table path that appears stale, for instance where the table lists a path but the filename does not match a real file.
7. Assert the inverse direction: every workflow listed in a group table must exist in `.github/workflows/`.

Step 7 catches typos and stale entries after a workflow rename or deletion. It is the half of the contract most hand-rolled audits skip.

## Parsing hazards

Two parsing hazards dominate implementations:

1. The `on` key. In YAML 1.1 the unquoted scalar `on` is a boolean, so `yaml.safe_load` yields the key `True`, not `"on"`. The trigger check must test both `data.get('on')` and `data.get(True)`; a dedicated fixture exists for exactly this trap (https://www.testaroo.com/pipelines/github-actions/github-actions-on-key-yaml-boolean-trap, weight 0.54). A library that ports GitHub's own workflow parser exists as a heavier alternative (https://github.com/tomasrollo/py_actions_workflow_parser, weight 0.34, weak backing).
2. The group tables live inside a shell string. The orchestrator's dispatcher is a `case "$GROUP"` block inside a `run:` step, so the table is a YAML string literal, not structured YAML. The spec's parser scans all `jobs[*].steps[*].run` values for the case statement and extracts the `<file>.yml` tokens from each branch. This heuristic is intentionally simple; a more rigorous parser would build an AST, but the heuristic is sufficient for the bug class the assertion catches (per the yubiOS spec, section 2.5).

GitHub's workflow syntax reference fixes the file constraints the walker relies on: workflow files must have a `.yml` or `.yaml` extension (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, weight 0.94; https://docs.github.com/en/enterprise-server@latest/actions/reference/workflow-syntax-for-github-act, weight 0.91).

## Expected output

The text mode prints one line per finding with severity, file, and reason, plus a summary line (`Summary: 4 ERROR, 1 WARN, 1 INFO across 22 workflows` in the spec's example). JSON mode emits findings with a remediation hint per finding, for example "Add to a ci.yml group table (typically 'tests' or 'ci-builders' depending on workflow purpose)" (per the yubiOS spec, sections 2.3 and 2.4). Doc 05 covers the machine-readable formats and their CI consumption.

## Why not reuse an existing linter

Existing static checkers validate workflow syntax and action usage, not a repository-specific dispatch contract. actionlint checks for unexpected or missing keys and expression validity (https://pkg.go.dev/github.com/rhysd/actionlint, weight 0.67; https://github.com/rhysd/actionlint, weight 0.76), but it has no knowledge of a repo's group tables. A custom assertion is the only way to encode "this repo's orchestrator can reach every dispatchable workflow." A related precedent exists in the Attested Delivery docs, which define a catalog-completeness check that verifies every artifact is present in a catalog (https://attested-delivery.github.io/docs/reference/ci-and-pinning-workflows/, weight 0.56), the same completeness-assertion shape applied to a different inventory.

