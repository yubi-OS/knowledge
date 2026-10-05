# 06. The outcome ledger: POST and GET /api/outcomes

**Scope.** How `outcomes/1` imports preregistration into the wayfinder: an append-only ledger, a 2-phase predict-then-verdict shape, a closed verdict vocabulary, and counts without rates.

## Preregistration, imported from open science

Preregistering a research plan before data collection improves rigor and reduces bias; that is the Center for Open Science's core claim for preregistration [1]. Registered Reports go further and get the protocol peer-reviewed before data collection begins [2][3], and the reproducibility-crisis literature is the background that makes these practices load-bearing rather than ceremonial [4].

The wayfinder ledger imports the same 2-phase shape. Project provenance for this section: the yubi-OS refs corpus document `pfister-keystone-methods-wayfinder-2026-09-17.md` (internal primary source, unweighted).

- A prediction is first registered as a row with `predicted_delta` and verdict `pending`.
- Later, the verdict row is appended with a `supersedes` reference to the prediction row.
- One-shot rows are stored with `preregistered:false`, so a post-hoc row can never masquerade as a pre-registered one.

The pending-then-verdict discipline is exactly the preregistration discipline: fix the prediction before the outcome is observed, then append what happened [1][3].

## Append-only as a design commitment

The ledger is an append-only D1 table created with an additive `CREATE TABLE IF NOT EXISTS`; the `maps` table is untouched. PUT, PATCH, and DELETE all answer 405. Append-only event records are the event-sourcing pattern: the log is the system of record, state is derived from it, and the pattern's trade-offs are explicit in the architecture literature [5]. The ledger follows the pattern where it matters and declines the rest: it stores verdict events, it does not derive state from them.

## What the ledger refuses

The refusal list is the interesting part:

- `verifier` is required; `geometry` is refused as a verifier for non-pending rows.
- `score`, `quality`, `success_rate`, `rate`, and `confidence` (and `z`) are refused as inputs entirely.
- With `after_id`, the observed delta is recomputed server-side by `PM.explainTransition` on the frozen frame, answering 409 on frame mismatch or a different moved name; a caller-supplied `observed_delta` is stored with `observed_source:"caller"` and never mixed with server-recomputed values.

The refusal of rate-like inputs is the decision-evaluation constraint from doc 02 in API form: a prediction is valuable through the decision it feeds [6], and the ledger records decisions and verdicts, not performance scores.

## The read shape: contingency of counts

GET returns rows plus a contingency of counts: `sign_exact_count`, `predicted_sign_by_observed_sign`, `verdict_by_sign_exact`, `by_verdict`, `observed_source_counts`, and every count carries its n. There is no rate, no percentage, and no z anywhere in the response. The closed verdict vocabulary is `pending`, `kept`, `reverted`, `declined`, `abstained`, `neutral`.

The historical 4 of 10 sign agreement from earlier rounds stays a historical count under this design. It becomes forward evidence only when rows are pre-registered through the ledger before the task check that resolves them, which is the next-check listed in the source record (project provenance, internal primary source, unweighted).

## Sources

1. https://www.cos.io/initiatives/prereg (noul 0.8232)
2. https://www.cos.io/initiatives/registered-reports (noul 0.9078)
3. https://zenodo.org/records/8088845/files/Preregistration_and_registered_reports_final.pdf (noul 0.6699)
4. https://plato.stanford.edu/entries/scientific-reproducibility (noul 0.8629)
5. https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing (noul 0.9543)
6. https://www.sciencedirect.com/science/article/pii/S0169207021001758 (noul 0.9187)
