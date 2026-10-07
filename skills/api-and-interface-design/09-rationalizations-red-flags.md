# 09 Rationalizations, Red Flags, and the Verification Checklist

Scope: the skill's self-check layer, the rationalization table that pre-answers the arguments against the rules, the red flag list that encodes the failure modes, and the verification checklist that turns the whole skill into an auditable pass. This is an internal-record subtopic grounded in the source doc itself; no external dig was run.

## The rationalization table

The source doc lists 10 rationalizations and answers each with the reality (all from the source doc):

| Rationalization | Reality |
|---|---|
| "We'll document the API later" | The types ARE the documentation. Define them first. |
| "We don't need pagination for now" | You will the moment someone has 100+ items. Add it from the start. |
| "PATCH is complicated, let's just use PUT" | PUT requires the full object every time. PATCH is what clients actually want. |
| "We'll version the API when we need to" | Breaking changes without versioning break consumers. Design for extension from the start. |
| "Nobody uses that undocumented behavior" | Hyrum's Law: if it's observable, somebody depends on it. Treat every public behavior as a commitment. |
| "We can just maintain two versions" | Multiple versions multiply maintenance cost and create diamond dependency problems. Prefer the One-Version Rule. |
| "Internal APIs don't need contracts" | Internal consumers are still consumers. Contracts prevent coupling and enable parallel work. |
| "Accepting the Idempotency-Key header is enough" | The header is the contract; storing the key against the result is the implementation. A key you accept but don't honour tells the client retrying is safe when it isn't. |
| "Our queue guarantees exactly-once delivery" | No queue does across a consumer crash. The broker's ack and your side effect are not in one transaction. Design for at-least-once with idempotent processing. |
| "Duplicate requests are rare" | They're correlated. Retries spike exactly when a dependency is degraded, the moment duplicates are most likely and most expensive. |

Two of these deserve emphasis because they are about probability, not preference. The exactly-once row is a structural claim: the broker's acknowledgment and your side effect cannot share a transaction, so the system must be designed for at-least-once delivery with idempotent processing (source doc). The "duplicate requests are rare" row is a correlation claim: retries spike exactly when a dependency is degraded, which is the moment duplicates are most likely and most expensive (source doc). Both rows push the same conclusion: idempotency is not an edge-case optimization, it is the design for the correlated failure mode.

## The red flags

The source doc's red flag list is the failure mode inventory, and each item maps to a doc in this corpus (all from the source doc):

- Endpoints that return different shapes depending on conditions (doc 03).
- Inconsistent error formats across endpoints (doc 03).
- Validation scattered throughout internal code instead of at boundaries (doc 04).
- Breaking changes to existing fields, type changes or removals (doc 05).
- List endpoints without pagination (doc 07).
- Verbs in REST URLs, `/api/createTask`, `/api/getUsers` (docs 05, 07).
- Third-party API responses used without validation or sanitization (doc 04).
- A `SELECT` for an idempotency key followed by an `INSERT`, that's a race, not a guard (doc 06).
- An idempotency key derived from a UUID, timestamp, or anything else regenerated per attempt (doc 06).
- The same key accepted with a different request body, silently returning the first response (doc 06).
- A key retention window shorter than the longest path that can re-deliver the request (doc 06).

The list is deliberately concrete enough to grep for: 4 of the 11 items are checkable by reading code for patterns (`SELECT` + `INSERT` pairs, `Date.now()` in key derivations, unpaginated `find` calls, verbs in route definitions). Treat it as a review checklist, not prose.

## The verification checklist

The source doc closes with a 12-item checklist to run after designing an API (all from the source doc):

1. Every endpoint has typed input and output schemas.
2. Error responses follow a single consistent format.
3. Validation happens at system boundaries only.
4. List endpoints support pagination.
5. New fields are additive and optional, backward compatible.
6. Naming follows consistent conventions across all endpoints.
7. API documentation or types are committed alongside the implementation.
8. State-changing endpoints either honour an idempotency key or are documented as unsafe to retry.
9. The key is claimed in one atomic operation, guarded by a unique constraint.
10. A reused key with a different payload fails loudly rather than replaying the wrong response.
11. The in-flight-duplicate response is a deliberate choice, 409, wait, or 202, rather than whatever falls out.
12. Key retention outlives the longest retry path, including dead-letter replay.

The structure is two halves. Items 1 through 7 cover the shape of the interface (types, errors, validation, pagination, evolution, naming, documentation) and correspond to docs 02 through 05 and 07. Items 8 through 12 are all idempotency, a full 5 of 12 items, which reflects the skill's own emphasis: honouring an idempotency key is where the money is lost (source doc, doc 06).

Note what the checklist does not ask. It does not ask whether the API is complete, fast, or feature-rich. Every item is a stability or safety property. That is the skill's scope statement in miniature: stable, well-documented interfaces that are hard to misuse (source doc, Overview).

## Using this doc

Run the checklist as a diff-level gate: every PR that adds or changes an endpoint answers all 12 items, and any "no" on items 8 through 12 must either fix the idempotency handling or explicitly document the endpoint as unsafe to retry (item 8's own escape hatch). The rationalization table is the review vocabulary: when someone argues for PUT over PATCH or for skipping pagination, the table's reality column is the standing answer.
