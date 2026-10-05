# 06 Drift Report Formats and Retention

Scope: output formats for drift reports: human text, machine JSON, SARIF for code-scanning integration, plus artifact naming and retention.

## Three output modes and who reads them

The drift report has three audiences, and each deserves its own format:

1. Text mode for a human scanning a workflow log: one line per fork with pinned SHA, upstream SHA, behind count, and verdict, plus a summary line.
2. JSON mode for machines: the report schema carries report_date, threshold_commits, a forks array (fork, pinned_sha, upstream_sha, behind, verdict), and a summary block (drifted, minor_lag, synced, total). The JSON is what the issue filer consumes and what gets archived.
3. SARIF mode for integration with GitHub's code scanning surface.

## SARIF: putting drift into the code scanning UI

SARIF is the standard upload format for third-party analysis results into GitHub code scanning: GitHub documents SARIF files for code scanning and notes that files from third-party tools must use the supported SARIF version, with upload via GitHub Actions, the code scanning API, or the CodeQL CLI (docs.github.com about SARIF files, weight 0.94). Uploading a code scanning analysis from a third-party tool or CI/CD system is a documented how-to (docs.github.com uploading a SARIF file, weight 0.89), and the github/codeql-action upload-sarif action is the standard upload path with an input for the SARIF file or directory to upload (github.com/github/codeql-action, weight 0.65).

Mapped to drift: each drifted fork becomes a SARIF result whose message names the fork, the behind count, and the threshold. The win is routing: drift shows up where security reviewers already look, with the repository's code scanning alert lifecycle (open, fixed, dismissed) instead of a separate tracker. Conversion tooling exists for scanners that never added SARIF support (github.com/sarif-kit/sarif-kit, weight 0.45, weak backing), though for a JSON-producing drift script the mapping is direct rather than a conversion.

## Retention: the report's lifetime

Retention policy decides whether last month's drift reports still exist. GitHub changed Actions retention so one setting now covers checks, workflow runs, and statuses together, labeled as covering checks, statuses, artifacts, and logs (GitHub Blog changelog, 2026-10-01, weight 0.59). Organization settings configure the retention period, and the policy applies to data beyond GitHub Actions (docs.github.com configuring retention, weight 0.51). GitHub Enterprise Server documentation puts the configurable range at 1 to 400 days (docs.github.com enterprise server retention, weight 0.55). The default artifact and log retention is 90 days (getorchestra guide, weight 0.13, weak backing).

For a drift report the retention question is not storage cost, it is evidence value: the report is the record of when a fork first crossed the threshold, which is exactly the baseline data the threshold-tuning phase needs. If reports expire after 90 days and the threshold conversation happens at day 100, the baseline is gone. Two fixes:

- Set an explicit retention-days on the upload-artifact step, within the 1 to 400 day range.
- Or treat the artifact as transient and commit a daily summary line (per-fork verdicts only) to a file in the repo, which lives forever and costs 8 lines a day.

## Artifact naming

Name artifacts with the run id (fork-drift-report-<run_id>) so each day's report is distinct and addressable by run. A stable name that overwrites (fork-drift-report) keeps only the latest report, which destroys the history the retention section just argued for. The upload step runs with if: always() so the artifact exists even when a later step fails, and the issue filer links the artifact URL into the drift issue so every notification carries its evidence.

## Schema stability across formats

All three modes must express the same three verdicts (synced, minor-lag, drifted) and the same per-fork fields. The JSON schema is the source of truth: text is a rendering of it, SARIF is a projection of its drifted entries. Adding fields is safe; renaming or removing them breaks every consumer (issue filer, SARIF mapping, trend analysis), so version the report object if the schema will evolve.
