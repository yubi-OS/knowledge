# Branch And PR Policy

Scope: how work is branched, reviewed, and landed under the yubiOS maintainer playbook, as recorded in the source doc (yubi-OS/yubiOS docs/MAINTAINER.md). Internal-record subtopic, no dig: every rule here is quoted or unpacked from the source doc itself.

## The planning branch

Wiki and docs planning work uses the `docs/research` branch (source doc). This is a dedicated lane: research that has not yet hardened into a change to a source-of-truth file lives there instead of sitting uncommitted or being forced through a landing review prematurely. The maintainer playbook treats planning as real work with a real home, separate from implementation.

## Implementation branches are named after the work

Focused implementation branches should be named after the work they carry (source doc). The name is the first thing a reviewer sees, so a branch named for its work makes the scope of a review legible before the diff is opened. A branch name like the feature or fix it carries also keeps the branch list self-describing when several parallel work streams are in flight, which is the normal state for this project: the drift checks recorded in the source doc describe multiple agent-driven rounds running in the same repository.

## Do not delete branches

Do not delete branches as part of routine docs or CI work (source doc). This is an explicit negative rule. Branch deletion is a destructive operation that severs the pointer to prior work; under a discipline where every landing is reviewed and merged by a single maintainer, keeping branches around preserves the full audit trail of what was proposed, even when a proposal was superseded. The playbook therefore errs on the side of retention.

## The landing bar: summary, validation, known inconsistencies

When a change should land, the source doc requires a PR that carries three things:

1. A concrete summary. Not a vague description of intent but a statement of what the change does.
2. Validation. Evidence that the change was tested or checked, tied to the research cycle's requirement to gather primary upstream sources for claims that may have changed.
3. Known inconsistencies. An honest listing of what the change does not resolve.

The third element is the distinctive one. It pairs with the playbook's rule that maintainers flag inconsistencies instead of quietly smoothing over unresolved conflicts (source doc). A PR that declares its unresolved edges lets the reviewer make the call with full information; a PR that hides them turns the reviewer's approval into an accident.

## Merge discipline

The source doc's own drift checks record how this discipline behaves in practice. The 2026-09-18 drift check for wayfinder round 10, cycle 17 states that the rules the doc encodes were honored by every round, with all agent PRs held for review and merged by the maintainer, and the note classified as additive (source doc). The round 11, cycle 12 check repeats the same finding across rounds 9 through 11: all three PRs were merged by the maintainer (source doc).

This is the governance center of the playbook: automated and agent-produced work streams can propose, but a single human maintainer performs the merge. The discipline held through at least three consecutive rounds of parallel agent work, per the source doc's dated entries.

## What the policy rules out

Read together, the four rules produce a specific failure-mode avoidance:

- Planning work does not masquerade as landed work (separate `docs/research` lane).
- Reviews are not squinting at anonymous branch names (work-named branches).
- History is not destroyed to tidy the branch list (no routine deletion).
- Landings do not outpace their own evidence (summary, validation, and known inconsistencies required).

None of these rules is negotiable per the source doc, and the drift-check entries show them being exercised, not just stated.
