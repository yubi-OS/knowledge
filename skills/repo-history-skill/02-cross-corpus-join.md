# 02 - The Cross-Corpus Join

**Scope.** The three join keys that stitch the git and Linear sub-corpora into one corpus: OMN regex on PR body, merge_commit_sha on the PR, and the 40-hex SHA regex on bodies. Plus the four anti-patterns that break joins (title-only joins, truncated list bodies, short SHAs, and state-field confusion).

Grounding spine: the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md` (source doc).

## Join key 1: PR body to Linear issue

The regex `OMN-\d+` runs on the PR `body`. PRs that mention an OMN issue get `has_linear_ref` flipped from 0 to 1 (source doc). After cycle 2 the pattern was broadened to `OMN[-_]\d+` (underscore or hyphen), any linear.app URL path, URL-decoded %2F slashes, and query-string variants (source doc, Detection Patterns).

## Join key 2: commit to PR via merge_commit_sha

The precise join is `merge_commit_sha` on the PR to the commit SHA: not all PR commits, only the squash merge commit (source doc). GitHub documents three merge methods: merge commit, squash and merge, and rebase and merge (https://docs.github.com/en/pull-requests/reference/pull-request-merges, weight 0.93; https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github, weight 0.96). The squash method is the one that produces exactly one commit on the base branch, which is why the source doc calls this the precise join: under squash, one merge_commit_sha maps to one PR deterministically, and PRs whose merge commit is in the commit corpus get `has_pr_ref` set.

Why the precise join beats heuristic joins: the source doc records that heuristic joins such as PR title against Linear title produce false positives, and its cycle-2 audit put the residual cross-corpus gap on a workflow convention (PR bodies cite SHAs and PR numbers, not OMN ids) rather than on the regex. A third-party tutorial page covering the same merge-strategy territory is weak backing (https://learn.programmingline.com/learn/git/github-merge-strategies, weight 0.14, weak), as are an unaffiliated capability-matrix gist (https://gist.github.com/eduardosilvacodurance/c003aed1f2e88f7fe1f2659b8609cfca, weight 0.11, weak) and an auto-merge action repo (https://github.com/ridedott/merge-me-action, weight 0.45, weak). None of them contradicts the primary docs.

## Join key 3: body to SHA

The regex `[0-9a-f]{40}` runs on PR and issue bodies. Items referencing a commit SHA get `has_sha` flipped (source doc). The 40-character boundary is load-bearing: the anti-pattern list forbids joining via `commit.sha.slice(0, 7)` because multiple commits share short SHAs (source doc).

## Anti-pattern 1: title-only joins

The source doc gives a measured false-positive rate of about 30% for joining on PR titles because titles are short and noisy; the rule is to always join on body (source doc).

## Anti-pattern 2: the truncated list body

The PR list endpoint returns `body` truncated to 200 chars. Any join regex run over list output silently misses most matches; the rule is to fetch the full PR via GET /pulls/{n} for every body regex (source doc). The REST reference for pull requests documents the full fetch surface, including the raw-markdown media type (https://docs.github.com/en/rest/pulls, weight 0.96; https://docs.github.com/en/rest/pulls/pulls, weight 0.96; the versioned variant https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28, weight 0.96). The in-repo source of those reference pages is public (https://github.com/github/docs/blob/main/content/rest/pulls/pulls.md, weight 0.91). A third-party post describing truncation of GitHub REST list responses exists (https://techtoaster.io/github-api-curl-only-returns-a-subset-of-an-entire-list/, weight 0.12, weak); it is consistent with the source doc's measured behavior but is not primary evidence.

## Anti-pattern 3: merged state means nothing about progression

Treating `state: merged` as `has_state_progression: 1` is a listed anti-pattern: a PR can merge without progressing project state (a typo fix merged to main). The primitive flips on observed progression, not on the API state field (source doc).

## Anti-pattern 4: joining before refreshing

Running the join over a stale cached archive is listed as an anti-pattern; the cycle's first step is always refresh (source doc).

## Measured outcomes

The source doc's cycle-1 measurement on 34 PRs found `has_linear_ref` at 0.0% and `has_cross_corpus_link` at 0.0%, both constant-zero from regex false-negatives (line-constraint and Z-suffix issues). Cycle 2 broadened the regexes; the PR-only fixes for `has_linear_ref` and `has_cross_corpus_link` still returned 0.0%, and cycle 3 documented the root cause as repo workflow convention. The join keys themselves are sound; the corpus is the limiting factor (source doc, cycles 1 to 3). This is the honest reading to carry into any future refresh: a 0% coverage number on a join primitive is a hypothesis to investigate, not a verdict to accept.
