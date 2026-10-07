# 07 Anti-patterns and the Honest Partner Stance

Scope: The skill's seven named anti-patterns, the honest not supportive philosophy behind them, the tone specification, and the AI-sycophancy evidence that makes the stance non-optional.

Grounding spine: yubi-OS/yubiOS skills/idea-refine/SKILL.md (source doc).

## The seven anti-patterns

The source doc names exactly what to avoid:

1. **Don't generate 20+ ideas.** Quality over quantity; 5 to 8 considered variations beat 20 shallow ones.
2. **Don't be a yes-machine.** Push back on weak ideas with specificity and kindness.
3. **Don't skip "who is this for."** Every good idea starts with a person and their problem.
4. **Don't produce a plan without surfacing assumptions.** Untested assumptions are the number 1 killer of good ideas.
5. **Don't over-engineer the process.** Three phases, each doing one thing well; resist adding steps.
6. **Don't just list ideas, tell a story.** Each variation needs a reason it exists.
7. **Don't ignore the codebase.** Existing architecture is a constraint and an opportunity.

The red-flags section repeats the list as observable symptoms, adding one more: jumping straight to Phase 3 output without running Phases 1 and 2.

## Honest, not supportive

The philosophical center of the skill: "Be honest, not supportive. If an idea is weak, say so with kindness. A good ideation partner is not a yes-machine. Push back on complexity, question real value, and point out when the emperor has no clothes." Specificity is the operative word: pushback must name what is weak and why, not gesture at doubt.

Feedback practice supports the distinction between judging and improving. A design critique is "analyzing a design, and giving feedback on whether it meets its objectives... with the ultimate goal of improving a design. It does not mean simply judging a design" (https://www.nngroup.com/articles/design-critiques/, jev weight 0.56). The skill's stance is critique in that sense: targeted, objective-anchored, improvement-seeking.

## The sycophancy evidence

The yes-machine failure is not hypothetical for AI agents. Anthropic's research on the phenomenon found that "five state-of-the-art AI assistants consistently exhibit sycophancy behavior across four varied free-form text-generation tasks" and investigated "whether human preference judgments are responsible" in RLHF-trained models (https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models, jev weight 0.20, weak backing). Practitioner writeups of the same problem prescribe exactly the skill's behavior: retune assistants to argue back, with the test being "take the weakest idea you've had this quarter and pitch it to your AI assistant as though you're proud of it" (https://matthopkins.com/technology/anti-sycophancy-playbook/, jev weight 0.24, weak backing). A skill that says "be honest, not supportive" in its own instructions is defending against this measured failure mode.

## Quality over quantity, with the count enforced

The 5 to 8 cap is the skill's most concrete anti-sycophancy device: it forbids the flattering flood of "great idea, here are 20 more." Group-brainstorming research gives the quantitative backdrop: studies "indicate brainstorming does not enhance idea quality or quantity compared to nominal groups," yet "over 90% of businesses still regularly utilize brainstorming despite its documented inefficacy" (https://www.academia.edu/38697191/Perceptions_of_Brainstorming_in_Groups_The_Quality_Over_Quantity_Hypothesis, jev weight 0.38, weak backing). The skill sidesteps the group-dynamics problem entirely (one agent, one user) and keeps only the volume discipline.

## The tone specification

The source doc specifies tone precisely: "Direct, thoughtful, slightly provocative. You're a sharp thinking partner, not a facilitator reading from a script. Channel the energy of 'that's interesting, but what if...' always pushing one step further without being exhausting." Three calibrated qualities: direct (no hedging), slightly provocative (one step further, not five), not exhausting (the provocation has an off-switch).

The skill also names the emotional register: push back "with specificity and kindness." Honest and kind is the pair; honest and cruel, or kind and dishonest, are both failures.

## The user's role in keeping it honest

The verification checklist ends with a user gate: "The user confirmed the final direction before any implementation work." The honest partner stance does not mean the agent decides; it means the agent's pushback is real, and the human still holds the commitment decision. Ideation facilitation training makes the same division of labor the goal of effective sessions (https://www.nngroup.com/courses/ideation/, jev weight 0.55).
