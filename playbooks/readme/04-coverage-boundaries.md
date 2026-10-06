# 04. Coverage Boundaries: What the Collection Covers and What It Does Not

## Scope

This doc explicates the "Covers" and "Does not cover" lines of the yubiOS playbooks/README.md, and why those boundaries are drawn where they are. Internal-record subtopic, no dig: every claim comes from the source doc (https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md), the primary source of record.

## Covers

The source doc states the collection covers two things:

1. "CI/CD failure modes that have fired >= 2 times."
2. "the verify-before-claim doctrine."

The >= 2 threshold is the qualification rule: a failure mode earns a playbook only once it has recurred. The index (02-playbook-index.md) shows the threshold applied, for example digest-bump-recovery's provenance line "OMN-139 + 2 re-resolutions in 7 days". The verify-before-claim doctrine is a failure mode class of its own: dispatch-chain-verification's trigger is "about to report any dispatch/chain/merge green", which is a claim-making moment, not a failure string.

## Does not cover

The source doc excludes 5 things explicitly:

1. "one-offs (commit messages / Linear comments)". A lesson that fired once stays where it happened. The two-fire threshold is what separates it from a playbook.
2. "SRE/production runbooks (yubiOS is pre-launch)". The collection is scoped to the build-and-CI surface that yubiOS operates today; production incident response is out of scope until there is production.
3. "architecture rationale (`docs/ADR.md`)". Why a decision was made lives with the ADRs; a playbook records only the chosen approach and the working mechanism.
4. "blocker state (`docs/BLOCKERS.md`)". What is currently blocked is state, not procedure; the seam between the two is covered in 06-relationship-and-maintenance.md.
5. "the test scripts' own correctness (separate audit, gated on real-board work)". The playbooks can tell you how to run the test lanes; auditing whether the test scripts themselves are right is a separate workstream the collection deliberately does not take on.

## Why the boundaries are narrow

The exclusions keep each playbook provable. A playbook must name at least 1 commit/run/PR under Verified working (05-format-spec.md), which is only possible for a concrete, repeatable mechanism. Architecture rationale, blocker state, and one-off lessons either cannot carry that kind of evidence or already have a designated home (refs/, docs/ADR.md, docs/BLOCKERS.md). The exclusions also protect the usage protocol's step 2 (03-usage-protocol.md): if Context does not describe your situation, you stop, and the boundary lines are what make that check trustworthy.

## The escalation lane for uncovered ground

The source doc's "Not here?" paragraph closes the loop: if no playbook matches, "Don't improvise a playbook mid-incident. Fix the incident, then file `playbook: <failure mode>` on team OMNI-AGENT with the run ID and root cause." That turns an uncovered failure into a candidate for the next playbook, once it has fired twice. Known uncovered ground is tracked in `refs/testing-production-gaps-2026-08-01.md`.

## Sources

- Source doc (sole source, internal-record subtopic, no dig): https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md
