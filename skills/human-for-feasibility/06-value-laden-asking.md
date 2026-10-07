# 06 - Value-laden decisions: ask, with a recommendation attached

Scope: Step 4 of the discipline. Why taste, politics, and strategy are not inferable, and Step 6's rules for asking well once the ask is earned.

## The step

Step 4 of the source doc (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, "Is the decision politically / value-laden?") handles the decisions no amount of evidence can settle, because they encode values the agent does not hold. The source doc names 3 classes:

1. Taste / aesthetic: visual design, naming, tone of voice.
2. Politics / values: what to prioritize, what to exclude, who to defer to.
3. Strategic: which market, which user, which trade-off to accept.

"For these, the agent's inference will be defensible at best. The user IS the source of value here. If YES -> ask, with a single concrete recommendation attached. Don't ask 'what do you want?' - ask 'I'm leaning toward X because Y. Right?'" (source doc).

The reasoning is structural, not probabilistic. An inference can be more or less well-supported by evidence; a value choice has no evidence to be supported by. The agent can describe consequences, but only the user can weigh them.

## The industry echo: judgment is shifting to humans

Independent practitioner sources converge on the same division of labor. Darktrace's blog on human judgment in the agentic AI age argues that "as agentic AI systems take on more decision-making, human value is shifting from execution to judgement", with the challenges of maintaining oversight and resisting AI-driven influence (https://www.darktrace.com/blog/the-problem-of-re-defining-human-value-in-the-agentic-age, weight 0.18, weak backing, sub-0.5). McKinsey's analysis of agentic AI in procurement similarly shifts the function's center of gravity from transaction tasks to strategy (https://www.mckinsey.com/capabilities/operations/our-insights/redefining-procurement-performance-in-the-era-of-agentic-ai, weight 0.42, weak backing, sub-0.5). An enterprise-analysis piece frames the core question as defining "which decisions can be automated, which require human judgment, and how escalation" works between them (https://www.inteqgroup.com/blog/agentic-ai-breaking-the-myth-of-the-iron-triangle, weight 0.12, weak backing, sub-0.5). All weak-backed; the convergence supports the source doc's premise that human-judgment boundaries are an active design concern, and this skill is the per-decision mechanism for drawing that boundary.

## Step 6: when the ask is earned, ask well

If the decision survives Steps 1 through 5, the choice is genuinely undocumented and the cost of asking is justified. The source doc (Step 6, "None of the above -> ASK") fixes 5 rules for the ask itself:

1. One question at a time. No batching.
2. Attach your guess. "I'm leaning toward X because Y. Right?"
3. Make the choice concrete. Two options framed as a choice, not an open-ended "what do you want?"
4. Show the cost of the choice. What changes if the user picks the other option?
5. Default if no answer. State what you'll do if the user doesn't respond. This is the inference fallback: proceed with your best guess.

Rule 5 is what keeps the ask from stalling the work: even a fully earned ask carries a default, so silence never blocks progress (source doc).

## The recommendation-attached pattern

The single most repeated sentence in the source doc is the recommendation pattern, appearing in Step 4 and again in the Guidelines: "I'm leaning toward X because Y. Right?" The pattern does 3 things at once:

- It commits the agent to a position, which exposes bad reasoning for correction instead of hiding it behind an open question.
- It gives the user a low-effort accept path (a 1-word confirmation instead of an essay).
- It separates the value question (should it be X or Y?) from the justification question (why X?), so the user can reject the answer while accepting the reasoning.

The red-flag list enforces the inverse: "Asking without a guess. 'What do you want me to do?' is unanswerable without a hypothesis. Always attach your guess" (source doc, Anti-patterns).

## Vague answers are not confirmation

The source doc adds a subtle rule to this class: "Asking and inferring the answer. If the user gives a vague response ('sure', 'ok', 'fine'), don't pretend it's confirmation. Re-ask with two concrete options" (source doc, Anti-patterns). But the Red Flags section sharpens it into a second-order inference: "Re-asking the same question after the user gave a vague answer (the inference is: they delegated; pick the best option and proceed)". The synthesis: one re-ask with concrete options is allowed; after that, a vague answer is itself an answer meaning "you decide". The user who says "fine" to a concrete recommendation has implicitly exercised the delegation right this skill reserves for them.

## Takeaway

Taste, politics, and strategy ask, because the user is the source of value and no ladder rung can substitute. But the ask itself has a spec: one question, a guess attached, concrete options, costs shown, and a stated default for silence. Ask well or do not ask at all.
