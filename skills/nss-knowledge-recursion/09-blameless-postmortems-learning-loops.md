# 09 Blameless postmortems and learning loops

Source doc: yubi-OS/yubiOS skills/nss-knowledge-recursion/SKILL.md (the ground source). Scope: failure_inventory, learning_loop, feedback_independence, change_mechanism, and verification_metrics axes, grounded in the Google SRE postmortem tradition.

## What the rubric scores

Failure_inventory (0-4, source doc): 0 is no record, 2 is impact plus cause plus mitigation, 3 is postmortem-grade (impact, causes, mitigation, follow-up, prevention), 4 adds near misses, misleading assumptions, stale references, and failed improvement attempts. Learning_loop (0-4): 2 is steps listed, 3 names trigger, input, decision rule, action, stopping condition, owner, and next review, 4 makes cadence and the observe-interpret-hypothesize-act-measure-retain-repeat transition explicit. Guideline 7: "Memory is not 'we'll remember.' Memory is an artifact (changelog, ADR, next-review field, linked code/test). Without the artifact, the loop is open."

## The Google SRE postmortem standard

Google's SRE book states the position: "a truly blameless postmortem culture results in more reliable systems" [1] (weight 0.89). The SRE book chapter "Postmortem Culture: Learning from Failure" frames the cost of failure as education and treats blamelessness as what makes the learning usable at scale [2] (weight 0.88). In practice, Google runs postmortem review meetings that reinforce the blameless culture, with presenters walking the incident rather than the people [3] (weight 0.79).

The ground source converts this into a gate: "A postmortem that is published but whose preventive action is not checked in the next incident review is unverified self-improvement. Name the follow-through owner and the verification cycle" (source doc, guidelines).

## Closing the loop into the runbook

The runbook-to-postmortem relationship is itself a closed loop: runbooks prevent incidents, postmortems improve runbooks, and the linkage discipline is to attach every postmortem's action items to the specific runbook sections they change [4] (weight 0.34, weak). Template practice pushes action items past "we should": each carries an owner, a verifiable verb, a measurable outcome, a tracker entry, and a deadline [5] (weight 0.17, weak), with follow-through checklists covering owners, verification methods, review cadences, and recurrence tracking [6] (weight 0.15, weak).

This is the ground source's change_mechanism axis (number 10): "Learn from this" scores 0; an owner plus action plus scope scores 3; the change actually landing in code, prompts, tests, workflow, architecture, taxonomy, docs, or skills with the person named scores 4 (source doc).

## Feedback must be independent

Feedback_independence (axis 9, source doc): self-impression scores 0, single-author review 1, peer review 2, test-based or environment-based 3, and 4 is external, test-based, user-based, or historical feedback with independent evidence. The anti-pattern is stated flatly: "Self-generated critique is circular. If the same process creates the claim, the audit, and the success measure, the feedback is not independent" (source doc). Guideline 8 names the sources: tests, metrics, reviewers, incidents, and historical evidence.

## Verification and anti-self-deception

Verification_metrics (axis 11, source doc): a listed metric scores 2, before/after comparison 3, and 4 is tracked over time: time-to-diagnosis, contradiction counts, stale-link counts, reviewer judgments, documentation freshness. The red-flag table completes the discipline: a postmortem whose runbook change is missing is unverified self-improvement; a learning log with "we should" and no owner has no change mechanism; a `next_review` field older than 30 days without re-review means the recursion cadence is broken (source doc).

## Sources

1. https://sre.google/workbook/postmortem-culture/ (weight 0.89)
2. https://sre.google/sre-book/postmortem-culture/ (weight 0.88)
3. https://cloud.google.com/blog/products/gcp/incident-management-at-google-adventures-in-sre-land (weight 0.79)
4. https://github.com/legioncodeinc/vibe-coding-tools/blob/main/src/skills/runbook-writing-stinger/guides/06-postmortem-linkage.md (weight 0.34, weak)
5. https://www.augmentcode.com/guides/incident-postmortem-template (weight 0.17, weak)
6. https://aurora-coach.com/use-cases/postmortem-follow-through (weight 0.15, weak)
