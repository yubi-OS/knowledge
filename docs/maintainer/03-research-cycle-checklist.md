# Research Cycle Checklist

Scope: the 7-step procedure the maintainer playbook prescribes for any piece of research or change work in yubiOS. Internal-record subtopic, no dig: the steps and their exact wording come from the source doc (yubi-OS/yubiOS docs/MAINTAINER.md).

## The steps

The source doc lists the cycle as follows:

1. Read the task-specific file, then `AGENTS.md`, `PINNED.md`, and relevant ADRs/refs.
2. Gather primary upstream sources for claims that may have changed.
3. Record dated findings under `refs/` when the work spans more than one file.
4. Name planning-cycle notes `refs/planning-cycle-YYYY-MM-DD.md`, keep each note scoped to that research cycle, and link source-of-truth files instead of copying live pin tables.
5. Update docs that repeat the affected claim.
6. Flag inconsistencies instead of quietly smoothing over unresolved conflicts.
7. Open a PR, merge when appropriate, and create or update an issue with the outcome.

## Step 1: read order

The read order is a dependency chain. The task-specific file scopes what is being asked; `AGENTS.md` supplies the agent-facing operating rules; `PINNED.md` supplies the current base and tool pins, which the source doc elsewhere establishes as the only live digest source; ADRs and refs supply accepted decisions and prior research evidence. Reading in this order means every later judgment in the cycle is made against current ground truth rather than memory.

## Step 2: primary sources for changeable claims

Step 2 forces verification precisely where staleness is most likely: claims that may have changed. The playbook does not ask for re-verification of everything, only of claims whose upstream truth could have moved. This is the same instinct the consistency flags encode for systemd directive naming: a claim about upstream behavior is checked against upstream, not against the project's own older notes.

## Step 3 and 4: the refs/ evidence trail

Steps 3 and 4 govern where findings live. Multi-file work gets a dated record under `refs/`. Planning-cycle notes carry a fixed naming convention, `refs/planning-cycle-YYYY-MM-DD.md`, which makes the research corpus chronologically browsable and collision-free. Each note is scoped to exactly one research cycle.

The link-not-copy rule in step 4 is the operational enforcement of the source-of-truth map: a planning note links to `PINNED.md` rather than copying its pin table, so a copy can never go stale and contradict the live file. This mirrors the doc-wide rule that historical fragments never override current source-of-truth files.

## Step 5: propagate, do not fork

Updating docs that repeat the affected claim closes the loop the source-of-truth map opens. If a claim changes in its authoritative file, every downstream document repeating it must be updated in the same cycle. A doc that keeps repeating the old claim is exactly the "stale fragment" hazard the override rule warns about.

## Step 6: surface conflicts

Step 6 is a honesty requirement: unresolved conflicts get flagged, not smoothed over. This pairs with the PR requirement to list known inconsistencies (source doc) so that unresolved edges are visible at review time rather than being laundered into the merge.

## Step 7: close the loop in public

The final step lands the work and records the outcome. A PR carries the change; an issue carries the outcome. The playbook requires both, so the knowledge of what happened is durable and searchable, not buried in a merge commit message.

## The cycle as governance

Read as a whole, the checklist converts research work into an auditable pipeline: scoped input (step 1), verified claims (step 2), dated evidence (steps 3 and 4), propagated corrections (step 5), surfaced conflicts (step 6), and a landed, issue-tracked outcome (step 7). Each step maps to a rule stated elsewhere in the maintainer playbook, which is the doc's consistent style: one principle, stated once, enforced in several places.
