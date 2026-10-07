# 05 - Listening for want vs should want

Scope: Step 3 of the process, detecting answers that describe what a thoughtful answer sounds like rather than what the user actually wants, and the single probe question that breaks the pattern.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, The Process step 3 and Red Flags.

## The 4 signal classes

The source doc names 4 patterns that mark a "should want" answer:

1. Best-practice talk without specifics: "I want it to be scalable", "clean architecture". These are sophistication signals; they sound like goals but name no outcome.
2. Deferral to convention: "the way most apps do it", "the standard approach". The user is citing a norm instead of a need.
3. Obligation language: "I should probably...", "I think I'm supposed to...", "good engineering practice says...". The subject of the sentence is not the user's desire but an external standard.
4. Buzzwords as goals: "modern", "scalable", "robust" as the answer instead of a specific outcome.

All 4 share one structure: the answer is optimized for defensibility to an imagined audience, not for describing what the user wants. That is the "should" in want vs should.

## The probe

The source doc prescribes one question when these signals appear:

> "If you didn't have to justify this to anyone, what would you actually want?"

The doc's assessment: that single question often does more work than the previous 5. Its mechanism is to remove the audience whose approval the answer was optimized for, which collapses the should-answer into a want-answer.

## External grounding: what the research says about stated wants

The Mom Test literature is the closest external mechanism and its core rule matches the probe's design. The book's site (https://www.momtestbook.com/, jev weight 0.68, primary) states the principle as: talk about their life, not your idea; ask about specific past behavior, not hypothetical future commitments; people are wired to be nice to you and will say what you want to hear unless the question is built so that any answer is useful. The distribution page (https://hailpixel.gumroad.com/l/momtest, jev weight 0.52, primary) summarizes the same discipline: big vague questions get vague answers, so anchor on specifics of their life.

Secondary summaries reinforce it (all weak backing, labeled as such): the GoNoGo example collection (https://gonogo.team/the-mom-test/examples, jev weight 0.28) and Koji's probing-questions guide (https://www.koji.so/docs/probing-questions-user-interviews, jev weight 0.28) both catalog probe phrasings that substitute for direct asks.

Note on dig quality: this subtopic's dig was thin. 2 redo attempts with different queries still returned mostly aggregator noise and dictionary entries; the strongest surviving sources are the 2 Mom Test primary links above. The doc therefore leans on the source doc for its claims and uses the Mom Test material only as corroborating external mechanism.

## Red flags the source doc attaches to this step

- The user gives a sophistication-signaling answer ("scalable", "clean", "modern") and the interviewer accepts it without probing whether it is what they actually want. Acceptance without the probe is listed as a red flag in its own right.
- Questions framed as "what would be best practice?" instead of "what do you actually want?" feed the same pattern: they invite the user to optimize for defensibility again.

## What this means for practitioners

- Treat "scalable" and its siblings as conversation enders, not answers. The next move is the justification-free probe, not a follow-up on scalability.
- Expect the probe to be slightly uncomfortable to ask; it is asking the user to drop a social performance. That discomfort is the signal it is working.
- One probe usually re-opens the interview: fold the new answer into the hypothesis, adjust the confidence number (doc 03), and continue one question at a time (doc 04).
