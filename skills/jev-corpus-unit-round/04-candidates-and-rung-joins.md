# Candidates and rung joins

Scope: step 4 of the runflow. Deriving the skip-list from the outcomes ledger, reading the map's ladder rungs, and the ground-truth economics of candidate selection learned across nine rounds. Internal-record subtopic: no dig; grounded in the source doc.

## The skip-list comes from the ledger, not from memory

Before proposing anything, the round derives its skip-list from the outcomes ledger: every (doc, axis) pair with a final verdict of declined, reverted, or neutral gets a `skip` entry on the lens call, either as a bare name or as a `{name, axis}` object (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md). The ledger is the memory of what the gate has already rejected. Re-proposing a declined pair wastes a round; re-proposing a reverted pair can undo a revert. The skip-list is how the chain remembers without a human curator.

## The rungs are the structure-level generator

The candidate generator is `GET /api/maps/:id`, whose `ladder_candidates.rungs` field enumerates the structure-level proposals (source doc). Two rung kinds matter. A create-isolate rung proposes a new isolated element. A rung JOIN proposes connecting existing isolates, marked by a non-empty `joins` field and a negative `isolated_delta` (source doc). The flow says: prefer rung JOINS over create-isolate rungs (source doc).

The preference is empirical, not aesthetic. Ground truth from nine rounds of the chain: generator-endorsed rung joins went 2 for 2 as keeps, while caller-proposed adds went 0 for 5 (source doc). When the structure itself says "these two isolates belong together", the edit has a much better survival rate through the gate than an edit proposed from outside the measurement frame.

## The lens is demoted, not deleted

The lens once functioned as a candidate source. It is retired in that role: on the refs/ corpus it proposes only closed-class axis-fills, and axis-fill is level-negative under three gate statistics (refs2, refs4, refs7, per the source doc's failure lessons). But the lens still earns its keep in two roles: as a pre-flight detectability filter before measuring, and as the snapshot feeding the mobility saturation series (source doc).

This demotion is one of the cleanest results in the chain because it separates two jobs that look similar. Predicting "would this be detected" (detectability) is useful at low cost. Predicting "would this improve the level" (improvement) is a claim the lens does not support: the lens predicts movability, never improvement, and rungs propose while the gate disposes (refs8 F1, source doc). A tool kept in one role and retired in the other is the honest outcome; deleting it entirely would throw away the detectability filter and the mobility series with it.

## The abstention case

If no instrument-proposed candidate survives the content filters, the round records an honest abstention rather than authoring a padding change to satisfy a count (source doc, guideline 2). The skip-list plus the rung read are exactly the machinery that makes abstention cheap to verify: the ledger shows the skip-list was complete, and the rungs field shows what the structure proposed. An abstention with evidence is a valid round; a padding change to fill the round is a violation of the one-atomic-change discipline.

## Why caller-proposed adds fail

The 0 for 5 record on caller-proposed adds is not about content quality. It is about who proposes. A caller proposes from outside the frozen frame, so the predicted delta is a guess against a geometry they have not measured. A rung join proposes from inside the frame, where the isolates and their deltas are already computed. The unit roundflow never forbids caller proposals, but its ground truth says what happens to them, and the flow encodes that expectation so the operator spends rounds where the survival rate is real.

## What this record does not claim

This record is an internal-record subtopic: it makes no claims about external tools or standards because the skip-list, rungs, and lens verdicts are artifacts of this specific engine, and the evidence (2 for 2, 0 for 5, the closed-class finding) is recorded in the outcomes ledger of the yubi-OS chain, not on the public web. All numbers here are quoted from the source doc and carry its authority as the source of record.

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc).
