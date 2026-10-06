# Finalist merging: hybrid synthesis instead of winner takes all

Scope: how the two top-scored finalists (V1 thin controller, Sigma 17, and V5 ledger extension, Sigma 17) were merged into one hybrid, and how a third variation (V4) was folded in as a compatibility constraint.

## The tie and the merge decision

The framing log ends with V1 and V5 tied at 17. The recorded resolution: "merged, since V5 is a conventions layer over V1's shape, not a rival." That single sentence carries the whole merge logic: the two finalists were judged to operate at different layers, V1 defines the architecture (state machine, gate, review loop, HTTP-fetch tools), V5 defines the conventions (append-only audit rows, digest-stable IDs, explicit verdicts, no implicit state, borrowed from the worker's existing /api/outcomes ledger). A layering judgment converts a tie into a composition.

The resulting hybrid is recorded as "V1+V5 hybrid (thin controller on the ledger pattern)" and V4's n8n-compatibility constraints are folded in on top: plain JSON, one task per resource, poll-friendly status endpoint, webhook-free.

## Why merging beats tiebreaking here

Classic concept-selection literature argues against treating a tie as a coin flip. Pugh's method "does not aim to select the best concept, but to develop the best concept," because usually no single concept is superior and each has strengths and weaknesses (https://appinventor.mit.edu/explore/sites/all/files/teachingappcreation/unit4/DesignUnit4.pdf, jev weight 0.55, authoritative backing). Concepts with mixed scores are explicitly candidates for hybrid concept development (https://www.patsnap.com/resources/blog/articles/pugh-concept-selection-matrix-for-design-comparison/, jev weight 0.32, weak backing). The framing log's merge is a clean instance: V1 wins P (5) and T (5) but trails on D (3); V5 wins S (5) and D (4) but trails on P (4). The merge takes each finalist's strongest axes.

Systems-engineering synthesis describes the same operation at a higher level: synthesis brings together elements, sub-systems and systems to identify a solution option, and produces artifacts documenting the synthesis itself that then provide the basis for analysis (https://sebokwiki.org/wiki/Synthesizing_Possible_Solutions, jev weight 0.79, authoritative backing). The framing log's generation table plus the merge paragraph is exactly such an artifact: the synthesis is documented, not just performed.

Parallel-design research gives the empirical backing for generating alternatives first and combining later: running parallel design and combining the best ideas improves usability at lower cost than betting on a single early design (https://www.nngroup.com/articles/parallel-and-iterative-design/, jev weight 0.72, authoritative backing). In interaction-design practice, keeping multiple alternative code strategies side by side inside one function is an observed working pattern for trying different approaches before converging (https://people.eecs.berkeley.edu/~bjoern/dissertation/hartmann-diss-ch5.pdf, jev weight 0.64, authoritative backing).

## The fold-in: V4 as constraint, not component

V4 (n8n-first orchestration template, Sigma 15) was not merged as a design and not dropped as a design. It was demoted to an API-compatibility constraint: the merged design must be callable from n8n. The recorded constraints are concrete: plain JSON bodies, one task per resource, poll-friendly status, no webhooks required.

This disposition is worth naming because it is a third outcome beyond merge and drop. A variation can lose the ranking and still contribute a requirement. In the framing log this shows up as V4's audience shift becoming the merged design's API contract. The hybrid therefore serves the n8n caller without being organized around n8n.

## What the merged design looks like

Per the framing log, the finalist direction is: the worker hosts the state machine (D1), the deterministic fail-closed gate, the approval queue/dashboard, and verify/reconcile logic; jev-1.13 via the existing /api/decide relay powers Understand and Decide as advisory-only inputs whose probabilities never authorize anything; v1 execution is a scoped outbound-HTTP allowlist with stable action IDs and idempotency keys; and the conventions are borrowed from the worker's existing append-only /api/outcomes ledger.

The layering reading explains why this is stable: V1's controller answers "what runs and where"; V5's conventions answer "how the record reads after the fact"; V4's constraints answer "who can call it." None of the three answers the same question, which is the actual precondition for a merge rather than a rivalry.
