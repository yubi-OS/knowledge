# Data Access Anti-Patterns

Scope: Backend data-access fixes: N+1 queries, unbounded fetching and pagination, composite index design with EXPLAIN ANALYZE, and connection pool exhaustion.

## N+1 queries

The source doc's example is an ORM loop that issues one query per task to fetch each task's owner:

```typescript
// BAD: N+1 - one query per task for the owner
const tasks = await db.tasks.findMany();
for (const task of tasks) {
  task.owner = await db.users.findUnique({ where: { id: task.ownerId } });
}

// GOOD: Single query with join/include
const tasks = await db.tasks.findMany({ include: { owner: true } });
```

The fix is to replace the per-row round trip with a single joined or eagerly-included query. A guest post by Kevin Gilpin on the Rails Tutorial news site walks through eager loading and the N+1 problem and reaches the same conclusion: the ORM's lazy loading per association is the mechanism that manufactures the N+1, and eager loading collapses it into one query (w 0.62, [news.railstutorial.org](https://news.railstutorial.org/eager-loading)). The remaining N+1 dig results (an observability guide at w 0.31, an OpenReplay explainer at w 0.32, and several framework-specific posts at 0.25 to 0.33) all fall below the 0.5 authority line and agree with, but do not strengthen, the source doc.

The source doc's red flags list makes N+1 patterns in new data fetching code an explicit review blocker, and its verification checklist requires "No N+1 queries in new data fetching code" after any change.

## Unbounded data fetching

The source doc's second anti-pattern is fetching all records where the caller needs one page:

```typescript
// BAD: Fetching all records
const allTasks = await db.tasks.findMany();

// GOOD: Paginated with limits
const tasks = await db.tasks.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

"List endpoints without pagination" appears in the source doc's red flags list, which makes this a review-level check rather than a debugging exercise: scan new list endpoints for a `take`/`limit` and an ordering.

## Indexes: the plan is the measurement

The source doc's stance is that "add an index" is the guess and the query plan is the measurement. Run `EXPLAIN ANALYZE` on the query, and read 3 things from the output:

| What you see | What it means |
|---|---|
| Seq Scan on a large table where you expected an index | No usable index for this predicate |
| Estimated rows= off from actual by an order of magnitude | Stale statistics; the planner is choosing on bad information |
| A Sort node above the scan | The index covers the filter but not the ORDER BY |

Index for the shape of the query, not the column in isolation. In a composite index, equality columns come first, then the range or sort column:

```sql
CREATE INDEX idx_tasks_owner_created ON tasks (owner_id, created_at DESC);
```

The strongest dig on this point (w 0.43, weak, [milanjovanovic.tech](https://milanjovanovic.tech/blog/how-to-design-the-right-sql-index)) demonstrates the same rule with numbers: an index on (issue_id, user_id, created_at DESC) moved all 3 conditions into the index condition and removed the sort, taking a demo query from 16.6ms to 0.04ms. The weak weighting means treat the magnitude as illustration, not citation; the column-order rule itself is carried by the source doc and is standard practice.

The source doc also lists when an index will NOT help: low selectivity on the dominant value (a sequential scan is genuinely cheaper; a partial index serves the rare-value case), leading wildcard LIKE terms (a B-tree cannot seek without a prefix; needs trigram or full-text), functions on the column (index the expression instead), and write-heavy tables (every index taxes every INSERT and UPDATE; measure the write cost, not just the read gain). Re-run EXPLAIN ANALYZE after adding the index: an index that did not change the plan is a revert, and it still costs on every write.

## Connection pool exhaustion

The source doc gives the signature: every endpoint slows at once, the slow time is spent waiting for a connection rather than executing, and the database reports mostly idle sessions. The fix pattern is one pool per process, sized against the database's ceiling:

```typescript
const pool = new Pool({
  max: 10,                        // instances x max must stay under max_connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000, // fail fast instead of queueing forever
});
```

Two rules from the source doc: bigger is not faster (a pool larger than what the database can execute concurrently just relocates the queue from your app to the database, where it is harder to see), and when instance count is unbounded (serverless, autoscaling), a multiplexing proxy such as pgbouncer or RDS Proxy is the fix, not a higher max. The red flags list treats "raise the pool size" without finding what holds connections as a blocker.

## What to remember

1. N+1: one query per row in a loop; fix with join or eager include (source doc; w 0.62).
2. Every list endpoint needs a limit and an order (source doc).
3. EXPLAIN ANALYZE before and after any index change; read Seq Scan, rows estimate error, and Sort nodes (source doc).
4. Composite index order: equality columns first, then range or sort (source doc; w 0.43).
5. Pool sizing is bounded by the database's max_connections divided by instance count; multiplex when instances are unbounded (source doc).
