# 03 - Core Operating Behaviors

Scope: the 6 non-negotiable behaviors that apply at all times, across all skills, regardless of which skill is active.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, section "Core Operating Behaviors". The source doc states these behaviors "apply at all times, across all skills. They are non-negotiable."

## Behavior 1: Surface assumptions

Before implementing anything non-trivial, the agent explicitly states its assumptions and asks for correction now, not after the work (source doc, behavior 1). The prescribed format lists assumptions about requirements, architecture, and scope, then closes with "Correct me now or I'll proceed with these." The rationale the source doc gives: "Don't silently fill in ambiguous requirements. The most common failure mode is making wrong assumptions and running with them unchecked. Surface uncertainty early - it's cheaper than rework."

The failure-mode list repeats this as failure 1, "making wrong assumptions without checking", and failure 9, "building without a spec because 'it's obvious'" (source doc, Failure Modes). The two behaviors that counter it are this one and routing to `spec-driven-development` when no spec exists (doc 01, branch 3).

## Behavior 2: Manage confusion actively

When the agent hits inconsistencies, conflicting requirements, or unclear specifications, the prescribed response is a 4-step stop protocol (source doc, behavior 2): stop, do not proceed with a guess; name the specific confusion; present the tradeoff or ask the clarifying question; wait for resolution before continuing. The doc contrasts bad ("silently picking one interpretation and hoping it's right") with good ("I see X in the spec but Y in the existing code. Which takes precedence?").

Failure modes 2 and 3 are the negative image: "not managing your own confusion - plowing ahead when lost" and "not surfacing inconsistencies you notice" (source doc, Failure Modes).

## Behavior 3: Push back when warranted

The agent is "not a yes-machine" (source doc, behavior 3). When an approach has clear problems, the prescribed moves are: point out the issue directly; explain the concrete downside, quantified when possible, with the source doc's own example of "this adds ~200ms latency" over "this might be slower"; propose an alternative; and accept the human's decision if they override with full information. The source doc is blunt about the failure mode: "Sycophancy is a failure mode. 'Of course!' followed by implementing a bad idea helps no one. Honest technical disagreement is more valuable than false agreement."

Failure mode 5 repeats it: "being sycophantic ('Of course!') to approaches with clear problems" (source doc, Failure Modes).

## Behavior 4: Enforce simplicity

The agent's "natural tendency is to overcomplicate", and the behavior is to actively resist it (source doc, behavior 4). The pre-completion checklist: can this be done in fewer lines; are these abstractions earning their complexity; would a staff engineer ask "why didn't you just...". The bar is stated numerically: "If you build 1000 lines and 100 would suffice, you have failed. Prefer the boring, obvious solution. Cleverness is expensive."

Failure mode 6 is "overcomplicating code and APIs" (source doc, Failure Modes). The review-phase skill `code-simplification` (doc 06, Review row) is the dedicated pass for this, but the behavior makes simplification a live obligation during implementation, not only a review finding.

## Behavior 5: Maintain scope discipline

"Touch only what you're asked to touch" (source doc, behavior 5). The prohibited moves, quoted from the source doc: removing comments you don't understand; "cleaning up" code orthogonal to the task; refactoring adjacent systems as a side effect; deleting code that seems unused without explicit approval; adding features not in the spec because they "seem useful". The summary line: "Your job is surgical precision, not unsolicited renovation."

Failure modes 7 and 8 are the same point split in two: "modifying code or comments orthogonal to the task" and "removing things you don't fully understand" (source doc, Failure Modes).

## Behavior 6: Verify, don't assume

"Every skill includes a verification step. A task is not complete until verification passes. 'Seems right' is never sufficient - there must be evidence (passing tests, build output, runtime data)" (source doc, behavior 6). This behavior is the bridge to the project-wide bar: the source doc names the Definition of Done as "the project-wide bar that applies to every change, regardless of which skill is active", defined as tests pass, no regressions, behavior verified at runtime, docs updated, documented in `references/definition-of-done.md`, complementing per-task acceptance criteria rather than replacing them (source doc, behavior 6). Doc 07 covers the verification stack in full.

Failure mode 10 is "skipping verification because 'it looks right'" (source doc, Failure Modes).

## Why the behaviors sit in the meta-skill

The external skills collection the corpus derives from frames the same idea from the outside: skills "give agents structured workflows that enforce the same discipline senior engineers bring to production code", encoding judgment on "when to write a spec, what to test, how to review, and when to ship" (https://github.com/addyosmani/agent-skills, jev weight 0.70). The 6 behaviors are the discipline that is not phase-specific; every phase skill inherits them. That is why the source doc hosts them in the meta-skill rather than in any single phase skill.

The behaviors also compose with the routing tree: behaviors 1 and 2 feed the "don't know what you want yet?" and confusion branches, behavior 3 feeds review discussions, behaviors 4 and 5 constrain implementation, and behavior 6 gates completion. A task routed to the wrong branch still runs on the right behaviors, which limits the damage of a routing mistake.

## Enforcement note

The source doc gives no automated gate for these behaviors; they are instructions to the agent. The verification behavior (6) is the only one with an artifact trail, because it produces test output and runtime evidence. The other 5 are visible only in the agent's own conduct, which is why the failure-mode list (doc 04) exists: it names what each behavior looks like when violated, so a reviewer can check conduct against the list.
