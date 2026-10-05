# 04 Exact local isolation ledgers

Scope: `PM.explainTransition` verifies inputs and independently recounts isolation, produces an exact ledger for one ADD and one CHANGE, and halts before persistence on any mismatch.

## What explainTransition verifies

`PM.explainTransition` first verifies the frame and instrument identifiers, that points are at full precision, and that names are unique. Then it recounts isolation independently (source doc: direct runtime additions section, primary project artifact). The independence is the load-bearing property: the ledger is not a reformatting of whatever the main pipeline computed. It is a second computation from the raw points, and the two computations must agree before anything is persisted.

## The ADD ledger

For one ADD the isolation delta is:

```
isolation delta = indicator(new degree = 0) - previous isolated neighbours touched
```

The first term is 1 when the newly added point has degree 0, meaning it is isolated on arrival. The second term subtracts 1 for each previously isolated neighbour the new point connected to, because adding an edge to an isolated point destroys that point's isolation. The formula is an exact integer identity, and it is backed by the kernel theorems of document 01 (`add_isolation_delta`, `after_old_count`, `old_vertex_after_add`).

The vocabulary is standard graph theory: a vertex's neighbourhood is the subgraph induced by its adjacent vertices, with open and closed conventions that must be pinned down before counting (source: https://mathworld.wolfram.com/GraphNeighborhood.html, jev weight 0.87; see also https://en.wikipedia.org/wiki/Neighbourhood_(graph_theory), jev weight 0.45, weak backing). Isolation itself has formal precedent in the literature: an isolating set in a graph is a set of vertices whose removal leaves no edges, studied as "total isolation" in recent work (source: https://link.springer.com/article/10.1007/s00010-024-01057-1, jev weight 0.72; PDF at https://link.springer.com/content/pdf/10.1007/s00010-024-01057-1.pdf, jev weight 0.80). The wayfinder usage is narrower, degree 0 versus connected, but the counting discipline is the same: say exactly which vertices are isolated before and after.

## The CHANGE ledger

For one CHANGE, neighbour degrees are recomputed as `old degree - old edge + new edge`, plus the moved point's own degree. Removing the old edge decrements the old neighbour's degree by 1; adding the new edge increments the new neighbour's degree by 1; the moved point's own degree is recomputed from its final edge set. The ledger names the affected neighbours explicitly (source doc: direct runtime additions section, primary project artifact). Naming them is what makes the ledger checkable by a reader: a reviewer can look at the named neighbours and verify each degree transition by hand. The kernel counterpart is `change_neighbour_ledger` and `change_isolation_delta`, with `change_neutral` covering the case where the change leaves isolation untouched.

## Halt before persistence

A mismatch between the ledger and the independent recount halts processing before persistence. Nothing half-checked ever lands in storage (source doc: direct runtime additions section, primary project artifact). This is a fail-closed posture, and it differs from a validation that merely logs a warning. If the two computations disagree, the transition is not recorded at all, and the discrepancy is surfaced to the operator rather than absorbed into a dataset.

## Scope limits

Multi-item changes and removals are outside this certificate and report not-applicable. The certificate covers exactly one ADD and exactly one CHANGE (source doc: direct runtime additions section, primary project artifact). Reporting not-applicable outside that envelope is the same honesty that runs through the whole integration: a certificate that pretended to cover batches would be covering nothing, because the exact identities it relies on are per-operation statements.

## Live confirmation

The live verification run exercised the ledger on a real deployment. A preview change produced isolated delta +2 with 11 unchanged anchors, and a preview add produced isolated delta +1 with 12 unchanged anchors, with no persisted map in either case (source doc: final publication section, primary project artifact). Historical maps 51 to 52 still compare on the old frame and produce the exact -2 ledger, confirming the recount reproduces recorded history rather than merely agreeing with itself on new data (source doc: final publication section, primary project artifact).
