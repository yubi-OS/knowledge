# 06 pull-requests-draft-workflow

Scope: creating draft pull requests through the REST API and listing open PRs, the two calls the source doc specifies for the PR stage of org automation.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. External grounding from searXNG dig, weighted by jev-1.13 noul.

## Creating a draft PR

The source doc's create pattern is `POST {base}/pulls` with a body of five fields: `title`, `head` (source branch), `base` (target branch), `body` (markdown, opening with "Closes #14" in the example), and `draft: true` (source doc). The response fields the source doc logs are `number` and `html_url`, which is the identity pair every later step needs: the number for API references and the URL for humans.

The `draft: true` flag is the deliberate part of the pattern. A draft PR signals work in progress that is reviewable but not ready, and the org's mint pipeline uses exactly this shape: push a corpus to a mint branch, open the PR as a draft, and let the report link to the draft PR rather than implying it is merged.

The body convention "Closes #14" (source doc) is worth naming because it is load-bearing: putting a closing keyword plus issue number in the PR body links the PR to its tracking issue, so merging the PR closes the issue automatically. That is how the issue patterns from doc 05 hand off to the PR pattern here.

## Listing open PRs

The list pattern is `GET {base}/pulls?state=open&per_page=50` (source doc), mirroring the issues list from doc 05. The mirrored shape is not accidental: GitHub's own documentation states "Pull requests are a type of issue. Any actions that are available in..." (https://docs.github.com/en/rest/pulls/pulls, weight 0.97), and "You can list, view, edit, create, and merge pull requests using the REST API" (same URL, weight 0.97).

The list endpoint is also how the org's pipeline resolves PR numbers after the fact. The mint flow in this corpus's own tasking does exactly this: rather than trusting an assumed PR number, it resolves the real number with a head-branch lookup (`GET /repos/OWNER/REPO/pulls?head=OWNER:BRANCH&state=all`). The source doc's list pattern is the foundation for that lookup: filter by `head` and read `number` from the response.

## What the official docs add

GitHub's pull requests documentation covers the surface: "Use the REST API to manage pull requests and pull request reviews" (https://docs.github.com/en/rest/pulls, weight 0.97). One availability detail the dig surfaced: "Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Ente[rprise]" (https://docs.github.com/en/rest/pulls/pulls, weight 0.97). The yubi-OS org's repos are public and org-owned, so drafts are available on both sides of that list; the note matters for anyone reusing the pattern on a personal free-plan private repo, where drafts are not.

## Composition with the other patterns

The PR pattern sits last in the write chain the skill describes: Git Data API or Contents API produces the commit (docs 02 and 03), a branch carries it (doc 02 step 5), and `POST /pulls` with `head` equal to that branch opens the review. Because the create call names `head` and `base` explicitly, the same body template works for PRs between any two branches, including the mint branches this corpus landed on (source doc).

## Dig surface

Three of the twelve collected results were the official pull-requests documentation at weight 0.97; the rest were homepage, sign-in, blog, and social noise weighted 0.05 to 0.21 and rejected. No redos were needed.
