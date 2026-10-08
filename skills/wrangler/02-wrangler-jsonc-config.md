# 02 Wrangler Configuration (wrangler.jsonc)

Scope: the config file, its schema, compatibility date and flags, binding shapes, environments, and type generation.

## The file and its format

The skill mandates `wrangler.jsonc` over TOML, noting that newer features are JSON-only (source doc). Cloudflare's configuration docs state the same: Wrangler recommends `wrangler.jsonc` for new projects, and some newer Wrangler features are only available to projects using a JSON config file (https://developers.cloudflare.com/workers/wrangler/configuration/, weight 0.94). The JSONC format allows comments, and the same docs note the configuration format is shared across Wrangler surfaces.

The first field should be the schema pointer, `"$schema": "./node_modules/wrangler/config-schema.json"`, which gives editors and agents the exact field list for the installed Wrangler version (source doc). The minimal config is then just `name`, `main` pointing at the entry file, and `compatibility_date` (source doc).

## compatibility_date and flags

The skill says to use a recent compatibility date, within 30 days, and to consult the compatibility-dates page (source doc). Cloudflare describes compatibility dates as opting into a specific version of the Workers runtime for the project (https://developers.cloudflare.com/workers/configuration/compatibility-dates/, weight 0.94). The date pins which runtime behaviors apply, so an old date silently disables newer platform features; updating it quarterly is listed as a best practice in the skill (source doc).

`compatibility_flags` sits next to the date. The skill's full-config example uses `["nodejs_compat"]` (source doc), the flag that turns on Node.js API compatibility inside the Worker runtime.

## Binding shapes

The full-config example in the skill enumerates the binding families an agent will meet most often (source doc): `vars` for plain environment variables, `kv_namespaces` with `binding` and `id`, `r2_buckets` with `binding` and `bucket_name`, `d1_databases` with `binding`, `database_name`, and `database_id`, `ai` with `binding`, `vectorize` with `binding` and `index_name`, `hyperdrive` with `binding` and `id`, `durable_objects.bindings` with `name` and `class_name`, and `triggers.crons` as a cron expression array.

Cloudflare's configuration reference documents these as typed objects, for example `r2_buckets` as an object list and a `build.command` field for a custom build step executed through `sh` on Linux and macOS and `cmd` on Windows (https://developers.cloudflare.com/workers/wrangler/configuration/, weight 0.94). When a binding shape is in doubt, the config-schema.json in node_modules is the ground truth for the installed version (source doc).

## Environments

The skill directs staging and production separation through config environments: define `env.staging` and `env.production` in the config (source doc). An environment overrides top-level fields; the skill's example gives staging its own `name` (`my-worker-staging`) and its own `vars.ENVIRONMENT` value. Commands select the environment with `--env staging`, and a `wrangler deploy --env staging` writes to the staging Worker, not production (source doc).

## Types from config

After any config change, run `wrangler types` so the TypeScript bindings match the config (source doc). The command generates `worker-configuration.d.ts` by default, accepts a custom output path such as `wrangler types ./src/env.d.ts`, and supports `wrangler types --check` for CI verification that types are current (source doc).

Cloudflare's TypeScript page states that type definitions are generated directly from workerd, the open-source Workers runtime, and recommends generating types via Wrangler (https://developers.cloudflare.com/workers/languages/typescript/, weight 0.96). The @cloudflare/workers-types package documents the same generation flow and notes that Wrangler can generate the type file itself (https://www.npmjs.com/package/@cloudflare/workers-types, weight 0.71). A third-party walkthrough describes `wrangler types` processing the configuration and emitting definitions that make `env.BACKEND`-style access type-safe (https://deepwiki.com/charliermarsh/uv-cloudflare-containers-example/5.1-wrangler-configuration, weight 0.15, weak, aggregator; corroborates but does not carry).

## Practical ordering

A config change is not done until types are regenerated (source doc): edit `wrangler.jsonc`, run `wrangler types`, recompile. Running `wrangler types --check` in CI catches a config and types drift before deploy (source doc, best practices).

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
