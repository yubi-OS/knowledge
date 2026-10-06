# 04 - Findings taxonomy and machine-readable output

Scope: designing an audit finding model: severity levels (ERROR, WARN, INFO), exit-code thresholds for CI, and machine-readable output formats (JSON, SARIF).

## Severity as policy, not decoration

An audit script is only useful if its severities map to actions. The yubiOS script uses three levels with distinct meanings:

- ERROR: the finding breaks a stated invariant, like a reference to the retired GH_TK secret. It blocks merge under the default `--fail-on ERROR` threshold.
- WARN: the finding is a hygiene debt, like a job that is less permissive than its workflow's top-level grant, or a secret reference that is not in the allowlist. It is visible but does not block in phase 1.
- INFO: the observation is neutral bookkeeping, like a workflow with a minimal permissions block and no secret references.

The severity-then-threshold pattern is standard across linters. alint documents exactly this mapping: a rule's level (error, warning, info, off) maps to the process exit code, and a `--fail-on-warning` flag tightens the gate for CI (https://alint.org/docs/concepts/start-here/severity-and-exit-codes/, weight 0.64). Specmatic's linter uses the same shape for gradual adoption: warnings do not fail the command, which lets a team introduce a rule as warn, resolve existing findings, then change it to error (https://docs.specmatic.io/features/linter/specification-formats/openapi/reports-and-exit-codes, weight 0.60). The vacuum OpenAPI linter exposes the same exit-code contract for CI/CD pipelines (https://quobix.com/vacuum/commands/exit-codes/, weight 0.67). The golangci-lint discussions show the edge case worth deciding up front: a tool can exit 1 if anything was found regardless of severity, or always exit 0 with a workaround, and the difference matters to downstream gates (https://github.com/golangci/golangci-lint/discussions/2639, weight 0.56).

The yubiOS choice is a threshold model: `--fail-on ERROR|WARN|INFO|NEVER` selects the minimum severity that produces a nonzero exit. That is what makes the phased migration in doc 07 possible without changing the script: the same binary serves advisory runs (fail-on NEVER or INFO), then error-only gating (fail-on ERROR), then strict gating (fail-on WARN) as the baseline is cleaned.

## SARIF as the interchange format

For CI integration, SARIF (Static Analysis Results Interchange Format) is the industry standard format for the output of static analysis tools (https://sarifweb.azurewebsites.net/, weight 0.68). The normative document is the OASIS SARIF Version 2.1.0 specification, which defines the standard format for static analysis tool output (https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html, weight 0.93), maintained by the OASIS SARIF technical committee whose charter is interoperability standards for detecting software defects and vulnerabilities (https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=sarif, weight 0.88). Microsoft's sarif-tutorials repository provides user-friendly documentation describing SARIF as a powerful and sophisticated format suited to a wide variety of tools (https://github.com/microsoft/sarif-tutorials, weight 0.85).

The practical mapping from the yubiOS finding model to SARIF is direct: each finding becomes a `result` with the file path and line number as the location, the finding code as the rule ID, the severity level as the result level, and the remediation text as the message. The JSON mode the script ships (`--output-format json`) is a simpler intermediate for grep-friendly CI consumption, with SARIF as the interoperability upgrade path.

## The finding record

Every finding carries the same fields regardless of output format, so consumers never parse two shapes:

- `file`: workflow filename, relative to the repo root.
- `line`: line number in that file, when the parser can attribute one.
- `severity`: ERROR, WARN, or INFO.
- `code`: a stable machine identifier, such as GH_TK_REFERENCED, UNKNOWN_SECRET, JOB_LESS_PERMISSIVE_THAN_WORKFLOW.
- `message`: a human sentence, including context like the cleanup date that makes an ERROR self-explanatory.
- `remediation`: the concrete fix, such as "Replace with github.token; ensure permissions: {contents: write} is declared at workflow or job level."

Stable codes matter because the CI gate, the weekly drift scan, and any future dashboards key off codes, not prose. This is the same property that makes SARIF's rule-ID model central to the spec (https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html, weight 0.93).

## Summary block

Every run ends with a machine-countable summary: errors, warnings, infos, and files scanned. The text mode prints it as `Summary: 0 ERROR, 1 WARN, 22 INFO across 22 workflows`; JSON mode emits the same counts as an object. The summary is what a gate compares against a threshold and what a drift scan diffs week over week, which is the point of running the audit on a schedule in addition to per-PR.
