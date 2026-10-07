# 05 - The un-testable bet and cheap validation

Scope: why testability is a kill signal, the falsifiability standard behind it, and the cheap-experiment practice that makes a bet testable.

## The un-testable bet as a kill signal (source doc)

Step 5 of the source doc's process returns to the bet named in Step 2 and asks one question: can it be tested cheaply, or does validating it require massive upfront investment? An un-testable bet is a kill signal even if the idea is otherwise strong, because the project cannot learn cheaply whether to keep going (source doc). The verdict section ties this directly to SHIP: a SHIP verdict requires the bet to be testable cheaply, and a SHIP verdict on an un-testable bet is a listed red flag (source doc).

The logic is economic, not philosophical. A review is cheap; a build is expensive. If the only way to learn whether the central claim is true is to build the whole thing, the review cannot converge, and the project's continuation is decided by hope rather than evidence.

## Falsifiability: the standard behind the question

The intellectual standard the step applies is Popper's falsifiability criterion: for a claim to be scientific, there must be an observation that could conceivably prove it wrong; a claim compatible with every possible outcome is not testable (https://www.britannica.com/topic/criterion-of-falsifiability, weight 0.81). The survey-level treatment adds the key operational point: a theory is strengthened by risky predictions that survive severe attempts at refutation, not by confirming instances (https://en.wikipedia.org/wiki/Falsifiability, weight 0.72; the same article at https://en.m.wikipedia.org/wiki/Falsifiability scored 0.75 in a duplicate entry).

Applied to idea review, the criterion becomes a test the bet must pass: name the observation that would prove the bet false, and name the cheap way to look for that observation. A bet for which no falsifying observation can be named is not a bet but a slogan, and the source doc routes it to KILL (via the un-testable-bet rule) or PAUSE (via the can't-name-the-bet rule).

## Cheap experiments: the riskiest-assumption practice

The lean startup tradition supplies the practical method for making a bet testable. The core discipline is to identify the riskiest assumption, the one whose failure would kill the idea, and test it first with the cheapest possible experiment (https://www.koji.so/docs/riskiest-assumption-test-guide, weight 0.41, weak backing). Content marketing treatments of lean startup repeat the same structure: validate assumptions with minimal investment before committing to the full build (https://fastercapital.com/content/Lean-startup--How-to-test-and-validate-your-assumptions-with-minimal-resources.html, weight 0.12, weak backing).

The dig on this subtopic is the thinnest of the corpus: the sources that survived weighting describe the practice but at a low authority level, so the claims above are labeled weak. What survives is the direction of the practice, which is consistent across sources: cheap, assumption-targeted tests are the standard mechanism for converting an un-testable bet into a testable one.

## How the skill uses testability

The source doc gives testability three roles. First, in Step 5 it is the go/no-go question for the idea's learning path. Second, in the verdict semantics it is a required property of SHIP. Third, in the resurrection triggers it is a repair target: a trigger of the form "if we acquire capability Y, the un-testable bet becomes testable" treats cheap testability as something that can be earned by new capability rather than fixed by new evidence (source doc).

## Practical reading

For a reviewer running the skill, the step produces one of three findings. The bet is testable and a cheap test exists: the idea keeps its SHIP eligibility. The bet is testable but the test has not been run: the honest verdict is usually PAUSE with "run the test" as the trigger to revisit. The bet is un-testable at acceptable cost: KILL, with the capability trigger named, because continuing means buying information at the full price of the build instead of the price of a test.
