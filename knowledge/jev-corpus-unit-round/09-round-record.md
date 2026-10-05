# The round record and landing

Scope: what a unit round writes down (steps.log entry and the record doc), how rounds land as draft PRs held for review, the GraphQL ready-for-review then squash merge path, and the three worked unit types.

## What the record contains

Every unit writes a steps.log repro entry: a line in the running steps log that reproduces the round's inputs, change, gate readings, and outcome (source doc, design decision 7). The record doc attached to the round's PR is the round's deliverable: it is the human-readable statement of what changed, what was measured, and why the gates passed or failed (source doc). The workspace convention backs this up with concrete history: steps logs for refs5 through refs9 exist as dated files, one per round (documents/jev-corpus/steps-refsN-2026-10-03.log, internal layout record, not web-weighted).

Laboratory documentation practice justifies the two-layer design. During developmental and optimization phases, staff must provide complete documentation of all experimental steps at each iteration (https://www.genomica.uaslp.mx/Protocols/Gral_Record_Keeping_ENG.pdf, w0.615). Accurate and organized records of experiments and data are essential to research practice (https://currentprotocols.onlinelibrary.wiley.com/doi/toc/10.1002/(ISSN)1948-3430.ExperimentDocumentationandDat, w0.859). Comprehensive process documentation is key to producing rigorous, responsible, and reproducible research, especially because research can take years and pass through many hands (https://research.washu.edu/documenting-research-activity/, w0.735). The steps.log entry is the per-iteration record; the record doc is the distilled report.

## Landing: draft PR, ready-for-review, squash

Rounds land as draft PRs held for review; Jenny merges, using GraphQL to flip the PR to ready-for-review and then squashing the merge (source doc, design decision 6). The draft state is the review gate: nothing merges automatically, even when every gate in the flow passed. Squash merging keeps the repository history linear by compressing a PR's commits into one (https://learn.microsoft.com/en-us/azure/devops/repos/git/merging-with-squash?view=azure-devops, w0.836). GitHub's own reference describes the available merge strategies, including merge commits, squash merges, and rebases, and what each does to history (https://docs.github.com/en/pull-requests/reference/pull-request-merges, w0.926). Squash is the right fit for a round: the round is one logical change, so one commit per round makes the git history mirror the round record.

Commit integrity matters at this boundary because the merged record is the archive of record: repository integrity practices, including signed commits, protect the history that later rounds and audits depend on (https://mikegerwitz.com/2012/05/a-git-horror-story-repository-integrity-with-signed-commits, w0.599).

## The three worked unit types

The skill carries three worked examples drawn from the validated rounds (source doc):

1. Change unit: modify an existing corpus item under the full runflow. Refs8 is the worked example class, the first structure-level round where the rung join drove the candidate and the add-check subset was defined (source doc, refs8).
2. Add unit: introduce a new corpus item, gated by the add-check subset of the task check rather than the full C1-C7 set (doc 07).
3. Revert unit: undo a previously merged keep. Refs7 is the canonical case: the pre-registered revert of refs6's merged keep was itself the round's keep (source doc, refs7). A revert can win its own round when the measurement says the earlier change did not hold up; the pre-registration (doc 04) is what makes that verdict clean rather than embarrassing.

## Why the record is the deliverable

The unit protocol optimizes for one honest measurement per round (doc 01). The record is where that measurement becomes durable: steps.log makes the round reproducible, the record doc makes it reviewable, and the squash-merged PR makes it part of the corpus's own history. The three-layer structure means an auditor can go from the corpus state at any commit, back to the round that produced it, back to the repro entry that re-runs it. Pull request practice supports the review half: well-sized, well-described PRs improve review quality directly (https://www.deployhq.com/blog/the-perfect-pull-request-best-practices-for-collaborative-development, w0.263, weak backing). Merge strategies and squash merge - Azure Repos | Microsoft Learn, w0.836, and the GitHub merge reference, w0.926, cover the mechanics; the flow adds the discipline of holding the merge behind a human review even when every gate is green.
