# 05 - Wrangler Configuration and Migrations

Scope: how the durable-objects skill configures wrangler.jsonc for DO bindings and SQLite class migrations, and the newer exports-based lifecycle that is replacing the migrations array.

## The skill's quick reference

The source doc's Wrangler Configuration block is the canonical minimal config (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md):

```jsonc
// wrangler.jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "MY_DO", "class_name": "MyDurableObject" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyDurableObject"] }]
}
```

Two pieces are load-bearing: the durable_objects binding maps the Worker-side name MY_DO to the class MyDurableObject, and the migration declares the class as a SQLite-backed DO under tag v1 (source doc). The binding is what the Worker code accesses as env.MY_DO in the basic pattern (source doc).

## The migrations array

Critical rule 3 connects config to storage: use SQLite storage, configured with new_sqlite_classes in migrations (source doc). A class must be declared in a migration before it can hold state; the tag (v1) marks the migration step. Cloudflare's migrations reference is the retrieval target for the full migration vocabulary (create, delete, rename, transfer): it describes the declarative exports field used to manage Durable Object class lifecycle across those 4 operations (https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/, jev weight 0.91).

## The drift: exports is replacing migrations

Here the dig world has moved past the source doc, and the corpus records it as a dated correction. Cloudflare's migrations documentation now states that the current state of your exports map is the source of truth, and carries a caution: once a Worker has been deployed with exports, subsequent deploys cannot return to the legacy migrations array, so plan the transition accordingly (https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/index.md, jev weight 0.97, retrieved 2026-10-06). The source doc's migrations-array example remains the classic form, but new deployments should check the current exports field before locking in the legacy shape.

The Wrangler configuration page backs the same direction from the config side: Cloudflare recommends wrangler.jsonc for new projects, and some newer Wrangler features will only be available to projects using a JSON config file; the same page notes that Durable Object entries are mutually exclusive with migrations (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.88).

## Configuration reference

Cloudflare's Durable Objects configuration page is the skill's retrieval target for the full config surface (bindings, classes, migrations) beyond the minimal quick reference (https://developers.cloudflare.com/durable-objects/configuration/, jev weight 0.97).

## Review checklist for config

Reading the source doc's rules back onto config review (source doc):

1. Every exported DO class referenced in code must have a binding entry with matching name and class_name.
2. Every class holding state must appear in a migration as a SQLite class (new_sqlite_classes) or in the exports map for new-style projects.
3. Do not mix DO entries and migrations in one config (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.88).
4. A project that moved to exports must not revert to migrations (https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/index.md, jev weight 0.97).

## Testing-config interaction

One operational hazard surfaced in the digs: the Workers Vitest pool validates wrangler.jsonc with its own bundled wrangler version, and a mismatch can reject a valid config. The recorded case is vitest-pool-workers 0.22.0 bundling wrangler 4.124.0, which did not know the DO-managed container form (scheduling_policy: "durable_object" with images), while current wrangler 4.146.0 accepted the same file, so a project using containers could not point the pool at its real config (https://github.com/cloudflare/workers-sdk/issues/16044, jev weight 0.72). This is a weak-backed observation (GitHub issue, not official docs), labeled as such; it matters only when the test pool disagrees with the CLI about config validity.

## Summary

Minimal shape: a durable_objects binding plus a v1 migration declaring new_sqlite_classes. The storage rule (critical rule 3) is enforced through that migration. Note the dated correction: the declarative exports field now manages class lifecycle and is one-way once adopted, so check the current migrations reference before choosing between the exports map and the legacy migrations array.
