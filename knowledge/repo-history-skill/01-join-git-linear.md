# Joining git and Linear event history

Scope: techniques for joining git event history (pull requests, commits) with Linear issue data via reference regexes, merge-commit links, and graceful fallbacks when identifiers are missing.

## The join problem

A repository's decision record is split across two systems. Git holds the atomic events: commits and the pull requests that merged them. The planning tracker holds intent: which issue a change serves, its priority, its state progression. Neither side carries the other's key by default, so an archive that mirrors both must derive the join from text and structural fields.

## Keyword linking in the git side

GitHub links a pull request to an issue either manually or through a supported keyword in the pull request description, the summary text added by the author at creation time (https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue, noul 0.9667). The supported keywords include Closes, Fixes, and Resolves followed by an issue reference. For an automated archive this means the PR body is the primary join surface on the GitHub side: a regex pass over the body is the cheapest way to recover the issue graph without extra API calls.

GitLab formalizes the same idea more strongly. Crosslinking creates relationships between issues, and it connects related issues to their related commits and merge requests through references in commit messages, branch names, and descriptions, working across projects (https://docs.gitlab.com/user/project/issues/crosslinking_issues/, noul 0.8271). The lesson for a cross-system archive is that reference surfaces include more than the body: branch names and commit messages are first-class join keys worth scanning.

## Pull requests are issues on GitHub

GitHub's REST model considers every pull request to also be an issue, and issue events triggered by pull request activity are available through the issue event and timeline event endpoints (https://github.com/github/docs/blob/main/content/rest/using-the-rest-api/issue-event-types.md, noul 0.5431; https://docs.github.com/en/rest/using-the-rest-api/issue-event-types?apiVersion=2022-11-28, noul 0.9567). The timeline endpoint exposes event types for activity in issues and pull requests, and each event type declares whether it occurs on pull requests, issues, or both (https://docs.github.com/en/rest/issues/timeline, noul 0.9208). This is the structural key that makes the git side joinable to a tracker: an archive can walk the event stream of each pull request and recover state transitions, references, and cross links as typed events rather than parsing prose alone.

## The merge_commit_sha join and its pitfalls

The precise commit-level join between a pull request and the commit graph runs through the merge_commit_sha field. Practitioners report that GitHub creates a surrogate merge commit on the refs/pull/:number/merge ref, and merge_commit_sha points at that test merge commit, which does not exist on either the base or the head branch (https://stackoverflow.com/questions/68061051/get-commit-sha-in-github-actions, noul 0.0503, weak backing; https://www.baeldung.com/ops/github-actions-commit-sha, noul 0.2464, weak backing). A second report describes merge_commit_sha as the SHA of the test merge commit GitHub builds to preview the merge (https://stackoverflow.com/questions/22331524/get-pull-request-merge-commit-sha-from-pull-request-number-using-github-api, noul 0.0749, weak backing).

Two consequences follow for an archive. First, the join is asymmetric: one pull request carries many commits, and merge_commit_sha names only the synthesized tip, not every head commit. Second, for merged pull requests the issue-event stream carries a commit_id on merge events that can be used to recover the merge commit from the events side as well (https://stackoverflow.com/questions/26625965/how-to-get-merge-commit-sha-for-merged-pull-request, noul 0.0379, weak backing). A robust archive joins commits to pull requests through merge_commit_sha specifically, and records the asymmetry instead of pretending the relation is one to one.

## What the pulls endpoint does not give you

The pulls endpoint does not return linked issues or project memberships, and developers have had to work around this by walking the timeline or the issue references (https://stackoverflow.com/questions/60717142/getting-linked-issues-and-projects-associated-with-a-pull-request-form-github-ap, noul 0.0406, weak backing; https://github.com/orgs/community/discussions/179613, noul 0.1938, weak backing). This is why an archive design should not treat the pull request object as self-contained: the cross-reference half of the join lives in the event stream and in the body text.

## Cross-system identifiers and fallbacks

On the tracker side the join key is the issue identifier that appears in git artifacts. For a Linear-backed workflow the identifier looks like OMN-123 in a PR body or a comment thread. But identifiers are not uniform: some items are referenced only by URL, and per-project keys can differ. An archive therefore needs a layered detection pass: first a strict identifier regex, then a URL pattern fallback that parses the issue id out of tracker links, and finally a per-project key map. When all three fail, the item keeps has_linear_ref at 0 and lands as an isolated point in the coverage curve, which is the honest state: an unjoined event should be visible as a sparse cell, not papered over with a guessed link.

## Design summary

1. Join pull requests to tracker issues by regex over PR body and timeline events, with URL-pattern fallback (https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue, noul 0.9667).
2. Join commits to pull requests through merge_commit_sha, knowing it names the surrogate merge commit (https://stackoverflow.com/questions/22331524/get-pull-request-merge-commit-sha-from-pull-request-number-using-github-api, noul 0.0749, weak backing).
3. Treat PRs as issues to reuse the event stream as the typed source of state transitions (https://docs.github.com/en/rest/using-the-rest-api/issue-event-types?apiVersion=2022-11-28, noul 0.9567).
4. Scan commit messages and branch names as secondary reference surfaces, the pattern GitLab formalizes as crosslinking (https://docs.gitlab.com/user/project/issues/crosslinking_issues/, noul 0.8271).
