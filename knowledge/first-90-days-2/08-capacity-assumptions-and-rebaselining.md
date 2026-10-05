# Capacity assumptions and re-baselining under drift

Scope: making throughput assumptions explicit, detecting plan-versus-actual drift, and re-baselining when an assumption breaks.

## State the capacity assumption explicitly

Capacity planning exists to remove unstated throughput guesses. Atlassian's capacity planning play describes it as a method that "takes the guess-work and assumptions out of your project timeline" and prescribes building the plan "with your team" (weight 0.59, atlassian.com/team-playbook/plays/capacity-planning). A broader guide defines capacity planning as aligning "people, machines, space, and technology with future demand so you can deliver reliably without overspending" (weight 0.34, weak backing, microestimates.com/blog/what-is-capacity-planning), and project-management guidance adds formulas, templates, and strategies for resource planning (weight 0.25, weak backing, juntrax.com/blog/project-management-capacity-planning/).

The operational implication for a 90-day plan: before the first decision point, write down the capacity model the plan silently assumes, for example "one main contributor plus automation can run N interviews, produce M documents, close K hardware tasks, recruit 2 design partners, and run 1 paid pilot in 90 days." If that sentence has never been written, the plan's schedule is a guess. Team-facing planning practice reinforces that the people who must deliver the plan should be in the room when the capacity model is built (weight 0.59, atlassian.com).

## Detecting drift: variance against the baseline

Drift detection is a measurement problem. Baseline-management guidance states the rule directly: "Rebaseline when the original baseline no longer reflects reality closely enough to produce useful variance data, typically after a formally approved scope change, not after an unapproved slip" (weight 0.30, weak backing, onplana.com/blog/project-baseline-management). The practical test is informational, not emotional: if schedule variance numbers have stopped meaning anything because reality moved too far from the baseline, the baseline is dead and must be reset.

## Re-baselining is a deliberate, significant change

Re-baselining is not the same as rescheduling a task. PMP guidance frames it as "an important way to keep project continuity as the original plan is significantly altered" (weight 0.23, weak backing, nytcc.net/blog/pmp-rebaseline-guide), and a comparative guide distinguishes "baseline planning vs re-baselining projects" as different activities with different triggers, asking "When To Reset Your Timelines" as a deliberate question (weight 0.33, weak backing, pmresourcehub.com/baseline-planning-vs-re-baselining-projects-when-to-reset-your-timelines/).

Two boundary rules follow:

1. Small slips do not re-baseline. A single delayed item is handled inside the existing baseline (reschedule, compress the critical path, see doc 06). Re-baselining is reserved for significant alteration (weight 0.23, weak backing, nytcc.net).
2. Re-baselining rewrites forward, not backward. The purpose is continuity of the plan going forward, with the alteration recorded, not an erasure of the record of what was planned (weight 0.23, weak backing, nytcc.net).

## A worked pattern: narrow scope instead of stretching time

When capacity proves materially lower than assumed, the adjustment that preserves decision integrity is narrowing scope rather than extending the window. In a 90-day plan: if the days-31-60 phase cannot deliver its full output list under real capacity, cut the phase's scope and re-baseline the final-phase outcomes accordingly, rather than letting every downstream decision point absorb a silent slip. This is the concrete application of the re-baseline trigger: the capacity assumption broke, so the plan (not the truth) changes.

## Keeping execution tools as the source of truth

Tooling practice adds a provenance rule: keep the execution system as the single source of truth and route planning changes through it. One practitioner describes keeping a tracking tool "as the execution source of truth" with an upstream editorial inbox feeding it, rather than splitting truth across systems (weight 0.49, weak backing, codewithshabib.com/docs/planning/linear-reorg-original-plan/). For a 90-day plan this means the re-baselined plan lands in the same tracker the team executes from, dated, with the prior baseline preserved.

## Practical takeaways

- Write the capacity assumption down before the first decision point and validate it against real throughput (weight 0.59, atlassian.com).
- Watch variance data; when it stops being useful, the baseline is dead (weight 0.30, weak backing, onplana.com).
- Re-baseline only on significant alteration, deliberately, with the change recorded (weight 0.23, weak backing, nytcc.net; weight 0.33, weak backing, pmresourcehub.com).
- On a capacity shortfall, narrow scope and re-baseline outcomes rather than silently absorbing the slip.
