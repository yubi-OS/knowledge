# 02 - Coordination Atoms and Deterministic Routing

Scope: the skill's first 2 critical rules, the 3 stub-creation patterns, and how per-entity modeling and deterministic routing prevent the global-object bottleneck.

## Rule 1: model around coordination atoms

The source doc's first critical rule reads: "Model around coordination atoms - One DO per chat room/game/user, not one global DO" (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc). This is the load-bearing architectural decision the skill drives. A coordination atom is the smallest entity that needs serialized access to shared state: one room, one match, one user, one booking.

The reference architecture dig gives the scaling shape for when one atom is not enough: "depending on our load, we could further shard our control plane Durable Object into several Durable Objects" (https://developers.cloudflare.com/reference-architecture/diagrams/storage/durable-object-control-data-plane-pattern/, jev weight 0.88). That is the parent-child pattern the skill's When to Use list names as a design activity: a few control-plane objects route work into many per-entity data-plane objects, and the pattern can be applied recursively (weight 0.88).

The anti-direction is the skill's first NEVER: a single global DO handling all requests is a bottleneck (source doc, Anti-Patterns). Cloudflare's docs describe each DO as having "a globally-unique name, which allows you to send requests to a specific object from anywhere in the world" (https://developers.cloudflare.com/durable-objects/, weight 0.97), which is exactly the property that makes one-object-per-entity viable at global scale.

## Rule 2: deterministic routing with getByName

The second critical rule: "Use getByName() for deterministic routing - Same input = same DO instance" (source doc). The stub-creation section lays out 3 patterns (source doc):

```typescript
// Deterministic - preferred for most cases
const stub = env.MY_DO.getByName("room-123");

// From existing ID string
const id = env.MY_DO.idFromString(storedIdString);
const stub = env.MY_DO.get(id);

// New unique ID - store mapping externally
const id = env.MY_DO.newUniqueId();
const stub = env.MY_DO.get(id);
```

The namespace API reference explains the contract behind the third pattern: "IDs created using newUniqueId, will need to be stored as a string in order to refer to the same Durable Object again in the future" (https://developers.cloudflare.com/durable-objects/api/namespace/, weight 0.96). Unique IDs are not recoverable from any name; if you do not persist the string, the object becomes unreachable. The ID itself is "the 64-digit hex identifier used to address a Durable Object" (https://developers.cloudflare.com/durable-objects/api/id/, weight 0.96).

The skill's search list includes `idFromName` alongside `getByName` (source doc, Reference Documentation). Both derive an ID from a name, so the same name always maps to the same object; `getByName` is the 2-step convenience wrapper. A Cloudflare community announcement (weight 0.08, weak backing) describes `getByName` as removing "the need to convert Durable Object names to IDs and then create a stub", which matches the source doc's preference ordering.

## Choosing between the 3 patterns

The decision the skill encodes (source doc comments):

- getByName when a natural string key exists (room ID, user ID, game ID). Preferred for most cases.
- idFromString plus get when an ID string was previously persisted, for example a `newUniqueId()` stored in another database.
- newUniqueId when identity must be unguessable or globally unique beyond a name, accepting the obligation to store the mapping externally.

Review heuristic: any `newUniqueId()` call site should have a visible persistence path for the returned ID. An unpaired `newUniqueId()` is a reachability bug waiting to happen, because only stored IDs address the same object later (namespace API, weight 0.96).

## Ties to the rest of the skill

Deterministic routing is what makes the storage rules in doc 04 safe: because the same name always lands on the same object, the object's constructor can run schema setup exactly once per identity, and its alarms (doc 06) and WebSockets (doc 07) attach to a stable entity rather than to whatever server happened to answer. The skill's boundary note also applies here: designing a sharding hierarchy is in scope; picking between Workers and Durable Objects is doc 01's question.
