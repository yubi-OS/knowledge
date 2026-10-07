# 02 - Trigger conditions: when to interview and when not to

Scope: the 5 positive triggers, the 5 exclusions, and the live-user loading constraint that gate whether interview-me should run at all.

Grounding spine: source doc `yubi-OS/yubiOS skills/interview-me/SKILL.md`, When to Use and Loading Constraints sections. Internal-record subtopic, no dig: these conditions are defined entirely within the source doc and name no external mechanisms.

## Positive triggers

The source doc applies the skill when any of these hold:

1. The ask is missing at least one of: **who** the user is, **why** they want it, what **success** looks like, what the binding **constraint** is. These 4 absences are the concrete testable signature; each one is a column of the restate format in doc 06.
2. The request is conventional rather than specific ("build me X", "make it faster") and the convention cannot be unpacked without guessing.
3. The agent is tempted to start with assumptions it has not surfaced. This trigger is self-directed: the moment of noticing the temptation is itself the signal.
4. The user has not said which value they optimize for when 2 reasonable ones are in tension (simplicity vs flexibility, cost vs speed).
5. The user explicitly invokes the skill: "interview me", "grill me", "before we start, are we sure?", "stress-test my thinking". Explicit invocation overrides the agent's own judgment about whether the ask seems clear enough.

## Exclusions

The source doc lists 5 conditions where the skill must not run:

- The ask is unambiguous and self-contained ("rename this variable", "fix this typo").
- The user has explicitly asked for speed over verification.
- Pure information requests ("how does X work?", "what does this code do?").
- Mechanical operations (renames, formats, file moves).
- The agent already has at least 95% confidence. The doc adds a guard here: re-read the stop condition (doc 07) before assuming the confidence is real, because inflating confidence is the failure mode the confidence number exists to prevent.

The exclusion list is as load-bearing as the trigger list. An interview run on a mechanical request wastes the user's finite thinking energy, which the source doc treats as a resource to be spent one question at a time (see doc 04).

## Loading constraints: a live user is required

The source doc states this plainly: the skill needs a live, responsive user, and must not be invoked in non-interactive contexts such as CI pipelines, scheduled runs, `/loop`, or autonomous-loop.

The prescribed fallback in those contexts is not guessing and not a batched questionnaire: flag the underspecification as a blocker for the user instead of guessing. This matters for any orchestration layer that routes work automatically: an autonomous session that hits an underspecified ask should surface the blocker and wait, because the entire interview mechanism (react to a guess, confirm a restate) requires a human in the loop.

## Interaction with the rest of the corpus

- Triggers 1 and 4 feed directly into the hypothesis format in doc 03: the missing who/why/success/constraint become the stated "missing:" list under the confidence number.
- Exclusion 5 (95% confidence) is the same threshold that governs the stop condition in doc 07; the skill is entered and exited against the same number.
- The explicit-invocation trigger (trigger 5) means the skill can run even when the ask looks fine, because the user is asking for their own thinking to be stress-tested, which is a distinct job from requirement gathering.
