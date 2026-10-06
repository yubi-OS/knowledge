# 02 - Coordination-Atom Modeling

Scope: the skill's first critical rule, model around coordination atoms, one Durable Object per chat room, game, or user, never one global DO, and the use cases that modeling choice unlocks.

## The rule

Critical rule 1 in the source doc: model around coordination atoms. One DO per chat room, game, or user, not one global DO (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md). The unit of state and of serialization is the entity that clients coordinate around. A chat room, a game match, a shopping cart, a single tenant's data: each is one Durable Object instance. The namespace-level class definition is the template; instances are the atoms.

Cloudflare's overview describes the same shape from the product side: Durable Objects exist for coordination among multiple clients, for collaborative editing tools, interactive chat, multiplayer games, live notifications, and deep distributed systems, so you do not have to build serialization and coordination primitives yourself (https://developers.cloudflare.com/durable-objects/, jev weight 0.97).

## Why one atom, not one global object

A global DO that every request funnels through is the skill's first listed anti-pattern: single global DO handling all requests is a bottleneck (source doc). The mismatch is fundamental. A Durable Object serializes access to its own state; that serialization is a feature when it guards one entity's state (an inventory count, a turn order, a room's message log) and a defect when it throttles traffic that has no shared state. Cloudflare's design guidelines page, Rules of Durable Objects, is the canonical deep reference for this when-and-how judgment (https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/, jev weight 0.97).

The matching anti-pattern list in the source doc (single global DO, state held only in memory, broken write atomicity) all trace back to the same modeling error: putting the wrong boundary around the atom.

## The consistency property being bought

Durable Objects give each atom a single place where its state lives and a single thread of execution over it. The storage attached to a DO is transactional and strongly consistent, and it is private to that unique instance, inaccessible to other objects (https://developers.cloudflare.com/durable-objects/api/storage-api/, jev weight 0.96). That is what makes the strong-consistency use cases in the source doc's table work: inventory, booking systems, turn-based games (source doc). Two clients racing to book the last seat hit the same DO instance, and the instance decides the order.

Cloudflare's launch post frames the same property: consistent, low-latency, distributed storage and state, with coordination and real-time collaboration between clients (https://blog.cloudflare.com/introducing-workers-durable-objects/, jev weight 0.84).

## Per-entity storage and multi-tenancy

The per-entity storage row of the source doc's table (multi-tenant SaaS, per-user data) falls directly out of the atom model: if each tenant is an atom, each tenant gets its own DO instance with its own private storage, and isolation comes for free from the instance boundary. The skill's stub-creation section (getByName for deterministic routing) is what makes this addressable: the same tenant name always resolves to the same instance (source doc, and see doc 03 of this corpus).

## Scheduled work per atom

The 5th row, scheduled work per entity (subscription renewals, game timeouts), is the alarms subsystem: each DO instance carries exactly one alarm, set with setAlarm (source doc, rule 7; full treatment in doc 07). The point for the modeling discussion is that scheduled work is attached to the atom, not to a global scheduler: a game timeout belongs to one match instance, a renewal to one subscription instance.

## Persistent connections per atom

The 4th row, persistent connections (WebSockets, real-time notifications), also binds to the atom: the room instance holds the room's sockets. Every Durable Object is a WebSocket server and client, so broadcast within the atom is a few lines of code (https://www.cloudflare.com/products/durable-objects/, jev weight 0.67). Hibernation and the WebSocket API split are covered in doc 08.

## Sharding and parent-child relationships

The skill's When to Use list includes designing sharding strategies and parent-child relationships (source doc). The atom rule composes upward: when one atom is too big (a room with thousands of participants), the design question becomes how to split it into child atoms and how a parent DO coordinates them. The skill does not prescribe a single sharding pattern in its quick reference; it flags the design task as in-scope and points at the retrieval sources (https://developers.cloudflare.com/durable-objects/, jev weight 0.97) for the current documented patterns.

## Summary

One Durable Object per coordination atom. The atom owns its state (private, transactional, strongly consistent storage), its thread of execution, its alarm, and its sockets. A global DO is the canonical anti-pattern. When an atom outgrows one instance, the skill's sharding-and-parent-child scope is where the design work lives, grounded in the Cloudflare best-practices and rules pages.
