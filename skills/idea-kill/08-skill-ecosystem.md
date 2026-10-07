# 08 - Skill ecosystem

Scope: how idea-kill relates to its neighboring skills (idea-refine, ideate-solo, prior-art-search, spec-driven-development, negative-skill-space, doubt-driven-development), and its loading constraints.

Internal-record subtopic, no dig: this doc is grounded entirely in the source doc (yubi-OS/yubiOS skills/idea-kill/SKILL.md); all claims below are attributed to it.

## The pipeline position

idea-kill sits downstream of ideation and upstream of specification. The source doc's ecosystem section defines five relationships:

1. idea-refine and ideate-solo are upstream. The kill verdict is more accurate when run on a one-pager than on a raw idea, so the guidance is to run ideation first if the idea is fresh.
2. prior-art-search is complementary. The strongest critique in Step 3 includes "what's been tried before that failed", and prior-art-search is the tool that surfaces that evidence.
3. spec-driven-development is downstream of SHIP. A SHIP verdict hands off to SDD for the spec.
4. negative-skill-space is the alternative. It maps gaps without making a recommendation; idea-kill produces a verdict. Use negative-skill-space when the user wants a gap map, idea-kill when the user wants a go/no-go.
5. doubt-driven-development is orthogonal. It doubts specific decisions; idea-kill doubts the whole idea. The recommended pairing is to run doubt-driven on a SHIP-verdict idea to vet its specific design decisions (source doc).

## The shape of the ecosystem

The relations form a funnel with a verdict at its neck. Before the neck, two skills (idea-refine, ideate-solo) shape a raw idea into a one-pager. At the neck, idea-kill answers go/no-go. After the neck, a SHIP continues to spec-driven-development; a KILL or PAUSE stops or parks, with resurrection triggers documenting the revisit condition.

The alternatives and complements are not interchangeable with the verdict. negative-skill-space produces a different artifact (a gap map) on purpose, and the source doc routes politically charged cases there precisely because a gap map does not force a recommendation. doubt-driven-development operates after commitment, on individual decisions, where a whole-idea verdict is the wrong granularity (source doc).

## Loading constraints

The source doc constrains how the skill runs, and the constraints protect the ecosystem boundaries:

1. One pass: do not loop; the verdict is one shot.
2. Honest, not supportive: the user is asking for a kill-pulse; producing reasons to continue is failing the skill.
3. Read-only: the verdict is a document; do not modify the source idea and do not act on the verdict, because downstream skills consume it.
4. No recursion: the verdict is final; if the user disagrees they can run the skill again on the same idea with new evidence (source doc).

The read-only constraint is the one that ties idea-kill to the rest of the corpus: the skill's only output is the verdict document, and acting on the verdict is explicitly another skill's job. The no-recursion constraint pairs with the shopping red flag from doc 07: re-running with the same evidence to get a different answer is failure, re-running with new evidence is legitimate.

## Boundary case

The source doc's examples section adds one boundary rule: when a request only names a trigger ("kill this idea") without the artifact it acts on, route to the owning surface instead of improvising here. In practice that means asking for the raw idea text, the one-pager path, or the spec path before running the pipeline, because Steps 1 and 2 (read fully, name the bet) cannot run on nothing (source doc).
