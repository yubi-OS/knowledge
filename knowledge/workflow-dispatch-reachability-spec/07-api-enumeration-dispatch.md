# 07 - Enumerating and dispatching workflows through the GitHub REST API

Scope: the REST endpoints that enumerate workflows, fire dispatch events, and verify runs, plus the token scopes and permission model each step needs.

## Enumeration: list repository workflows

The workflows REST surface starts at `GET /repos/{owner}/{repo}/actions/workflows`, which lists the workflows in a repository; anyone with read access to the repository can use the endpoint (https://docs.github.com/en/rest/actions/workflows, weight 0.82; the Enterprise Server variant documents the same read-access rule, https://docs.github.com/en/enterprise-server@3.2/rest/actions/workflows, weight 0.83). Each entry carries the workflow id, name, path, and state, which is the machine-readable inventory a reachability tool cross-references against the file tree. Third-party API mirrors document the same endpoint (https://mindcloud.co/docs/universal/rest/github/latest/actions/list-repository-workflows, weight 0.64), and the upstream docs source is itself public in the github/docs repository (https://github.com/github/docs/blob/main/content/rest/actions/workflows.md, weight 0.42, weak backing).

For a dispatch-reachability tool, enumeration answers the inverse question at runtime: does the set of workflows GitHub knows about match the set the file tree contains? A workflow file added on a non-default branch does not appear in this list until it merges, which is why the file-tree assertion (doc 04) and the API enumeration are complementary rather than redundant.

## Dispatch: firing a workflow

`POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches` fires a `workflow_dispatch` event, and the endpoint requires the workflow to be configured for that event (https://docs.github.com/en/rest/actions/workflows, weight 0.97). The docs note that OAuth tokens and personal access tokens need the appropriate scope for the dispatch endpoint, with the `workflow` scope as the classic-token requirement (weight 0.97).

Permission-wise, the operator needs rights to trigger the workflow. A community discussion catalogs the permission question directly (https://github.com/orgs/community/discussions/26622, weight 0.45, weak backing), and a Stack Overflow thread reports that triggering `workflow_dispatch` via the API required admin rights in practice (https://stackoverflow.com/questions/73400268/github-actions-must-have-admin-rights-to-trigger-workfl, weight 0.10, weak backing). Treat the exact permission matrix as something to verify against current docs rather than these weak sources.

Token scope has one additional wrinkle for automations: creating a release that targets a commit SHA that modifies an Actions workflow file requires the `workflow` scope or `workflows:write` when the SHA is not already on the default branch (https://github.blog/changelog/2023-11-02-github-actions-enforcing-workflow-scope-when-creating-a-rel, weight 0.68). Any bot that both touches workflow files and dispatches workflows needs this scope budgeted.

## Verification: runs and jobs

After a dispatch, verification polls the run and its jobs. The yubiOS verification recipe (per the spec, section 6) is: `POST /actions/workflows/ci_dispatch-reachability.yml/dispatches`, then `GET /actions/runs/{id}/jobs` to read the audit job output. Job-level polling is what turns a fire-and-forget dispatch into an assertion result: the gate job's conclusion (success or failure) plus the uploaded `reachability.json` artifact is the evidence chain.

## How this maps to the assertion

The API surface and the file-tree assertion cover different halves of the contract:

- The API enumerates what GitHub currently knows about (default-branch state only).
- The file tree assertion covers PR state, where the contract violation is born.

A reachability check that ran only against the API would miss every orphan added in an open PR. A check that ran only against the file tree would not notice a workflow GitHub has disabled or renamed. The yubiOS design keeps the API as the verification channel for the gate's own runs and leaves the contract check entirely in the file tree, which keeps the assertion hermetic and testable offline.

