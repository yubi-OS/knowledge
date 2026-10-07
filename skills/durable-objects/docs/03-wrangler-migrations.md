# 03 - Wrangler Configuration and Class Migrations

Scope: the wrangler.jsonc shape the skill requires, the migrations array, the new_sqlite_classes rule, and where Cloudflare's docs have moved past the source doc.

## The skill's config block

The source doc's Quick Reference gives this as the canonical wrangler.jsonc shape (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc):

```jsonc
// wrangler.jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "MY_DO", "class_name": "MyDurableObject" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyDurableObject"] }]
}
```

Two invariants are packed into that snippet: every DO class a Worker calls needs a binding under `durable_objects.bindings` mapping a variable name to the class, and every new DO class needs a migration entry that declares how it was created. The critical rule "Use SQLite storage - Configure new_sqlite_classes in migrations" (source doc) makes SQLite-backed the default choice for new classes.

## What migrations actually do

The migrations reference documents the constraint behind the skill's rule: "The array new_sqlite_classes, which contains the new Durable Object class. You cannot enable a SQLite storage backend on an existing, deployed Durable Object class, so setting new_sqlite_classes on later migrations will fail with an error" (https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/index.md, jev weight 0.96). In other words, SQLite backing is decided at class creation time, not retrofitted. The legacy reference confirms the scope of the migrations array: "Use the legacy Wrangler migrations array to create, rename, delete, or transfer Durable Object classes" (https://developers.cloudflare.com/durable-objects/reference/durable-object-class-migrations-legacy/, weight 0.92).

The storage blog post corroborates the mechanics from the launch side: "instead of using new_classes, use new_sqlite_classes" and "KV data is stored into a hidden table" for SQLite-backed objects (https://blog.cloudflare.com/sqlite-in-durable-objects/, weight 0.84). That second detail matters for doc 04: the key-value Storage API keeps working on SQLite-backed classes because it is implemented over a hidden SQLite table.

## Drift note: the exports field

The dig surfaced a dated correction to the source doc. Current Cloudflare docs now describe a declarative path: "Use the declarative exports field in wrangler.json to manage Durable Object class lifecycle - create, delete, rename, and transfer Durable Object classes" (https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/, weight 0.90). This moves class lifecycle management out of the imperative migrations array for new projects. Dated correction, 2026 dig: the source doc teaches the migrations array, which still works and is the legacy path; new code on current docs can prefer the exports field, while existing deployments keep their migration history. Both references (0.92 legacy, 0.90 exports) come from the same docs tree, so this is a documented coexistence, not a contradiction.

## Operational hazards from the dig

- SQLite-backed DOs and `wrangler dev --remote` do not mix cleanly: the Workers SDK issue records the warning "[WARNING] SQLite in Durable Objects is only supported in local mode" for remote dev with a SQLite DO binding (https://github.com/cloudflare/workers-sdk/issues/9239, weight 0.62). Local dev is the supported mode for SQLite-backed classes.
- A Cloudflare community post (weight 0.09, weak backing) reports that new DO namespaces must use the SQLite storage backend as part of a broader move toward SQLite as the single backend; treat it as directional only, since the docs themselves are the authority on which backends new classes may use.
- Renames and deletes have ordering hazards (tombstones, avoid deleting persistent SQLite-backed data) discussed in third-party notes (https://laplusda.com/en/posts/cloudflare-durable-objects-exports-migration/, weight 0.10, weak backing). For review purposes, the safe rule from the first-party docs is: migrations are append-only history, and destructive class operations should be staged deliberately.

## Review checklist for config

When reviewing a DO change, check (source doc plus migrations reference, weight 0.96):

1. Every referenced class has a binding with a matching `class_name`.
2. A new class appears in a migration with `new_sqlite_classes` (or the new exports path), tagged in order (v1, v2, ...).
3. No later migration tries to convert an existing class to SQLite backing; that fails per the docs.
4. Compatibility date supports the features used, notably the RPC surface requiring >= 2024-04-03 (source doc critical rule 5, detailed in doc 05).
