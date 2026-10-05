# 01 - The orphan-workflow problem: dispatchable workflows nobody can fire

Scope: why a workflow file that declares `workflow_dispatch` but has no membership in the orchestrator's group tables is invisible to dispatch tooling, and the yubiOS incident that made this a permanent CI assertion.

## The reachability contract

The yubiOS ci.yml orchestrator (PR #145, commit 9d6ec85d, merged 2026-07-29) groups leaf workflows into 7 dispatch groups: `firmware`, `tests`, `vm-tests`, `fetches`, `ci-builders`, `forks`, `all`. The operating contract is: every workflow file under `.github/workflows/` that declares a `workflow_dispatch` trigger must be reachable from at least one group table, so both the ci-launchpad app and a human operator can fire it on demand (per the yubiOS spec, refs/workflow-dispatch-reachability-spec). Anything dispatchable but unlisted is an orphan.

The failure mode is silent. A workflow with `workflow_dispatch` still parses fine, still passes actionlint, still shows green YAML. It just never appears in the orchestrator's dispatch surface. GitHub's own trigger semantics compound this: `workflow_dispatch` only triggers a workflow run if the workflow file exists on the default branch, so a newly added file is not even dispatchable from the API until it merges, which hides the gap during review (https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows, weight 0.97).

## The yubiOS incident

As of 2026-08-02, 4 yubiOS workflows were orphaned: `ci_test-fedora-bootc-arm64-pull.yml`, `ci_test-ftpm-tpm0.yml`, `ci_test_sealed-uki-vm.yml`, `diag_sign-matrix.yml`. All 4 were folded into the `tests` group by the ci-launchpad per-workflow dispatch update deployed 2026-08-02 (per the yubiOS spec's RECENT_ACTIVITY record). The orphan list is the historical record of the bug class; the post-fold baseline is 24 dispatchable workflows with 24 group memberships.

The class recurs for a structural reason: leaf workflow files and the orchestrator's group tables are edited through different paths. A contributor adds `ci_test_newthing.yml` with a `workflow_dispatch` trigger and forgets that ci.yml's `case "$GROUP"` dispatcher must also learn the new filename. Nothing in the repository fails. The workflow sits there, dispatchable in principle, unreachable in practice.

## Dispatch-tooling dependence on the contract

Cross-workflow dispatch tooling relies on the target being both configured for `workflow_dispatch` and discoverable. The Workflow Dispatch and Wait action, for example, triggers another workflow via the `workflow_dispatch` event and requires the target to be configured for that event type (https://github.com/marketplace/actions/workflow-dispatch-and-wait, weight 0.86). A tool like ci-launchpad goes one step further and enumerates workflows by group membership rather than by raw file listing, so a group-table omission directly removes the workflow from the operator UI.

Community reports show the symptom end of this surface, though with weak sourcing: Stack Overflow threads where a `workflow_dispatch` workflow does not appear in the Actions tab or cannot be run manually (https://stackoverflow.com/questions/75250667/github-workflow-workflow-dispatch-missing-in-actions-tab, weight 0.07; https://stackoverflow.com/questions/67523882/workflow-is-not-shown-so-i-cannot-run-it-manually-github-actions, weight 0.10). These are weakly backed, but they document that "declared dispatchable, not actually dispatchable" is a recurring operator confusion.

## Why an assertion, not an audit

Manual audits decay. The 2026-08-02 fold fixed 4 orphans at a point in time, but the next added workflow recreates the gap with no signal. The durable fix is a re-runnable assertion that encodes the contract: walk every `.github/workflows/*.yml`, detect `workflow_dispatch`, parse the orchestrator's group tables, and flag every dispatchable file that no group lists. That assertion is the subject of doc 04; its CI gate is the subject of doc 06.

