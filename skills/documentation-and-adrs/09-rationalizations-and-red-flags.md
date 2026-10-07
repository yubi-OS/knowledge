# Rationalizations, Red Flags, and Verification

Scope: INTERNAL-RECORD subtopic, no dig. The source doc's rationalizations table, its 7 red flags, and its 6-item verification checklist, recorded as the skill states them in yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md.

## The rationalizations table

The source doc answers the 5 standard excuses for skipping documentation. Each row pairs the excuse with the reality:

| Rationalization | Reality (source doc) |
|---|---|
| "The code is self-documenting" | Code shows what. It doesn't show why, what alternatives were rejected, or what constraints apply. |
| "We'll write docs when the API stabilizes" | APIs stabilize faster when you document them. The doc is the first test of the design. |
| "Nobody reads docs" | Agents do. Future engineers do. Your 3-months-later self does. |
| "ADRs are overhead" | A 10-minute ADR prevents a 2-hour debate about the same decision 6 months later. |
| "Comments get outdated" | Comments on *why* are stable. Comments on *what* get outdated, which is why you only write the former. |

Two rows carry quantitative anchors: the ADR economics row (10 minutes now versus a 2-hour re-debate 6 months later) and the audience row's implicit timeline (3 months later self). The "API stabilizes" row is the only one that flips the premise: it claims documentation is not a cost paid after design but an input to it, since writing the doc is the first test of whether the design holds together.

## The red flags

The source doc lists 7 red flags, the observable states that mean the skill is not being followed:

1. Architectural decisions with no written rationale.
2. Public APIs with no documentation or types.
3. README that doesn't explain how to run the project.
4. Commented-out code instead of deletion.
5. TODO comments that have been there for weeks.
6. No ADRs in a project with significant architectural choices.
7. Documentation that restates the code instead of explaining intent.

The list maps 1:1 onto the corpus docs: flags 1 and 6 are the ADR discipline (docs 02 and 03), flag 2 is the API documentation form (doc 05), flag 3 is the README quick start (doc 06), flags 4 and 5 are the inline don'ts (doc 04), and flag 7 is the why-not-what rule restated as a detection criterion.

## The verification checklist

After documenting, the source doc's checklist has 6 items:

- [ ] ADRs exist for all significant architectural decisions.
- [ ] README covers quick start, commands, and architecture overview.
- [ ] API functions have parameter and return type documentation.
- [ ] Known gotchas are documented inline where they matter.
- [ ] No commented-out code remains.
- [ ] Rules files (CLAUDE.md etc.) are current and accurate.

Each item is mechanically checkable: the first is a count over significant decisions versus docs/decisions/ contents; the second is a presence check over README sections; the third is a scan of exported API functions for parameter and return documentation; the fourth and fifth are source scans; the sixth is a freshness review of rules files.

## How the 3 artifacts interlock

The rationalizations table is the motivation layer, the red flags are the detection layer, and the verification checklist is the remediation layer. A rationalization is the cause of a red flag (the "code is self-documenting" belief produces flag 7), and a red flag is what the checklist item finds (flag 4 is caught by checklist item 5). The skill's design keeps all 3 in one place so an agent or engineer can run the loop in one pass: notice the excuse, scan for the flag, fix it, and re-check.

## Scope note

This doc is an internal-record subtopic: every claim above is sourced from the ground source doc itself, and no searXNG dig was run for it. The table, the flag list, and the checklist are quoted structurally (not verbatim in full) and attributed to the source doc. Nothing in this doc is external corroboration; for grounded external context on the underlying practices, see docs 01 through 08.
