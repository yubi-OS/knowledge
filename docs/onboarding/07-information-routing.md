# 07. Where To Put New Information

Scope: the routing table the onboarding doc provides for new information: 8 destination documents, each owning one kind of content, and why the separation keeps the corpus trustworthy as it grows.

All claims in this doc are grounded in the source doc, yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11. This is an internal-record subtopic, no dig.

## The routing table

The doc gives an explicit 8-row mapping from kind of information to destination (source doc):

| Information | Destination |
|---|---|
| Current digest/tool pin | PINNED.md |
| Accepted decision | ADR.md |
| Normative requirement | SPEC.md |
| Roadmap/future work | FUTURE.md |
| Threat and residual risk | MITIGATE.md |
| Research-cycle notes | refs/YYYY-or-topic.md |
| Active blockers | BLOCKERS.md |
| Actionable task list | TODO.md |

## The 4 content classes the table separates

The 8 rows sort into 4 distinct classes, and keeping them apart is the table's actual function.

State versus decisions versus requirements. A pin (PINNED.md) is volatile state: which image digest or tool version is live right now. An accepted decision (ADR.md) is durable rationale: why the project chose a shape. A normative requirement (SPEC.md) is the contract a contribution must satisfy. A contribution that puts a new digest into ADR.md, or a new requirement into PINNED.md, corrupts exactly the distinction the reading path depends on: readers use PINNED.md to know what is true now and SPEC.md to know what must be true, and the reading path in doc 01 depends on that difference being real.

Forward versus risk versus operations. FUTURE.md holds roadmap and future work, which is by definition not yet committed. MITIGATE.md holds threat and residual risk, the acknowledged weaknesses that survive current mitigations. BLOCKERS.md holds active blockers and TODO.md holds the actionable task list, the two operational documents that describe what is stopping or queued right now.

Research. The refs/YYYY-or-topic.md row is the only destination with a date-or-topic-shaped path rather than a fixed filename. This matches the development rule (doc 05) that substantial research cycles get a dated refs/ note: research accumulates as an append-only series of dated files instead of being folded into a single evolving document.

## Why the table is in the onboarding doc

The table appears after the development rules and before the coverage sections, which fits its role: it is the routing answer a contributor needs the first time they have something to write down. Without it, new information gravitates to whichever file the author has open, and the corpus degrades in a specific, predictable way: pins rot inside decision records, requirements get buried in roadmap items, and risks stop being tracked separately from tasks. The table is therefore not documentation housekeeping; it is an integrity mechanism for the reading path in doc 01, because each step of that path (README, SPEC, PINNED, ADR, planning-cycle note) only stays reliable if new content lands in the right file.


## A worked routing decision

Consider a contributor who lands a change that moves the pinned base image and, in the same week, discovers a boot-failure edge case they cannot yet fix. The table resolves this into 3 writes with no overlap: the new digest goes to PINNED.md, never into the commit message body of other docs; the unfixable edge case goes to BLOCKERS.md as an active blocker if it stops work or to MITIGATE.md if it is a residual risk that ships with a workaround; and the investigation that produced the finding goes to a dated refs/ note. Nothing here belongs in SPEC.md unless the discovery rewrites a requirement, and nothing belongs in FUTURE.md unless the team accepted it as planned work. The table forces that disambiguation at write time instead of leaving it to a cleanup pass that never comes.

## Drift-check context

The doc's 2026-09-18 drift checks (wayfinder rounds 10 and 11, cycles 15 and 25) report the docs corpus as fully mojibake-repaired and, after round 11, single-version with SPEC resolved (source doc). For the routing table this matters practically: the destinations above are the repaired, single-version targets a contributor should write into, and the SPEC resolution confirms that normative requirements have one home rather than a version-split family of them.
