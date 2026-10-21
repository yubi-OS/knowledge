# 05. MVP Scope

**Scope:** MVP Scope: detailed analysis grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md, no external web dig

## The MVP in one line

The source states the MVP in a single line: **Lanes A+B+C, pushed same session, CI-verified. No new measurements.**

Each clause is a constraint.

## "Lanes A+B+C"

All three lanes are in scope together, not sequentially across sessions:

- **Lane A:** the new `falsification-corpus` skill, carrying the 7-step methodology (pre-registration, generator design, gate design checked on the pinned scale set, advisor review, L-convergence calibration, live-route parity, real-data protocol) and its anti-patterns (size-grading droplets, silent empty masks, post-hoc gate movement, predicting render-bias sign without measuring).
- **Lane B:** the repo harness at `tools/edge-standard/falsification/`, containing the cleaned v2 generators with a `--selftest` CLI asserting the anchors (gasket L=384 slope 1.5968, tri 1.2636, component counts), the amendments log, and the results JSON, wired into lean-check verify-tools.
- **Lane C:** the taste-engine SKILL.md amendment with the six lessons (empty-mask hazard, gate windows against the scale lattice, r/L-dependent render bias calibrated by convergence, matched-extent confound, Norcia trend, Trypogeorgos 1D-only finding).

Shipping all three together matters because they cross-reference. The taste-engine amendment points at the falsification skill; the skill points at the harness as its worked example; the harness's selftest is what makes the skill's claims checkable.

## "Pushed same session"

The external-copies rule is the reason. The point of the rollout is to end the session with nothing load-bearing left in session storage. Pushing in a later session would recreate the risk the MVP exists to remove.

## "CI-verified"

Not "pushed and assumed green." The source's assumption list says lean-check must stay green at the new HEAD under the dispatch-plus-verify discipline. The MVP is not complete until a CI run at the new HEAD is observed green.

## "No new measurements"

The most important constraint. The v3 matched-extent shuffle control is excluded from the MVP even though it is the most scientifically important next step. Mixing documentation with a new measurement would mean the documentation describes a moving target, and a measurement problem could block the documentation from landing.

## Acceptance criteria

Read from the source, the MVP is done when all of these hold:

1. The `falsification-corpus` skill exists in the repo, pushed and byte-verified, marked v1 one-use-validated.
2. `tools/edge-standard/falsification/` exists with cleaned v2 generators, amendments log, and results JSON.
3. `--selftest` runs green and reproduces the anchors within fixture-parity tolerance.
4. lean-check verify-tools includes the harness.
5. The taste-engine SKILL.md carries the six lessons.
6. A lean-check run at the new HEAD is dispatched and verified green.
7. No new measurement was run.

## Sizing

Three lanes is the minimum that covers the three risk categories: lost methodology (A), lost code and data (B), and a stale governing skill (C). The stress-test addresses the obvious objection, that three lanes of docs for one day's work is heavy, by pointing at precedent (the taste-engine rollout) and at function (the artifacts are the program's audit trail).

## What follows the MVP

The source schedules the v3 matched-extent control as "the next measurement (separate turn)." Its purpose is to gate any "D reads order" claim. The companion record shows that control later ran, found the earlier lattice-versus-shuffle gap was driven by array extent (jitter mean 1.2609 against tri 1.2636), and narrowed the instrument's label to a hierarchy/fill detector. That outcome is a direct argument for the MVP's ordering: the documentation landed first, so the control's result could be added to a stable, versioned record rather than to scattered session files.
