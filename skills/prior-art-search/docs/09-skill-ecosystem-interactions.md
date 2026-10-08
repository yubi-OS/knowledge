# 09 Interaction with the yubiOS skill ecosystem

Scope: how prior-art-search composes with idea-refine, ideate-solo, idea-kill, negative-skill-space, source-driven-development, novelty-indication, and the websearch/webfetch tools. Internal-record subtopic, no dig.

Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md` (all claims come from the source doc's "Interaction with Other Skills" section; internal-record subtopic, no dig).

## The pairing map

The source doc defines six relationships:

1. **idea-refine / ideate-solo: upstream or parallel.** Running prior-art-search before ideation gives the agent concrete prior art to inform variation generation. Running it after gives the finalist an honest check. The inputs it accepts (a raw idea, a one-pager) are exactly these skills' outputs.
2. **idea-kill: downstream.** The prior-art report's "Why previous attempts failed" section is direct input to idea-kill's steelman-the-opposition step. Run idea-kill after to verify the verdict.
3. **negative-skill-space: orthogonal.** prior-art-search answers "what's been tried"; negative-skill-space answers "what does this artifact not cover". Different gaps, different questions.
4. **source-driven-development: complementary.** source-driven-development verifies implementation claims against official docs; prior-art-search verifies the idea's novelty against existing products. Both are checks; they check different sources.
5. **novelty-indication: complementary.** prior-art-search handles engineering prior art (software projects, technical ideas, adoption history); novelty-indication handles patent prior art (the Graham v. John Deere framework for legal novelty assessment). Same term, different domains; the disambiguation disclaimer at the top of the source doc's When to Use section documents the split (see doc 01).
6. **websearch / webfetch (tools): building blocks.** prior-art-search is a structured way to drive those tools; it does not replace them for ad-hoc queries.

## Direction of flow

The composition has a shape: prior-art-search sits between idea generation and idea verdicts. Upstream (idea-refine, ideate-solo) it grounds variation generation in what already exists; downstream (idea-kill) it supplies the failure evidence that a kill verdict needs. The orthogonals and complementaries (negative-skill-space, source-driven-development, novelty-indication) are checks on different axes and can run at any point.

## Why the ecosystem needs a dedicated prior-art pass

Each pairing fixes a specific failure the partner skill cannot fix by itself:

- idea-refine without prior art generates variations blind to the existing landscape; the user's own knowledge is bounded, and the conversation cannot reliably answer "what has been tried?" (the source doc's philosophy section names this as "the most consequential gap in idea-refine").
- idea-kill without the failed-attempts section has no steelman evidence: opposition to an idea is strongest when grounded in named prior failures.
- novelty-indication and prior-art-search must not be merged: running websearch for patent-law novelty assessment produces the wrong kind of report, and the source doc's changelog records that the naming collision was flagged and repaired across cycles 2 and 4 of its self-improvement loop.

## Boundary case

The source doc notes a boundary rule: when a request only names a trigger ("prior art", "has anyone done this") without the artifact the skill acts on, route to the owning surface instead of improvising. prior-art-search needs a topic, idea, or question to load in step 1; a bare trigger is a routing decision, not a search.

## Sources

- Source doc: `yubi-OS/yubiOS skills/prior-art-search/SKILL.md` (sole source; internal-record subtopic, no dig)
