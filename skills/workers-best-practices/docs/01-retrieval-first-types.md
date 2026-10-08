# 01 Retrieval-first types

Scope: why and how to fetch the latest Workers types, wrangler-generated `Env`, and wrangler config schema before writing or reviewing any Workers code, instead of relying on baked-in knowledge.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## The retrieval-first discipline

The source doc states the core rule plainly: your knowledge of Cloudflare Workers APIs, types, and configuration may be outdated, and you should prefer retrieval over pre-training for any Workers code task, whether writing or reviewing (source doc). This is not decoration. The runtime ships new APIs on a cadence, type definitions move with it, and a reviewer who flags from memory risks flagging things that no longer apply and missing things that do.

The source doc names four retrieval sources and what each is for (source doc):

| Source | Use for |
|--------|---------|
| The Workers best-practices page | canonical rules, patterns, anti-patterns |
| `references/review.md` in the skill | API signatures, handler types, binding types |
| `node_modules/wrangler/config-schema.json` | config fields, binding shapes, allowed values |
| Cloudflare docs (search or the Workers docs root) | API reference, compatibility dates and flags |

## Fetching the latest workers types

The source doc gives a concrete command sequence: create a temp directory, run `npm pack @cloudflare/workers-types --pack-destination /tmp/workers-types-latest`, extract the tarball, and the types land at `package/index.d.ts` (source doc). Packing from the registry guarantees the latest published version; the source doc adds that if the project's `node_modules` has an older version, prefer the latest published version (source doc).

The npm package page backs the intent: `@cloudflare/workers-types` provides a typing environment that corresponds to the latest version of the Cloudflare Workers runtime, and the runtime manages backwards compatibility through compatibility dates (https://www.npmjs.com/package/@cloudflare/workers-types, jev weight 0.57). Because that weight is below 0.5, treat the npm page as weak backing here; the Cloudflare TypeScript docs are the stronger anchor: Workers is a first-class TypeScript platform, all runtime APIs are fully typed, and the type definitions are generated directly from workerd, the open-source Workers runtime. Cloudflare recommends generating types for your Worker by running `wrangler types` (https://developers.cloudflare.com/workers/languages/typescript/, jev weight 0.79).

## wrangler types and the Env interface

The generated-types rule matters because hand-written `Env` interfaces are on the source doc's anti-pattern list: they drift from the actual bindings in the wrangler config (source doc). `wrangler types` closes that gap by reading the config.

There is drift worth noting against the source doc. The source doc does not mention environment aggregation, but the Cloudflare changelog from 2026-01-13 records that `wrangler types` now generates types for all environments by default, aggregating bindings across your deployment environments for complete type coverage (https://developers.cloudflare.com/changelog/post/2026-01-13-wrangler-types-multi-environment/, jev weight 0.80). If a reviewer expects per-environment type files from an older workflow, that expectation is stale as of the January 2026 change; this is a dated correction grounded in the changelog, not the source doc.

The type definitions package itself is maintained at https://github.com/cloudflare/workers-types, where issues about type definitions should be raised in the workerd repository tagging the package (https://github.com/cloudflare/workers-types, jev weight 0.59).

## The wrangler config schema

For configuration questions the source doc points at `node_modules/wrangler/config-schema.json` for config fields, binding shapes, and allowed values (source doc). The wrangler configuration docs are the web counterpart and add a rule the corpus carries into the configuration doc: Cloudflare recommends `wrangler.jsonc` for new projects, and some newer Wrangler features are only available to projects using a JSON config file (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.85). The same page is where the `$schema` key wired to `config-schema.json` appears in the canonical example (see doc 08).

## What a reviewer actually does

In review practice the retrieval step comes first for a reason: check types, config, patterns, and security against the fetched current state, not against memory (source doc, Review Workflow step 1 and step 3). A practical ordering from the source doc and the dig set:

1. Pack the latest `@cloudflare/workers-types` and locate `package/index.d.ts` (source doc).
2. Run `wrangler types` so `Env` is generated from the live config, not hand-maintained (source doc; https://developers.cloudflare.com/workers/languages/typescript/, jev weight 0.79).
3. Open `node_modules/wrangler/config-schema.json` for any config field or binding shape under question (source doc).
4. Fetch the best-practices page for the canonical rules before flagging (source doc; https://developers.cloudflare.com/workers/best-practices/workers-best-practices/, jev weight 0.92).

Framework routers do not change the retrieval rule. Hono documents its own Workers setup with wrangler handling compilation so you can write TypeScript (https://hono.dev/docs/getting-started/cloudflare-workers, jev weight 0.41), but that weight is weak backing; the retrieval discipline itself comes from the source doc, and the framework choice does not exempt a reviewer from fetching current types.

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (retrieval sources table, fetch-latest-types command, principles).
- Digs: 2 queries, 12 results weighted, 6 kept at weight 0.4 or higher.
