# 02 Configuration rules

Scope: the five configuration rules from the source doc: compatibility date freshness, the `nodejs_compat` flag, `wrangler types` for `Env`, `wrangler secret put` for secrets, and `wrangler.jsonc` over other config formats.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## Compatibility date

The source doc rule: set `compatibility_date` to today on new projects and update it periodically on existing ones (source doc). The mechanism behind the rule is documented: a compatibility date opts a Worker into a specific version of the Workers runtime (https://developers.cloudflare.com/workers/configuration/compatibility-dates/, jev weight 0.89). A stale date pins old runtime behavior, which is why the source doc treats it as a per-review check rather than a one-time setup task. The canonical example on the wrangler configuration page shows the date sitting at the top of `wrangler.jsonc` with the comment "Set this to today's date" (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.86).

## nodejs_compat

The source doc rule: enable the `nodejs_compat` flag, because many libraries depend on Node.js built-ins (source doc). The docs confirm the mechanics: Node.js APIs not yet supported in the Workers runtime are polyfilled via Wrangler using unenv; when the `nodejs_compat` compatibility flag is enabled and the Worker's compatibility date is 2024-09-23 or later, Wrangler applies this automatically (https://developers.cloudflare.com/workers/runtime-apis/nodejs/, jev weight 0.84). That pairs two config fields the source doc lists separately: the flag and the date interact, so a review that checks one should check the other.

The ecosystem context has moved the right way. Cloudflare reports hundreds of new Node.js APIs became available over the course of a year, making it easier to run existing Node.js code on Workers (https://blog.cloudflare.com/nodejs-workers-2025/, jev weight 0.76). That is marketing-adjacent (a vendor blog), so weigh it accordingly, but it is Cloudflare's own engineering blog and it corroborates the direction the source doc assumes.

## wrangler types for Env

The source doc rule: run `wrangler types` to generate `Env`; never hand-write binding interfaces (source doc). Hand-written `Env` is on the anti-pattern list because it drifts from the actual bindings declared in the config (source doc). The retrieval discipline in doc 01 covers the command's current behavior, including the January 2026 multi-environment aggregation change (https://developers.cloudflare.com/changelog/post/2026-01-13-wrangler-types-multi-environment/, jev weight 0.80).

## Secrets: wrangler secret put, never in source or config

The source doc rule: use `wrangler secret put` and never hardcode secrets in config or source (source doc). The docs define what a secret is and why the rule exists: secrets are environment variables whose values are not visible in Wrangler or the Cloudflare dashboard after you define them, so sensitive data such as passwords or API tokens is protected from casual inspection (https://developers.cloudflare.com/workers/configuration/secrets/, jev weight 0.93). The environment-variables page carries the same definition and contrasts secrets with plaintext environment variables (https://developers.cloudflare.com/workers/configuration/environment-variables/, jev weight 0.94).

Local development has its own surface: put secrets for local dev in a `.dev.vars` file or a `.env` file in the same directory as the Wrangler configuration file (https://developers.cloudflare.com/workers/local-development/environment-variables/, jev weight 0.90). A reviewer should therefore treat a credential literal inside `wrangler.jsonc` as a finding even when the file is not committed, because the config file is the declared home for non-secret settings only (see below).

## wrangler.jsonc

The source doc rule: use JSONC config for non-secret settings; newer features are JSON-only (source doc). The docs back it directly: Cloudflare recommends `wrangler.jsonc` for new projects, and some newer Wrangler features are only available to projects using a JSON config file; the configuration format is the same across both languages, only the syntax differs (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.85). The same page states it is best practice to treat the Wrangler configuration file as the source of truth for configuring a Worker (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.87), which is the principle underneath the `wrangler types` rule: config first, generated types second, hand-written interfaces never.

## Review checklist for config

From the source doc's Review Workflow step 4 and the rules table (source doc), a config pass checks:

1. `compatibility_date` set to today on new projects, recent on existing ones.
2. `nodejs_compat` enabled where libraries need Node built-ins (paired with a date of 2024-09-23 or later for automatic polyfills, https://developers.cloudflare.com/workers/runtime-apis/nodejs/, jev weight 0.84).
3. `Env` generated by `wrangler types`, not hand-written.
4. No secrets in source or config; secrets managed with `wrangler secret put`, local ones in `.dev.vars` or `.env` (https://developers.cloudflare.com/workers/configuration/secrets/, jev weight 0.93).
5. Config in `wrangler.jsonc` with a `$schema` reference (see doc 08).

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (Configuration rules table, anti-patterns table, Review Workflow).
- Digs: 2 queries, 12 results weighted, 6 kept at weight 0.4 or higher.
