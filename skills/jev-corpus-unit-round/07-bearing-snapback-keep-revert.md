# Bearing, snapback, keep or revert

Scope: steps 10 and 11 of the runflow. Reading the predicted and realized deltas as a direction, posting the snapback series, applying the keep rule, running the taskcheck, and committing or reverting.

## Step 10: bearing as a direction

The predicted delta from step 6 and the realized delta from step 9 are read together as a DIRECTION in the level convention (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md). Four readings:

1. Aligned plus meaningful: keep.
2. Aligned plus tiny: small-but-real. The source doc is explicit: never auto-drop a positive realized level delta (source doc).
3. Inverted: the text moved the corpus against the geometry.
4. Zero: no-flip.

The subtlety is the small-but-real case. A naive threshold on delta magnitude would discard small positive movements, but the flow treats any positive realized level delta as evidence the change did what its content was supposed to do, just weakly. Magnitude grading belongs to the operator's judgment; sign does not.

## Snapback

The cumulative series of `(cycle, predicted_delta, realized_delta)` pairs is posted to `POST /api/jev/corpus/visco/snapback` (source doc). Both sides must be in the level convention, or the inversion detector flags every keep (source doc). The series is cumulative across cycles, so it is a running record of how well predictions have tracked realizations, and a detector on it can halt the chain when the two have decoupled.

## Step 11: the keep rule and the taskcheck

The keep rule is conjunctive: KEEP if and only if the realized level delta is greater than 0 AND snapback does not halt (source doc). Guideline 3 states the same thing from the other side: the gate is level_dbc UP, and nothing else authorizes a keep (source doc).

For a keep, the frozen task check runs: `bash tools/point-map/taskcheck_refs.sh <before-file> <after-file> <axis>` covering checks C1 through C7 (source doc). The checks are change-shaped and add-shaped subsets: an ADD uses the C5 and C6 subset, while C2 and C3 apply only to changes (source doc). Guideline 4 is the pairing rule: geometry proposes; the frozen task check disposes. A keep without a taskcheck pass is not shipped (source doc). The taskcheck is "frozen" in the sense that its rules are fixed before the round, so a content author cannot negotiate with a checker they wrote mid-round.

On PASS, the commit goes through the Git Data API chain: blob, then tree with `base_tree`, then commit, then `PATCH /git/refs/heads/<branch>` (source doc). Every response is surfaced, because a silent commit failure costs a manual recovery (source doc). The chain-of-objects commit model (blobs referenced by trees, trees referenced by commits, commits advancing refs) is a Git-native design; the flow's requirement is that each POST in the chain be checked before the next one runs.

For a REVERT: no commit, the local file is untouched, and the verdict is `reverted`, or `neutral` if the delta was zero (source doc).

## The GraphQL side door for drafts

Later in the flow (step 13), a draft PR must be un-drafted with GraphQL, because REST `PATCH {draft:false}` does NOT clear a draft; the correct call is GraphQL `markPullRequestReadyForReview` with the PR's `node_id` (source doc). GraphQL is a query language for APIs in which clients specify exactly the data they need (https://graphql.org/learn/, weight 0.91; https://graphql.org/, weight 0.76), and the mutation-based write path is how state changes are expressed. The lesson here is not about GraphQL in general but about which API surface owns which operation: draft state transitions live behind the GraphQL interface of the GitHub API, not the REST one.

## Commit mechanics and the stale blob sha

The failure lesson that belongs to this step: stale blob sha 409s on the second edit of a file (source doc). When the chain commits a second edit to the same file, a blob sha cached from the first edit produces a 409. The remedy is procedural: re-read the current file state before each blob creation, and surface every response so the 409 is seen rather than swallowed.

## What this record does not claim

This record does not describe the taskcheck rules C1 through C4 in detail (they are encoded in `tools/point-map/taskcheck_refs.sh`), and it does not claim the snapback detector's internal algorithm; both are cited from the source doc as the source of record. The keep rule is quoted exactly: realized level delta greater than 0, snapback not halted.

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); GraphQL.org, Learn (https://graphql.org/learn/, weight 0.91); GraphQL.org, home (https://graphql.org/, weight 0.76).
