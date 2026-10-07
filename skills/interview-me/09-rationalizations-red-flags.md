# 09 - Rationalizations, red flags, and the verification checklist

Scope: the source doc's anti-self-deception machinery: the 8-row rationalization table, the 10 red flags, and the 8-item post-use verification checklist.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, Common Rationalizations, Red Flags, and Verification sections. Internal-record subtopic, no dig.

## The rationalization table

The source doc pairs each excuse with its reality check:

| Rationalization | Reality |
|---|---|
| "The ask is clear enough" | If you can't write the user's desired outcome in one sentence right now, the ask isn't clear. Run Step 1 before deciding. |
| "Asking too many questions wastes their time" | 4 to 6 targeted questions cost little. Building the wrong thing costs enormously, and the user bears that cost. |
| "I'll figure it out as I build" | Switching costs after code exists are 10x what they are now. Discovery during implementation is rework. |
| "They said 'whatever you think,' so I should just decide" | "Whatever you think" is delegation, not decision. Re-ask with 2 concrete options as a choice. |
| "I should give them several options to pick from" | Options work when the user knows what they want. They don't yet. Listing options widens the search; asking narrows it. |
| "If I attach my guess, I'm leading them" | Leading is the point. Reacting is faster than generating. The risk is sycophancy, not leading; mitigate by being visibly willing to be wrong. |
| "We've talked enough, I get it" | Test it: can you predict their reaction to the next 3 questions? If not, you don't get it yet. |
| "The user said yes, we're done" | If the yes followed a vague restate or an open-ended "sounds good," the yes is hollow. Restate concretely and re-confirm. |

Note the structure: 4 of the 8 rows are settled by the same 2 instruments, the 3-question prediction test (doc 07) and the explicit-yes gate (doc 06). The table is the skill defending its own core mechanisms against quiet erosion.

## The red flags

The source doc lists 10 behaviors that mark a degraded interview:

1. 3 or more questions in a single message: batching, not interviewing.
2. A question without the interviewer's hypothesis attached: surveying, not committing.
3. Accepting "whatever you think is best" as a terminal answer.
4. Producing a spec, plan, or task list before the user has explicitly confirmed the restate.
5. Questions framed as "what would be best practice?" instead of "what do you actually want?".
6. Accepting a sophistication-signaling answer ("scalable", "clean", "modern") without probing (doc 05).
7. 3 or more rounds without confidence visibly rising: wrong questions, step back and reframe.
8. A confidence number below ~70% with no reason attached: the user cannot help close a gap they cannot see (doc 03).
9. Saving the intent doc before the user has confirmed: the doc itself implies a yes the user did not give.
10. Skipping the "Out of scope" line in the restate: silent disagreement about non-goals is half of misalignment (doc 06).

## The verification checklist

After applying the skill, the source doc requires all 8 checks:

- An explicit hypothesis with a confidence number was stated in the first turn.
- Every confidence number below ~70% was accompanied by a one-line reason.
- Questions were asked one at a time, each with the agent's guess attached.
- At least one "what would you actually want if you didn't have to justify it?" probe ran when the user gave a sophistication-signaling or convention-signaling answer.
- A concrete restate (Outcome / User / Why now / Success / Constraint / Out of scope) was written back to the user.
- The user confirmed the restate with an explicit yes (not "whatever you think," not "sounds good," not silence).
- At the stop point, the agent could predict reactions to the next 3 questions it would ask.
- Any handoff to a downstream skill (idea-refine, spec-driven-development) was framed in terms of the confirmed intent, not the original underspecified ask.

## What this means for practitioners

- Run the checklist after every interview, not after every few; each item is a binary check, so the audit is fast.
- Items 1, 2, 7, and 8 fail silently and early; they are the ones to watch when the interview feels smooth.
- Items 9 and 10 protect the artifact boundary: nothing gets persisted and nothing gets left unstated until the explicit yes lands.
- The red flags double as a training rubric: each one names the correct behavior in its negative, so the list can be used to review an interview transcript line by line.
