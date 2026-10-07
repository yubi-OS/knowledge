# ADR Lifecycle: Proposed, Accepted, Superseded, Deprecated

Scope: the source doc's ADR lifecycle state machine (PROPOSED to ACCEPTED to SUPERSEDED or DEPRECATED), the never-delete rule, and the supersede-by-new-ADR mechanism.

## The state machine (source doc)

The source doc gives the lifecycle as a one-line state machine:

```
PROPOSED → ACCEPTED → (SUPERSEDED or DEPRECATED)
```

Three facts follow from this shape. First, PROPOSED is a real state: an ADR can exist and be readable before the team has accepted it, which makes the draft useful for review rather than only for the record. Second, ACCEPTED is terminal in the sense that no further "revised" state exists: a change of decision does not mutate the ADR, it produces a new one. Third, the exit states are exactly 2, SUPERSEDED and DEPRECATED, and both are markers pointing elsewhere rather than erasures.

## The never-delete rule (source doc)

The source doc states it bluntly: "Don't delete old ADRs. They capture historical context." And when a decision changes: "write a new ADR that references and supersedes the old one." The mechanism is therefore append-only. The old ADR stays in `docs/decisions/` with its sequential number intact; its Status section changes from Accepted to `Superseded by ADR-XXX`; the new ADR carries the new decision, its own date, and its own alternatives analysis.

This is the same discipline git applies to code history: the source doc applies it in a different place (its When NOT to Comment section says to delete commented-out code because "git has history"), but for decision rationale the ADR file itself is the history medium. Deleting an ADR destroys the context (constraints at the time, alternatives evaluated) that future readers need to understand why the current state is the current state, including understanding why the superseding decision exists.

## The status field as the lifecycle hook

The template's Status section (doc 03) is where the lifecycle lives: `Accepted | Superseded by ADR-XXX | Deprecated`. Superseded carries a pointer to the replacing ADR, which makes the decision graph navigable: a reader landing on a stale ADR can walk the supersession chain to the currently-binding decision. PROPOSED appears in the state machine even though the template's status enumeration shows the post-acceptance values; the source doc's template example (ADR-001) is an Accepted ADR, and the state machine supplies the pre-acceptance state.

## How the wider ADR canon describes the same lifecycle

The dig results for this subtopic were mostly weak. The strongest usable hit was a readthedocs-hosted explanation of ADRs for the ETHOS.TSAM project describing decisions as records that accumulate rather than get rewritten (https://tsam.readthedocs.io/en/latest/explanation/background/decisions/, jev weight 0.56, authoritative). A Real Python glossary entry defines the ADR and its role without contradicting the source doc (https://realpython.com/ref/software-engineering-glossary/architecture-decision-record/, jev weight 0.28, weak backing). A dedicated lifecycle write-up distinguishes superseding (the decision domain changed, a new decision owns it) from deprecating (the decision is no longer relevant and nothing replaced it) (https://whychose.com/blog/adr-lifecycle-supersede-deprecate, jev weight 0.23, weak backing). A deepwiki page over the ADR GitHub organization describes status states including Superseded as a lifecycle transition (https://deepwiki.com/architecture-decision-record/architecture-decision-record/2.1-adr-lifecycle-and, jev weight 0.29, weak backing).

One amusing artifact of the dig: 2 of the 12 results were about alternate- dispute resolution (adr.org, jev weight 0.51, off-topic for the domain despite the acronym) and depositary receipts (investopedia ADRs, jev weight 0.19). They are recorded in the research-db as weighted but unused; they carry no claim in this doc. This is the noul metric doing its job: an acronym collision scored as authoritative-looking pages but off-topic.

## Why append-only matters for machines as much as humans

The docs-for-agents doc (08) carries the source doc's claim that ADRs "help agents understand why past decisions were made (prevents re-deciding)". That mechanism depends on the never-delete rule in a specific way: an agent scanning `docs/decisions/` must be able to trust that a present ADR's rationale was true when written and that its status line tells the truth about whether it still binds. If ADRs were editable in place or deletable, the corpus of decisions would be silently rewritten and an agent could reconstruct a false history. Append-only plus supersession pointers is what makes the directory a log rather than a wiki page.

## Practical checklist

From the source doc, the verification item closest to this doc is "ADRs exist for all significant architectural decisions" (Verification section). To that the lifecycle section adds its own operational rule set: never delete, supersede by reference, and keep the status field current. A project following these 3 rules has a decision history that reads forward in time: oldest ADRs at the bottom numbers, the current architecture describable as "the set of non-superseded, non-deprecated ADRs".
