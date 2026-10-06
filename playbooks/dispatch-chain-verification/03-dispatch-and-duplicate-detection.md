# Dispatch and duplicate detection

Scope: the first 2 steps of the source playbook's mechanism: dispatch once, then list runs immediately to catch duplicate dispatches, and cancel duplicates with the documented endpoint and status code.

## Step 1: Dispatch once

The source doc's mechanism opens with a single POST to the workflow dispatch endpoint for ci.yml, with `ref` set to `main` and inputs carrying the `group` name and a free-text `reason` field. The response code is captured with `curl -w '%{http_code}'` and nothing else is assumed from it: the dispatch acceptance is not a run id and not a conclusion. The "1 dispatch per intent" rule is repeated in the source doc's Operational section, and duplicates are the failure it guards against.

The external mechanism behind the step is GitHub's dispatch API: a `workflow_dispatch` event creates a new workflow run for the named workflow file, and the run appears in the runs listing as its own object with its own id (https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow, jev weight 0.84; https://docs.github.com/en/rest/actions/workflow-runs, jev weight 0.95). The dispatch POST returning success means the event was accepted, not that a run succeeded; the run must be found by listing, which is exactly why step 2 exists.

## Step 2: List immediately, cancel duplicates

The source doc instructs listing the 10 most recent runs on `main` immediately after dispatching and reading, for each row: id, name, path, status, conclusion, created_at. The purpose is duplicate detection: 2 dispatches for the same intent land 10 to 20 seconds apart, and a duplicate run wastes runner time and, for the fetch workflows, produces unintended commits (see 09-operational-dispatch-discipline.md).

When a duplicate is found, the source doc prescribes `POST /actions/runs/{id}/cancel` and records the expected response: 202. GitHub's documentation for the runs endpoints confirms the cancel operation lives on the workflow-runs resource (https://docs.github.com/en/rest/actions/workflow-runs, jev weight 0.95), and the dedicated how-to page documents cancellation of queued or in-progress runs (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/cancel-a-workflow-run, jev weight 0.94). The cancellation reference explains the server-side semantics: cancelling re-evaluates the `if` conditions of all currently running jobs, and jobs whose condition now evaluates true are not executed further (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-cancellation, jev weight 0.89).

The changelog entry for force-cancel documents that a plain cancel request can leave stuck workflows, and that a force-cancel capability was added to the REST API while the existing cancel endpoint remained unchanged (https://github.blog/changelog/2023-09-21-github-actions-force-cancel-workflows/, jev weight 0.75). The source playbook does not use force-cancel; it stays on the plain endpoint and the 202 response. The plain endpoint is what the playbook's recorded process verifies.

## Why the duplicate window is 10 to 20 seconds

The 10 to 20 second figure is an internal-record observation from the source playbook's dispatch practice, not an API guarantee: it is the spacing observed between accidental double dispatches in yubiOS's history. The listing step is timed to catch that window, because once a duplicate has run to completion, cancelling no longer helps and the fetch workflows may already have committed. This is also why the source doc bans dispatching `group=all` in self-mode: 25 child dispatches in one burst risks the Actions API rate limit and makes duplicate detection structurally harder (1 group per dispatch; see 09-operational-dispatch-discipline.md).

## Verification posture

The mechanism steps are read-heavy by design: 1 write (the dispatch), then reads (the list), then at most 1 more write (a cancel), then per-run identity and job reads (04-inner-run-identity-and-jobs.md). Every conclusion in a report must come from a read made in the same turn as the claim (02-verify-before-claiming-rules.md). Weak corroboration note: a third-party guide to the cancel endpoint exists at https://www.getorchestra.io/guides/githubaction-cancel-a-workflow-run with jev weight 0.11, which is weak backing and is cited here only to record that it was collected and rejected in favor of the primary GitHub documentation.
