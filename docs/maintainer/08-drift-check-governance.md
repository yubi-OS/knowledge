# Drift Check Protocol And Governance

Scope: the dated drift-check entries appended to the maintainer playbook and the governance discipline they record. Internal-record subtopic, no dig: the entries and their content come from the source doc (yubi-OS/yubiOS docs/MAINTAINER.md).

## The entries

The source doc ends with two dated drift-check notes, both from 2026-09-18:

1. Drift check for wayfinder round 10, cycle 17: the maintainer doc is unchanged; the Jenny-merges rules it encodes were honored by every round, with all agent PRs held for review and merged by the maintainer; the note is classified as additive.
2. Drift check for round 11, cycle 12: a follow-up entry recording that MAINTAINER.md was already drift-checked in round 10, cycle 17, and that the Jenny-merges discipline held through rounds 9 through 11, with all three PRs merged by the maintainer; again classified as additive.

## What a drift check is

A drift check is a scheduled re-verification of a document against the current state of the project. The entries follow a fixed reporting shape: which document, which round and cycle, whether the document changed, whether the rules it encodes were honored, and a classification of the check's effect on the document itself. In both recorded cases the document was unchanged and the note was additive, meaning the check added a dated entry rather than modifying the rules.

The round/cycle numbering (round 10, cycle 17; round 11, cycle 12) shows the checks are indexed against the project's parallel agent workstreams rather than the calendar alone, so a drift check is anchored to the specific body of work it verified.

## The Jenny-merges discipline

Both entries name the same rule: the Jenny-merges discipline. Its content, as the entries record it in operation, is that every PR produced by agent work is held for review and merged by the maintainer, never self-merged by the agent that produced it. The entries are evidence of the rule being enforced: across rounds 9, 10, and 11, all agent PRs were held and all three were merged by the maintainer.

This is the enforcement end of the branch-and-PR policy documented earlier in the playbook: agents may propose through the standard PR path with its summary, validation, and known-inconsistencies bar, but the merge decision stays with a single human owner. The drift-check mechanism exists precisely to verify that this property keeps holding as the number of automated workstreams grows.

## Additive classification

Both notes are marked additive. In the vocabulary these entries establish, an additive drift check changes nothing in the document under check; it appends a dated record. That classification matters for the source-of-truth discipline: a drift check that changed rules would need to update the rules in place and propagate to docs that repeat them (per the research cycle checklist), whereas an additive check is pure evidence trail.

## Governance reading

The drift-check section shows the maintainer playbook operating on itself. The document states rules; the rules are exercised by real workstreams; dated checks verify the exercise; and the verification is recorded in the same document, keeping the evidence with the policy it validates. The 2026-09-18 pair demonstrates the loop closed three times over: three rounds of agent PRs, all held and merged by the maintainer, with the finding written back into the playbook the same day.
