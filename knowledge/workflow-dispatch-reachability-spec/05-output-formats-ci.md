# 05 - Output formats: text, JSON, and SARIF for CI consumption

Scope: how a reachability assertion reports findings in text, JSON, and SARIF, which severity model each format implies, and how GitHub ingests each one.

## Text for humans, JSON for CI

The yubiOS assertion offers `--output-format text` (default), `json`, and `sarif`. Text mode prints one line per finding, ordered severity first, ending in a summary line such as `Summary: 4 ERROR, 1 WARN, 1 INFO across 22 workflows`. JSON mode emits a findings array where each finding carries `file`, `severity`, `code` (`ORPHAN_WORKFLOW_DISPATCH`), `message`, and a `remediation` string, plus a `summary` object with counts and the orphan list (per the yubiOS spec, sections 2.3 and 2.4). The remediation field is what makes JSON mode useful in a CI log: the failure message tells the contributor exactly which group table to edit.

## SARIF and code scanning

SARIF (Static Analysis Results Interchange Format) is the channel into GitHub's code scanning UI: GitHub creates code scanning alerts in a repository from SARIF files, which can be uploaded with an action or the code scanning API (https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/integrate-with-ex, weight 0.86; https://docs.github.com/code-security/code-scanning/integrating-with-code-scanning/uploading-a-sarif, weight 0.65). The reference uploader is the codeql-action `upload-sarif` action, whose input is a SARIF file or a directory of SARIF files (https://github.com/github/codeql-action/blob/main/upload-sarif/action.yml, weight 0.83).

The conversion path is well trodden: security tools that do not emit SARIF natively ship converters, and Veracode's pipeline-scan-results-to-sarif converts its JSON output into SARIF for upload (https://github.com/veracode/veracode-pipeline-scan-results-to-sarif, weight 0.61). A reachability assertion follows the same shape: its findings are (file, rule, severity) triples, which is precisely SARIF's result model. Mapping is direct: `ORPHAN_WORKFLOW_DISPATCH` becomes a rule id, ERROR maps to `error` level, WARN to `warning`, and the workflow file becomes the artifact location. The `filter-sarif` action exists for trimming SARIF results before upload (https://github.com/advanced-security/filter-sarif, weight 0.65), which matters if the assertion ever runs with `--fail-on WARN` and floods the alerts list with informational findings.

For an audit-style check, SARIF buys surfacing (alerts appear in the Security tab with rule pages and remediation text) at the cost of extra tooling; the Qualys integration guide shows the same pattern for IaC scanners (https://docs.qualys.com/en/integration/iac/github/upload_sarif_file_on_github.htm, weight 0.79). The yubiOS gate keeps SARIF as an option but ships the artifact as JSON first (per the yubiOS spec, section 3).

## Artifacts as the transport

Whatever the format, the CI gate uploads the report as a workflow artifact so the run's evidence survives job teardown. The canonical uploader is actions/upload-artifact (https://github.com/actions/upload-artifact, weight 0.53), and the docs describe artifacts as the store-and-share mechanism for build and test output used for debugging failed runs (https://docs.github.com/en/actions/tutorials/store-and-share-data, weight 0.88). The yubiOS gate uploads `reachability.json` under the name `dispatch-reachability-report` with `if: always()`, so a failing run still produces the report (per the yubiOS spec, section 3).

Test-result publishing is the other consumption route: the Publish Test Results action parses structured files including JSON and JUnit XML and publishes them on the run page (https://github.com/marketplace/actions/publish-test-results, weight 0.77). If the assertion emitted a JUnit-shaped failure list, the same report could render as a test case per orphan workflow. That is a viable alternative to SARIF when the team prefers the Checks UI over code scanning.

## Severity model

The three formats share one severity vocabulary: ERROR (contract violation, fails the job when `--fail-on ERROR`), WARN (suspect but not certainly broken, fails only when `--fail-on WARN`), INFO (contextual, never fails). The `--fail-on` flag is the policy knob that separates detection from enforcement, which is what lets the same script run report-only in Phase 1 and as a required gate in Phase 3 (per the yubiOS spec, section 5).

