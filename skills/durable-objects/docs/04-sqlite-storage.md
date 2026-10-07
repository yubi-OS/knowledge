# 04 - SQLite Storage: SQL First, KV Second, Init Once

Scope: the storage API surface the skill teaches (sql.exec synchronous SQL, async KV), the constructor initialization pattern with blockConcurrencyWhile, and the persistence-ordering rules that keep state correct.

## Two storage APIs, one recommendation

The source doc's Storage Operations section shows both APIs side by side (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc):

```typescript
// SQL (synchronous, recommended)
this.ctx.storage.sql.exec("INSERT INTO t (c) VALUES (?)", value);
const rows = this.ctx.storage.sql.exec<Row>("SELECT * FROM t").toArray();

// KV (async)
await this.ctx.storage.put("key", value);
const val = await this.ctx.storage.get<Type>("key");
```

The recommendation is explicit in the comment: SQL is synchronous and preferred. The SQLite storage API reference grounds the surface: "Durable Objects gain access to Storage API via the DurableObjectStorage interface and accessed by the DurableObjectState::storage property. For example, using sql.exec() a user can create a table and insert rows" (https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/, jev weight 0.95; same content mirrored at https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/index.md, weight 0.96).

The architecture rationale comes from the launch post: "Traditional cloud storage is inherently slow because it is accessed over a network... put your application code deep into the storage layer, such that your code runs where the data is stored" (https://blog.cloudflare.com/sqlite-in-durable-objects/, weight 0.82). That locality is why SQL calls can be synchronous and still fast.

The KV API remains first-class even on SQLite-backed objects; Cloudflare ships a dedicated example for reading and writing KV from within a DO (https://developers.cloudflare.com/durable-objects/examples/use-kv-from-durable-objects/, weight 0.95), and the blog notes KV data is backed by a hidden table (weight 0.84).

## Rule 4: initialize in the constructor, with blockConcurrencyWhile

Critical rule 4: "Initialize in constructor - Use blockConcurrencyWhile() for schema setup only" (source doc). The skill's basic pattern runs the CREATE TABLE inside `ctx.blockConcurrencyWhile` in the constructor:

```typescript
constructor(ctx: DurableObjectState, env: Env) {
  super(ctx, env);
  ctx.blockConcurrencyWhile(async () => {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL
      )
    `);
  });
}
```

The State API reference explains the mechanism: `blockConcurrencyWhile` is "executing async operations based on the current state of the Durable Object and using blockConcurrencyWhile to prevent that state from changing while yielding the event loop. If the callback throws an exception, the object will" be reset (https://developers.cloudflare.com/durable-objects/api/state/, weight 0.97). That last clause is the review-relevant hazard: a throwing initializer resets the object, so schema setup must be idempotent (IF NOT EXISTS) and must not perform work that can fail transiently on first boot.

The anti-pattern table sharpens the boundary (source doc): holding `blockConcurrencyWhile()` across `fetch()` or external I/O is NEVER, and using it on every request kills throughput. A GitHub docs issue (weight 0.34, weak backing) records the same consensus: "In practice, this is quite rare, and most use cases do not need blockConcurrencyWhile" outside initialization. A forum thread on calling it inside fetch (weight 0.05, weak backing) exists but should not be cited as guidance.

## Rules 6 and the atomicity hazard

Critical rule 6: "Persist first, cache second - Always write to storage before updating in-memory state" (source doc). Combined with the anti-pattern "Using await between related storage writes (breaks atomicity)" (source doc), the review rule is: batch related writes into one synchronous SQL transaction (or one awaitable storage batch), then update in-memory mirrors only after the durable write has committed. A crash between the durable write and the cache update is recoverable; the reverse ordering is not.

This is also why the SQL API's synchronicity is a feature, not a style choice: consecutive `sql.exec` calls without awaits in between execute as an ordered sequence on the object's SQLite database without interleaving with other events, which is exactly the atomicity the rule demands.

## Review checklist for storage

1. Schema creation happens once in the constructor under `blockConcurrencyWhile`, using IF NOT EXISTS (source doc pattern).
2. Hot-path code uses `sql.exec` without wrapping request logic in `blockConcurrencyWhile` (source doc anti-patterns).
3. Related writes are atomic (no interleaved awaits), then in-memory state updates (source doc rules 6 and anti-patterns).
4. KV use is deliberate: key-value for blobs and simple values, SQL for relational queries and multi-row transactions (SQL reference weight 0.95, KV example weight 0.95).
