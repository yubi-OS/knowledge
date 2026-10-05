# Build method and live lessons

Scope: the build ran as capability map approval, ideate-solo (7 variations), SPEC-AUTOMATIONS.md, five parallel implementation lanes, and advisor integration that also wrote the one module no lane covered; then live verification surfaced four operational lessons the same hour.

## The method

The build used the same method as the orchestrator: capability map approved in chat first, an ideate-solo design pass over 7 variations, a written SPEC (SPEC-AUTOMATIONS.md), then five parallel lanes:

- Lane A: registry, LLM runtime, database access layer (dbx).
- Lane B: prompt intake and the scheduler.
- Lane C: the lead machine port.
- Lane D: routes.
- Lane E: the console.

The advisor/integration lane reconciled cross-lane contracts and, notably, wrote the one module no lane covered: `jev-engine.js`, the stage engine itself. Integration also fixed contract gaps that only appear when lanes meet: a compare-and-set signature `updateAutomation(id, patch, expectedLastFiredAt)`, the lead dedupe accessors `getLeadByDedupeKey`/`getLeadByContactEmail`, `jev_leads.data_json`, and `llm_neurons` accounting. Final test count: 232 of 232 passing across lane suites, the engine, and end-to-end, all run against the merged tree.

The pattern has grounding: trunk-based development's argument is that frequent integration onto one trunk beats long-lived feature branches for integration risk (https://trunkbaseddevelopment.com/, weight 0.81; https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development, weight 0.69), and contract-first development is the standard way to make parallel streams independent until they meet (https://github.com/specmatic/specmatic-mcp-cdd-with-spec-kit, weight 0.73). The five-lane structure is a documented pattern elsewhere: many lanes, one integrator (https://jarvisorigin.com/architecture, weight 0.70, moderate backing, cited as a comparable lane-based build).

## Lesson 1: NOT NULL explicit-null trap, round two

The engine's direct task insert omitted `cost_usd`. Because the insert helper lists every column, a missing key binds as an explicit NULL, and D1 (SQLite) rejects that even when the column has `DEFAULT 0`: a DEFAULT clause does not make an INSERT that binds NULL succeed. The earlier `llm_neurons` fix had covered only lane A's insert path. Fix: default both NOT NULL numeric columns in `dbx.insertTask`. Rule now on record: ANY new NOT NULL column needs its insert-layer default in the same commit. SQLite's constraint semantics are the grounding: constraints reject the bound value regardless of defaults (https://sqlite.org/index.html, weight 0.77; constraint behavior reference https://zetcode.com/db/sqlite/constraints/, weight 0.20, weak backing).

## Lesson 2: binding vs REST response shapes

Llama 3.3 70B over the Workers binding speaks full chat.completion (`choices[0].message.content`); the REST API adds a `response` convenience string the binding may not carry. The extractor's last-resort `String(obj)` turned the entire response object into the literal text `[object Object]`, which then flowed downstream as if the model had said it. Fix: `textFrom` handles chat.completion plus nested shapes and never stringifies an object; `runLLM` attaches `raw_shape` (the JSON of the binding response, truncated to 400 chars) whenever text extraction comes back empty, so an undecidable model failure is diagnosable from the API alone. Workers bindings are the runtime's access layer for resources, which is why binding-first shape assumptions matter (https://developers.cloudflare.com/workers/runtime-apis/bindings/, weight 0.73).

## Lesson 3: the engine needed the UA lesson too

The `User-Agent` fix shipped earlier for gated dispatch (`jev-execute`) did not cover the engine's own fetch path, and GitHub 403'd the automation's tool stage. Fix: the engine always sends `User-Agent: jev-orchestrator/1 (+site)` unless the stage declares its own. The lesson generalizes: a runtime policy applied at one call site is not a runtime policy until it is applied at every call site that fetches.

## Lesson 4: Secrets Store ordering

A Worker binding that references a secret that does not exist yet fails the WHOLE deploy (Cloudflare error 10182). Bindings must be added only after the secret lands in the Secrets Store. The platform's own validation posture matches: wrangler validates required secrets before deploy succeeds when they are declared (https://developers.cloudflare.com/workers/configuration/secrets/, weight 0.82; https://developers.cloudflare.com/workers/wrangler/configuration/, weight 0.92, which documents deploy-time validation of configured secrets). A community thread on the local-mode variant documents the same failure class (https://github.com/cloudflare/workers-sdk/issues/9369, weight 0.15, weak backing, cited as the failure symptom, not the production path).

## The meta-lesson

All four lessons were found in live verification within the same hour as deploy (2026-10-01, roughly 07:05 to 07:12Z) and fixed the same hour. None of them were caught by the 232 tests: they live in the seams between module boundaries (insert helper vs schema, binding vs REST, one fetch path vs another, binding vs secret lifecycle). Parallel lanes produce exactly those seams, which is why the advisor integration pass plus live verification is not optional overhead but the method's load-bearing step.
