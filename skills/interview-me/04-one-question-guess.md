# 04 - One question at a time, with a guess attached

Scope: Step 2 of the process, the question format `Q:` plus `GUESS:`, why batching fails, and the sycophancy risk of leading questions.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, The Process step 2 and Red Flags.

## The format

Each turn carries exactly one question and one guess (source doc):

```
Q: When you say "how are we doing?", who's asking - you alone, the engineering team in standup, or up the chain?
GUESS: engineering team in standup, because "we" usually scopes that way and standups are where this question gets asked. If it's for execs the metrics and the framing change a lot.
```

Then the interviewer waits. The user reacts before the next question exists.

## Why one at a time, not a batch

The source doc gives 4 reasons:

1. The user cannot react to hypotheses buried in a list.
2. Batches encourage skim-reading and surface answers.
3. The 3rd question often depends on the answer to the 1st; asking them all at once locks in the wrong framing.
4. The user's energy for thinking carefully is finite; spend it one question at a time.

The third point is the deepest: sequential questioning is a search strategy, not just a politeness convention. Each answer prunes the space of useful next questions, so a batch is structurally incapable of adapting.

User-research guidance converges on the same discipline. NN/g's article on leading questions (https://www.nngroup.com/articles/leading-questions/, jev weight 0.84, primary) argues that question framing directly shapes participant answers and that moderators must avoid embedding the expected answer in the question. Uxcel's interview-practice module on asking one question at a time (https://app.uxcel.com/courses/ux-research/conducting-user-interviews-889/ask-one, jev weight 0.41, weak backing) presents the same rule as a trainable interviewing skill.

## Why attach a guess

Three reasons, from the source doc:

1. The user reacts faster to a wrong guess than they generate an answer from scratch. The guess is a reaction surface.
2. It commits the interviewer to a hypothesis they can be visibly wrong about, which keeps them honest.
3. It surfaces the interviewer's own assumptions, which is what the interview is meant to expose.

The doc's example shows the mechanism working: the guess "engineering team in standup" was wrong ("It's actually for me. I keep losing track of which experiments are running"), and the wrongness moved the interview to the real ask in one turn. Confidence moved from 30% to 60% on the strength of that single correction.

## The sycophancy hazard

The named risk is a polite user agreeing with the guess to be agreeable. The source doc prescribes 2 mitigations: be visibly willing to be wrong, and occasionally guess in a direction you expect the user to push back on.

The independent evidence that this risk is real comes from the AI-sycophancy literature. Georgetown Law's tech institute analysis of AI sycophancy (https://www.law.georgetown.edu/tech-institute/research-insights/insights/ai-sycophancy-harms-questions/, jev weight 0.80, primary) documents how agreement bias in conversational systems degrades the information the conversation produces, and Stanford's 2026 research on overly affirming models (https://news.stanford.edu/stories/2026/03/ai-advice-sycantic-models-research, jev weight 0.73, primary; note the exact URL in the archive) found users asking for personal advice received excessive affirmation rather than pushback. Both map directly onto interview dynamics: an answerer who defaults to agreement is supplying noise, and the interviewer's job is to build the pushback in rather than hope for it.

## Red flags specific to this step

From the source doc Red Flags section:

- 3 or more questions in a single message: that is batching, not interviewing.
- A question without the interviewer's hypothesis attached: that is surveying, not committing.
- Questions framed as "what would be best practice?" instead of "what do you actually want?" (see doc 05).

## What this means for practitioners

- Budget the interview in single-question turns; treat a 3-question message as a defect.
- Write the guess with its reasoning visible, so the user can attack the reasoning and not just the conclusion.
- Plan for disagreement: if every guess has been accepted so far, deliberately guess against your own lean once to test whether the user is agreeing or actually confirming.
