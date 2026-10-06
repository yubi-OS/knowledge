# 01 Retrieval-first stance

Scope: the skill's core operating rule, that live retrieval replaces baked-in knowledge when citing Cloudflare numbers, API signatures, and configuration options, plus the four retrieval channels and the docs-over-references resolution order.

## The rule itself

The source doc (yubi-OS/yubiOS skills/cloudflare/SKILL.md) states the stance plainly: "Your knowledge of Cloudflare APIs, types, limits, and pricing may be outdated. Prefer retrieval over pre-training". The references bundled with the skill are "starting points, not source of truth". This makes the skill unusual: its first instruction is not how to build, but how to find out what is true today. The Calibration section of the source doc reinforces the point: a limit or price read from any source older than the current retrieval is "expired, not stale-but-usable".

## The four retrieval channels

The source doc's Retrieval Sources table names four channels, each mapped to a use:

1. Cloudflare docs, fetched through the Cloudflare MCP `docs` tool or at https://developers.cloudflare.com/ (weight 0.97, https://developers.cloudflare.com/). Use it for limits, pricing, API reference, compatibility dates and flags. The docs site is actively maintained; the changelog page at https://developers.cloudflare.com/changelog/ (weight 0.94) lists product changes within days, and its front page on 2026-10-06 showed a DNS records quota warning change dated 1 day earlier, which is the kind of freshness the skill expects you to retrieve rather than remember.
2. Workers types, obtained by `npm pack @cloudflare/workers-types` or by reading `node_modules`. The npm package page (weight 0.78, https://www.npmjs.com/package/@cloudflare/workers-types) explains why the package exists: it is not always possible or desirable to modify tsconfig.json to include all Workers types, so the package provides importable versions usable with no tsconfig setup. The upstream README in the workerd repo (weight 0.88, https://github.com/cloudflare/workerd/blob/main/npm/workers-types/README.md) carries the same statement.
3. Wrangler config schema at `node_modules/wrangler/config-schema.json`, for config fields, binding shapes, and allowed values. The Wrangler configuration docs (weight 0.97, https://developers.cloudflare.com/workers/wrangler/configuration/) show the schema wired into a real config file through the `$schema` key, next to `name`, `main`, and a `compatibility_date` set to the current date.
4. Product changelogs at https://developers.cloudflare.com/changelog/ (weight 0.94), for recent changes to limits, features, and deprecations.

## Types come from the runtime, not from memory

The TypeScript docs (weight 0.97, https://developers.cloudflare.com/workers/languages/typescript/) state that all APIs provided in Workers are fully typed and that type definitions are generated directly from workerd, the open-source Workers runtime, and recommend generating types for a Worker by running `wrangler types`. This grounds the skill's insistence on type retrieval: the types are a build artifact of the runtime version, not a fixed vocabulary. The workers-types package adds a coupling the skill expects you to respect: compatibility dates affect which runtime types are available, so you must match the workers-types entrypoint to the compatibility date set in the wrangler config (weight 0.69, https://www.npmjs.com/package/@cloudflare/workers-types?activeTab=dependents).

## Resolution order

The source doc fixes the arbitration rule: when a bundled reference file and the docs disagree, trust the docs, especially for numeric limits, pricing tiers, type signatures, and configuration options. The API Reference index (weight 0.97, https://developers.cloudflare.com/api/) and the Fundamentals API reference page (weight 0.92, https://developers.cloudflare.com/fundamentals/api/reference/, which documents rate limits, permissions, SDKs, and token templates) are the endpoints of that rule: they are the live sources a conflicting reference file loses to.

## Failure handling

The source doc's false-positive rule says a failed retrieval is never permission to cite baked-in knowledge. The claim fails openly as "cannot cite without retrieval" rather than being guessed. In practice this means a corpus author or agent working under this skill either retrieves a number from the four channels or omits the claim entirely.

A weakly weighted secondary source (weight 0.17, https://deepwiki.com/cloudflare/cloudflare-docs/5.1-wrangler-cli-and-configuration) adds context that Wrangler supports both TOML and JSON config formats and recommends wrangler.jsonc for new projects. That is weak backing (0.17), so treat the JSON recommendation as unverified until confirmed against the docs channel above.
