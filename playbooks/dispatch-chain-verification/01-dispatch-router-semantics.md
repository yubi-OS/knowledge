# Dispatch router semantics

Scope: what ci.yml actually is in the yubiOS CI tree, why its conclusion proves nothing about the workflows it dispatches, and the exact reporting posture that follows. This doc explicates the Context section of the source playbook.

## The router, in the source doc's own words

The source playbook (yubi-OS/yubiOS playbooks/dispatch-chain-verification.md) states the mechanism directly: ci.yml is a group router. It dispatches each workflow in the group independently. There is no chain, no `needs:`, and no callback read. The consequence the playbook draws is exact: ci.yml with `conclusion=success` means exactly one thing, its single dispatch job ran. Every inner run can still fail.

This is not a bug in the router. It is the design. A GitHub `workflow_dispatch` event starts one workflow run for one workflow file; the dispatched file is a separate run object with its own id, its own status, and its own conclusion. GitHub's own documentation confirms the model: `workflow_dispatch` and `repository_dispatch` events always create workflow runs even when triggered with the repository's `GITHUB_TOKEN` (https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow, jev weight 0.84). The dispatcher and the dispatched are distinct runs, so the dispatcher's success says nothing about the dispatched work.

## What the outer conclusion covers, precisely

Reading the REST API surface makes the separation concrete. The workflow runs endpoints list, view, re-run, and cancel runs, and each run carries its own `status` and `conclusion` fields (https://docs.github.com/en/rest/actions/workflow-runs, jev weight 0.95). The workflows endpoints treat each workflow file as its own object (https://docs.github.com/en/rest/actions/workflows, jev weight 0.93), and the Actions REST API as a whole is organized around these separate resources (https://docs.github.com/en/rest/actions, jev weight 0.94). A router run and its inner runs appear as separate rows in that model. Nothing in the API rolls a chain of runs into one verdict, so nothing in a report should either.

## The recorded violation this rule exists for

The source doc grounds the rule in the PR #150 cycle of 2026-07-29, which produced 5 violations of the outer-versus-inner confusion in one session. Violation (c) is the router-semantics failure: `ci.yml` `conclusion=success` was reported as "chain green" with no inner reads. The full record of that session, including the other 4 violations, is kept in 08-recorded-failure-evidence.md in this corpus. The router doc and the failure record are 2 views of the same lesson: the outer run is a dispatch envelope, not a verdict.

## Reporting language that follows from this

When the outer run is green, say exactly that and no more: the router's dispatch job succeeded. The playbook's reporting template requires listing inner runs verified and inner runs unverified as separate fields, precisely so an outer green never gets promoted to a chain verdict. The corollary discipline is documented in 02-verify-before-claiming-rules.md: no run ID, conclusion, or merge state without a fresh API call in the same turn.

## Why no dig went deeper here

The router's behavior in ci.yml is an internal-record fact about yubiOS's own workflow tree, documented in docs/CI_MAP.md for group membership (source doc). The external mechanism, how dispatch events create runs, is covered by the GitHub documentation cited above. The 2 queries recorded for this subtopic in the research-db digs file returned mostly generic GitHub marketing pages plus the 4 primary documentation pages kept here, so the dig was adequate without a redo.
