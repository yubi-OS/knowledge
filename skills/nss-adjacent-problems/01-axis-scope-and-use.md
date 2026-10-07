# 01 - Axis scope and use

**Scope:** What the Adjacent-problems axis scores (the breadth AND correctness of a file's relationship map: related issues, alternative solutions, problem-family taxonomy, prior-art cross-references), its trigger phrases, and the when-to-use / when-not-to-use boundaries inside the 12-axis negative-skill-space sweep.

## What the axis scores

The Adjacent-problems axis is the sixth of the twelve axes defined by `negative-skill-space` (source doc: `yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`). It scores a file's coverage of 4 relationship classes at once: related issues, alternative solutions, problem-family taxonomy, and prior-art cross-references. The source doc is explicit that the axis measures "not the count of links, but the breadth AND correctness of the relationship map documented or evidenced in the file." A file that name-drops 12 RFCs scores worse than a file that maps 3 alternatives with trade-offs, rejection criteria, and flip conditions.

This breadth-and-correctness framing matches the way related-work guidance frames the job of a related-work section: positioning a contribution against what already exists, not listing it. The Scott Aaronson research-papers page, which collects survey-style writing advice for positioning new work, carries a jev weight of 0.53 (high backing) for the general claim that good research writing surveys and positions rather than enumerates [https://scottaaronson.com/papers/]. An academic Stack Exchange discussion of how to write a related-work section in computer science makes the same point from the reviewing side: the section exists so a reviewer can judge the contribution against prior results (weak backing, weight 0.08) [https://academia.stackexchange.com/questions/68164/how-to-write-a-related-work-section-in-computer-science].

## Trigger conditions

The source doc lists the phrases that route a request to this skill: NSS adjacent-problems axis, related-work, prior art, alternative solutions, problem-family taxonomy, problem framing, design space enumeration, RFC cross-reference, USPTO analogous-art, citation snowballing, see-also cross-linking, and cycle-13 NSS-adjacent-problems gap-finder. Any one of these triggers the skill; none of them alone authorizes a different axis.

## When to use

The source doc gives 5 use conditions. Use the axis when:

1. A skill, file, ADR, or research note declares a single solution without enumerating the alternatives it chose not to take.
2. Scoring or comparing files along the Adjacent-problems axis for an NSS sweep.
3. Designing a new skill, ADR, or refactor that must position itself against existing alternatives without re-deriving the survey from scratch.
4. A file says "we chose X" but never says why not Y or Z.
5. A research note states findings without linking to the prior art it extends or contradicts.

Conditions 1, 4, and 5 are the diagnostic core: the file made a choice it never contextualized. Literature-review guidance makes the same demand of research writing: a review that starts from a problem statement and studies topic-related literature to confirm or deny it (weak backing, weight 0.06) [https://studycorgi.com/blog/literature-review-outline-strategies-and-examples/].

## When NOT to use

The source doc sets 4 boundaries. Do not use this axis for:

- Primitive coverage (9-primitive binarization): use `negative-skill-space` directly.
- Lens-format RSI patches specifically: use `curve-compass-skill`.
- Enumerating explicit prerequisites or assumptions: use `nss-assumption-set`.
- Enumerating failure modes or anti-patterns: use `negative-skill-space` directly.

These boundaries matter because the axes overlap in surface symptoms. A file with no alternatives often also has no failure-mode section and no assumptions section; the failure is shared but the remedy belongs to a different axis. The adjacent-problems remedy is specifically the relationship map: alternatives, families, prior art, and the reasoning that connects them.

## Operational shape

In the yubiOS corpus the axis runs as the cycle-13 sweep: the rubric is applied to roughly 40 files, and each file gets exactly one adjacent-problems-aware section per lens-format patch, titled `## Adjacent problems -- cycle 13`. The source doc requires that this section carry hypothesis + method + parameters + delta + verdict + score + caveat; a templated section without the lens fields is an anti-pattern (see doc 07).

The sweep is local-only for measurement (the rubric is applied to files, not to the network) and self-contained: the source doc embeds the full rubric, the distinctions, and the lens schema, so no external doc fetch is required to run it.

## Relation to the other 11 axes

The Adjacent-problems axis is axis 6 of 12 in `negative-skill-space`. Its neighbors cover what a file needs (inputs, axis 2), what it produces (outputs, axis 3), and how it executes (mode, axis 11). Adjacent-problems is the only axis that scores the file's *outward* relational posture: what the file says about the world of alternatives around its own choice. That is why the source doc insists the map must hold across operator, developer, CI, and architect audiences: a relationship map that only the author's role can see re-anchors the author's biases into the artifact.
