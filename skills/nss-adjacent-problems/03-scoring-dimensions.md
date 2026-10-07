# 03 - The 10 scoring dimensions

**Scope:** The ten binary 0-2 scoring dimensions, the 20-point maximum, and the label conversion bands Narrow, Emerging, Useful, Strong, Comprehensive. Internal-record subtopic grounded in the source doc's rubric.

## The dimensions

The source doc (`yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`) defines 10 dimensions, each scored 0, 1, or 2, for a maximum of 20. The rubric is binary per-dimension: no fractional scores.

1. **Related problems named** - the file names the problems it solves *alongside* the focal problem (siblings, cousins, not just prerequisites). Score 2 if 3 or more related problems are named with a relation type.
2. **Alternative solutions enumerated** - the file enumerates at least 2 alternative approaches with their trade-offs, not just the one it chose. Score 2 if 3 or more alternatives are enumerated.
3. **Problem-family taxonomy** - the file identifies the problem family it sits in (for example "OS trust anchoring" vs "OS measurement" vs "OS key sealing"). Score 2 if the family name is explicit and the boundary with adjacent families is documented.
4. **Prior-art citations** - the file cites prior art (papers, RFCs, vendor docs, similar projects) with enough context that the reader can find them. Score 2 if every alternative has at least 1 citation.
5. **Rejection criteria documented** - for each rejected alternative, the file states WHY it was rejected (constraint violation, missing primitive, security boundary). Score 2 if every alternative has an explicit "why not" line.
6. **Relation type classified** - relationships are classified (intersection / analogy / abstraction / substitution / alternative / prior-art / extension) rather than free-form "see also" links. Score 2 if a controlled vocabulary is used.
7. **Decision reversibility stated** - the file states the conditions under which the chosen solution would be abandoned for an alternative. Score 2 if the flip conditions are explicit.
8. **Boundary with adjacent families** - the file distinguishes its problem from adjacent families (for example "secure boot" vs "measured boot" vs "encrypted boot" vs "reproducible boot"). Score 2 if at least 1 boundary is explicitly named.
9. **Cross-context invariance** - the relationship map holds across the relevant contexts (operator, developer, CI, architect). Score 2 if all 4 contexts see the same map.
10. **Link integrity** - every cross-reference resolves to the cited artifact (no broken links, no stale RFC numbers). Score 2 if a machine check is feasible.

## Conversion bands

| Total | Label |
|---|---|
| 0-3 | Narrow |
| 4-7 | Emerging |
| 8-12 | Useful |
| 13-16 | Strong |
| 17-20 | Comprehensive |

The bands are deliberately coarse. The source doc treats the label as a summary for wayfinding; the actionable output of a scoring pass is the dimension vector, because the vector names which specific dims are missing.

## What the dimensions jointly enforce

The 10 dimensions decompose the axis's 4 relationship classes into checkable conditions:

- Related problems: dimension 1.
- Alternative solutions: dimensions 2, 5 (why not), 7 (when it would flip).
- Problem-family taxonomy: dimensions 3, 8.
- Prior-art cross-references: dimensions 4, 10.
- Map quality (cross-cutting): dimensions 6 (controlled vocabulary), 9 (cross-context invariance).

Dimensions 5 and 7 are the pair that turn a survey into a decision: 5 documents why each alternative lost, 7 documents when the winner would lose. Dimensions 9 and 10 are the quality guards: a map that only makes sense to the author's role (9) or a map with dead references (10) does not count as evidenced even if the content is present.

## Scoring behavior, not keywords

The source doc's guidelines rule 1 is "score behavior, not keywords." A token like `see also` earns at most partial credit; full credit requires a relation type, a trade-off, and a flip condition. This blocks the most common gaming failure: a file that sprinkles RFC numbers and `see also` links to harvest points without building a relationship map.

The worked examples in the source doc (see doc 07 for the lens format that carries them) show the principle in practice. A Containerfile that FROMs an image and adds packages with no alternatives scores 1/20 (cross_context: 1, everything else 0) and lands Narrow. An ADR that proposes option A, lists options B and C, and concludes A without stating the winning constraint scores 4/20 (Emerging): the alternatives are named but the "why not" lines are missing, and the source doc identifies those lines as the highest-leverage add. A research note that cites 3 papers with context but never enumerates alternatives scores 7/20 (Emerging); a 1-paragraph "what we did not adopt, and why" would push it to Strong.

## Calibration notes

Two dims are easy to over-award:

- **Dim 4 (prior art):** a bibliography is not a cross-reference. The citation must come with context that ties it to a component or alternative ("this is the prior art for component X").
- **Dim 3 (family taxonomy):** an implied family scores 1, not 2. Score 2 requires the family name to be explicit AND the boundary with adjacent families documented.

And one is easy to under-award:

- **Dim 10 (link integrity):** the score 2 condition is that a machine check is feasible, not that someone ran a link checker. A file whose cross-references are all resolvable URIs qualifies even if no checker has run.
