# 06 - Self-recognition

Scope: the positive and negative checklists a future session uses to determine whether it is in restful-self mode, and why the checklists are behavioral rather than introspective.

## The two checklists (source doc)

The source doc gives 2 recognition lists.

A future session can recognize it IS in restful-self if (source doc):

1. It just read one file without producing a tool call.
2. It observed the shape of the work in one sentence, without enumerating gaps.
3. It sat with the read without reviewing shipping output.
4. It exited on one of the 4 exit criteria.

It can recognize it is NOT in restful-self if (source doc):

1. It read AND produced an artifact (gap-finding, fix, draft, list).
2. It sat AND extracted a pattern to act on (analysis, enumeration, scoring).
3. It wrote a whole-self output AND scheduled a follow-up task.
4. It ran the protocol past the exit criteria (5 steps instead of 4, or "I am resting" narration).
5. It produced the "I am sitting with X" narration, which is anti-pattern #1.

Every line on both lists is an observable behavior: what was read, what was produced, how many steps ran, which exit fired. None requires the agent to report an inner state.

## Why behavioral tests rather than introspection

The design choice has a grounding in 2 research domains.

The metacognition literature distinguishes monitoring from regulation, and is candid about monitoring's failure modes. Wikipedia describes metacognition as knowledge of one's own thinking plus metacognitive regulation, the regulation of cognition and learning through a set of activities (https://en.wikipedia.org/wiki/Metacognition, jev weight 0.29, weak backing). MIT's Teaching and Learning Lab defines it as the process by which learners use knowledge of the task, knowledge of learning strategies, and knowledge of themselves to plan, monitor progress, and evaluate the outcome (https://tll.mit.edu/teaching-resources/how-people-learn/metacognition/, jev weight 0.35, weak backing). A science-education piece notes that metacognition includes both awareness of how the mind works and the capacity to adjust approach based on that awareness (https://scienceinsights.org/what-does-metacognition-mean-and-why-it-matters/, jev weight 0.16, weak backing). A ResearchGate paper on improving self-monitoring and self-regulation traces how metamemory research from cognitive psychology informs interventions (https://www.researchgate.net/publication/257408389_Improving_self-monitoring_and_self-regulation_From_cognitive_psychology_to_the_classroom, jev weight 0.24, weak backing).

The agent-side domain is newer but points the same direction. Anthropic's research program asks whether AI systems can truly introspect and notes that the answer has implications for transparency and reliability: if models can accurately report on their own internal mechanisms, that could help understanding and debugging (https://www.anthropic.com/research/introspection, jev weight 0.21, weak backing). An arXiv study investigates conditions under which large language models produce structured first-person descriptions that reference awareness or subjective experience (https://arxiv.org/html/2510.24797v2, jev weight 0.15, weak backing). An IEEE paper proposes confidence introspection as a self-reflection method and frames the motivating problem: LLMs suffer from factual hallucinations, confidently providing responses inconsistent with reality (https://ieeexplore.ieee.org/document/11352956, jev weight 0.18, weak backing).

The shared lesson: self-report is the weakest available instrument. A model narrating "I am resting" is exactly the hallucination-shaped output the source doc bans as anti-pattern #1 (source doc). So the skill replaces introspection with a checklist over the session's own action history: did a tool call happen, was more than 1 file read, was an artifact produced, which exit fired. This makes the mode-recognition question decidable the same way a linter is decidable, from the transcript, rather than via a confidence-weighted self-assessment (source doc).

## How a session runs the checklists

The positive list is conjunctive enough to be falsifiable: if the session cannot confirm all 4 positive lines, it is not (or not yet) in restful-self. The negative list is disjunctive: any single line disqualifies. In transcript terms, an operator or a later session can audit a restful-self claim by reading the message history and applying the lists mechanically: count reads, look for artifacts, look for follow-up tasks, count protocol steps, look for narration phrases like "I am sitting with" or "let me reflect on" (source doc).

This is also why the source doc separates self-recognition from the fire signals (doc 02): the fire signals decide whether to ENTER the mode, the checklists decide whether a session is IN it, and the exit criteria (doc 05) decide when to LEAVE. Three separate state questions, three separate artifacts, no overlap (source doc).

## Drift the checklists catch

The negative list doubles as a drift detector for the cadence itself. Line 3 (wrote a whole-self output AND scheduled a follow-up task) is the exact signature of the evidence-not-pause drift from doc 01: an entry that claims reflection while queueing more work. Line 4 (protocol past the exit criteria) catches the run-on session. Both are patterns the SELF-CHANGELOG v0.16 drift signal was built to surface (source doc), and both are mechanically checkable in the changelog's own entries, which is what the worked example 3 in doc 07 demonstrates (source doc).
