# 08 - The skill ecosystem: where interview-me sits

Scope: the Define-phase pipeline position of interview-me and its declared relationships with idea-refine, spec-driven-development, planning-and-task-breakdown, doubt-driven-development, and source-driven-development.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, Overview and Interaction with Other Skills sections. Internal-record subtopic, no dig: the sibling skills are yubiOS-internal surfaces named by the source doc.

## The position in the timeline

The source doc places interview-me as the part before all other Define-phase skills. The other skills assume you already know roughly what you want:

- `idea-refine` generates variations from an idea.
- `spec-driven-development` writes the requirements down.
- `doubt-driven-development` stress-tests a plan after you have drafted one.

Interview-me runs before all of those: one question at a time, with your best guess attached, until you can predict what the user is going to say before they say it. Its output, a confirmed statement of intent, is what the downstream skills consume.

## The declared relationships

From the source doc's Interaction with Other Skills section:

| Skill | Relationship | Handoff condition |
|---|---|---|
| idea-refine | downstream | The confirmed intent is "I want X but I don't know how to scope it": hand off to generate variations against the now-explicit intent. |
| spec-driven-development | downstream | The confirmed intent is concrete ("I want X for Y users with Z success criteria"): hand off to write it down. |
| planning-and-task-breakdown | 2 hops downstream | Runs after the spec, not after the intent. |
| doubt-driven-development | opposite end of the timeline | Interview-me is pre-decision intent extraction; doubt-driven is post-decision artifact review. Both catch divergence, but at different moments. |
| source-driven-development | orthogonal | Interview-me clarifies what the user wants; SDD verifies framework facts. They do not compete. |

## What the handoff rules imply

1. The intent is the interface. The source doc's Verification checklist requires that any handoff to a downstream skill be framed in terms of the confirmed intent, not the original underspecified ask. Handing "build me a dashboard" to idea-refine would propagate the misunderstanding; handing "a personal experiment tracker listing experiments and their early signals, for me alone" propagates the understanding.
2. Direction matters. idea-refine and spec-driven-development consume intent; doubt-driven-development reviews artifacts produced after decisions. Running doubt-driven on an unconfirmed intent is a category error: there is no artifact to stress-test yet.
3. Orthogonality is load-bearing. Interview-me does not verify facts and SDD does not extract intent; the source doc pairs them so neither substitutes for the other.

## In-repo touchpoints

The source doc's in-repo summary lists the sections this skill owns or extends: Overview, When to Use, Loading Constraints, The Process. The Guidelines section constrains scope: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job. That makes the frontmatter description, underspecified asks, explicit invocation ("interview me", "grill me"), and silent assumption-filling before a plan exists, the routing boundary between this skill and its neighbors (see doc 02).

## What this means for practitioners

- Treat the confirmed intent as the only valid input to idea-refine and spec-driven-development; do not hand off before the explicit yes (doc 06).
- Do not run interview-me and doubt-driven-development on the same moment: one is pre-decision, the other post-decision.
- When the ask is underspecified in a non-interactive context, the loading constraint (doc 02) forbids this skill; surface the blocker instead.
