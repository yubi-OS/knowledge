# 07 - Rollback Friendliness

Scope: Rule 5 from the source doc, each increment independently revertable, additive changes favored, minimal focused modifications, and database migrations with rollback counterparts.

## The rule

The source doc (`yubi-OS/yubiOS skills/incremental-implementation/SKILL.md`) states Rule 5 as: "Each increment should be independently revertable." It names 4 concrete practices:

1. Additive changes (new files, new functions) are easy to revert.
2. Modifications to existing code should be minimal and focused.
3. Database migrations should have corresponding rollback migrations.
4. Avoid deleting something in one commit and replacing it in the same commit; separate them.

The connection to the increment cycle is direct: Rule 2 guarantees every increment is verified and committed, and Rule 5 guarantees every one of those commits can be undone alone without dragging unrelated changes with it.

## The operational-excellence backing

The strongest external support for the rule comes from the AWS Well-Architected Framework's operational excellence pillar, best practice OPS05-BP09: "Make frequent, small, reversible changes." The rationale is scope reduction: when used in conjunction with change management systems, configuration management systems, and build and delivery systems, frequent small reversible changes reduce the scope of each change (https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_dev_integ_freq_sm_rev_chg.html, jev weight 0.95). In incremental terms, the rollback unit is the slice commit, so a bad slice rolls back alone and the feature's other slices stay intact.

The microservices literature carries the same guidance into delivery cadence: each developer should strive to break work into small, incremental changes deployed at least once a day (https://premium.microservices.io/microservices-rules-10-make-smaller-safer-and-reversible-changes-part-3/, jev weight 0.32, weak backing), and smaller changes are easier to test, easier to diagnose, and easier to roll back (https://agilesm.net/incremental-delivery.html, jev weight 0.19, weak backing).

## Migrations: expand and contract

The source doc's migration requirement (every migration paired with a rollback migration) has a well-developed pattern behind it. The expand and contract pattern provides a way to implement breaking changes to a system in a safe manner (https://www.tim-wellhausen.de/papers/ExpandAndContract/ExpandAndContract.html, jev weight 0.53). Applied to schemas, it splits a change into 2 phases: expand, which adds new schema elements alongside the existing ones, and contract, which removes the old elements once consumers have moved over (https://xata.io/blog/pgroll-expand-contract, jev weight 0.28, weak backing).

The expand phase is exactly what Rule 5 calls an additive change: it is easy to revert, and it never takes the old behavior away. Sequencing the delete separately from the add, the source doc's 4th practice, is what makes each phase independently revertible: a commit that both deletes the old path and adds the new one cannot be rolled back to either state.

## Rollback is not the safety net, reversibility is

One practitioner warning is worth folding into the rule: rollbacks themselves are a slow and unreliable mitigation when code and config changes cause a failure, so the best protection against change-related failures is not an automated rollback but the change design itself (https://principleresilience.com/articles/stoprelyingonrollback/, jev weight 0.21, weak backing). Rule 5 is that change design: reversibility built into each increment, rather than rescue machinery invoked after a bad deploy.

## How Rule 5 changes the code you write

In practice the rule biases every increment toward the additive end of the change spectrum:

1. New behavior in new files and functions, so a revert removes them cleanly.
2. Edits to existing code kept minimal and focused, so the revert diff is reviewable.
3. Every schema change shipped as migrate plus rollback from the first increment, never retrofitted after the old schema is gone.
4. Deletes and replacements split across increments, so the old path survives until the new one is proven.

This costs little inside the increment cycle and changes the failure economics: the worst case for any slice is one commit reverted and one slice redone, not a feature branch abandoned.
