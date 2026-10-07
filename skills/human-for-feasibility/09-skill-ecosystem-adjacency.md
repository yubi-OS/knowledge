# 09 - Skill ecosystem adjacency: how the discipline composes

Scope: the 8 sibling skills the source doc positions relative to human-for-feasibility, plus the primitive-closure sections the corpus audit appended to the skill.

## The composition map

The source doc (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, "Interaction with Other Skills") defines the relationship with 8 skills. Each entry below is a source-doc claim; the corpus adds no relations the doc does not state.

1. interview-me. The inverse. "When this skill's discipline is satisfied (decision inferable OR low cost OR convention exists), do NOT invoke interview-me. Interview-me is for genuinely unclear intent with high build-cost. Both skills can apply to different sub-decisions in the same task."
2. ideate-solo. Downstream. "When ideation runs autonomously, this skill decides which sub-decisions during ideation need a human answer and which can be inferred. The 'ask only for undocumented choices' rule applies to ideation's own scoring heuristics, scope class choice, and lens selection."
3. idea-kill. Sibling. "A kill verdict may surface undocumented choices that warrant asking. Use this skill to decide whether the kill verdict itself needs a human check or can stand alone."
4. prior-art-search. Upstream. "The findings of a prior-art search inform inference: if X already exists, infer the user's reaction to it."
5. negative-skill-space. Orthogonal. "NSS maps gaps; this skill decides which gaps are user-warrants-an-ask and which the agent can fill by inference." The source doc also routes politically charged decisions here: "use negative-skill-space to surface the gaps instead of asking" (Do-not-use list).
6. spec-driven-development. Downstream. "When writing a spec, every decision is a potential inference point. The spec should include an inference audit for non-obvious choices."
7. doubt-driven-development. Orthogonal. "Doubt-driven doubts decisions with fresh-context reviewers; this skill doubts decisions with the ask-vs-infer rubric."
8. novelty-indication. Orthogonal. "Novelty-indication judges whether an idea is novel (Graham v. John Deere framework); this skill decides whether the judgment requires a user input or can be inferred from the project's ADR history."

The directional labels encode the data flow: upstream skills (prior-art-search) feed evidence into the inference decision; downstream skills (ideate-solo, spec-driven-development) consume the audit and the ask-only-undocumented rule; orthogonal skills handle adjacent judgment problems without sharing a control path.

## The human-in-the-loop framing

The composition is an instance of the broader escalation-design problem. A NeurIPS 2020 workshop on human-in-the-loop dialogue systems treated when systems hand control back to humans as a first-class research question (https://sites.google.com/view/hlds-2020/home, weight 0.46, weak backing, sub-0.5). The dig for this subtopic was thin after 1 redo (4 additional queries still returned mostly generic pages), so the corpus states the boundary explicitly: this doc is grounded primarily in the source doc's own composition section, with the workshop result as weak external context only. No other external relations are claimed.

## Primitive-closure sections in the source doc

The source doc carries 4 appended sections from the curve-guided-rsi corpus audit; the corpus records them here as internal-record content (no dig, per the skills-variant brief):

- Least privilege coverage (cycle-4): "the skill's outputs (artifacts, scripts, patterns) feed into the least privilege layer of the yubiOS pipeline"; changes to the skill are reviewed for impact on least privilege coverage, with gaps tracked in the corpus audit cycle log at refs/ on yubi-OS/yubiOS (source doc).
- Audit/evidence coverage (cycle-5): "this skill contributes to audit by establishing the inference discipline; documented choices are auditable". The doc records the cycle-5 fit coordinates: u=0.812, v=0.550, PC1+PC2 = 0.4615, holdout R-squared = +0.2244 (source doc).
- Primitive-closure entries for cycles 5, 6, and 7 (2026-08-06): segmentation (closing a corpus-wide gap, count 22 to 23 of 70), cryptographic identity, and trust chain (source doc). The changelog entry for cycle 5 points at refs/cycle5-results-2026-08-06.md for the measured delta.

These sections are audit-trail content, not behavioral content: they record where the skill sits in the yubiOS 10-primitive model rather than changing how the discipline is applied. A reader using the skill can skip them; a corpus auditor placing the skill on the primitive-coverage map needs them.

## One coverage caveat the source doc itself makes

The source doc's "Continuous / adaptive coverage" section records that a former template paragraph "asserted capabilities this skill does not itself implement; removed as unsupported" (source doc, dated 2026-09-17). That is a precedent worth noting for corpus consumers: appended coverage sections in the skill corpus are subject to the same falsifiability standard as everything else, and unsupported template claims get removed rather than softened.

## Takeaway

The discipline is a router inside a skill ecosystem: interview-me is its inverse, prior-art-search feeds it, ideate-solo and spec-driven-development consume it, and 4 orthogonal skills cover adjacent judgment problems. The primitive-closure sections are audit metadata. When composing, defer to the source doc's directional labels rather than inventing new couplings.
