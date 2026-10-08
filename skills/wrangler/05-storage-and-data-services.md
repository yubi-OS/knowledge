# 05 Storage and Data Services via CLI

Scope: KV, R2, D1, Vectorize, and Hyperdrive management commands and their config bindings.

## KV (key-value store)

Namespace management (source doc): `wrangler kv namespace create MY_KV`, `wrangler kv namespace list`, and `wrangler kv namespace delete --namespace-id <ID>`. Key operations (source doc): `wrangler kv key put --namespace-id <ID> "key" "value"`, with `--expiration-ttl 3600` for expiry in seconds, `wrangler kv key get`, `wrangler kv key list`, `wrangler kv key delete`, and `wrangler kv bulk put --namespace-id <ID> data.json` for bulk import from JSON.

Cloudflare's KV commands reference covers the same surface: managing namespaces, keys, and bulk operations with Wrangler (https://developers.cloudflare.com/kv/reference/kv-commands/, weight 0.94). The config binding is `kv_namespaces` with `binding` and `id` (source doc), and the Wrangler configuration reference lists `kv_namespaces` among its top-level binding fields (https://developers.cloudflare.com/workers/wrangler/configuration/, weight 0.94).

## R2 (object storage)

Bucket management (source doc): `wrangler r2 bucket create my-bucket`, optionally with `--location wnam` as a location hint, `wrangler r2 bucket list`, `wrangler r2 bucket info my-bucket`, `wrangler r2 bucket delete my-bucket`. Object operations (source doc): `wrangler r2 object put my-bucket/path/file.txt --file ./local-file.txt`, `wrangler r2 object get`, `wrangler r2 object delete`.

Cloudflare's R2 wrangler-commands reference documents the same surface and adds flags such as `--storage-class` as the default storage class for uploaded objects, `--jurisdiction` (alias `--J`) for the jurisdiction of a new bucket, and `--use-remote` to use a remote binding (https://developers.cloudflare.com/r2/reference/wrangler-commands/, weight 0.95). The config binding is `r2_buckets` with `binding` and `bucket_name` (source doc).

## D1 (SQL database)

Database management (source doc): `wrangler d1 create my-database` with optional `--location wnam`, `wrangler d1 list`, `wrangler d1 info my-database`, `wrangler d1 delete my-database`.

SQL execution (source doc): `wrangler d1 execute my-database --remote --command "SELECT * FROM users"`, `--file ./schema.sql` for a file, and `--local` to execute against the local database. Migrations (source doc): `wrangler d1 migrations create my-database create_users_table`, `wrangler d1 migrations list my-database --local`, then `wrangler d1 migrations apply my-database --local` or `--remote`. Export (source doc): `wrangler d1 export my-database --remote --output backup.sql`, with `--no-data` for schema-only export.

The config binding carries `binding`, `database_name`, `database_id`, and `migrations_dir` (source doc), which is how `migrations apply` finds its files.

## Vectorize (vector database)

Index management (source doc): `wrangler vectorize create my-index --dimensions 768 --metric cosine`, or with a preset such as `--preset @cf/baai/bge-base-en-v1.5` that auto-configures dimensions and metric, plus `wrangler vectorize list`, `wrangler vectorize get my-index`, `wrangler vectorize delete my-index`. Vector operations (source doc): `wrangler vectorize insert my-index --file vectors.ndjson` for NDJSON input and `wrangler vectorize query my-index --vector "[0.1, 0.2, ...]" --top-k 10`.

Cloudflare's Vectorize wrangler-commands reference documents creating, managing, and querying Vectorize indexes through the CLI (https://developers.cloudflare.com/vectorize/reference/wrangler-commands/, weight 0.94). The config binding is `vectorize` with `binding` and `index_name` (source doc).

## Hyperdrive (database accelerator)

Config management (source doc): `wrangler hyperdrive create my-hyperdrive` with either explicit flags (`--origin-host db.example.com`, `--origin-port 5432`, `--database my-database`, `--origin-user db-user`, `--origin-password "$DB_PASSWORD"`) or a `--connection-string "$HYPERDRIVE_CONNECTION_STRING"`; then `wrangler hyperdrive list`, `wrangler hyperdrive get <HYPERDRIVE_ID>`, `wrangler hyperdrive update <HYPERDRIVE_ID> --origin-password "$DB_PASSWORD"`, and `wrangler hyperdrive delete`.

Note the secret hygiene pattern the skill itself models: passwords arrive from environment variables, never as literals (source doc). Cloudflare's Hyperdrive wrangler-commands reference covers creating and managing Hyperdrive configurations via the CLI (https://developers.cloudflare.com/hyperdrive/reference/wrangler-commands/, weight 0.93). The config binding requires `compatibility_flags: ["nodejs_compat"]` alongside the `hyperdrive` entry with `binding` and `id` (source doc).

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
