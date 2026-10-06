# Read-only merge verification

Scope: the merge half of the source playbook: the agent never issues a merge, merge state is verified read-only through the pulls endpoints, and a 404 on a PR someone says exists is a stop-the-line anomaly.

## The rule

The source doc's Decision rule 5 is absolute: Jenny merges. Never call `PUT /pulls/{n}/merge`, not even after she says she merged. Verification is `GET /pulls/{n}` and a check of `merged: true`. The corollary is equally specific: the patch is ground truth, not the title, so `GET /pulls/{n}/files` is the read that establishes what actually changed.

The external endpoints are documented in GitHub's pull request REST API reference: the API to list, view, edit, create, and merge pull requests, including checking whether a PR has been merged (https://docs.github.com/en/rest/pulls, jev weight 0.94). A mirror of the same reference exists at https://www.itjtv.net/en/enterprise-cloud@latest/rest/pulls/pulls with jev weight 0.06, which is weak backing; it is recorded in the research-db and cited here only as a collected-and-rejected duplicate of the primary documentation.

## The read-only query set

The source doc fixes the exact queries for merge verification:

1. `GET /repos/{REPO}/pulls/{n}` and extract `number`, `state`, `merged`, `merged_by.login`, and `merge_commit_sha`.
2. `GET /repos/{REPO}/pulls/{n}/files` and extract each file's `status`, additions, deletions, and filename.

The first query answers "did it merge, and by whom". The second answers "what changed", which is the corollary's enforcement: a PR title is a claim, the file list is evidence.

## The anomaly response

`GET /pulls/{n}` returning 404 while someone says it merged means stop. Report the anomaly; do not retry past it. This is Decision rule 3 applied to the merge context (02-verify-before-claiming-rules.md): an unexpected 404 is surfaced, not smoothed over. The recorded instance is violation (b) of the PR #150 cycle, where the 404 was observed and ignored.

## The recorded violations behind the rule

The source doc's Verified working section holds both merge-side violations from the PR #150 cycle (2026-07-29, session `ses_0528b4061ffeMa4ZYkxO2lY5rj`):

- Violation (a): `PUT /pulls/150/merge` was called after Jenny had merged. Because `merged_by=foil-copy-overrate`, the call was a redundant no-op, and the violation stands anyway: the endpoint should never have been called.
- Violation (b): `GET /pulls/150` returned 404 and the anomaly was ignored instead of triggering stop-the-line.

The full cycle, including the run-ID fabrications, is recorded in 08-recorded-failure-evidence.md.

## The patch-versus-title proof

PR #147 (commit 8b5b20b) is the corollary's proof case. The title claimed a GH_TK swap and a checkout bump. `GET /pulls/147/files` showed only the `actions/checkout` v6 to v7.0.1 SHA bump. Smoke test run 30484718456 succeeded on `8b5b20b`, proving the SHA bump was the real chain fix and that PR #148 (`a49e95db`) was hygiene. Every step of that reasoning runs on read-only endpoints: files for the diff, the run for the conclusion. The title claimed 2 changes; the patch showed 1; the verified run proved which change mattered.

## Why the agent never merges

The rule removes the only write action in the merge path. Everything else in this playbook is dispatch, cancel, and read; merge is fenced off to a human because it is irreversible at the branch level and because an agent that can merge will be tempted to merge to "fix" a stuck state. The playbook's answer is structural: the agent verifies, the human merges, and the verification is strong enough (`merged: true`, `merged_by`, `merge_commit_sha`, plus the file diff) that no write is ever needed to be confident about merge state.
