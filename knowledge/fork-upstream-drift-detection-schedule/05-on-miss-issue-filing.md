# 05 On Miss: Filing Issues When Drift Is Detected

Scope: filing issues or comments when drift is detected: the GitHub issues API, deduplication against open issues, and linking to a tracking issue.

## The API surface

GitHub's REST API is the integration surface for automation: create integrations, retrieve data, and automate workflows (docs.github.com REST API documentation, weight 0.92). Within it, the REST endpoints for issues cover viewing and managing issues including assignees, comments, labels, and milestones (docs.github.com rest issues, weight 0.55). GitHub also documents that issues and pull requests can be managed automatically using Actions workflows (docs.github.com manage your work with Actions, weight 0.82).

For the drift check this means the issue-filing step needs exactly three operations: list open issues (for dedup), create an issue, and create a comment on an existing issue. All three are covered by the issues REST surface above.

## One issue per drifted fork, or one tracking thread

Two filing shapes exist, and the daily cadence forces a choice:

1. One issue per drifted fork per event. The issue body carries the pinned SHA, the upstream SHA, the behind count, and the threshold in force. Marketplace tooling such as the auto-issue action supports automated issue creation with assignees, labels, and workflow integration (github.com marketplace auto-issue, weight 0.37, weak backing).
2. A persistent tracking issue per fork, with a dated comment per drift event. This trades per-event visibility for a single place that answers "how often does this fork drift".

The daily cadence makes shape 1 spammy without dedup, and makes shape 2 noisy without a summarizing convention (a comment only when the behind count changes meaningfully). A hybrid works: issue per fork on first drift, comments on updates, close on synced.

## Deduplication is mandatory, not optional

A daily cron filing issues without dedup generates 365 issues per year per fork. Weak-evidence sources nonetheless converge on the right pattern: the action-genai-issue-dedup project exists specifically to detect duplicate issues (github.com/pelikhan/action-genai-issue-dedup, weight 0.19, weak backing), and a semgrep-to-Linear automation documents the same discipline: deduplicate by checking existing issues before creating, and retry up to 3 times on network issues or API degradation (github.com/mark-chris/semgrep-linear-connection, weight 0.19, weak backing).

The dedup algorithm for a drift filer is small and deterministic:

1. Search open issues for the fork name and a stable marker (for example a label like `fork-drift` plus the fork name in the title).
2. If an open issue exists, append a comment with the new behind count and report artifact link instead of creating an issue.
3. If no open issue exists, create one with the label, an assignee, and the report link.
4. When a later report shows the fork synced, close the issue with a comment, so state in the tracker mirrors state in the report.

## Linking evidence into the issue

The issue is only useful if it carries its evidence: the drift report JSON (uploaded as a workflow artifact, named with the run id), the pinned and upstream SHAs, and the behind count at filing time. The issues REST surface supports labels and milestones (docs.github.com rest issues, weight 0.55), which is enough to route: a `drifted` label for triage, a `security-relevant` label when the drift window contains a security fix, and an assignee so the issue has an owner rather than a queue.

## Failure behavior of the filing step

The filing step runs after the detection step and must not take the workflow down with it. The retry pattern from the weak-evidence sources above (retry on API degradation, bounded attempts) is the right shape: bounded retries around the issues API, and a failed filing attempt should still leave the report artifact in place, because the report is the record and the issue is the notification. A filing failure that loses both is a silent miss; a filing failure that keeps the artifact is a recoverable one.
