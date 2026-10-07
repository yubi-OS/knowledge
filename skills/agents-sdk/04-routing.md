# 04 Routing and instance addressing

Scope: the /agents/{agent}/{instance} URL scheme, routeAgentRequest, kebab-case name resolution, instance naming patterns, custom routing with basePath and getAgentByName, and the routing options that matter in production.

Grounding note: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Other claims cite their dig source URL plus the jev weight.

## The default scheme

Agents are addressed at `https://your-worker.workers.dev/agents/{agent-name}/{instance-name}`: the first segment is the agent class name, the second the unique instance ID (source doc; https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.88). Class names convert to kebab-case for URLs, and the router matches both the original and kebab-case forms, so `useAgent({ agent: "Counter" })` and `useAgent({ agent: "counter" })` both hit `/agents/counter/...` (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90). The source doc's table gives the canonical examples: Counter maps to `/agents/counter/user-123` and ChatRoom to `/agents/chat-room/lobby` (source doc).

`routeAgentRequest(request, env)` is the entry point in the Worker's fetch handler; it returns a Response when a route matches or undefined otherwise, letting the handler fall through to its own 404 (source doc; https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90).

## Instance naming patterns

The instance name determines which isolated agent with its own state handles the request (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90). The docs name four patterns (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90):

- Per-user agents: `name: \`user-${userId}\``, one instance per user.
- Shared rooms: `name: roomId`, all users of a room share one agent.
- Global singleton: `name: "default"` for app-wide configuration.
- Dynamic naming: per-session, per-document (`doc-${documentId}`), or per-game instance names derived from context.

## Custom routing

For URL structures the default scheme does not fit, the client uses `basePath` to connect to any path, for example connecting to `/user` instead of `/agents/user-agent/...`; the server then resolves the instance from its own logic, typically the authenticated session, and forwards with `getAgentByName(env.UserAgent, session.userId)` followed by `agent.fetch(request)` (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90). The source doc compresses this to the same recipe: use `getAgentByName(env.MyAgent, "instance-id")` then `agent.fetch(request)` (source doc).

With basePath, the server determines the instance, so the client learns its identity on connect: the agent sends its identity automatically, surfaced through `onIdentity(name, agentType)` on useAgent or AgentClient, with `agent.identified` and `await agent.ready` for awaiting it (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90). Identity changes on reconnect surface via `onIdentityChange(oldName, newName, ...)`, and if instance names carry sensitive data you can set `static options = { sendIdentityOnConnect: false }` on the agent class, after which `agent.identified` stays false and `agent.ready` never resolves (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90).

Two helpers round out the toolkit: `buildAgentPath(address, { leafPath })` builds pathnames for known identities, including nested sub-agent routes, and `buildAgentUrl()` does the same against a base URL (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90).

## Routing options

`routeAgentRequest` and `getAgentByName` both accept options (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.88):

- `cors: true` for default CORS headers, or a custom header map for cross-origin frontends.
- `locationHint` such as `"enam"` to hint where a latency-sensitive agent should run.

The routing page's API reference lists the three signatures together: `routeAgentRequest(request, env, options?)`, `getAgentByName(namespace, name, options?)`, and `useAgent(options)` / `AgentClient` options (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90).

## Why this matters to the skill

The skill's routing section is short because the mental model is small: one class, one URL space, and the instance name is the identity key that the rest of the SDK (state, SQL, schedules, fibers) treats as stable across hibernation and reconnection (source doc; https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90). Custom routing exists so agents can slot into an existing URL structure rather than forcing the /agents prefix on it (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90).
