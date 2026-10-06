# 10. Rationalizations, red flags, and verification

Scope: the skill's anti-rationalization table, its 7-item red flag list, and its 6-item post-documentation verification checklist. This is an internal-record subtopic: it is grounded in the source doc itself, with no external dig needed, and the source doc's own later edits supply the drift notes.

## The rationalization table (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) closes the argument loop with 5 rationalization-versus-reality pairs:

| Rationalization | Reality (source doc) |
|---|---|
| "The code is self-documenting" | Code shows what. It doesn't show why, what alternatives were rejected, or what constraints apply. |
| "We'll write docs when the API stabilizes" | APIs stabilize faster when you document them. The doc is the first test of the design. |
| "Nobody reads docs" | Agents do. Future engineers do. Your 3-months-later self does. |
| "ADRs are overhead" | A 10-minute ADR prevents a 2-hour debate about the same decision six months later. |
| "Comments get outdated" | Comments on why are stable. Comments on what get outdated, which is why you only write the former. |

Each reality line is a restatement of a rule documented earlier in the corpus: the why-over-what doctrine (doc 01), the ADR value argument (doc 02), the agent readership (doc 09). The table's function is to pre-load the counterargument so the discipline survives the moment of friction.

## The red flags (source doc)

The skill lists 7 red flags, each an observable state rather than a judgment:

1. Architectural decisions with no written rationale.
2. Public APIs with no documentation or types.
3. README that doesn't explain how to run the project.
4. Commented-out code instead of deletion.
5. TODO comments that have been there for weeks.
6. No ADRs in a project with significant architectural choices.
7. Documentation that restates the code instead of explaining intent.

Items 4 and 5 are the inline-comment anti-patterns detectable mechanically (grep for comment-out patterns and stale TODOs). Items 1, 2, 3, and 6 are the absence states that the when-to-use triggers exist to prevent. Item 7 is the quality failure mode: documentation present but worthless, which is the subtlest of the 7 because it looks like compliance.

## The verification checklist (source doc)

After documenting, the skill requires 6 checks:

1. ADRs exist for all significant architectural decisions.
2. README covers quick start, commands, and architecture overview.
3. API functions have parameter and return type documentation.
4. Known gotchas are documented inline where they matter.
5. No commented-out code remains.
6. Rules files (CLAUDE.md etc.) are current and accurate.

The checklist maps 1:1 onto the corpus: check 1 to docs 02 through 04, check 2 to doc 07, check 3 to doc 06, check 4 to doc 05, check 5 to doc 05, check 6 to doc 09. It is the skill's own executable definition of "documented".

## Source-doc drift notes (internal-record)

The source doc carries later machine-audited edits that a reader should know about, recorded here as internal-record statements from the file itself (no dig):

1. Curve-guided-rsi cycle 4 (2026-08-06 per the file) added a "Least Privilege coverage" section stating the skill contributes to the least-privilege primitive of the yubiOS 10-primitive model, with gaps tracked in the corpus audit.
2. Cycle 5 (2026-08-06) added an "Audit/evidence coverage" section with the skill's fit coordinate (u=1.000, v=0.553, PC1+PC2 = 0.4615, holdout R-squared = +0.2244) and named the evidence composition (audit-evidence-packaging, sigstore-rekor-v2, slsa-provenance, the cycle changelog).
3. Cycles 5, 6, and 7 (all 2026-08-06) appended primitive-closure sections (segmentation, cryptographic identity, trust chain) with keywords and audit-trail entries.
4. Two coverage sections (Declarative policy, Continuous/adaptive) were replaced on 2026-09-17 by notes stating the former template paragraphs "asserted capabilities this skill does not itself implement" and were removed as unsupported.

Point 4 is the drift that matters for consumers of this corpus: the skill's primitive-coverage claims are curated, and unsupported ones are retracted rather than accumulated. Anyone crediting this skill against the 10-primitive map should credit the surviving sections (least privilege, audit/evidence, segmentation, cryptographic identity, trust chain) and not the retracted ones.

## Using the 3 artifacts together

The rationalization table is for the moment of resistance, the red flag list is for auditing an existing project, and the verification checklist is for closing out a documentation pass. Running them in that order turns the skill from advice into a loop: document, verify against the checklist, flag what fails, and answer the rationalization when it reappears.
