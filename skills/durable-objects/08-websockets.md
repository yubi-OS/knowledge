# 08 - WebSockets and Persistent Connections

Scope: serving WebSocket connections from Durable Objects, the two APIs (standard and Hibernation), why Hibernation is the recommended server-side choice, and how persistent connections bind to the coordination atom.

## Every DO is a WebSocket endpoint

The source doc lists persistent connections (WebSockets, real-time notifications) as one of the 5 reasons to reach for a Durable Object (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md). Cloudflare's product page states the same capability as a property of the primitive itself: every Durable Object is also a WebSocket server and client, so you can broadcast and coordinate state in real-time with just a few lines of code (https://www.cloudflare.com/products/durable-objects/, jev weight 0.67). The fit is structural: a chat room, game match, or collaborative doc (the source doc's coordination atoms) is exactly the entity that a set of clients hold sockets to, and the DO is the single point where those sockets meet (source doc use-for table; https://developers.cloudflare.com/durable-objects/, jev weight 0.97).

## Two APIs

Cloudflare's WebSocket best-practices page documents 2 ways to serve WebSocket connections from a Durable Object: the standard and Hibernation APIs (https://developers.cloudflare.com/durable-objects/best-practices/websockets/, jev weight 0.95). The source doc for those best practices spells the split out: the Hibernation WebSocket API allows the Durable Object to hibernate without disconnecting clients when idle, and is marked recommended; the Web Standard WebSocket API uses the familiar addEventListener event pattern (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/durable-objects/best-practices/websockets.mdx, jev weight 0.90).

## Why Hibernation wins on the server

The hibernation-server example gives the economics and the feature argument: the WebSocket Hibernation API should be preferred for WebSocket server applications built on Durable Objects, since it significantly decreases duration charge, and provides additional features that pair well with WebSocket applications (https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/, jev weight 0.94).

The duration-charge point follows from what hibernation changes: with the standard API the object stays resident for as long as sockets are open, billing (and holding memory) for idle time; with hibernation the runtime can evict the object's execution while keeping the client connections alive, waking it only for events. Idle rooms stop costing runtime duration while their sockets stay connected (https://developers.cloudflare.com/durable-objects/best-practices/websockets/, jev weight 0.95).

## Routing sockets to the right atom

The skill's stub-creation rules drive socket routing: getByName("room-123") deterministically returns the stub for that room's DO, and the Worker upgrades and forwards the socket to that instance (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md). Same room name, same instance, same set of connected clients. The broadcast surface is the atom: notifications, game state, and document edits flow through the object that owns the entity's state, which is also where the SQLite-backed truth lives (doc 04).

## Review checklist

1. Server-side WebSocket serving in a DO uses the Hibernation API unless there is a specific reason for the standard addEventListener-style API (https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/, jev weight 0.94; https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/durable-objects/best-practices/websockets.mdx, jev weight 0.90).
2. Sockets are attached to the coordination atom (one room, one match, one document), not scattered across instances (source doc rule 1).
3. State the sockets mutate is persisted per doc 04's rules; in-memory-only state around sockets is the documented anti-pattern (source doc).
4. Retrieval before implementation: the skill mandates fetching https://developers.cloudflare.com/durable-objects/best-practices/websockets/ when implementing WebSocket features, since API details may have moved (source doc; jev weight 0.95).

## Not WebSocket-related but nearby

The digs surfaced the WebGPU API page for Durable Objects: it is only available in local development, and you cannot deploy Durable Objects to Cloudflare that rely on the WebGPU API (https://developers.cloudflare.com/durable-objects/api/webgpu/, jev weight 0.81). Recorded here because it is the kind of local-only API surface that a WebSocket-adjacent build might reach for and then fail to deploy.

## Summary

Persistent connections are a first-class DO use case: every object is a WebSocket server and client. Two server APIs exist; prefer Hibernation for server applications, because it lets the object hibernate without disconnecting clients when idle and significantly decreases duration charge. The standard Web API remains for the familiar addEventListener pattern. Sockets belong to the coordination atom, and state they touch follows the persist-first storage rules.
