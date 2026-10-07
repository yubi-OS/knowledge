# 01 - The want vs should gap

Scope: why stated requests diverge from actual intent, why the divergence is invisible at request time, and why the moment before any plan, spec, or code exists is the cheapest place to close it.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/interview-me/SKILL.md), Overview section.

## The premise

The source doc opens with the claim that carries the whole skill: what people ask for and what they actually want are different things. Users ask for "a dashboard" because that is what one asks for, not because a dashboard solves their problem. They say "make it faster" without a number to hit. Both examples come directly from the source doc, and both share a structure: the request names an artifact or a direction, not the underlying outcome.

This matches the classic requirements-elicitation framing: elicitation is the activity of drawing out requirements that stakeholders cannot fully state themselves. The Wikipedia requirements-elicitation article (https://en.wikipedia.org/wiki/Requirements_elicitation, jev weight 0.37, weak backing) describes elicitation as iterative and conversational for this reason. Practical guides make the same point (https://bacentric.com/requirements-elicitation/, jev weight 0.25, weak backing): what a stakeholder says they want is a starting hypothesis, not the requirement.

The customer-development literature states the mechanism more sharply. The Mom Test (https://www.momtestbook.com/, jev weight 0.68, primary) is built on the observation that people describe what they wish were true and what sounds good, so the interviewer must dig at the problem and the person's actual life rather than the pitch or the proposed solution. The book's own distribution page (https://hailpixel.gumroad.com/l/momtest, jev weight 0.52, primary) frames it the same way: talk about their life, not your idea.

## Why the gap is invisible

The source doc gives 2 mechanisms for why users do not notice the gap themselves:

1. Convention substitution. When the ask is conventional ("build me a dashboard"), the artifact name carries the whole specification, and nobody interrogates it. The request is conventional rather than specific, so unpacking it without guessing is impossible.
2. Tension without a tiebreaker. When 2 reasonable values are in tension (simplicity vs flexibility, cost vs speed), the user has often never picked which one they optimize for. The request sounds complete because both halves are individually sensible.

## Why the moment matters

The source doc is explicit about timing: the cheapest moment to find the gap is before any plan, spec, or code exists. Once building has started, switching costs are real, and the user will rationalize the wrong thing into a "good enough" thing. The misfit gets locked in. The doc's rationalizations table repeats this with a number: switching costs after code exists are 10x what they are before, and discovery during implementation is rework (source doc, Common Rationalizations).

The skill's own example shows the gap concretely (source doc, Example). A user asks for "a dashboard for our metrics". Without the interview, the agent starts proposing chart libraries, having silently assumed who the dashboard is for, what the metrics are, and what success looks like. Two questions later the truth surfaces: the user wants a personal experiment tracker, and they do not even have a list of their experiments. The actual ask is "a list". Different artifact, different scope, different work. The dashboard would have been wrong.

## What this means for practitioners

- Treat every artifact-naming request as a hypothesis about intent, not as the intent itself (source doc; https://www.momtestbook.com/, weight 0.68).
- Price the timing: the cost of 4 to 6 targeted questions is small; the cost of building the wrong thing is borne entirely by the user (source doc, Common Rationalizations).
- The gap is detectable in the request text itself: missing who, missing why, missing success measure, missing binding constraint. Those 4 absences are the trigger signature (source doc, When to Use; see doc 02).
