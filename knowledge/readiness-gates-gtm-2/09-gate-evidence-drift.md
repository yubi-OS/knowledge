# 09: Gate Evidence Drift

Scope: keeping gate evidence current: how documentation and status drift forms, how to detect it, and the review-gate discipline that keeps a readiness ladder honest over time.

## Drift is structural, not accidental

Documentation drift is the gap that opens when the thing a document describes changes while the document stays static: the README still names an install path that moved, the architecture page still shows a deleted service, and readers stop trusting the corpus (source: https://www.moxiedocs.com/learn/what-is-documentation-drift, weight 0.18, weak backing). The root cause is a process asymmetry: code changes pass through review, CI, and merge gates, while documentation changes pass through nothing. Code ships, the document rots, and nobody notices until someone is burned (source: https://understandingdata.com/posts/doc-drift-detection-ci/, weight 0.31, weak backing).

The costs are measurable in the same sources: a 2025 GetDX study (cited there) found new hires take 2 to 3 months longer to become productive when documentation is not current, and developers spend 3 to 10 hours per week searching for answers that should already be documented; other practitioner analysis reports stale documentation roughly doubling outage resolution times (source: https://sync-o.io/blog/stale-documentation-engineering, weight 0.15, weak backing).

For readiness gates the drift problem is sharper than for ordinary docs, because gate evidence is decision-grade: a gate decision (sign the SOW, make the GA claim) inherits the staleness of every artifact it cites. A gate definition that cites a blocker's status as of last month is making this month's decision on last month's evidence.

## Four drift surfaces

Practitioner compliance-drift analysis decomposes drift into 4 types, each of which maps onto a gate ladder: configuration drift (the system changed), process drift (the procedure changed), personnel drift (the accountable people changed), and documentation drift (the record changed). The same taxonomy is applied across SOC 2, ISO 27001, PCI DSS, HIPAA, FedRAMP, and NIST CSF 2.0 control environments (source: https://josefkamara.com/compliance-drift-detection/, weight 0.18, weak backing).

For a readiness ladder, the highest-risk pair is the last two: when a gate's owner leaves and the evidence file they wrote stays put, the ladder keeps pointing at an artifact nobody can vouch for.

## Detection mechanisms

Three detection patterns recur:

1. Same-day diff between dependent documents. When two documents depend on the same upstream evidence (for example, a gate definition and a blocker list), re-checking them against each other at the time a decision is made catches the case where one has moved and the other has not. This is the drift-check pattern: a scheduled re-read of the cited source against the citing document, with the diff recorded.
2. CI-based doc drift detection. The same merge-event machinery that tests code can review docs: a workflow fires on merge, extracts the diff, compares code changes against the documentation, and opens a follow-up change when something drifted (source: https://understandingdata.com/posts/doc-drift-detection-ci/, weight 0.31, weak backing).
3. Decision gates with built-in re-review. The DecisionGate standard assigns every gated decision a Reversibility Index from 1 (fully reversible at negligible cost) to 5 (irreversible with significant long-term consequences) and scales gate depth to it; trigger conditions re-arm the gate whenever the decision's impact conditions change (source: https://decisiongate.org/standard.html, weight 0.55, strong).

## The review-gate discipline

The drift-check discipline has a self-referential virtue worth keeping: a review-gate diff, run when a dependent document is re-issued, states explicitly what the previous version got wrong and why. The pattern is: read the upstream source's current date and status, diff it against what the dependent document last recorded, correct the dependent document, and log the diff. A same-day source cited with a different-day reading is the specific failure this catches: the source says a blocker resolved on day X, the citing doc, written the same day, still describes the blocker as open, because each document was drafted from different snapshots.

An honest drift check also records when the checker does not know the answer. Where a referenced artifact has an unfilled placeholder or an unverified claim, the drift check marks it explicitly rather than inventing content, so the next reviewer can see the gap as a gap.

## Keeping a gate ladder current

Practical rules for a readiness ladder that must stay true over months:

1. Date-stamp every evidence citation. A claim "as of" a date is checkable; an undated claim is not (source: https://www.moxiedocs.com/learn/what-is-documentation-drift, weight 0.18, weak backing).
2. Re-read upstream sources at decision time, not from memory. The cost of a re-read is minutes; the cost of deciding on stale evidence is a gate passed on a false premise (source: https://understandingdata.com/posts/doc-drift-detection-ci/, weight 0.31, weak backing).
3. Tie re-review depth to reversibility. Irreversible commitments (signed SOWs, public GA claims) get full re-verification of every citation; reversible internal moves can use a fast-track check (source: https://decisiongate.org/standard.html, weight 0.55, strong).
4. Write the drift log. Each check records what moved, what was corrected, and what remains open, so drift detection itself is auditable (source: https://josefkamara.com/compliance-drift-detection/, weight 0.18, weak backing).
5. Treat unresolved drift as a gate blocker, not a footnote. If a gate's cited evidence is known-stale, the gate is not cleared until the evidence is re-verified; shipping on stale evidence is how a readiness ladder becomes a fiction with good formatting (source: https://sync-o.io/blog/stale-documentation-engineering, weight 0.15, weak backing).
