# 10 - Composition, anti-patterns, and red flags

**Scope:** How the axis composes with negative-skill-space, curve-compass-skill, prior-art-search, documentation-and-adrs, recursive-self-improvement, and context-isolation; the anti-pattern list and red-flag table. Internal-record subtopic.

## Composition map

The source doc (`yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`) defines 6 composition edges, each with a direction:

| Skill / channel | How it composes | Direction |
|---|---|---|
| `negative-skill-space` | provides the 12-axis sweep framework; this skill owns axis 6 (Adjacent problems). NSS sweeps this axis on every cycle that asks for adjacent-problems gap finding. | negative-skill-space -> nss-adjacent-problems |
| `curve-compass-skill` | provides the lens-format patch generator and the Sigma ladder; this skill emits one lens per file in the same JSON shape. | curve-compass-skill <-> nss-adjacent-problems |
| `prior-art-search` | provides the survey/prior-art cross-reference convention; nss-adjacent-problems scores files against the prior-art channel. | nss-adjacent-problems <-> prior-art-search |
| `documentation-and-adrs` | ADRs are the canonical place to enumerate alternatives + rejection criteria; this skill scores ADRs against the rubric and pushes missing "why not" lines into the cycle-13 patch. | documentation-and-adrs <-> nss-adjacent-problems |
| `recursive-self-improvement` | the closing loop. nss-adjacent-problems proposes gaps; RSI applies the per-file patch. | nss-adjacent-problems -> recursive-self-improvement |
| `context-isolation` | when running the cycle-13 sweep, run each file's lens in a fresh-context subagent so author bias from prior cycles does not re-anchor. | context-isolation -> nss-adjacent-problems |

## Reading the directions

- **Downstream consumers (this skill is the source):** recursive-self-improvement. The axis produces gap evidence; RSI consumes it as patch instructions. Nothing else consumes the axis's output.
- **Upstream providers (this skill is the consumer):** negative-skill-space (the framework), curve-compass-skill (the format), prior-art-search (the survey convention), context-isolation (the execution discipline).
- **Bidirectional:** curve-compass-skill, prior-art-search, documentation-and-adrs. The bidirectionality means the relationship is a contract, not a dependency: curve-compass defines the lens shape and receives lenses back in that shape; documentation-and-adrs defines where alternatives live and receives rubric scores about whether they are adequate.

The `documentation-and-adrs` edge is the practical anchor for authors: if an ADR enumerates alternatives and rejection criteria up front, the cycle-13 patch for that file is mostly confirmation; if it does not, the patch supplies the missing "why not" lines. An ADR that proposes option A, lists options B and C, and concludes A without the winning constraint scores 4/20 (Emerging) on the rubric (source doc example 2), and the fix is 2 rejection lines, not a rewrite.

## Self-containment contract

Reads: nothing required (rubric + distinctions + lens schema embedded). Writes: lens-format JSON per file. Depends on: stdlib only. This means the axis can run on a fresh checkout with no network, which is what the "LOCAL ONLY for the rubric; no network for measurement" constraint encodes.

## Anti-patterns

The source doc lists 10 anti-patterns:

1. Awarding points for keywords alone ("mentions RFC" = full credit).
2. Confusing related problem with alternative solution.
3. Confusing prior art with alternative solution.
4. Naming a sibling tool without naming the problem family.
5. "See also" links without a relation type.
6. RFC number without context.
7. No "why not" lines for rejected alternatives.
8. No flip conditions on the chosen solution.
9. Family boundaries implicit or missing.
10. Shipping templated `## Adjacent problems -- cycle 13` sections without lens format.

Anti-patterns 1, 5, and 6 are one family: keyword-shaped evidence substituting for a relationship map. Anti-patterns 2, 3, 4, and 9 are the distinctions failures (doc 05). Anti-patterns 7 and 8 are the decision-documentation failures. Anti-pattern 10 is the format failure: prose where a lens belongs.

## Red flags

| Observation | What it means |
|---|---|
| File says "we chose X" but never names an alternative | adjacent-problems axis is a gap |
| "See also" without a relation type | the link is decorative, not informative |
| RFC / paper cited without context | name-drop, not cross-reference |
| No "why not" lines for rejected alternatives | rejection criteria missing |
| Family boundary implicit or absent | the choice cannot be re-derived |
| Lens has `delta: {}` or `score: 0` | the experiment did not run; lens is aspirational |
| 40+ lenses all verdict=YES score=50 | experiment is degenerate |

The red-flag table is the quick diagnostic pass that precedes full scoring: each row is observable by inspection, and each maps to at least 1 rubric dimension that will score 0 or 1. A file with no red flags is not automatically strong; a file with 3 or more red flags is mechanically below Useful (8/20).

## The degenerate-sweep case deserves its own note

"40+ lenses all verdict=YES score=50" is a sweep-level red flag, not a file-level one: if every lens in a cycle passes at maximum, the method did not discriminate. The likely causes are keyword-matching instead of behavior scoring (guideline 1), hypothesis sets that assert the conclusion, or a scorer that re-anchored on its own prior edits (which is exactly what the context-isolation fresh-context rule prevents). A degenerate sweep invalidates the whole cycle's patches, not just the worst file.

## Where this fits in the mint corpus

The composition table is also the reading order for this corpus: doc 01 (scope, from the framework edge), docs 02 and 03 (rubric and dimensions), doc 04 (vocabulary), docs 05 and 06 (distinctions and prior-art practice), doc 07 (lens format, from the curve-compass edge), doc 08 (secondary-research grounding), and this doc (the edges, the failure catalogue, and the loop back into RSI).
