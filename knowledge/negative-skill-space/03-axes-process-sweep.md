# 03 Axes 7 to 12: The Process and Meta Sweep

Scope: Axes 7 to 12 of the sweep: failure modes, lifecycle, composition, knowledge sources, calibration, and recursion, the process and meta axes.

## What changes at axis 7

Axes 1 to 6 face outward toward the artifact's users. Axes 7 to 12 turn inward: how it fails, how it ages, how it connects, where its facts come from, how it knows it is right, and what happens when it looks at itself (source doc origin: yubiOS refs/negative-skill-space-2026-07-28.md). These are where the least visible gaps hide, because they concern the artifact's operation over time rather than its surface behavior.

## Axis 7: Failure modes

The question: which failures does it handle gracefully, and which does it ignore, swallow, or silently mishandle? The gap map distinguishes listed anti-patterns (the positive space) from structural defenses against them (the negative space). A skill that lists "don't be a yes-machine" as moral guidance has no structural mechanism to detect a polite yes; that is a failure-mode gap, not a rhetoric problem.

The domain vocabulary for silent misbehavior exists and is worth importing. Security documentation practice defines an explicit adversary model and enumerates "features pending analysis, audit, and mitigation" so that unhandled threat surfaces are named rather than assumed away (https://2019.www.torproject.org/projects/torbrowser/design/, weight 0.38, weak backing). The systems-engineering formalization is Software FMEA: NASA's software safety handbook describes SFMEA as identifying key software fault modes for data and software actions and analyzing the effects of abnormalities on other components and the system as a whole (https://swehb.nasa.gov/spaces/SWEHBVD/pages/102695706/8.05+-+SW+Failure+Modes+and+Effects+Analysis, weight 0.83). Practitioner writing on monitoring defines the target precisely: silent failures do not throw exceptions or create incidents, they quietly cost you until someone notices (https://www.notilens.com/blog/silent-failure-monitoring-complete-guide, weight 0.15, weak backing). Axis 7 asks the mapper to run that same enumeration over a process or document: what abnormal input does this swallow without an error?

## Axis 8: Lifecycle

The question: what happens on first invocation, on the Nth, when the paired artifact changes, when the user or context changes? A one-shot artifact produces one output per invocation with no link between them: no version history, no drift detection, no re-examination triggers, no accumulation across sessions. Running the skill twice in two sessions does not build a body of related work (source doc origin).

The software-engineering background for why this matters is coupling: the degree of interdependence between modules, where high coupling with low cohesion makes a system hard to change and test (https://www.geeksforgeeks.org/software-engineering/software-engineering-coupling-and-cohesion/, weight 0.55). Wikipedia defines coupling as the strength of relationships between routines and modules (https://en.wikipedia.org/wiki/Coupling_%28computer_programming%29, weight 0.16, weak backing). A skill with no lifecycle axis is maximally coupled to the moment of its own invocation: every run is stateless, so no run can correct or build on any previous run.

## Axis 9: Composition

The question: which other skills should it pair with, which does it assume you will use, and where does it conflict? The negative answers are missing handoff protocols, missing anti-pairs, and missing co-trigger rules. The source doc's case study found upstream and downstream neighbors implied but never declared: a skill said "ideate on [concept]" without saying "after this, run the spec skill on the one-pager, then run the doubt skill on the spec."

Composition gaps are visible through the coupling lens: declared handoffs are low-coupling, high-cohesion interfaces between skills; undeclared ones are implicit coupling that only works while both skills happen to be present in the same agent's memory.

## Axis 10: Knowledge sources

The question: where does the artifact get its facts, what sources does it exclude, and how stale can those sources get? A conversational skill bounded by the user's own knowledge has no external research integration; its claims are only as good as one person's memory. A second-order gap: the artifact's own conventions can go stale, and referenced companion files can dangle (the source doc's test case referenced three companion files that did not exist). Source-driven practice, which verifies claims against authoritative documentation before implementing, is the positive-space contrast the axis measures against (source doc origin).

## Axis 11: Calibration

The question: how does the artifact know it is right? What signals does it use, what signals does it ignore? The negative answers found in the case study: a stop condition of "the user said sounds good," which is an unreliable signal; no structural signal for "this idea is weak, kill it"; no mid-flow signal for "we are converging on the wrong direction"; and no coverage check confirming the output actually covered the negative space (source doc origin). Calibration gaps convert into confidence gaps: the artifact completes without ever having measured whether it succeeded.

## Axis 12: Recursion

The question: what happens when you apply this skill to itself? This is the only axis that catches meta-blind spots. Most artifacts cannot be cleanly self-applied: a skill that assumes a user-supplied idea and a willing human cannot run on its own definition. The source doc names this the axis the whole framework exists to honor, and doc 05 covers the recursive application in depth.

## The two-column record

As with axes 1 to 6, each of these 6 axes produces a positive answer (what the artifact claims) and a negative answer (what it excludes), and each negative is scored and filtered before it counts as a real gap. The 12 axes together are a sweep, not a proof: they organize the search for the negative space but do not guarantee it is complete.
