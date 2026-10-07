# 09 - Testing Durable Objects with Vitest

Scope: the test setup the skill requires (`@cloudflare/vitest-pool-workers`), the unit and integration test surface, and alarm testing.

## The quick start

The source doc's Testing Quick Start is minimal by design (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc):

```typescript
import { env } from "cloudflare:test";
import { describe, it, expect } from "vitest";

describe("MyDO", () => {
  it("should work", async () => {
    const stub = env.MY_DO.getByName("test");
    const result = await stub.addItem("test");
    expect(result).toBe(1);
  });
});
```

Three things are being exercised in those 8 lines: the `cloudflare:test` module provides a test `env` with real bindings; the DO namespace binding works through the same `getByName` routing as production code (doc 02); and the test calls an RPC method (doc 05), which means the test doubles as a contract check on the typed stub interface.

## The runner

The skill's When to Use list names the runner explicitly: "Writing tests with @cloudflare/vitest-pool-workers" (source doc). The npm package describes itself as the Workers Vitest integration: "write Vitest tests that run inside the Workers runtime... Supports both unit tests and integration tests... Provides direct access to Workers runtime APIs" (https://www.npmjs.com/package/@cloudflare/vitest-pool-workers, jev weight 0.50).

The upstream reference the skill ships underlines the point (this is the same skill family as the ground source, hosted in cloudflare/skills): "Use @cloudflare/vitest-pool-workers to test DOs inside the Workers runtime" (https://github.com/cloudflare/skills/blob/main/skills/durable-objects/references/testing.md, weight 0.52). The significance of "inside the Workers runtime" is fidelity: tests execute in workerd, not in a Node shim approximating it. The announcement post is explicit: "unit and integration tests via the popular testing framework, Vitest, that execute directly in our runtime, workerd" (https://blog.cloudflare.com/workers-vitest-integration/, weight 0.77). The docs page confirms the current surface: "Run unit and integration tests for Cloudflare Workers inside the Workers runtime using the Vitest integration" (https://developers.cloudflare.com/workers/testing/vitest-integration/, weight 0.82).

## What the docs example covers

The dedicated DO testing example is the canonical reference: "Write tests for Durable Objects using the Workers Vitest integration" (https://developers.cloudflare.com/durable-objects/examples/testing-with-durable-objects/, weight 0.96). It pairs with runnable fixtures in the workers-sdk repo under fixtures/vitest-pool-workers-examples/durable-objects (https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples/durable-objects, weight 0.74), which show the full wrangler vitest config plus class setup the quick start abbreviates.

## Alarm testing

Alarms are the part of DO behavior most likely to be under-tested, because they fire on a clock rather than on a request (doc 06). The review expectations that carry over from doc 06 into tests:

1. The alarm handler is idempotent, so a test that invokes it twice with the same storage state must observe no double-application (alarms reference, weight 0.95: at-least-once execution).
2. The replace semantics of setAlarm are testable directly: set one alarm, then set another, and assert the earlier time was replaced, not queued (source doc critical rule 7).
3. Self-rescheduling recurring handlers can be tested by invoking the handler and asserting the next alarm time moved forward (source doc handler comment).

Because tests run inside workerd with direct access to runtime APIs (npm package, weight 0.50), the test can drive `ctx.storage.setAlarm` states and invoke `alarm()` through the same stub surface production uses, rather than mocking storage.

## What good coverage looks like

Mapping the skill's critical rules to test assertions (source doc):

- Rule 1 and 2 (atoms, routing): two different names resolve to independent instances; the same name resolves to the same instance across two stubs.
- Rule 4 (constructor init): a fresh instance creates schema without throwing, and a second instantiation is also safe (IF NOT EXISTS semantics, doc 04).
- Rule 6 (persist first): after an operation, storage reflects the write even if the in-memory mirror is discarded, which a test can check by fetching through a second stub.
- Anti-pattern 4 (atomicity): a concurrent-ish sequence of interleaved operations leaves storage in the invariant state the writes were supposed to establish.

The Hono testing notes (weight 0.33, weak backing, labeled weak) describe the same env surface: the "cloudflare:test module at runtime which exposes the env passed in as the second argument during testing" (https://hono.dev/examples/cloudflare-vitest). Prefer the first-party sources above as authority; third-party tutorials are orientation only.
