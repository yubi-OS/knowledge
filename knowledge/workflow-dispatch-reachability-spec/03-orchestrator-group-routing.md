# 03 - Orchestrator group routing: the hub-and-leaf dispatch contract

Scope: how a central ci.yml dispatcher organizes leaf workflows into named dispatch groups, and the routing contract a reachability assertion has to verify.

## The yubiOS hub shape

The yubiOS ci.yml orchestrator (PR #145, commit 9d6ec85d, merged 2026-07-29) is a hub workflow: it declares 7 dispatch groups (`firmware`, `tests`, `vm-tests`, `fetches`, `ci-builders`, `forks`, `all`) and routes each group to a fixed list of leaf workflow files. The dispatcher itself is a `case "$GROUP"` shell block inside a `run:` step, where each branch echoes or invokes the leaf workflow files belonging to that group (per the yubiOS spec). The group tables live inside that shell literal, which is why a reachability checker has to parse them out of a string, not out of structured YAML keys.

As of the spec's snapshot, the routing covers 24 dispatchable workflows: 1 ci-builders entry for the main yubiOS-ci.yml plus ci_dev_image.yml and ci_mkosi-installer.yml, 1 firmware workflow, 2 vm-tests, 4 tests, 3 fetches, 8 forks, and the 4 formerly orphaned workflows now in `tests`. Every dispatchable file has exactly one group membership (per the yubiOS spec, section 4).

## The central-control pattern

The hub pattern generalizes beyond yubiOS. GitHub's agentic-workflows documentation describes a central control repository used as a control plane for large-scale operations such as security patches, policy rollouts, and configuration standardization (https://github.github.com/gh-aw/patterns/central-repo-ops/, weight 0.76). The yubiOS ci.yml is the same idea at repo scale: one entry point, many leaf capabilities, and a routing table that decides what an operator can reach.

Third-party tooling reproduces the shape too. The ethpandaops dispatchoor project is a GitHub Actions workflow that dispatches other workflows in configurable groups (https://github.com/ethpandaops/dispatchoor, weight 0.47, weak backing). Its existence confirms the pattern is common enough to warrant a dedicated tool, and also confirms the same gap: nothing in these tools verifies that the group tables stay in sync with the workflow directory.

## Alternative routing mechanisms

Two other mechanisms compete with case-statement group tables:

- Matrix-driven dispatch: a single hub job fans out over a matrix of workflow names or group names, using the matrix strategy to generate one job per member (https://docs.github.com/en/enterprise-server@latest/actions/using-jobs/using-a-matrix-for-your-jobs, weight 0.80; https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variatio, weight 0.96). Matrices can be built dynamically from event payloads, including `repository_dispatch` payloads (weight 0.96).
- Workflow-dispatch actions: marketplace actions that trigger another workflow by name via `workflow_dispatch` (https://github.com/marketplace/actions/workflow-dispatch, weight 0.42, weak backing in this context).

These change where the group table lives (a matrix literal in YAML instead of a shell case string) but not the contract: some enumerable list of leaf workflows must exist, and every dispatchable leaf must appear in it. The assertion's extraction step differs per mechanism, the orphan check does not.

## What the routing contract implies for the assertion

The reachability contract has two directions:

1. Forward: every workflow file with `workflow_dispatch` appears in at least one group table. Violation is an orphan and is the ERROR case.
2. Inverse: every filename listed in a group table exists as a workflow file in `.github/workflows/`. Violation is a stale or mistyped entry and is the WARN case, because it breaks one dispatch path without orphaning anything.

The inverse check matters as much as the forward one. Group tables are hand-edited strings; a typo'd filename routes to nothing at dispatch time with no CI signal. The bidirectional check is what turns a one-time audit into a maintained contract.

