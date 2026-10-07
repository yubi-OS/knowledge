# 01 Divergent and Convergent Pipeline

Scope: The three phase ideation pipeline the idea-refine skill drives, why divergent expansion must precede convergent selection, and how the sequence maps to the wider divergence-convergence tradition in design practice.

Grounding spine: yubi-OS/yubiOS skills/idea-refine/SKILL.md (source doc).

## The three phases as the skill defines them

The source doc fixes the pipeline at exactly three phases, each doing one thing well:

1. **Understand & Expand (divergent).** Restate the idea as a "How Might We" problem statement, ask 3 to 5 sharpening questions, and generate 5 to 8 idea variations through named lenses.
2. **Evaluate & Converge.** Cluster the ideas that resonated into 2 to 3 distinct directions, stress-test each on user value, feasibility, and differentiation, and surface hidden assumptions.
3. **Sharpen & Ship.** Produce a concrete markdown one-pager with a problem statement, recommended direction, assumptions to validate, MVP scope, a Not Doing list, and open questions.

The source doc is explicit that this is a conversation, not a template: the agent adapts its approach based on what the user says at each phase, and Phase 2 only begins after the user reacts to Phase 1 (indicating which ideas resonate, pushing back, adding context).

## Why the sequence matters

The divergence-then-convergence rhythm is the load-bearing structure. The skill never mixes the two modes: questions and variations in Phase 1, judgment and selection in Phase 2, artifact in Phase 3.

External practice converges on the same shape. The US federal digital service playbook describes divergent and convergent thinking as alternating frames: convergent thinking "will happen naturally and intermittently throughout your design process, whenever you prioritize, refine, or select ideas to pursue" and warns to "be as conscientious and deliberate as possible when moving into this unique frame of mind" (https://digital.gov/guides/hcd/design-operations/thinking/, jev weight 0.78). That matches the skill's design: convergence is not continuous mild filtering, it is a deliberate mode you enter on purpose.

The canonical formalization is the Double Diamond, popularized by the British Design Council in 2005 and adapted from the divergence-convergence model proposed in 1996 by linguist Bela H. Banathy (https://en.wikipedia.org/wiki/Double_Diamond_(design_process_model), jev weight 0.56). Its four phases (Discover, Define, Develop, Deliver) split into two diamonds: expanding outward to gather many possibilities, then narrowing inward to select a direction (https://dovetail.com/design-thinking/double-diamond-model/, jev weight 0.36, weak backing). The skill's three phases compress that model: Phase 1 is the first diamond, Phase 2 is the second, Phase 3 is the deliverable.

## Convergence is decision making

The sharpest formulation in the dig material: "Convergent thinking is decision making" (https://digital.gov/guides/hcd/design-operations/thinking/, jev weight 0.78). This is why the skill gates Phase 2 on user reaction. Deciding which directions deserve stress-testing before the user has reacted would converge on the agent's preferences rather than the user's.

## What the pipeline is not

The source doc draws hard boundaries against three failure modes:

- **Do not jump to Phase 3.** Producing a plan without running Phases 1 and 2 is listed as a red flag. The artifact is only sharp because the expansion and stress-testing preceded it.
- **Do not over-engineer the process.** "Three phases, each doing one thing well. Resist adding steps." The pipeline is deliberately minimal; adding a fourth phase or sub-frameworks is treated as a defect.
- **Do not run the phases mechanically.** The skill reads its companion frameworks.md selectively: "pick the lens that fits the idea, don't run every framework mechanically."

The pipeline is also bounded in volume at each stage: 3 to 5 questions in Phase 1 (no more), 5 to 8 variations, 2 to 3 clusters in Phase 2. Every stage cap is a convergence device: the numbers force selection pressure instead of letting the session sprawl.
