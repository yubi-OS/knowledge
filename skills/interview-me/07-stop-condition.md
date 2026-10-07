# 07 - The 95% confidence stop condition

Scope: the checkable test that ends the interview, the grind floor, and when stepping back is the right answer.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, The 95% Confidence Stop section.

## The test

The source doc defines the stop condition as a single checkable question:

> Can I predict the user's reaction to the next 3 questions I would ask?

If yes, shared understanding exists: stop interviewing and produce the restate (doc 06). If no, ask the next question. The doc stresses that this is a checkable test, not a vibe: prediction is either right or it is not, and the next 3 answers are the ground truth that settles it.

The 95% framing is a confidence threshold, and it connects back to the confidence number of doc 03: the stop condition is the behavioral test that the confidence number claims. A number you cannot defend with the 3-question prediction is, per the source doc, the wrong number.

## Why prediction, not agreement

Predicting reactions tests whether the interviewer holds a model of the user, not just a summary of what was said. A summary can be passively correct while the underlying intent is still misread; a working predictive model of how the user will weigh options, react to guesses, and prioritize constraints is much harder to hold without actual shared understanding. This is the same reason the guess-attached question format works (doc 04): both mechanisms convert understanding into a falsifiable commitment before the expensive artifact gets built.

## The grind floor

The test has a floor built in (source doc): if you have gone several rounds and still cannot predict the user's reactions, that is information about the ask, not a reason to keep grinding. The prescribed move is to stop and tell the user:

> "I've asked X questions and I still can't predict your reactions. Something foundational is missing. Want to step back?"

This is the skill's honest exit: the failure is reported as a failure of the interview, not papered over with a low-confidence restate. It pairs with the red flag "3 or more rounds without your confidence visibly rising: you're asking the wrong questions, step back and reframe" (source doc, Red Flags; see doc 09).

## External grounding: stopping criteria in research interviews

The qualitative-research literature names the same phenomenon as saturation: the point at which further data collection stops producing new information. Saturation in qualitative research (https://pmc.ncbi.nlm.nih.gov/articles/PMC5993836/, jev weight 0.78, primary) traces the concept's conceptual history and its use as a justification for sample sizes, and the AMEE Guide on ethnography in qualitative educational research (https://www.ncbi.nlm.nih.gov/pubmed/23808715, jev weight 0.76, primary) treats saturation as the practical stopping rule for interview-based studies.

The correspondence is worth stating precisely: saturation in research says "stop when new answers stop adding information"; the source doc's test says "stop when you can predict the next answers". The latter is a stronger and more operational criterion for a 2-party interview: instead of counting new-information increments after each round, the interviewer predicts the next 3 and checks against reality. Requirements-elicitation sources (https://en.wikipedia.org/wiki/Requirements_elicitation, jev weight 0.37, weak backing; https://www.apriorit.com/white-papers/699-requirement-elicitation, weight 0.37, weak backing) describe elicitation as iterative with no fixed endpoint, which is exactly the gap the 3-question test closes.

## What this means for practitioners

- Compute the test before ending the interview, and be able to name the 3 questions you predicted.
- If the prediction fails, the failure is data: the interview continues, with the failed prediction sharpening what to ask next.
- Watch the round counter: 3+ rounds without rising confidence is the step-back signal, and the honest step-back message is prescribed by the source doc rather than improvised.
- The stop condition gates the restate, and the restate gates the explicit yes (doc 06); no downstream artifact (spec, plan, task list) is produced before the yes.
