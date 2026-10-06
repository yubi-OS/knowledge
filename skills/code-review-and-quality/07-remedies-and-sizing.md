# 07 Structural Remedies and Change Sizing

Scope: the named restructurings the skill proposes instead of bare problem reports, and the change size targets and splitting strategies that keep review reviewable.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## Propose the move, not just the problem

The source doc's rule for structural findings: when you flag a structural problem, propose the move, not just the problem. A review that only says "this is complex" leaves the author guessing (source doc). The skill catalogs 8 named restructurings (source doc):

1. Replace a chain of conditionals with a typed model or an explicit dispatcher.
2. Collapse duplicate branches into a single clearer flow.
3. Separate orchestration from business logic so each reads on its own.
4. Move feature-specific logic out of a shared module into the package that owns the concept.
5. Reuse the canonical helper instead of a bespoke near-duplicate.
6. Make a type boundary explicit so downstream branching disappears.
7. Delete a pass-through wrapper that adds indirection without clarifying the API.
8. Extract a helper, or split a large file into focused modules.

The tie-breaker rule: prefer the remedy that removes moving pieces over one that spreads the same complexity around (source doc). This is the architecture axis's complexity-relocation test (doc 04) applied at remedy-selection time.

## Change size targets

Small, focused changes are easier to review, faster to merge, and safer to deploy (source doc). The targets (source doc):

- roughly 100 lines changed: good, reviewable in one sitting
- roughly 300 lines changed: acceptable if it is a single logical change
- roughly 1000 lines changed: too large, split it

The industry metric record is consistent on the direction: smaller PRs correlate with faster review turnaround and better review outcomes, which is why engineering-metrics tooling tracks PR size as a headline metric (noul 0.15, weak, https://www.em-tools.io/engineering-metrics/pull-request-size).

## File size is a separate signal

Watch file size, not just diff size (source doc). A small diff can still push a file past a healthy boundary. Around 1000 total lines in a single file is a common inspection signal, not a hard cap, and it is distinct from the 1000 changed-lines threshold (source doc). When a change materially grows an already-large file, ask whether to extract helpers, subcomponents, or modules first, before piling more on. Decompose, then add (source doc).

## What counts as one change

A single self-contained modification that addresses one thing, includes related tests, and keeps the system functional after submission: one part of a feature, not the whole feature (source doc).

## Splitting strategies

When a change is too large, the skill offers 4 splitting strategies keyed to when each applies (source doc):

| Strategy | How | When |
|----------|-----|------|
| Stack | Submit a small change, start the next one based on it | Sequential dependencies |
| By file group | Separate changes for groups needing different reviewers | Cross-cutting concerns |
| Horizontal | Create shared code or stubs first, then consumers | Layered architecture |
| Vertical | Break into smaller full-stack slices of the feature | Feature work |

The stacked-PR pattern is now a mainstream practice with dedicated tooling, and practitioner guides describe its core mechanics: land a small PR, stack the next PR on its branch, merge them in order (noul 0.22, weak, https://www.michaelagreiler.com/stacked-pull-requests; noul 0.27, weak, https://www.thedroidsonroids.com/blog/splitting-pull-request).

## Two exceptions and one separation rule

Large changes are acceptable in 2 cases: complete file deletions, and automated refactoring where the reviewer only needs to verify intent, not every line (source doc).

The separation rule: refactoring and feature work are different changes. A change that refactors existing code and adds new behavior is 2 changes, submitted separately. Small cleanups such as variable renaming can ride along at reviewer discretion (source doc).

## Speed connection

Sizing is also a review-speed intervention. The skill instructs reviewers to ask authors to split large changes rather than reviewing one massive changeset (source doc). The alternative, a too-big PR, is on the red-flag list in its own right: PRs that are "too big to review properly" should be split (source doc).
