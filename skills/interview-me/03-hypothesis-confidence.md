# 03 - The hypothesis with a confidence number

Scope: Step 1 of the process, stating a one-sentence best read of intent with an honest 0 to 100 confidence number, and attaching a reason whenever the number is below 70.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, The Process step 1 and Red Flags. External grounding on why a stated number changes judgment quality.

## The format

The source doc requires that before asking anything, the interviewer writes down 2 things:

```
HYPOTHESIS: You want a way to answer "how are we doing?" in standup, and "dashboard" was the convention that came to mind.
CONFIDENCE: ~30% - missing: who it's for, what "metrics" means in context, and what success looks like
```

Two structural rules come with it (source doc):

1. The number forces honesty. If you write a high number but cannot predict the user's reactions to the next 3 questions you would ask, the number is wrong. Start at the confidence level you can defend. This ties the number to a checkable behavioral test (doc 07) rather than a feeling.
2. When confidence is below about 70%, append a brief reason on the same line stating what is still unresolved or missing. The reason tells the user exactly what the interview needs to surface, and prevents the number from being a vague signal. A confidence number below 70% with no reason attached is listed as a red flag in the source doc.

## Why a stated number works

The evidence for making uncertainty explicit comes from judgment-calibration research. Calibration training for improving probabilistic judgments (https://onlinelibrary.wiley.com/doi/10.1002/ffo2.177, jev weight 0.58, primary; mirrored at https://ideas.repec.org/a/wly/fufsci/v6y2024i2ne177.html, weight 0.58) shows that explicit probability estimates can be improved through training and feedback, and that the act of committing to a number is what makes calibration measurable at all. The general concept of calibration, adjusting stated confidence so it matches observed hit rates (https://en.wikipedia.org/wiki/Calibration_(probability_and_statistics) territory; the dig surfaced https://en.wikipedia.org/wiki/Calibration, jev weight 0.58, primary), is the mechanism the confidence number exploits: a number you can be visibly wrong about corrects faster than a vibe.

The source doc's own example demonstrates the failure mode the number prevents: an agent that "starts proposing chart libraries" has implicitly assigned itself high confidence in a plan it never stated. Writing "CONFIDENCE: ~30%" exposes that assumption in the first turn instead of the fourth.

## What goes in the reason line

The example in the source doc ties the reason directly to the 4 trigger absences from doc 02: who it is for, what the key terms mean in context, and what success looks like. So the reason line is not generic hedging; it is a named list of the specific gaps (see doc 06, where each gap becomes a restate line).

## Practical rules extracted from the source doc

- One sentence for the hypothesis. If it does not fit in one sentence, the intent has not been parsed yet.
- The number is about intent, not implementation: how confident are you that this is what the user wants, not how confident are you the design is good.
- Defend the number before publishing it: the test is whether you can predict reactions to the next 3 questions. If not, lower the number until you can.
- Below 70%, always name the missing pieces on the same line. Above 70%, the restate (doc 06) is the next step, not more questions.
- The confidence number should visibly rise across rounds. The source doc lists "3 or more rounds without your confidence visibly rising" as a red flag meaning the questions themselves are wrong (doc 09).
