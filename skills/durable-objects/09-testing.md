# 09 - Testing with vitest-pool-workers

Scope: the skill's testing stack, @cloudflare/vitest-pool-workers with the cloudflare:test module, how the Workers Vitest integration executes tests inside the real runtime, and what the docs say about testing Durable Objects and alarms.

## The skill's quick start

The source doc's Testing Quick Start is the minimal test (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md):

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

Two facts carry the whole pattern: the test imports env from cloudflare:test, and it drives the DO through the same binding (env.MY_DO) and the same deterministic stub creation (getByName) that production code uses (source doc). Testing a DO means testing it through its RPC surface, not by poking internals.

## The integration

The skill's When to Use list includes writing tests with @cloudflare/vitest-pool-workers (source doc), and its reference tree points at ./references/testing.md for Vitest setup, unit/integration tests, and alarm testing (source doc).

Cloudflare's Testing Durable Objects page says to use the Workers Vitest integration package to write tests for your Durable Objects, because the integration runs your tests inside the Workers runtime, giving direct access to Durable Object bindings and APIs, and shows installing Vitest and the Workers Vitest integration as dev dependencies (https://developers.cloudflare.com/durable-objects/examples/testing-with-durable-objects/, jev weight 0.96, page dated August 20, 2026).

The Vitest integration page states the capability plainly: run unit and integration tests for Cloudflare Workers inside the Workers runtime using the Vitest integration (https://developers.cloudflare.com/workers/testing/vitest-integration/, jev weight 0.83, page dated August 20, 2026).

## Why in-runtime testing matters

Cloudflare's announcement of the integration explains the difference from ordinary unit tests: the tests execute directly in the runtime, workerd, providing the ability to test anything related to your Worker, and for the first time allowing unit tests that run within the same runtime that Cloudflare runs in production (https://blog.cloudflare.com/workers-vitest-integration/, jev weight 0.78). For Durable Objects that matters especially: storage semantics, alarms, and stub behavior only exist inside the runtime, so a test that mocks them tests a fantasy. The workers testing overview lists the tool choice generally, including the Vitest integration (https://developers.cloudflare.com/workers/testing/, jev weight 0.76).

## Alarm testing

The source doc's reference tree explicitly scopes alarm testing into the testing reference (./references/testing.md, source doc). The alarms subsystem's documented behavior (at-least-once execution, automatic retry with exponential backoff from 2 seconds and up to 6 retries when the handler throws, https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95) is exactly what an alarm test should pin: a handler that throws must be retried, and an idempotent handler must tolerate re-execution.

## Known config interaction

One operational hazard surfaced in the digs, recorded with its weight: the Vitest pool validates wrangler.jsonc using its bundled wrangler, and version skew can reject valid configs. The recorded case is vitest-pool-workers 0.22.0 bundling wrangler 4.124.0, which rejected the DO-managed container form (scheduling_policy: "durable_object" with images) that wrangler 4.146.0 accepted, so a project using containers could not point the pool at its real config (https://github.com/cloudflare/workers-sdk/issues/16044, jev weight 0.72). This is a weak-backed community report, not official docs, labeled as such; its review value is that the test pool's wrangler and the deploy CLI's wrangler can disagree about the same file.

## Retrieval discipline

The skill's retrieval-first rule applies to testing too: API details of cloudflare:test helpers and the pool's config parsing may be outdated in pre-trained knowledge, so fetch the testing pages before setting up the suite (source doc; https://developers.cloudflare.com/durable-objects/examples/testing-with-durable-objects/, jev weight 0.96).

## Review checklist for a test suite

1. Tests run under the Workers Vitest integration, inside the runtime, not as mocked unit tests outside it (https://developers.cloudflare.com/durable-objects/examples/testing-with-durable-objects/, jev weight 0.96).
2. DO tests go through env bindings and stubs, exercising RPC methods the way the Worker does (source doc quick start).
3. Alarm behavior is covered: retry-on-throw and idempotency under at-least-once semantics (source doc references/testing.md; https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95).
4. The wrangler config the pool validates is the same one used for deploy, and version skew between the pool's bundled wrangler and the CLI is checked when config validation fails unexpectedly (https://github.com/cloudflare/workers-sdk/issues/16044, jev weight 0.72).

## Summary

Test Durable Objects with the Workers Vitest integration (@cloudflare/vitest-pool-workers, cloudflare:test), which runs tests inside workerd with real DO bindings and APIs. The quick-start shape is: import env from cloudflare:test, get a stub via getByName, call RPC methods, assert results. Cover alarms explicitly, including retry semantics, and remember that the test pool bundles its own wrangler for config validation, which can disagree with a newer CLI about the same config file.
