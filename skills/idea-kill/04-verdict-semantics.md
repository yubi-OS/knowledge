# 04 - Verdict semantics

Scope: what each of the four verdicts means, when each is legitimate, and the reversibility and stage-gate concepts the semantics map onto.

## The four verdicts (source doc)

The source doc defines the verdict space exactly. KILL: the idea should not be pursued; the critique is overwhelming, the second-order effects are net-negative, and the bet is un-testable. PAUSE: the idea is interesting but not now; something is missing (context, market, capability, or team), and the verdict must document what is missing and the trigger to revisit. REVISE: the idea has merit but the current form is weak; the specific revision that would change the verdict must be named, and if no clear revision exists the verdict is KILL. SHIP: the idea is strong enough to proceed now; the critique is manageable, the second-order effects are net-positive, and the bet is testable cheaply (source doc).

## The semantic asymmetries

Three asymmetries in the source doc's semantics are load-bearing. First, KILL is terminal but documented: it means "do not proceed now", not "never reconsider", because resurrection triggers make reconsider cheap when the triggers fire (source doc). Second, REVISE is constructive only when the revision is named; the source doc states that an un-named revision is PAUSE with extra steps, which is also listed as an anti-pattern (source doc). Third, SHIP is rare and high-confidence: it must be defensible to a skeptical reviewer, which is the heaviest justification burden of the four (source doc).

## Reversibility: one-way and two-way doors

The closest external framework for the verdict semantics is the decision-reversibility distinction popularized in the one-way versus two-way door model: reversible decisions can be made quickly and cheaply reversed if wrong, while irreversible decisions deserve slow deliberation because the cost of being wrong is not recoverable (https://thoughtbot.com/blog/one-way-vs-two-way-door-decisions, weight 0.55). Practitioner writeups of the same model apply it to product and engineering choices, treating reversibility as the variable that should govern how much analysis a decision earns (https://leadersloop.com/toolkit/reversible-vs-irreversible-decisions/, weight 0.19, weak backing; https://blueprints.guide/posts/one-way-vs-two-way-doors, weight 0.21, weak backing).

The mapping is direct. A KILL verdict on a two-way-door idea costs little, so the review can be quick and cheap; a KILL on a one-way-door idea deserves the heaviest steelman, which is why the source doc requires at least three of the five critique angles and 3 to 5 concrete reasons regardless. PAUSE is effectively a deferred decision: the reversibility question is unchanged, but a prerequisite (context, market, capability, team) is missing.

## Stage gates and the go/kill discipline

Stage-gate process management supplies the organizational analogue: work moves through stages separated by gates, and each gate is a go/kill decision point where the project must justify continuing against explicit criteria (https://asana.com/resources/stage-gate-process, weight 0.29, weak backing). Manufacturing-oriented writeups of the model emphasize that gates exist precisely so that killing a project is a legitimate gate outcome rather than a failure of the team (https://flexi-project.com/the-stage-gate-process-in-manufacturing-phases-gates-and-go-kill-decisions/, weight 0.17, weak backing).

idea-kill compresses that machinery into a single review of a single artifact. Where stage-gate asks "should this continue into the next phase", the skill asks the sharper question "should this exist at all", and its four verdicts are a finer vocabulary than the binary go/kill: REVISE captures the "go, but not in this form" case that a binary gate cannot express, and PAUSE captures the "not now" case.

## What the verdict must not be

The source doc's prohibition list is short but strict: no "maybe", no "interesting but...". A verdict that contradicts its own reasons (a KILL whose reasons all favor continuing) is a red flag, not a nuance (source doc). The verdict vocabulary exists to be used honestly; if the evidence genuinely supports continuation, the verdict is SHIP, and the source doc's guidance that SHIP is rare is a calibration note, not a quota.
