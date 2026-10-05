# Instrument bugs and stale state

**Scope:** Driver bugs from stale in-memory state versus committed ground truth: rebuild from the committed tree, add transition guards, fail closed with actionable errors, and keep scratch files out of the corpus.

## The round 8 driver bug

Round 8's driver mutated the corpus in memory and then built after-maps against a stale disk state that had not been reloaded. Per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18), after-maps 188 through 192 were built against incomplete corpora. The bug was only caught because chained comparisons looked wrong: the map-to-map deltas did not match what the round had actually done.

Two properties made this catchable at all. First, the campaign chains every cycle's baseline_id, so each map is comparable to a named predecessor; a stale-state rebuild shows up as a comparison that should be small coming out large, or vice versa. Second, the round records report counts, so a wrong count is visible instead of vibes. The bug survived five map builds before the inconsistency surfaced, which is the honest cost of in-memory mutation without a freshness guarantee.

## The instrument fix: transition guards that fail closed

The shipped fix changed the map API's contract. `/api/map` with `baseline_id` now accepts a `transition` declaration (`max_changed_names`, `max_added`, `max_removed`) and returns 409 with the offending names and `persisted: false` when the corpus differs from the baseline by more than the declared single transition.

This is a guard-clause pattern applied to an API. Microsoft's guard-class documentation describes the idiom: validate preconditions at entry, throw or reject with a specific message, and do the real work only after every precondition holds (weight 0.93, https://learn.microsoft.com/en-us/dotnet/communitytoolkit/diagnostics/guard). The design choices in the fix each earn their place:

1. The caller declares the expected transition size, so the guard encodes intent rather than a hardcoded threshold.
2. The 409 carries the offending names, so the failure is diagnosable without re-running anything. Naming what exceeded the budget is the difference between a guard and a dead end.
3. `persisted: false` makes the rejection side-effect-free and explicit: nothing was written, so retrying after a fix cannot double-apply.

The word stale means no longer fresh or usable, having lost effectiveness through age (weight 0.93, https://www.merriam-webster.com/dictionary/stale); the bug class it names is in-memory state that no longer matches the durable state it claims to represent.

## Lesson 25: the committed tree is the only ground truth

The process rule that shipped with the fix, lesson 25: the branch tree is the only ground truth, and the corpus is rebuilt from the committed tree before every after-map. In-memory state is a cache of the tree, never a source. Weak-backed general reading agrees that stale caches are the standard failure mode when a second representation of state diverges from the source of truth; two writeups of the pattern scored 0.27 and 0.24 (weak backing, https://humzakt.github.io/blog/two-cache-layers-stale-data.html, https://buglyst.com/learn/failure-modes/stale-cache-entry) and are cited here only as corroboration, not evidence.

## Round 12 hygiene: the corpus directory is not a workspace

Round 12 contributed two smaller members of the same family:

1. A temp file inside the corpus directory tripped the kebab-case name check. The check was right and the file was wrong: anything inside the corpus root is corpus.
2. The results ledger left the corpus on a skills-only re-sync and crashed a batch. The results record either lives in the corpus consistently from cycle 1 or lives outside it entirely.

The rule that falls out: keep scratch files and the results record outside the corpus root, or include the record consistently from the first cycle. A corpus directory should contain exactly the bytes the checks are supposed to evaluate.

## What to keep doing

1. Rebuild from the committed tree before every map, every check, and every count. Never trust an in-memory copy across a mutation boundary (lesson 25).
2. Declare expected transitions and fail closed with named offenders when reality exceeds the declaration (weight 0.93, https://learn.microsoft.com/en-us/dotnet/communitytoolkit/diagnostics/guard).
3. Chain baseline_ids so every comparison has a named predecessor and inconsistency is visible.
4. Keep scratch files and result ledgers outside the corpus root.

## Source quality notes

The Microsoft guard-class reference (0.93) and the dictionary entry for stale (0.93) are the only high-weight sources in this subtopic's archive; the guard idiom claim rests on the Microsoft source, and the stale definition on the dictionary. Ten results scored below 0.5 (aggregator posts on caching, guard clauses, and cache protocols) and were either labeled weak or unused as noted above.
