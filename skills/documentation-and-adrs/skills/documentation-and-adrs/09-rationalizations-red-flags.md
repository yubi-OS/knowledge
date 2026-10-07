# Rationalizations, Red Flags, and the Verification Checklist

Scope: the source doc's Common Rationalizations table, Red Flags list, and post-documentation Verification checklist. This is an internal-record subtopic: all claims are from the source doc itself, no dig was run.

## Internal-record note

Per the mint brief's dig rule, this subtopic skips searXNG: rationalizations, red flags, and the checklist are records internal to the skill (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md), not web-research-shaped topics. Every claim below cites the source doc.

## The rationalizations table

The source doc answers 5 common excuses with reality:

| Rationalization | Reality (source doc) |
|---|---|
| "The code is self-documenting" | Code shows what. It doesn't show why, what alternatives were rejected, or what constraints apply. |
| "We'll write docs when the API stabilizes" | APIs stabilize faster when you document them. The doc is the first test of the design. |
| "Nobody reads docs" | Agents do. Future engineers do. Your 3-months-later self does. |
| "ADRs are overhead" | A 10-minute ADR prevents a 2-hour debate about the same decision six months later. |
| "Comments get outdated" | Comments on *why* are stable. Comments on *what* get outdated — that's why you only write the former. |

3 of the 5 rows are the strongest formulations in the whole skill. The "doc is the first test of the design" row reframes documentation from a downstream chore to a design activity. The "nobody reads docs" row makes agents a named reader population, which doc 08 develops. The "ADRs are overhead" row prices the practice with a concrete exchange rate: 10 minutes now versus a 2-hour re-debate in 6 months.

## The red flags list

The source doc names 7 red flags, which read as an audit checklist for an existing codebase:

1. Architectural decisions with no written rationale
2. Public APIs with no documentation or types
3. README that doesn't explain how to run the project
4. Commented-out code instead of deletion
5. TODO comments that have been there for weeks
6. No ADRs in a project with significant architectural choices
7. Documentation that restates the code instead of explaining intent

The list maps 1:1 onto the skill's other sections: 1 and 6 are the ADR discipline (docs 03, 04), 2 is the API documentation section (doc 06), 3 is the README section (doc 07), 4 and 5 are the inline-comment exclusions (doc 05), and 7 is the why-over-what philosophy (doc 01). A codebase can be audited against this list mechanically: each flag is a grep or directory scan away from a verdict.

## The verification checklist

After documenting, the source doc's checklist:

- ADRs exist for all significant architectural decisions
- README covers quick start, commands, and architecture overview
- API functions have parameter and return type documentation
- Known gotchas are documented inline where they matter
- No commented-out code remains
- Rules files (CLAUDE.md etc.) are current and accurate

Each item is the positive form of a red flag: 1 fixes flags 1 and 6, 2 fixes flag 3, 3 fixes flag 2, 4 is the positive form of the gotcha discipline, 5 fixes flag 4, and 6 extends the inline discipline to agent-facing rules files. The checklist is therefore not a separate standard; it is the same standard expressed as a completion state.

## How to use the 3 lists together

The 3 lists form a decision, audit, and completion triad for the same material:

- Use the rationalizations table when the discipline is being resisted (by yourself or a reviewer): each row is a pre-written counterargument.
- Use the red flags list when auditing an unfamiliar codebase: each flag is a detectable absence.
- Use the verification checklist when finishing a documentation pass: each item is a testable presence.

A practical loop: run the red flags audit, fix what it finds, verify with the checklist, and treat any rationalization that surfaces along the way as a signal to re-read the corresponding corpus doc (01 through 08) rather than as a reason to skip the item.

## Skill-level context: primitive coverage edits

Two later sections of the source doc place this skill inside the yubiOS 10-primitive framework, and the corpus records them as-is. The cycle-5 edit declares the skill's audit/evidence contribution: "this skill contributes to audit by establishing the documentation discipline that supports retrospection," composing with audit-evidence-packaging, sigstore-rekor-v2, slsa-provenance, and the curve-guided-rsi changelog (source doc, fit coordinate u=1.000, v=0.553, PC1+PC2 0.4615, holdout R2 +0.2244). A cycle-5 RSI closure note (2026-08-06) recorded a segmentation keyword-coverage addition (corpus-wide segmentation count 22 to 23 of 70), and cycles 6 and 7 recorded cryptographic-identity and trust-chain primitive references. A 2026-09-17 coverage note records that unsupported template paragraphs for declarative policy and continuous/adaptive coverage were removed as unsupported (source doc).

These edits are corpus-mechanics artifacts rather than documentation guidance. Their relevance here: an ADR-driven documentation discipline is itself the audit substrate the framework expects, and the changelog entries at the bottom of the SKILL.md are the same Keep a Changelog discipline this corpus's doc 07 describes, applied to the skill's own evolution.
