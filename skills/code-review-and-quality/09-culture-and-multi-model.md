# 09 Review Culture, Multi-Model Review, and Anti-Rationalizations

Scope: the social side of the skill: review speed, dispute resolution, honesty, dependency discipline, the multi-model review pattern, dead code hygiene, and the rationalizations the skill refuses.

Grounding spine: `yubi-OS/yubiOS skills/code-review-and-quality/SKILL.md` (source doc). External mechanisms are cited with their jev weight.

## Review speed

Slow reviews block entire teams, and the cost of context-switching to review is less than the waiting cost imposed on others (source doc). The source doc sets the bar (source doc):

- Respond within 1 business day, as a maximum, not a target.
- Ideal cadence: respond shortly after the review request arrives, unless deep in focused coding. A typical change should complete multiple review rounds in a single day.
- Prioritize fast individual responses over quick final approval. Quick feedback reduces frustration even if multiple rounds are needed.
- For large changes, ask the author to split them rather than reviewing one massive changeset.

Google's published reviewer guidance states the same standard: review speed is one of the 3 pillars of its review framework, with the expectation that responses come within a day and the emphasis on early, incremental feedback over fast final approval (noul 0.82, https://google.github.io/eng-practices/review/reviewer/speed.html).

## Handling disagreements

The dispute hierarchy has 4 levels, in order (source doc):

1. Technical facts and data override opinions and preferences.
2. Style guides are the absolute authority on style matters.
3. Software design must be evaluated on engineering principles, not personal preference.
4. Codebase consistency is acceptable if it does not degrade overall health.

The corollary rule is about deferred cleanup: do not accept "I will clean it up later". Experience shows deferred cleanup rarely happens. Require cleanup before submission unless it is a genuine emergency, and if surrounding issues cannot be addressed in this change, require filing a bug with self-assignment (source doc).

## Honesty in review

5 rules govern reviewer honesty (source doc):

1. Do not rubber-stamp. "LGTM" without evidence of review helps no one.
2. Do not soften real issues. Calling a production-bound bug "a minor concern" is dishonest.
3. Quantify problems when possible.
4. Push back on approaches with clear problems. Sycophancy is a failure mode in reviews.
5. Accept override gracefully. If the author has full context and disagrees, defer to their judgment. Comment on code, not people.

## Multi-model review pattern

The skill prescribes a 4-stage loop for agent-written code (source doc): model A writes the code, model B reviews for correctness and architecture, model A addresses the feedback, and a human makes the final call. The rationale: different models have different blind spots, so a single-model review misses what a cross-model review catches (source doc). Research on LLM-assisted code review supports the premise that models can perform review-grade analysis, while the human final call remains the gate (noul 0.61, https://arxiv.org/html/2404.18496v2).

## Dependency discipline

Dependency review is part of code review. Before adding any dependency, ask 5 questions: does the existing stack solve this, how large is it, is it actively maintained, does it have known vulnerabilities, and what is the license (source doc). The rule: prefer standard library and existing utilities, because every dependency is a liability (source doc).

## Dead code hygiene

After any refactoring or implementation change, identify unreachable or unused code, list it explicitly, and ask before deleting (source doc). The skill's example format names each orphan with its replacement, then asks "safe to remove these?" The rule has 2 halves: do not leave dead code lying around because it confuses future readers and agents, and do not silently delete things you are unsure about (source doc).

## The rationalization table

The source doc closes with 7 rationalizations and their refutations (source doc). The ones a reviewer hears most: "it works, that's good enough" (debt compounds), "I wrote it, so I know it's correct" (authors are blind to their own assumptions), "we will clean it up later" (later never comes), "AI-generated code is probably fine" (it needs more scrutiny, not less), "the tests pass, so it's good" (tests are necessary but not sufficient), "the refactor makes it cleaner" (relocating complexity is not reducing it), and "it's only a small addition to this file" (judge the resulting structure, not the diff size). Each maps to a check earlier in this corpus, which is the design intent: the culture rules are the five axes plus the sizing rules, stated as refusals.
