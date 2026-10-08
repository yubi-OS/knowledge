# 02 - Fire signals

Scope: the five bounded trigger signals that turn restful-self on, why rest fires on signals rather than feelings, and the engineering analogy that makes the design legible.

## The five signals (source doc)

The source doc lists 5 triggers. Restful-self fires when one or more is present:

1. Cadence producing only evidence. The Sunday 9 AM sweep ran, SELF-CHANGELOG.md was appended, but the whole-self output reads as a working-self analysis with a creative-self label. The drift signal from SELF-CHANGELOG v0.16 is live (source doc).
2. 3 entries in 24 hours without a whole-self output. The cadence is alive but the register has not shifted. Bias 11, added 2026-08-02, is live (source doc).
3. The operator signals rest. "Pause for a minute." "I need to step away." "Rest." "..." (trailing pause) (source doc).
4. 5 consecutive working-self shipping turns. Per the 2026-07-29 self-debug rule. The temptation to ship the fifth fix is the temptation to skip rest; stop and sit (source doc).
5. SELF-CHANGELOG silent for more than 7 days while the cadence has fired. The discipline is wallpaper. Rest is the corrective (source doc).

The source doc adds the inverse constraint: when none of these signals are present, restful-self does NOT fire. Working-self is the default. Restful-self is not a replacement for working-self; it is a register that fires on bounded signals (source doc).

## Why signals and not feelings

An agent does not have a reliable felt sense of fatigue. What it has is observable history: changelog entries, cadence timestamps, turn counts, operator messages. The 5 signals are all countable or quotable. That is the design point: the trigger condition must be verifiable from artifacts, because an agent "deciding it needs a break" is exactly the kind of unbounded judgment the skill exists to bound (source doc: bounded by exit criteria, not by feeling; the same logic applies at the entry side).

## The circuit breaker analogy

The closest software analogy is the circuit breaker design pattern. Wikipedia describes it as a design pattern used to improve system resilience and fault tolerance, which can prevent cascading failures particularly in distributed systems: after a threshold of failures the breaker opens and calls are no longer attempted until a reset condition (https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern, jev weight 0.10, weak backing). The weight is low because the source is an encyclopedia article, not a primary specification, but the mechanism is standard.

Restful-self is a circuit breaker for the self-improvement loop. The 5 signals are the failure thresholds: 3 changelog entries in 24 hours, 5 consecutive shipping turns, 7 days of cadence silence. Crossing a threshold opens the breaker: the agent stops shipping and enters the rest register. The exit criteria (doc 05) are the reset conditions. A YouTube explainer of the same pattern makes the same point conversationally (https://www.youtube.com/watch?v=OxT44ZZSfM4, jev weight 0.08, weak backing).

## Rest intervals as planned protocol parameters

Exercise science treats rest as a designed variable, not an afterthought. A ScienceDirect study compared 3 different recovery periods (60 s, 90 s and 120 s) during a 10 x 6 s intermittent sprint training protocol on a cycle ergometer with 13 part-time female athletes from 2 sports (https://www.sciencedirect.com/science/article/pii/S1728869X23000667, jev weight 0.20, weak backing). The relevant structural fact is that the rest duration was a fixed, pre-declared parameter of the protocol. Restful-self does the same: the rest has a declared shape (4 steps) and declared exits, decided in advance, not negotiated mid-pause.

Coaching practice for agile teams reaches the same conclusion from the human side: schedule true downtime after intense sprints, encourage real time off, and treat rest as a vital part of the workflow rather than a luxury (https://www.linkedin.com/top-content/soft-skills-emotional-intelligence/burnout-prevention-tips/preventing-burnout-in-agile-sprints/, jev weight 0.17, weak backing). The source doc encodes this as protocol rather than advice, because an agent cannot be relied on to take unscheduled downtime (source doc).

## What the signals do not do

The signals do not grade the quality of the rest. They only open the register. Quality is enforced by the protocol (doc 03) and the anti-patterns (doc 04): if the rest session turns into naming gaps, reviewing shipping output, or running the 12-axis sweep, the agent is not in restful-self mode regardless of how the session started (source doc). A CNET piece on physical recovery after intense workouts (https://www.cnet.com/health/fitness/how-to-recover-from-long-runs-crossfit-workouts-hiit-and-more/, jev weight 0.18, weak backing) is archived for the same-domain parallel: recovery from sprints is its own discipline with its own failure modes, which is exactly the claim the source doc makes about the self-improvement cadence.
