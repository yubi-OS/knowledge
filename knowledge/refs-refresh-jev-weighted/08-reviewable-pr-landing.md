# 08: Landing the Sweep as a Reviewable PR

Scope: how the sweep ships: one branch, one draft PR, the research DB committed alongside the docs, and post-push verification that proves the artifacts parse.

## One corpus, one branch, one PR

The sweep lands on a dedicated branch named for the run (for the reference corpus: a `mint/<REF>-2026-10-05` branch off main) and opens one draft pull request. Draft state is deliberate: a draft PR gets early CI and early design feedback without occupying the review queue (https://www.git-automation.com/git-workflow-architecture-branching-strategies/code-review-workflow-engineering/using-draft-pull-requests-effectively/, weight 0.4706, weak backing), and it marks the work as pending human approval, which matches the sweep's evidence-not-edits posture: the reference run edited no existing refs/ docs and landed its refresh queue as follow-up PRs so the research DB could be reviewed in isolation.

GitHub's PR model is what makes the isolation work: a pull request page focuses on what the PR introduced relative to its base (https://docs.github.com/articles/about-pull-requests, weight 0.9461), so a corpus PR whose diff is only `knowledge/<REF>/` files is a self-contained review unit.

## The push chain

The write path is the Git Data API, not a working-tree push: check for directory collision on main, read the head commit's tree, create one blob per file (UTF-8 content, never base64-as-content), build a tree with the base tree attached, create the commit, create the branch ref, then open the draft PR. Bodies large enough to be unwieldy go over stdin rather than as shell arguments. Every call carries the connection identity and a User-Agent.

This chain gives the whole mint a single atomic landing: either the branch exists with the complete corpus or it does not exist. There is no partially-updated state on main.

## The PR body as the run summary

The PR body is fixed-format, which turns every mint into a comparable record:

- **Source doc** line naming the input and its topic.
- **Outline table** with each subtopic's validation score and verdict (kept or dropped).
- **Metrics** section naming the metrics used per stage (score for outline, noul for weighting) and the model.
- **Jev stats**: request count, token usage, and the high/low weight split of the collected results.
- **Per-doc sources table**: results kept and primary (0.5-plus) count per doc.
- **Redo log**: per-doc dig redos, or "none".
- **Gaps and skips**: the honest list, or "none".
- **Preflight line** with the date and both endpoints' probe status.
- **Verification line** with the post-push counts.

The gaps section is the trust anchor. A mint that reports no gaps is claiming every subtopic either authored with adequate evidence or was never attempted; a mint that lists its skips is showing where the process, not the author, decided the outcome.

## Post-push verification

The push is not the end. Three checks run before success is reported:

1. **The PR diff contains the research DB.** Fetch the PR's file list and confirm the research-db files are present. A mint whose research DB is missing from the PR is a failed mint, full stop, because the evidence chain is the point.
2. **Every research-db .json re-parses.** Re-fetch each from raw.githubusercontent and parse it as JSON. What was written as plain UTF-8 must come back as plain UTF-8.
3. **Every archive entry carries a non-null weight.** The weighting stage's contract, checked on the fetched artifact rather than the local copy.

The check echoes the verification discipline that review automation describes: the verification step at the end proves that the parts produce exactly the intended whole (https://www.git-automation.com/git-workflow-architecture-branching-strategies/code-review-workflow-engineering/splitting-a-branch-into-reviewable-pull-requests/, weight 0.2281, weak backing).

## What reviewers check, and what they should find

Review checklists for PRs converge on: does every file belong, is there random cruft, are deletions appropriate (https://gist.github.com/katyhuff/845e06656f18784210190e4f46a4aa95, weight 0.4458, weak backing), and template collections operationalize the same items per language and stack (https://github.com/qodo-ai/pr-compliance-templates, weight 0.4997). For a corpus mint the reviewer-facing answers are structural: the diff touches only `knowledge/<REF>/`, the file set matches the fixed manifest (README, numbered docs, six research-db artifacts), the JSON parses, the weights are non-null, and the PR body's numbers match the data. Automated checklist generation from a diff is the natural next step for this kind of structured PR (https://inferensys.com/prompts/coding-agent-and-repository-context-prompts/pull-request-and-commit-discipline-prompts/pr-review-checklist-generation-prompt, weight 0.5222).

The draft stays draft until a human reviewer accepts it. The sweep's agents prove the artifacts; the reviewer decides they belong.
