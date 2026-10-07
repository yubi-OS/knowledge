# 05 Callable RPC: @callable, streaming, and timeouts

Scope: how the @callable decorator exposes agent methods to external clients over WebSocket RPC, streaming callables, error propagation and retry, timeouts, and the boundary where plain Durable Object RPC should be used instead.

Grounding note: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Other claims cite their dig source URL plus the jev weight.

## What @callable does

Callable methods let clients invoke agent methods over WebSocket using RPC. Mark a method with `@callable()` to expose it to external clients such as browsers, mobile apps, or other services (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92). The source doc's example is the minimal shape: `@callable() increment() { this.setState({ count: this.state.count + 1 }); return this.state.count; }` (source doc).

The decision table from the docs is the boundary discipline (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92):

| Caller | Mechanism |
|---|---|
| Browser or mobile client | `@callable()` over WebSocket |
| External service hitting the agent | `@callable()` over WebSocket |
| Worker calling an agent in the same codebase | Durable Object RPC, no decorator |
| Agent calling another agent | Durable Object RPC via `getAgentByName()` |

The decorator is specifically for WebSocket-based RPC from external clients. Internal calls skip it because Durable Object RPC does not pay the WebSocket serialization cost (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92). The source doc makes the same point in one line: `@callable()` methods are invoked over WebSocket (source doc).

## Calling from the client

Two client forms exist (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92):

- `agent.stub.increment()`, the recommended typed proxy.
- `agent.call("increment", ["new item"])`, the explicit name-plus-args form.

Arguments and return values must be JSON-serializable; functions, Dates, Maps, and Sets are invalid. Both sync and async methods work, and void methods still return a Promise that resolves when the server confirms execution (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92).

## Streaming callables

`@callable({ streaming: true })` marks a streaming method. The first parameter is a `StreamingResponse`; the body sends chunks with `stream.send(chunk)` and terminates with `stream.end(finalValue?)`. The client consumes it through `agent.call("generateText", [prompt], { stream: { onChunk, onDone, onError } })`, with a legacy flat `{ onChunk, onDone, onError }` format still supported (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92). The StreamingResponse surface is three methods: `send(chunk)`, `end(finalChunk?)`, and `error(message)`, where error sends the error and closes the stream (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92).

## Errors, disconnection, and retry

Errors thrown inside a callable propagate to the client as a rejected Promise (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92). If the WebSocket closes while calls are pending, pending calls reject with a "Connection closed" error. The client auto-reconnects; to retry after reconnection, `await agent.ready` then call again. The docs attach a warning that only idempotent operations should be retried this way, because a request may have executed on the server even though the response never arrived (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92).

## Timeouts and introspection

`CallOptions` is `{ timeout?: number, stream?: { onChunk?, onDone?, onError? } }`; passing `timeout: 5000` rejects a call that does not complete in time (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92). The decorator also accepts metadata: `@callable({ description: "Fetches user data" })`, and `CallableMetadata` is `{ description?: string, streaming?: boolean }`. `agent.getCallableMethods()` returns a `Map<string, CallableMetadata>` of every callable on the agent, useful for introspection and generated documentation (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92). TypeScript integration supports typed stubs via `useAgent<MyAgent>` and narrowing with `Omit<MyAgent, "internalMethod">` to exclude internal methods from the client type (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92).

## The setup trap this doc inherits

The source doc's gotcha that `experimentalDecorators` breaks `@callable()` traces to the build pipeline: Vite 8 transpiles with Oxc, which does not support TC39 decorators yet, so projects need the `agents/vite` plugin plus `tsconfig.json` extending `agents/tsconfig` (target ES2021). Without them the dev server fails with `SyntaxError: Invalid or unexpected token` (https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92). This is the highest-frequency setup failure for new agent projects and the reason the source doc lists the tsconfig flag first among its gotchas (source doc).
