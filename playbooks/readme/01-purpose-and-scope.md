# 01. Purpose and Scope: What playbooks/ Is

## Scope

This doc covers what the yubiOS `playbooks/` directory is for, the form of its artifacts, and how the directory relates to the two neighboring stores of operational knowledge in the same repo. Grounding spine: the yubiOS playbooks/README.md (source doc: https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md). All claims in the first two sections below come from the source doc.

## The runbook form

The source doc defines the collection in one line: "Operator-view runbooks, one per recurring failure mode." That line carries two commitments:

1. Operator-view. The artifacts are written for the person doing the work during an incident or recurring chore, not for a reader studying the architecture. This is why the format spec (see 05-format-spec.md) requires copy-pasteable commands under Mechanism rather than prose explanations.
2. One per recurring failure mode. The unit of organization is the failure mode, not the workflow or the subsystem. The README's own "How to use" section makes this explicit: "Match on failure mode, not workflow name."

In general industry usage, a runbook is a set of standardized written procedures for completing recurring IT processes, a form that sits inside ITIL's knowledge-management protocols (https://www.techtarget.com/searchnetworking/definition/run-book, jev weight 0.23, weak). DevOps practice treats runbooks as the operational backbone a team actually executes during incidents rather than a wiki that sits unused (https://isdown.app/blog/runbook-in-devops, jev weight 0.14, weak). yubiOS narrows the general form: the collection is not every procedure, only failure modes that have recurred. The two-fire qualification threshold that follows from this is covered in 06-relationship-and-maintenance.md.

## The three-way split

The source doc draws the boundary between the repo's operational-knowledge stores in a single line: "`refs/` = research. `docs/BLOCKERS.md` = current state. `playbooks/` = the next action."

- `refs/` holds research. Dated, exploratory documents. The README itself signals this by citing its format provenance from a refs/ doc: the playbook format was "proven by `refs/debug-with-cli-2026-08-01.md`".
- `docs/BLOCKERS.md` holds current state. What is blocked right now and what permanent patterns have been registered (see 06-relationship-and-maintenance.md).
- `playbooks/` holds the next action. When a known failure mode fires again, the playbook is what you open to act.

The three stores are sequential, not parallel: research matures into doctrine, doctrine registers as state, and state operationalizes into an executable next action. The README's "Relationship to BLOCKERS.md" section is the explicit seam between the last two.

## Why the split matters for maintenance

Because playbooks are revised in place (no date suffix in the filename, unlike refs/), the directory stays small and current. The source doc's maintenance section says new playbooks are added "as new failure modes emerge", which keeps the index honest: everything listed in it is a mode that has already fired at least twice. One-off lessons do not graduate into playbooks; the source doc explicitly excludes one-off guidance (commit messages, Linear comments) from coverage (see 04-coverage-boundaries.md).

## What this corpus adds

The remaining docs in this corpus explicate the collection end to end: the indexed playbooks and their trigger conditions (02-playbook-index.md), the 4-step usage protocol (03-usage-protocol.md), the coverage boundaries (04-coverage-boundaries.md), the format spec with its hard rules (05-format-spec.md), and the BLOCKERS.md register relationship plus the maintenance and escalation workflow (06-relationship-and-maintenance.md).

## Sources

- Source doc: https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md
- https://www.techtarget.com/searchnetworking/definition/run-book (jev weight 0.23, weak)
- https://isdown.app/blog/runbook-in-devops (jev weight 0.14, weak)
- https://en.wikipedia.org/wiki/Runbook (jev weight 0.16, weak)
