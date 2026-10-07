# One atomic change and pre-registration

Scope: steps 5, 6, and 7 of the runflow. Choosing the one atomic change under the authored content rules, pre-registering it before any measurement, and previewing it against the current or post-keep map.

## Step 5: one atomic change

Each round makes exactly one change. It is either a CHANGE (one section appended to one existing doc) or an ADD (one new doc) (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md). Nothing in between, nothing bundled. The word atomic is load-bearing here: the change is an indivisible unit, the smallest edit that can be meaningfully measured (Merriam-Webster defines atomic as "of, relating to, or concerned with atoms" and, derivatively, something that cannot be divided further, https://www.merriam-webster.com/dictionary/atomic, weight 0.84). A round that edits two docs cannot attribute its realized delta to either one.

The authored content rules are hard filters, not style advice (source doc):

1. C6: backticked in-repo paths or concrete dated facts. The change must contain either a path rendered in backticks or a dated fact; vague prose fails.
2. C5: no cross-axis vocabulary in headers or near-miss phrasing. Headers must not borrow words that belong to another measurement axis.
3. The doc's own subject only. The change does not editorialize about other docs.
4. C7: "What this record does not claim" charters are respected. C7 blocks companion and census docs outright unless `TASKCHECK_OVERRIDE` names a reason.

C7 is the strongest of the three: it exists because the chain has repeatedly generated census-style documents that pad the corpus without measuring anything new, and the override mechanism (`TASKCHECK_OVERRIDE`) keeps it a rule rather than a law of nature.

## Step 6: pre-register BEFORE measuring

`POST /api/outcomes {baseline_id, target, predicted_delta, task_check}` is the pre-registration, and it happens before the measurement, not after (source doc). The target is an OBJECT: `{action:'change'|'add', name}`. A bare string target returns 422 (source doc). The predicted_delta is a lens or rung number expressed in the level convention, and the task_check field starts as `verdict:'pending'`.

Pre-registration is a standard discipline in open science: the hypothesis and the analysis plan are committed before the data arrives, so the result cannot be reshaped after the fact to fit whatever came out (https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3000246, weight 0.79). In the unit roundflow the same logic has a mechanical edge: the ledger keeps the pre-registration row, and step 12's realized row references it through `supersedes`, so a round physically cannot backfill a prediction it did not make.

## Step 7: preview

`POST /api/map/preview {baseline_id, texts (FULL corpus), names, target, predicted_delta}` runs the change against the frozen frame without committing anything (source doc). Two constraints matter.

First, the preview payload carries the FULL corpus texts and names, not a diff. Second, the one-name constraint: a CHANGE must alter exactly one name versus the current baseline (source doc). If the preview shows two names moving, the edit was not atomic and the round has a bug to fix, not a measurement to take.

The baseline a change previews against is not static. After a keep, the corpus has moved, so the next change previews against the POST-KEEP map, which is the remap produced in step 12 (source doc). Adds use `target: {action:'add', name}` with the new doc appended to texts and names (source doc). An operator who keeps previewing against yesterday's baseline will produce predicted deltas that no longer mean anything.

## Why the ordering is the point

Steps 5 through 7 form a strict sequence: author under the content filters, register the prediction, preview the mechanics. Measurement (steps 8 and 9) comes after all three. The discipline prevents the two classic corrupt outcomes: authoring content after seeing a favorable measurement, and re-predicting after seeing the realized delta. Both are pre-registration failures in the ordinary scientific sense (https://handwiki.org/wiki/Preregistration_(science), weight 0.33, weak), and the ledger's supersedes chain is what makes them auditable rather than merely discouraged.

## What this record does not claim

This record does not restate the full taskcheck verdict list (doc 07 covers the keep side), and it does not claim the content rules C1 through C4, which belong to the change-shaped and add-shaped subsets documented in the taskcheck flow (doc 07).

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); PLOS Biology on open science preregistration (https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3000246, weight 0.79); Merriam-Webster, atomic (https://www.merriam-webster.com/dictionary/atomic, weight 0.84); HandWiki, Preregistration (https://handwiki.org/wiki/Preregistration_(science), weight 0.33, weak).
