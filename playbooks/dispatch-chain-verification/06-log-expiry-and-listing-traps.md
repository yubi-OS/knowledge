# Log expiry and run-listing traps

Scope: the 2 residual traps the source playbook records in its Mechanism section: workflow logs that expire within minutes, and run listings that surface inner-chain runs under the wrong workflow filter.

## Trap 1: logs expire

The source doc records the observed behavior: `GET /runs/{id}/logs` returns 404 on runs roughly 15 to 30 minutes old. The prescriptive part is what to do after the first 404: diagnose from the file diff and the jobs endpoint, and stop polling. Polling a dead logs URL wastes requests and delays the diagnosis that is still available from 2 other sources.

The external mechanism behind the endpoint is documented on GitHub's side: the REST API provides log download and deletion for workflow runs, and log access is part of the workflow-runs resource surface (https://docs.github.com/en/rest/actions/workflow-runs, jev weight 0.95). The user-facing log workflow, viewing, searching, and downloading logs for each job in a run, is documented in the monitoring how-to (https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs, jev weight 0.96), and monitoring workflows generally is covered from the Actions documentation root (https://docs.github.com/en/actions, jev weight 0.94). GitHub also documents run management operations such as deleting a workflow run (https://docs.github.com/en/actions/managing-workflow-runs/deleting-a-workflow-run, jev weight 0.94).

The 15 to 30 minute expiry window is an internal-record observation from yubiOS's own history, not a published API guarantee, so the corpus records it as such. The diagnostic ordering it implies is durable regardless: file diff and jobs endpoint first, logs only while they exist.

## Trap 2: run listings mislead

The source doc's second trap: a run surfaced under `?workflow=ci.yml` may be an inner-chain run. The practical failure is identity misattribution: the agent filters the listing by the router workflow, sees a run, and reports it as the router run when it is actually one of the dispatched workflows. The remedy the playbook prescribes is mechanical: always report `name` and `path` together. The `path` field pins the run to its workflow file, so a misattributed run is visible in the report itself.

This trap connects to the identity-confirmation step in 04-inner-run-identity-and-jobs.md: the per-run `GET /actions/runs/{RUN}` call exists precisely because listing rows are a weak identity source. The listing is for discovery; the run object is for identity.

## How the 2 traps compose

Both traps punish the same habit: trusting an intermediate view instead of the authoritative object. The listing row can misattribute identity; the log URL can vanish; the jobs endpoint and the file diff remain. The playbook's verification pipeline is built to depend only on the durable sources: per-run identity from the run endpoint, per-job conclusions from the jobs endpoint, patch truth from the files endpoint, and the local parse check for the zero-jobs case (04-inner-run-identity-and-jobs.md).

A weak dig result is recorded here for completeness: the dorny/paths-filter repository appeared in the listing-trap query results (https://github.com/dorny/paths-filter, jev weight 0.43, weak) and is about conditional workflow execution by changed files, which is adjacent to filtering but not evidence for either trap. It is collected and weighted, not cited.
