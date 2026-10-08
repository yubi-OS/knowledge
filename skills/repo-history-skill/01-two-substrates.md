# 01 - The Two Substrates: git and Linear Sub-Corpora

**Scope.** The five sub-corpora the repo-history archive is built from: four git sub-corpora fetched over the GitHub REST API and one Linear sub-corpus fetched over the Linear GraphQL API, with their field sets, endpoint shapes, and the two fetch-side traps (truncated list bodies and PR-converted issues).

The grounding spine for this doc is the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md` (source doc). All sub-corpus definitions below come from the source doc unless a dig source is cited.

## The four git sub-corpora

The source doc defines one sub-corpus per GitHub resource, each with a fixed field set:

| Sub-corpus | Endpoint | Field set |
|---|---|---|
| corpus_as_pr | GET /repos/{r}/pulls?state=all&per_page=100 | number, title, state, createdAt, mergedAt, user.login, labels, head.ref, body |
| corpus_as_issue | GET /repos/{r}/issues?state=all&per_page=100 | number, title, state, createdAt, updatedAt, user.login, body |
| corpus_as_commit | GET /repos/{r}/commits?per_page=100 | sha, commit.author, commit.message, commit.tree.sha, parents |
| corpus_as_release | GET /repos/{r}/releases?per_page=30 | tag_name, name, body, author.login, createdAt, publishedAt |

The per_page=100 batching follows GitHub's own pagination guidance: "If an endpoint supports the per_page query parameter, you can control how many results are returned on a page" (https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api, weight 0.97). The full REST surface the sub-corpora draw on is documented in the GitHub REST API reference (https://docs.github.com/en/rest, weight 0.96). The GitHub marketing and sign-in pages surfaced by the dig are not evidence for any field-level claim and are recorded here only as dig context (https://github.com/, weight 0.29, weak; https://github.com/login, weight 0.47, weak).

## GitHub Issues as a separate sub-corpus

The source doc is explicit that the skill treats GitHub Issues as a separate sub-corpus even though the operator's planning brain is Linear. Issues surface in two ways: direct posting through the GitHub UI (rare) and PR-to-issue conversion. The conversion is detectable: "the `pull_request` key on the issue body marks the conversion - handle by skipping items with `pull_request.url` set" (source doc). This is why the list endpoint for corpus_as_issue must be filtered before the items count as real issues; the empirical validation section of the source doc records that a naive issues fetch returned 0 real issues and that a since-filtered query was needed to capture 31 of them (source doc, cycle 3).

## The Linear sub-corpus

One sub-corpus, corpus_as_linear, fetched with a GraphQL query:

```
issues(filter: { team: { key: { eq: "OMN" } } }, first: 200, orderBy: updatedAt)
```

with field set identifier, title, state.name, state.type, priority, project.name, createdAt, updatedAt, completedAt, url (source doc). Two operational details from the source doc matter:

1. The team key is `OMN`, not `OMNI-AGENT` (that is the display name). Filtering on team.key.eq "OMN" resolves team 7e899705-e653-4322-8312-c377dc826c0b.
2. The creator field is `creator { name email }`, not `createdBy`. The source doc records that the GraphQL validator rejected `createdBy` on first attempt and that 133 of 138 items carry a non-null creator.name (source doc, cycle 3).

Linear's API is GraphQL-based; its filtering model is documented at https://linear.app/developers/filtering (weight 0.74) and the developer portal overview at https://linear.app/developers (weight 0.76). GraphQL is a query language for APIs with typed schemas, a model shared across GraphQL providers (https://thegraph.com/docs/en/subgraphs/querying/graphql-api/, weight 0.94). A third-party integration issue documents the practical cursor-pagination pitfall when a Linear client lists issues with first: 50 and does not follow page cursors (https://github.com/qf-studio/studio-sdk/issues/85, weight 0.56); the source doc's first: 200 sweep is sized to reduce that risk. Pages that merely describe the products are weak evidence and are not load-bearing here (https://linear.app/, weight 0.33, weak; https://tonsofskills.com/skills/linear-hello-world/, weight 0.15, weak).

## The two fetch-side traps

**Trap 1: list endpoints truncate bodies.** The source doc's anti-pattern list states the PR list endpoint returns `body` truncated to 200 chars and that the full PR must be fetched via GET /pulls/{n} before any body regex runs. The REST reference documents the per-endpoint fetch surface, including a media type that "Returns the raw markdown body" (https://docs.github.com/en/rest/pulls, weight 0.96; https://docs.github.com/en/rest/pulls/pulls, weight 0.96). An independent write-up of GitHub REST truncation behavior for large result sets exists but is a personal blog, not a primary source (https://techtoaster.io/github-api-curl-only-returns-a-subset-of-an-entire-list/, weight 0.12, weak). This doc 02 expands on the trap.

**Trap 2: pagination limits are not cursor-following guarantees.** Any client that stops at the first page silently loses items. The studio-sdk issue above is a concrete instance of that failure class (weight 0.56).

## Why the split matters downstream

The two substrates exist so the join (doc 02) can be computed across them: the git side carries commit SHAs and PR numbers, the Linear side carries OMN identifiers. The source doc's cycle-1 measurement found 0 of 34 PRs matching the Linear regex and cycle 3 found the residual cause is a repo workflow convention (PR bodies cite commit SHAs and PR numbers, not OMN ids), not a fetch bug (source doc). Keeping the substrates separate but joinable is the design that makes that diagnosis possible.
