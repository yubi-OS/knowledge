# 03 State management: setState, validation, SQL, and sync

Scope: how agent state is defined, persisted, validated, broadcast, and read back; how the SQL API relates to it; and the practices that keep the two layers honest.

Grounding note: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Other claims cite their dig source URL plus the jev weight.

## What state is

Agent state is persistent, synchronized, bidirectional, type-safe, immediately consistent, thread-safe, and fast. It persists automatically to SQLite and survives restarts and hibernation; changes broadcast to all connected WebSocket clients instantly; both server and clients can update it; and the second generic parameter of `Agent<Env, State>` types it fully (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.91). The source doc's capabilities list compresses this to "SQLite-backed, auto-synced to clients via setState" (source doc).

`initialState` is applied lazily on first access, not on every wake: new agents use and persist it, existing agents load persisted state from SQLite, and if no `initialState` is defined then `this.state` is `undefined` until the code sets it (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). State is distinct from props: props are one-time initialization arguments, state is persistent and synced (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.91).

## Updating and validating

`setState()` does three things: saves to SQLite, broadcasts to all connected clients (except connections where protocol messages were suppressed), and triggers `onStateChanged()` afterward on a best-effort basis (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). State is stored as JSON, so it must be serializable: plain objects, arrays, and primitives only; dates should be ISO strings (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92).

The `source` parameter of `onStateChanged` distinguishes `"server"` (the agent called setState) from a `Connection` (a client pushed state over WebSocket), which is the guard used to avoid infinite loops and to trigger side effects only on client actions (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). For rejecting updates, `validateStateChange(nextState, source)` runs before persistence and broadcast, must be synchronous, and throwing aborts the update (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). The source doc's Counter example shows exactly this: throw when the next count would be negative (source doc). The docs add a caution: onStateChanged is a notification hook and must not be used for validation (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92).

## Client-side sync

React clients subscribe with `useAgent({ agent, name, onStateUpdate })` and push updates with `agent.setState()`; vanilla JS uses `AgentClient` from `agents/client` with the same options (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). The state flow is a star: every client's setState lands in the agent's SQLite-backed state, and every change broadcasts back out over WebSocket to all clients (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92).

Workflows can also drive state from steps: `step.updateAgentState(state)` replaces it, `step.mergeAgentState(partial)` merges, and `step.resetAgentState()` restores initialState; these are durable operations that persist even if the workflow retries (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92).

## The SQL API

Every agent instance has its own embedded SQLite database accessed via `this.sql`, a template-literal API: create tables, insert with parameterized values, and query with an optional TypeScript type argument; the result is always an array, and the type parameter does not validate the rows (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). Because the database runs in the same context as the agent, inserts and queries are effectively zero latency with no network round trip (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.91). The source doc's Core APIs table lists the same single-liner: `` this.sql`SELECT * FROM users WHERE id = ${id}` `` (source doc).

## Best practices

The state page's practices are concrete (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.91):

- Keep state small: it broadcasts on every change, so large collections belong in SQL with a counter or last-id in state.
- Split by shape: state for UI state, counters, active session data, and configuration; SQL for historical data, large collections, relationships, and queryable data.
- Avoid infinite loops: never setState in response to your own onStateChanged; check the `source` first.
- Use optimistic updates client-side, then confirm or reconcile in `onStateChanged`.
- Use state and SQL together as model context: pull history with SQL, feed it to the model call, and append the response back to history (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.91).

The through-line for the skill: `this.state` is the synced, small, hot layer; `this.sql` is the private, unbounded, per-instance store (source doc; https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92).
