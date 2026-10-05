# 04 Gap Triage: Scoring, Filtering, and the Extend/Pair/Accept Decision

Scope: Scoring and filtering gaps: likelihood times severity ranking, separating performative gaps from real ones, and the extend/pair/accept action taxonomy.

## Every negative answer is a candidate, not a finding

The 12-axis sweep produces a negative answer per axis. Most of those answers are not gaps in the actionable sense. The framework filters each candidate through 2 screens before it counts: is it performative (listed for appearance rather than real exposure), and is it intentional narrow scope (the author deliberately drew the boundary there)? Only candidates that survive both screens are scored (source doc origin: yubiOS refs/negative-skill-space-2026-07-28.md).

Intentional narrowness is the more dangerous screen to skip. Some artifacts are narrow on purpose, and their small negative space is a feature. Mapping gaps into a deliberately tight skill produces false positives that lead to scope creep. The framework's own recursive pass flagged this against itself: the skill initially had no "is this artifact intentionally narrow?" check, and that absence was itself a gap (source doc origin).

## Scoring: likelihood times severity

Surviving candidates are scored on likelihood (how often the gap will actually be hit) and severity (how bad it is when hit). The product ranks them. This is the standard risk-assessment move: a risk matrix defines the level of risk by combining the likelihood category with the severity of consequences, and it is used during risk assessment precisely to force prioritization rather than flat listing (https://en.wikipedia.org/wiki/Risk_matrix, weight 0.52). Practitioner templates make the mechanics concrete: score likelihood against impact on a numeric grid (common templates use 3x3, 4x4, or 5x5 matrices, with impact computed as a product on a 1 to 25 scale) and sort the resulting list (https://asana.com/resources/risk-matrix-template, weight 0.16, weak backing).

The framework does not mandate a grid size. It mandates the ordering discipline: after scoring, the gap list is sorted most-likely-times-most-severe first, so the top of the list is where remediation effort goes first. The scoring vocabulary comes from risk management, where risk is formally defined as the effect of uncertainty on objectives and its management as identification, evaluation, and prioritization of risks (https://handwiki.org/wiki/Risk_management, weight 0.09, weak backing).

## A better instrument for surfacing: the pre-mortem

For gaps the sweep fails to surface, the framework borrows a technique from decision psychology. Gary Klein's pre-mortem method, set out in 2007, asks a team to imagine the project has already failed and to generate the reasons why (https://www.gary-klein.com/premortem, weight 0.59). The mechanism is prospective hindsight: imagining an event has already occurred increases the ability to correctly identify reasons for the outcome (https://www.theuncertaintyproject.org/tools/pre-mortem, weight 0.52). Klein describes the exercise as simple to run, taking as little as 20 to 30 minutes, and as a risk assessment method that works (https://www.psychologytoday.com/us/blog/seeing-what-others-dont/202101/the-pre-mortem-method, weight 0.78).

The connection to negative-skill-space is direct. Asking "what does this skill NOT do?" is a pre-mortem question pointed at an artifact instead of a plan. Where the 12 axes are a structured sweep, the pre-mortem is an unstructured generator: assume the skill failed in the field, then work backward to the negative space that let it fail. The two instruments cover each other's blind sides.

## The action taxonomy: extend, pair, accept

Every scored gap gets exactly one of 3 dispositions (source doc origin):

1. **Extend**. Add the missing behavior to the artifact itself. Correct when the gap is on the artifact's critical path and the artifact is the natural home for the fix. Example from the case study: dangling references to companion files that do not exist were routed to extend (write them or remove the references), because no other skill could fix the artifact's own broken pointers.
2. **Pair**. Use another skill alongside to cover the gap. Correct when the gap is a real need that belongs in a different artifact. The case study paired the missing solo mode with a dedicated solo-ideation skill, the missing kill verdict with a dedicated kill-verdict skill, and the missing prior-art awareness with a search skill. Pairing keeps each artifact coherent instead of growing one mega-skill.
3. **Accept**. Document why the gap is tolerable for now. Correct for gaps that are real but low priority: the case study accepted the missing multi-stakeholder workshop mode and batch mode as out of scope, noting them for future pairing rather than immediate work.

The taxonomy mirrors risk treatment in ISO 31000 style risk management: every identified risk is mitigated, transferred, or accepted with a recorded rationale, never left unowned (https://handwiki.org/wiki/Risk_management, weight 0.09, weak backing). The discipline point is the same: a gap with no disposition is an unowned finding that will be rediscovered by the next mapper.

## What triage does not do

Triage closes nothing by itself. The output is a ranked list with a disposition per item; the closing work belongs to other skills (extension edits, new pairings, documentation). The framework also names the failure mode of triage itself: without evidence that closing a mapped gap changed outcomes, the scoring loop is a hypothesis engine, not a measurement system. That limit is recorded in doc 05 and doc 07.
