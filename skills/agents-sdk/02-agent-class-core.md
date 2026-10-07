# 02 The Agent class and its lifecycle

Scope: what the Agent class is, how instances map to Durable Objects, the lifecycle hooks, the core properties, and the full server-side and client-side API surface the skill's Core APIs table compresses.

Grounding note: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Other claims cite their dig source URL plus the jev weight.

## An Agent is a Durable Object subclass

The base class is imported from the `agents` package: `import { Agent, routeAgentRequest } from "agents"` and `export class MyAgent extends Agent<Env, State>` (source doc; https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90). The Agents API page is explicit about the underlying model: agents require Cloudflare Durable Objects, and each Agent can have millions of instances, where every instance is a separate micro-server that runs independently (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

Instance identity is the design center. An instance of an Agent is globally unique: given the same name, you always get the same instance. That is what removes the centralized session store: if the instance represents a user, team, or channel, its state lives in the instance itself, and a disconnected client can be routed back to the exact same agent and pick up where it left off (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

## Lifecycle hooks

The lifecycle, from the source doc's structure and confirmed by the Agents API and WebSockets pages, is: an instance wakes up (onStart), then serves HTTP (onRequest), WebSocket connections (onConnect, onMessage, onClose, onError), and email (onEmail), reacting to state changes with onStateChanged (source doc; https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90; hook signatures confirmed at https://developers.cloudflare.com/agents/runtime/communication/websockets/, jev 0.90).

| Hook | When it runs |
|---|---|
| `onStart(props?)` | Instance starts or wakes from hibernation, before connections |
| `onRequest(request)` | Each HTTP request to the instance |
| `onConnect(connection, ctx)` | A WebSocket connection is established |
| `onMessage(connection, message)` | Each WebSocket message |
| `onError(connection, error)` | A WebSocket error occurs |
| `onClose(connection, code, reason, wasClean)` | A WebSocket connection closes |
| `onEmail(email)` | An email is routed to the instance |
| `onStateChanged(state, source)` | State changes from server or client |

Two corrections to record against the source doc, dated 2026-10-06. The source doc's Counter example overrides `onStateUpdate(state, source)` on the server; the current docs name this server-side hook `onStateChanged(state, source)` (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92). The source doc's React example passes `onStateUpdate` to `useAgent`; the current docs use `onStateUpdate` there too for the client callback, so the client-side name stands while the server-side name is the drift point (https://developers.cloudflare.com/agents/runtime/lifecycle/state/, jev 0.92).

## Core properties and the API surface

Four properties are always on `this`: `this.env` (bindings), `this.ctx` (execution context), `this.state` (current persisted state), and `this.sql` (the SQLite template tag) (source doc; https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

The full server-side map from the Agents API page (jev 0.90): state via `setState()`, `onStateChanged()`, `initialState`; callable methods via the `@callable()` decorator; scheduling via `schedule()`, `scheduleEvery()`, `getScheduleById()`, `listSchedules()`; durable execution via `runFiber()`, `startFiber()`, `stash()`, `onFiberRecovered()`, `keepAlive()`, `keepAliveWhile()`; queue via `queue()`, `dequeue()`, `dequeueAll()`, `getQueue()`; WebSockets via `onConnect()`, `onMessage()`, `onClose()`, `broadcast()`; email via `onEmail()`, `replyToEmail()`; workflows via `runWorkflow()`, `waitForApproval()`; MCP client via `addMcpServer()`, `removeMcpServer()`, `getMcpServers()`; plus `getCurrentAgent()`, tracing via `wrapAISDK()`, diagnostics channels via `subscribe()`, sub-agents via `subAgent()`, and agents-as-tools via `runAgentTool()`.

The client side is its own API: `AgentClient` (WebSocket), `agentFetch()` (HTTP), `useAgent()` (React), and `useAgentChat()` (chat UI), all under the Client SDK (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

## The Counter example

The source doc's worked example defines `type State = { count: number }`, sets `initialState = { count: 0 }`, validates with `validateStateChange(nextState)` throwing on negative counts, observes with `onStateChanged`, exposes an `@callable() increment()` that calls `this.setState({ count: this.state.count + 1 })` and returns the new count, and wires `export default { fetch: (req, env) => routeAgentRequest(req, env) ?? new Response("Not found", { status: 404 }) }` (source doc). The quick start reproduces the same shape with increment, decrement, and reset callables (https://developers.cloudflare.com/agents/getting-started/quick-start/, jev 0.92).

The official quick example also shows typed client calls: `const agent = useAgent<MyAgent, State>({ agent: "my-agent", name: "user-123" })`, then `agent.stub.someMethod()` and `agent.setState({ count: 1 })`, with state syncing to the server and all clients (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).
