# 04 - SQLite Storage Operations

Scope: the two storage APIs a Durable Object exposes, the SQL-first recommendation, the persist-first rule, and the storage isolation model.

## Two APIs, one storage

The source doc's Storage Operations section shows both APIs side by side (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md):

```typescript
// SQL (synchronous, recommended)
this.ctx.storage.sql.exec("INSERT INTO t (c) VALUES (?)", value);
const rows = this.ctx.storage.sql.exec<Row>("SELECT * FROM t").toArray();

// KV (async)
await this.ctx.storage.put("key", value);
const val = await this.ctx.storage.get<Type>("key");
```

The SQL API is marked synchronous and recommended in the source doc (source doc). The KV API (put/get) is asynchronous and remains available alongside it. Cloudflare's SQLite-backed storage reference covers both: it is the API reference for SQLite-backed Durable Object storage, including the SQL API and key-value methods (https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/, jev weight 0.95).

## What the SQL API is

The SqlStorage interface encapsulates methods that modify the SQLite database embedded within a Durable Object, and it is accessible via the sql property of the DurableObjectStorage class (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/durable-objects/api/sqlite-storage-api.mdx, jev weight 0.90). The database is embedded in the object itself, which is where the latency property comes from: Cloudflare's blog post on the feature explains that traditional cloud storage is slow because it is accessed over a network and must synchronize many clients, while SQLite-backed Durable Objects put application code deep into the storage layer so code runs where the data is stored (https://blog.cloudflare.com/sqlite-in-durable-objects/, jev weight 0.82, published September 2024).

The source doc's basic pattern uses this directly in the constructor and in an RPC method (source doc):

- Schema setup: this.ctx.storage.sql.exec with a CREATE TABLE IF NOT EXISTS statement, wrapped in ctx.blockConcurrencyWhile (see doc 06 for the concurrency rule).
- Writes: sql.exec("INSERT INTO items (data) VALUES (?) RETURNING id", data) with parameter binding, then result.one().id to read the returned row.

Parameterized statements with placeholder binding are the shape shown in the source doc for user-supplied values (source doc).

## What the KV API is and when it fits

The storage.put / storage.get calls in the source doc are the async key-value surface over the same DO storage. Cloudflare's general storage reference describes what both APIs sit on: the Durable Object Storage API allows Durable Objects to access transactional and strongly consistent storage, and a Durable Object's attached storage is private to its unique instance and cannot be accessed by other objects (https://developers.cloudflare.com/durable-objects/api/storage-api/, jev weight 0.96). The privacy property is what makes per-entity modeling safe (doc 02): one atom's storage is unreachable from another atom.

## The persist-first rule

Critical rule 6 in the source doc: persist first, cache second. Always write to storage before updating in-memory state (source doc). The reason is the eviction model: the skill's anti-pattern list names storing critical state only in memory as forbidden because it is lost on eviction or crash (source doc). In-memory fields are a cache of the stored truth, never the truth itself.

## The atomicity rule

The paired anti-pattern: using await between related storage writes breaks atomicity (source doc). Related writes belong in one storage transaction, not as a sequence of awaited separate writes where a crash between steps leaves half a write. The source doc states the rule without prescribing the exact API; the SQLite-backed storage reference is the retrieval target for the current transaction mechanics (https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/, jev weight 0.95).

## SQLite as the default backend

Critical rule 3 in the source doc: use SQLite storage, configured via new_sqlite_classes in migrations (source doc). The wrangler side of that rule is doc 05. Cloudflare's get-started guide now builds the first Durable Object with SQLite storage and a companion Worker, making SQLite the documented default path for new objects (https://developers.cloudflare.com/durable-objects/get-started/, jev weight 0.97).

## Retrieval discipline

The skill's retrieval-first directive applies with full force here: API details for sql.exec, result shapes, and transaction semantics may be outdated in pre-trained knowledge, so fetch the SQLite storage API page before implementing storage logic (source doc; https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/, jev weight 0.95).

## Summary

Write with this.ctx.storage.sql.exec, synchronous and recommended; use storage.put/get for the async KV surface. Storage is transactional, strongly consistent, and private per instance. Persist to storage before touching in-memory state, and keep related writes atomic. New classes are declared as SQLite classes in the wrangler migration, and the embedded database means reads and writes run at storage-local latency.
