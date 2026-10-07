# 07 - WebSockets and Hibernation

Scope: persistent connections as a first-class Durable Object use case, the 2 WebSocket APIs, and why the hibernation API is the default for DO WebSocket servers.

## The use case and the object

The source doc lists persistent connections (WebSockets, real-time notifications) as one of the 5 canonical DO use cases (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc). The reason DOs are the natural home is identity: each chat room, game session, or notification feed maps to one object with one addressable name (doc 02), and all clients of that entity converge on the same object. Cloudflare's real-time chat tutorial makes the pattern explicit: "The chat application uses a Durable Object to control each chat room" (https://developers.cloudflare.com/workers/tutorials/deploy-a-realtime-chat-app/, jev weight 0.87).

## Two APIs, one recommendation

The best-practices page separates the options: "Hibernation WebSocket API - Allows the Durable Object to hibernate without disconnecting clients when idle. (recommended). Web Standard WebSocket API - Uses the familiar addEventListener event pattern" (https://developers.cloudflare.com/durable-objects/best-practices/websockets/, weight 0.95).

The hibernation API reference defines the mechanism: "The WebSocket Hibernation API allows a Durable Object that is not currently running an event handler (such as handling a WebSocket message, HTTP request, ...) to be evicted from memory" (https://developers.cloudflare.com/durable-objects/api/websockets/, weight 0.96). The connection stays open at the edge; only the in-memory object goes to sleep. The example page states the cost rationale: "The WebSocket Hibernation API should be preferred for WebSocket server applications built on Durable Objects, since it significantly decreases duration charge, and provides additional features that pair well with WebSocket applications" (https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/, weight 0.94).

A third-party explainer (weight 0.21, weak backing, labeled weak) summarizes the same economics: "the WebSocket client can stay connected to Cloudflare's network, while the Durable Object gets to be removed from memory" (https://thomasgauvin.com/writing/how-cloudflare-durable-objects-websocket-hibernation-works/).

## What hibernation changes in review

Under the standard API, an idle DO with open sockets stays resident and bills duration; under hibernation, the object wakes per event (message, close, alarm) and sleeps again. That shifts the review focus:

1. Message handling must not rely on in-memory session maps surviving between events, because eviction clears them. Client registries belong in SQLite storage (doc 04), reloaded or re-derived on wake. This is the skill's anti-pattern "Storing critical state only in memory (lost on eviction/crash)" (source doc) applied directly to WebSocket servers.
2. The persist-first rule (source doc critical rule 6) applies to messages: write the durable record before broadcasting, so a crash between wake and broadcast does not lose the message.
3. The hibernation example is the reference implementation the skill points at (source doc Retrieval Sources, Examples row): https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/ (weight 0.94).

## Convergence with alarms

Hibernation and alarms compose: a hibernating object can still be woken by its alarm (doc 06) to run scheduled work, for example sweeping stale connections or firing game timeouts. The docs examples index groups exactly these patterns, "counters, WebSockets, and alarms" (https://developers.cloudflare.com/durable-objects/examples/, weight 0.95). A review heuristic: if a DO keeps clients connected but also needs timers, verify the timer work goes through the alarm API rather than a `setTimeout` held in memory, which eviction would discard.

## Review checklist for WebSocket DOs

1. Server-side sockets use the Hibernation API (recommended) unless there is a stated reason for the standard API (best-practices, weight 0.95).
2. No critical per-connection state lives only in memory across events (source doc anti-pattern; hibernation API weight 0.96).
3. Broadcasts follow persist-first ordering (source doc rule 6).
4. The object-per-entity mapping comes from deterministic routing, so reconnecting clients land on the same object (doc 02).
5. Scheduled work per entity uses alarms, not in-memory timers (source doc use-case table row 5; alarms reference weight 0.95).
