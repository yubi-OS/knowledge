# 08 The review workflow

Scope: the source doc's 8-step review workflow, the type and config checks it drives, the tooling that validates them, and the principles that govern what a reviewer flags.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## The 8 steps

The source doc defines the workflow in order (source doc):

1. Retrieve: fetch the latest best-practices page, workers types, and wrangler schema (doc 01).
2. Read full files, not just diffs; context matters for binding access patterns (source doc).
3. Check types: binding access, handler signatures, no `any`, no unsafe casts (source doc).
4. Check config: `compatibility_date`, `nodejs_compat`, observability, secrets, binding-code consistency (doc 02, doc 05).
5. Check patterns: streaming, floating promises, global state, serialization boundaries (doc 03, doc 06).
6. Check security: crypto usage, secret handling, timing-safe comparisons, error handling (doc 07).
7. Validate with tools: `npx tsc --noEmit`, lint for `no-floating-promises` (source doc).
8. Reference rules: the skill's `references/rules.md` for each rule's correct pattern (source doc).

The steps are ordered so that mechanical validation (7) runs after human judgment (2 through 6), and retrieval (1) runs before any judgment at all. The principles section justifies the order: be certain, retrieve before flagging; if unsure about an API, config field, or pattern, fetch the docs first (source doc).

## Why full files, not diffs

Step 2 has a concrete failure mode it prevents. Binding access patterns and module-level state are file-scoped, not diff-scoped: a small diff can introduce a module-level variable or rename a binding while the review sees only the changed lines. The source doc's instruction to read full files exists because binding-code consistency (step 4) is a cross-file property between `wrangler.jsonc` and every `env.X` access in the code (source doc).

## Type checks

Step 3 checks binding access, handler signatures, `any`, and unsafe casts (source doc). The anti-pattern table supplies the specific list (source doc):

- `any` on `Env` or handler params: defeats type safety for all binding access.
- `as unknown as T` double-cast: hides real type incompatibilities; fix the design.
- Hand-written `Env` interface: drifts from actual wrangler config bindings.
- `implements` on platform base classes instead of `extends`: legacy, loses `this.ctx` and `this.env`; applies to `DurableObject`, `WorkerEntrypoint`, `Workflow`.
- `env.X` inside a platform base class: should be `this.env.X` in classes extending `DurableObject`, `WorkerEntrypoint`, and similar.

## Config validation and the schema

Step 4 validates the config file. The wrangler configuration page's canonical example wires validation to the schema itself: `{ "$schema": "./node_modules/wrangler/config-schema.json", "name": "my-worker", "main": "src/index.js", "compatibility_date": "2026-08-07" ... }` (https://developers.cloudflare.com/workers/wrangler/configuration/, jev weight 0.86). The `$schema` reference is what makes editor and CI validation use the same schema file the source doc names for config fields, binding shapes, and allowed values (source doc). Third-party platform docs follow the same shape, treating `wrangler.jsonc` as the per-app config file with a committed example template (https://docs.seeksaas.com/docs/configuration/wrangler/, jev weight 0.73).

## Tool validation

Step 7 names the two tools (source doc). The lint rule's own documentation explains what it catches: a floating Promise is one created without any code set up to handle the errors it might throw, which causes improperly sequenced operations and ignored rejections (https://typescript-eslint.io/rules/no-floating-promises/, jev weight 0.51). That weight is marginal; the runtime-side consequence (cancellation on invocation completion) is the stronger backing and lives in doc 06 (https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.93). `npx tsc --noEmit` is the typecheck half of the same gate (source doc).

## Evidence and focus

The source doc's principles govern how findings are reported (source doc):

- Be certain: retrieve before flagging; fetch the docs when unsure.
- Provide evidence: reference line numbers, tool output, or docs links.
- Focus on what developers will copy: Workers code in examples and docs gets pasted into production.
- Correctness over completeness: a concise example that works beats a comprehensive one with errors.

The companion runtime-patterns reference in the Cloudflare skills repo documents preferred patterns and common mistakes per affected behavior, with retrieve links for uncertain APIs (https://github.com/cloudflare/skills/blob/main/skills/workers-best-practices/references/runtime-patterns.md, jev weight 0.72).

## Scope boundaries

The source doc scopes this skill to Workers-specific best practices and code review; Durable Objects route to the durable-objects skill, Workflows to the Rules of Workflows page (https://developers.cloudflare.com/workflows/build/rules-of-workflows/), and Wrangler CLI commands to the wrangler skill (source doc). The frontmatter description is the boundary: every use stays inside it, and anything beyond it is a different skill's job (source doc).

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (Review Workflow, anti-patterns table, Principles, Scope, Guidelines).
- Digs: 2 queries, 12 results weighted, 3 kept at weight 0.4 or higher.
