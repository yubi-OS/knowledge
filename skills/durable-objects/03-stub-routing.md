# 03 - Stub Creation and Deterministic Routing

Scope: the three ways to get a Durable Object stub, why getByName is the skill's preferred default, and how the id APIs behave.

## The three stub paths

The source doc's Stub Creation section lists exactly 3 ways to obtain a stub (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md):

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

The comment on the first path carries the rule: getByName is deterministic and preferred for most cases (source doc). Critical rule 2 restates it: use getByName for deterministic routing, same input means same DO instance (source doc). That property is what turns a name like room-123 into an address: every Worker invocation that asks for room-123 gets a stub to the same object, with no lookup table to maintain.

## What the Namespace API says about each path

Cloudflare's Durable Object Namespace reference documents the id creators the skill leans on (https://developers.cloudflare.com/durable-objects/api/namespace/, jev weight 0.97):

- newUniqueId creates a randomly generated and unique DurableObjectId referring to an individual instance of the DO class. IDs created with newUniqueId need to be stored as a string in order to refer to the same DO again in the future (same source, jev weight 0.97). This matches the source doc's comment on the third path: new unique ID, store mapping externally (source doc).
- idFromName derives an ID from a name; the Durable Object ID reference states that the name property of a DurableObjectId returns the name that was used to create it via idFromName, and that this value is undefined if the ID was constructed via newUniqueId (https://developers.cloudflare.com/durable-objects/api/id/, jev weight 0.96). The name you chose is therefore recoverable from the ID, which is useful for debugging routed objects.

The Stub reference adds the client-side mirror: the name property of a DurableObjectStub returns a name if it was provided at stub creation, either directly via getByName or indirectly via a DurableObjectId created from a name (https://developers.cloudflare.com/durable-objects/api/stub/, jev weight 0.96).

## What a stub is

The DurableObjectStub interface is the client used to invoke methods on a remote Durable Object (https://developers.cloudflare.com/durable-objects/api/stub/, jev weight 0.96). A stub is not the object; it is the handle through which the Worker calls into it. The basic pattern in the source doc shows the whole chain: env.MY_DO.getByName("my-instance") returns the stub, and stub.addItem("hello") invokes the RPC method (source doc).

## ID strings and validation

An ID that came from newUniqueId or idFromName can be serialized to a string and later reconstructed with idFromString (source doc). The third-party Rust binding documentation for worker's ObjectNamespace confirms the wire shape and the failure mode: a stringified object ID is a 64-digit hexadecimal number, but not all 64-digit hex numbers are valid IDs, and the method throws if passed an ID that was not originally created by newUniqueId() or idFromName() (https://docs.rs/worker/latest/worker/durable/struct.ObjectNamespace.html, jev weight 0.83). Treat idFromString as a validating parse, not a cast: an ID string minted from newUniqueId can be reconstructed, but arbitrary hex cannot.

## Choosing between the paths

The skill's decision rule is a priority order, not a menu (source doc):

1. getByName when a stable, human-meaningful key exists (room-123, user-42). Default choice. Same input resolves to the same instance forever.
2. newUniqueId when you need a fresh, unguessable instance and you will store the ID string yourself (per-request scratch objects, unlisted sessions). Cloudflare's docs confirm the storage obligation: the string must be kept to reach the same object again (https://developers.cloudflare.com/durable-objects/api/namespace/, jev weight 0.97).
3. idFromString only to rehydrate an ID that was previously serialized.

The anti-pattern that follows from path 1: routing through anything other than the deterministic name (a cache of IDs, a database row that can drift) reintroduces the coordination problem DOs exist to remove. Critical rule 2 is the guard: same input, same DO instance (source doc).

## In the basic pattern

The source doc's Quick Reference wires this together (source doc): the Worker's fetch handler calls env.MY_DO.getByName("my-instance") and immediately awaits an RPC method on the returned stub, returning Response.json({ id }). No id bookkeeping, no mapping table: the name is the address.

## Summary

Prefer getByName for deterministic routing; use newUniqueId plus externally stored ID strings when instances must be freshly minted; use idFromString only to validate and rehydrate serialized IDs. The name property on IDs and stubs is traceable back to idFromName, and undefined for newUniqueId IDs. The Stub is the remote-method client; the Namespace is where IDs and stubs are made.
