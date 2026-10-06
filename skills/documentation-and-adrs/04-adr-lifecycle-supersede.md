# 04. ADR lifecycle and supersession

Scope: the skill's ADR status lifecycle (PROPOSED, ACCEPTED, SUPERSEDED or DEPRECATED), the never-delete rule, and the supersession discipline of writing a new ADR that references the old one.

## The lifecycle (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) gives the lifecycle as a one-line state machine:

```
PROPOSED → ACCEPTED → (SUPERSEDED or DEPRECATED)
```

with 2 rules attached:

1. Do not delete old ADRs. They capture historical context.
2. When a decision changes, write a new ADR that references and supersedes the old one.

Status in the template is therefore a growing list of states per record, and the only mutation allowed on an old record is adding a pointer to its successor.

## How the ecosystem states the same rules

A software-engineering glossary entry states the same machine with the anti-edit rule made explicit: "Status moves through a small lifecycle of Proposed, Accepted, Deprecated, and Superseded. Records are never edited to flip a decision. A reversal is a new ADR with a new number, and the old one stays in the repository as the historical answer to 'why did we ever do that?'" (https://realpython.com/ref/software-engineering-glossary/architecture-decision-record/, jev 0.34, weak backing).

A weak-backed writeup of a template system lists the same 4 states (Proposed, Accepted, Deprecated, Superseded) and adds context linking so ADRs can reference related records and be filtered by status and date (https://dev.to/datanestdigital/adr-template-system-architecture-decision-records-adr-system-2pp5, jev 0.13, weak backing). The linking is what makes the skill's "write a new ADR that references the old one" navigable in a directory of numbered files.

A weak-backed practitioner guide on the supersede-vs-deprecate distinction (jev 0.25) argues ADRs written in year 1 do not stay accurate forever and gives 3 dispositions for a record that is no longer operative: supersede it with a new record, deprecate it when the context dissolved, or leave it alone if it is still current (https://whychose.com/blog/adr-lifecycle-supersede-deprecate). That distinction is finer than the skill's phrasing but compatible with it: SUPERSEDED means a replacement decision exists; DEPRECATED means the problem or context went away with no replacement.

A weak-backed 2026 guide frames the failure mode the lifecycle prevents as "ADR rot" and covers PR workflow integration and tooling (https://www.stackfyi.com/guides/architecture-decision-records-guide-2026, jev 0.17, weak backing).

## Why records are immutable

The never-delete rule has a specific justification in the source doc: old ADRs capture historical context. The glossary phrasing (weak backing) sharpens it: the old record is the answer to "why did we ever do that?". Deleting it destroys the only evidence of the constraints under which the superseded decision was made, which are exactly the constraints a new decision-maker needs to know have changed. The source doc's rationalization table makes the same point against the "we'll write docs when the API stabilizes" excuse: documenting is the first test of the design, and it is cheaper than re-deciding.

## Practice notes

1. Treat every ADR file as append-only. New information goes in a new ADR, not an edit.
2. When superseding, set the old record's Status to "Superseded by ADR-XXX" and the new record's Context must state what changed since the old decision.
3. Use DEPRECATED only when the context dissolved with no replacement decision; otherwise SUPERSEDED is the honest state.
4. Never renumber or reuse ADR numbers. The number is the permanent identifier that supersession pointers resolve against.
5. Review lifecycle state as part of routine documentation hygiene: a stale ACCEPTED record whose decision has quietly stopped being followed is a red flag under the skill's checklist.
