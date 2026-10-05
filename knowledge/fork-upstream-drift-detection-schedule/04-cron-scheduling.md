# 04 Cron Scheduling on GitHub Actions

Scope: scheduled workflows for the daily drift cron: cron timing, off-peak scheduling, workflow_dispatch override, permissions, and artifact upload.

## The schedule trigger

GitHub Actions supports scheduled workflows through the schedule trigger with standard 5-field cron syntax; schedules run on the default branch only (cronread, weight 0.08, weak backing). Scheduled workflows also have a known failure mode: they can silently never fire. A maintainer discussion reports a scheduled workflow that never fired across two repositories over a full day of testing (github.com/orgs/community discussion, weight 0.27, weak backing).

That failure mode dictates the design: a cron-only drift check can stop checking without anyone noticing, which is worse than no check, because the report's absence gets misread as "no drift". Two mitigations cost nothing:

- Pair the schedule with workflow_dispatch so the check can be run on demand.
- Alert on the check itself (a run older than 48 hours is its own drift signal).

## Manual runs with workflow_dispatch

When a workflow is configured with the workflow_dispatch event, it can be run manually, and inputs can be passed at dispatch time (docs.github.com manually running a workflow, weight 0.92). The drift workflow exposes threshold_commits as a dispatch input with a default of 10, so an on-demand sweep can tighten the threshold without a code change. This also gives a clean testing path: dispatch the workflow on a feature branch before the cron ever fires on main.

## Timing: off-peak daily

The schedule fires daily at 06:00 UTC, chosen as off-peak with a buffer before US work hours (source schedule spec, OMN-160). General cron guidance for GitHub Actions covers the syntax through production-ready scheduled workflows (oneuptime, weight 0.17, weak backing) and notes the 5-field syntax and scheduling constraints including a minimum granularity around the five-minute mark (cronwizard, weight 0.11, weak backing). At one run per day the timing choice is mostly about when humans see the report: a morning-local-time report is read; an afternoon one ages overnight.

## Permissions

The workflow declares contents: read for the checkout and issue filing needs, and issues: write because filing drift issues is a workflow side effect, with pull-requests: read for fork state (source schedule spec). GitHub documents that issues and pull requests can be managed automatically using Actions workflows (docs.github.com manage your work, weight 0.82). The principle is to scope the token to what the job does: a read-only detection step plus a write-scoped issue-filing step, rather than one broad token.

## Artifacts: persisting the daily report

An artifact is a file or collection of files produced during a workflow run, persisted after the job completes and shareable between jobs (docs.github.com workflow artifacts, weight 0.63). The upload-artifact and download-artifact actions share data between jobs in a workflow (docs.github.com store and share data, weight 0.84), and the actions/upload-artifact repository is the maintained implementation (github.com/actions/upload-artifact, weight 0.71).

For the drift check, the JSON report is uploaded with a name keyed on github.run_id (fork-drift-report-<run_id>), so each day's report is a distinct artifact and historical runs stay addressable. The upload step runs with if: always() so the report is captured even when the issue-filing step fails, which matters because the report is the evidence and the issues are the action.

## What the cron buys and what it costs

A daily cadence bounds worst-case lag at roughly 24 hours of detection delay, which is cheap at 8 forks and 8 to 16 API calls per run. The costs to design around are silent non-firing (mitigated above) and artifact accumulation (retention policy, covered in the report-formats doc of this corpus). The cron is the least interesting and most load-bearing part of the system: every other component can be perfect and the system still fails if the schedule never fires.
