# 09 - Scope, Boundary, and Guidelines

Scope: the frontmatter description scope, the boundary-case routing rule, and the guidelines that bind every use inside the declared scope.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, frontmatter, "Examples", and "Guidelines" sections.

## The declared scope

The frontmatter description is the skill's scope statement: "Discovers and invokes agent skills. Use when starting a session or when you need to discover which skill applies to the current task. This is the meta-skill that governs how all other skills are discovered and invoked" (source doc, frontmatter). It declares 2 trigger conditions (session start; task start needing skill discovery) and 1 ownership claim (governing how all other skills are discovered and invoked).

The closing rule of the source doc makes the scope binding: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job" (source doc, Guidelines). That sentence is the corpus's general scope-discipline rule applied to the meta-skill itself: the meta-skill must not absorb work that belongs to a phase skill.

## What is inside the scope

Concretely, the meta-skill's in-scope work, drawn from its own sections:

1. Routing a task to a skill via the discovery tree (doc 01).
2. Selecting and ordering skills for a task via the rules and lifecycle sequence (doc 05).
3. Consulting the phase map for membership and scope (doc 06).
4. Applying the 6 core operating behaviors at all times (doc 03).
5. Detecting the 10 failure modes (doc 04).
6. Enforcing the verification and Definition of Done bar (doc 07).
7. Maintaining its audit-section surfaces for the corpus audit (doc 08).

## The boundary-case rule

The source doc's Examples section states the boundary rule: "Boundary case - when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising here" (source doc, Examples, boundary case). Reading it against the trigger phrases: if a request says "review this code", the artifact exists and routing proceeds (code-review-and-quality). If a request only names a trigger, for example "do a review", with no artifact, the meta-skill must not improvise a definition of what to review; it routes to the surface that owns the trigger and lets that skill's own scope rules handle the gap.

The same Examples section carries a "Worked setup" list that restates 4 of the skill's own rules as bullets (the stop protocol, the check-for-skill rule, the workflows-not-suggestions rule, and the multiple-skills rule), and an "In-repo touchpoints" line naming the sections the skill owns or extends: Overview, Skill Discovery, Core Operating Behaviors, and behavior 1, Surface Assumptions (source doc, Examples).

## The guidelines list

The Guidelines section is a 4-item list that mixes the skill's own content into a numbered list (source doc, Guidelines):

1. The first discovery-tree branch: "Don't know what you want yet? routes to interview-me".
2. The assumption rule: "Don't silently fill in ambiguous requirements. The most common failure mode is making wrong assumptions and running with them unchecked. Surface uncertainty early - it's cheaper than rework."
3. The stop protocol head: "STOP. Do not proceed with a guess."
4. The workflow rule: "Skills are workflows, not suggestions. Follow the steps in order. Don't skip verification steps."

Items 2 to 4 restate behavior 1, behavior 2, and skill rule 2. The guidelines section is therefore a recap layer, not new policy; where it and the main sections could appear to differ, the main sections are the fuller statement.

## Interplay with the agent-level discipline

The skills ecosystem frames skill scope the same way from the outside: skills are described as instructions plus metadata that an agent invokes "when relevant", with the frontmatter description as the discovery surface (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview, jev weight 0.94), and the specification recommends the body carry step-by-step instructions, examples, and edge cases (https://agentskills.io/specification, jev weight 0.75). The yubiOS scope rule ("anything beyond it is a different skill's job") is the discipline layer on top: it prevents the meta-skill's broad governance claim from becoming a catch-all that swallows phase work.

## Failure mode at the boundary

The scope rule fails in 2 ways, both visible in the source doc's failure-mode list (doc 04):

1. Scope creep by the meta-skill: treating "governs how skills are discovered" as "governs the work the skills do". The counter is the boundary-case rule: route to the owning surface.
2. Scope abdication by the agent: skipping discovery entirely and doing phase work without a skill. The counter is skill rule 1: "Check for an applicable skill before starting work" (source doc, Skill Rules).

## Usage summary

The meta-skill is invoked at session start or task start; it routes, orders, and binds; it does not implement, review, test, or ship. Those verbs belong to the phase skills it routes to, and the boundary rule sends every out-of-scope request to the surface that owns it.
