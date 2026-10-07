# 06 - The restate and the explicit-yes gate

Scope: Steps 4 and 5 of the process, writing intent back in the user's own words in the 6-line format, and refusing every answer that is not an explicit yes.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, The Process steps 4 and 5.

## The restate format

When confidence is high, the interviewer writes back what they now think the user wants. The source doc fixes the format:

```
Here's what I now think you want:

- Outcome:      <one line>
- User:         <one line - who benefits>
- Why now:      <one line - what changed>
- Success:      <one line - how we know it worked>
- Constraint:   <one line - the binding limit>
- Out of scope: <one line - what we're explicitly not doing>

Yes / no / refine?
```

Constraints on the restate itself (source doc): keep it tight, 5 to 8 lines; use the user's own language where possible; structure it so the user can confirm or correct line by line.

## The out-of-scope line is non-negotiable

The source doc singles out one line: "Including 'Out of scope' is non-negotiable. Half of misalignment is silent disagreement about what is *not* being built."

The project-management literature supports why a written exclusion matters. Scope creep, the uncontrolled expansion of a project's scope (https://en.wikipedia.org/wiki/Scope_creep, jev weight 0.46, weak backing), is consistently attributed in practitioner guides to unstated boundaries rather than bad faith; ProjectManager's guide (https://www.projectmanager.com/blog/5-ways-to-avoid-scope-creep, jev weight 0.30, weak backing) recommends explicit scope statements as the first control. The source doc's version is stronger and simpler: the out-of-scope line is not optional hygiene, it is where half the misalignment hides.

## The gate: what is not a yes

Step 5's rule: the gate is an explicit "yes". The source doc enumerates 4 answers that fail the gate and what to do about each:

| Answer | Diagnosis | Move |
|---|---|---|
| "Whatever you think is best." | The user is delegating, which means they do not have 95% confidence either. | Re-ask with 2 concrete options framed as a choice. |
| "Sounds good." | Ambiguous. | Ask "Anything you'd refine?" Silence is not confirmation. |
| "Sure, let's go." | Often a polite exit, not an endorsement. | Same follow-up. |
| Silence, then "okay let's start." | The user has given up on the interview, not converged. | Stop and ask whether you've missed something. |

If the user corrects the restate, fold the correction in and restate. Loop until an explicit yes.

The options-prescription for delegation is the important structural move: when the user will not decide, the interviewer narrows the decision to 2 concrete options instead of widening the search. Listing many options widens the search; the source doc's rationalizations table explicitly rejects the "give them several options" reflex for users who do not yet know what they want (doc 09).

## External grounding

The conversational mechanism behind a line-by-line restate is paraphrase-based confirmation, well documented in counseling and coaching practice. Counselling Tutor's material on reflecting and paraphrasing (https://counsellingtutor.com/counselling-approaches/active-listening/reflecting-and-paraphrasing/, jev weight 0.48, weak backing) describes paraphrase as the skill that lets a speaker hear their own meaning reflected back and correct it. Positive Psychology's active-listening technique roundup (https://positivepsychology.com/active-listening-techniques/, jev weight 0.34, weak backing) lists paraphrasing and summarizing among the core confirmation techniques. The source doc's contribution beyond these is structural: a fixed 6-line schema and an explicit termination gate, so confirmation is checkable rather than impressionistic.

## What this means for practitioners

- Do not write the restate in your own vocabulary; the user's own words are the evidence of understanding.
- The 6 lines map 1:1 onto the trigger absences from doc 02: outcome, user, why now, success, constraint, plus out of scope. If any line is empty, confidence is not high yet and the interview continues (doc 07).
- An explicit yes ends the interview; anything else re-opens it. Producing a spec, plan, or task list before the yes is listed as a red flag (doc 09).
