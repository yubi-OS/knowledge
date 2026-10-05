# Reading ledgers across chained baselines

**Scope:** Why a chained improvement round spreads its outcome rows across many baseline_ids, why per-baseline queries return fragments, and how frame-scoped reads gather every row on one frozen frame.

## The round 11 failure

Round 11 read its outcome ledger mid-round and got zero rows back. The query was not wrong; it was too narrow. Per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18), a chained round spreads its rows across many baseline_ids, and `GET /api/outcomes?baseline_id=` sees exactly one link of the chain. Mid-round, the current baseline had no rows yet and the earlier rows sat under earlier baselines, so the read returned nothing while the ledger was full.

The shipped instrument fix: `GET /api/outcomes?frame_id=<frame>` gathers every row on one frozen frame, because the rows already carry frame_id. Lesson 27 encodes the rule: read the ledger by frame_id.

## The underlying data-model problem

This is the event-sourcing read-model problem in miniature. The event sourcing pattern stores every state change as an immutable event and derives current state by replaying or projecting those events (weight 0.77, https://microservices.io/patterns/data/event-sourcing.html; weight 0.52, https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing). The pattern's strength is the audit trail; its recurring weakness is that ad hoc queries against raw events need the right index and the right scope, or they return the wrong slice (weight 0.52, https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing). Aggregate design guidance makes the same point structurally: an aggregate is a consistency boundary, and queries that expect one aggregate's contents can miss data that logically belongs to the same business event but lives in a sibling aggregate (weight 0.72, https://docs.eventsourcingdb.io/best-practices/designing-aggregates/; weight 0.61, https://www.eventsourcing.dev/best-practices/designing-aggregates).

In the campaign's ledger, each outcome row is an event. The baseline_id is the aggregate key: every row belongs to exactly one baseline link. The frame is the business concept the reader actually wants: the whole round. The rows already carried frame_id, so the fix required no data migration, only a query keyed on the right boundary.

## The observability parallel: correlation ids

The same shape appears in production logging. When a request touches many services, each service emits its own log lines, and the lines are only joinable if they share a correlation id or trace id stamped at the boundary (weight 0.96, https://opentelemetry.io/docs/zero-code/obi/trace-log-correlation/). Guidance on log-trace correlation describes the failure mode when the id is missing or keyed inconsistently: an investigator greps by partial attributes and gets a fragment of the story, which looks exactly like "zero rows" when the fragment they get is empty (weight 0.54, https://oneuptime.com/blog/post/2026-01-30-log-trace-correlation/view). Structured-logging practice generalizes it: pick query keys that match the questions operators actually ask, and stamp them at write time, because retrofitting a join key onto already-written events is expensive or impossible (weight 0.54, https://archman.dev/docs/distributed-systems-and-microservices/observability/logs).

Round 11's rows were well-stamped: frame_id existed on every row from the start. The gap was in the query surface, which exposed the narrower key first.

## What to keep doing

1. Stamp every ledger row with both the fine-grained key (baseline_id) and the round-level key (frame_id) at write time. Retrofitting is the expensive case (weight 0.54, https://archman.dev/docs/distributed-systems-and-microservices/observability/logs).
2. Expose the round-level query surface (`?frame_id=`) alongside the per-link one, so mid-round reads do not silently return zero (lesson 27).
3. Treat a zero-row read from a ledger you know has data as a query-scope bug before treating it as a data bug.
4. When designing an append-only ledger, decide up front what the reader's unit of inspection is. Here the unit was the round, not the cycle, and the query API should have said so (weight 0.72, https://docs.eventsourcingdb.io/best-practices/designing-aggregates/).

## Source quality notes

Seven results scored at or above 0.5 (two event-sourcing pattern references, two aggregate-design guides, and three correlation-id references) and back the claims above. Five results scored below 0.5 (aggregator posts on event-driven architecture and terminology explainers) and were not used.
