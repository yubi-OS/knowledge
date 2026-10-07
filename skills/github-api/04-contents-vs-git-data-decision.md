# 04 contents-vs-git-data-decision

Scope: the decision rule the source doc states for choosing between the two write paths, and what the dig could and could not add to it.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. This subtopic was the weakest dig in the corpus: 2 initial queries and 2 redo rounds (5 queries total) found no dedicated third-party or official page that states the comparison directly. The doc is therefore authored honestly from the source doc's own decision rule, with the two endpoint families grounded by their official documentation.

## The rule as the source doc states it

The source doc's rule, quoted in structure:

- Contents API: 1 to 2 files, simple edits. Clean, but limited to one file per call.
- Git Data API: 3 or more files in one atomic commit, or complex tree changes. More verbose but required for multi-file commits without multiple round trips.

(source doc)

The axis is atomicity versus convenience. Contents API PUTs are individual commits, so a 5-file change through that path is 5 commits, each visible, each revertible only individually. Git Data API's blob, tree, commit, ref chain produces all 5 changes in one commit object (source doc, Pattern 1).

## What the dig grounded

The dig did ground both sides of the comparison at authoritative weight, even though it never found a page comparing them:

- The Contents API documentation covers "create, modify, and delete Base64 encoded content in a repository" (https://docs.github.com/en/rest/repos/contents, weight 0.97, redo round 2).
- The Git trees documentation covers the tree-creation endpoint the chain depends on, including its nested-entry overwriting behavior (https://docs.github.com/en/rest/git/trees, weight 0.97, redo round 1) and the Git database overview covering "raw Git objects in your Git database" (https://docs.github.com/en/rest/git, weight 0.96, redo round 2).

## Reading the dig honestly

This is the corpus's labeled weak-grounding doc for the comparison claims themselves. The decision rule (file count thresholds, one-file-per-call limitation, atomicity) is a source-doc claim and is attributed as such. The endpoint mechanics behind each branch of the rule are grounded at weights 0.96 to 0.97 by the official docs above. Nothing in this doc should be read as externally sourced beyond those two layers.

## Where the rule bites in practice

Two org-native examples make the rule concrete (both source-doc grounded):

1. The mint pipeline that produced this corpus had 17 files to land in one commit. That is squarely the Git Data API case, and the pipeline used the full blob, tree, commit, ref chain (source doc Pattern 1).
2. A single-label or single-file maintenance change, such as bumping one digest string, stays on Contents API, where the PUT's required current `sha` doubles as an optimistic-concurrency check.

## Redo log for this subtopic

- Attempt 1 (initial dig, 2 queries): returned homepage, sign-in, blog, and social results; zero results at weight 0.5 or above. Reason for redo: thin dig.
- Redo round 1 (3 queries): recovered the two official endpoint docs at 0.97; still no dedicated comparison source.
- Redo round 2 (2 queries): confirmed the surface has no dedicated comparison page; the two endpoint docs remain the strongest grounding.

Outcome: authored. The doc exists because the source doc supplies the decision content and the digs ground both endpoints it compares. Per the REDO rule, no primary source was fetched directly to fill the gap; the gap is recorded here and in the README instead.
