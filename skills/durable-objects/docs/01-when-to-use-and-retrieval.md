# 01 - When to Use Durable Objects and the Retrieval Discipline

Scope: when a Durable Object is the right primitive, when it is not, and the retrieval-first working rule the durable-objects skill imposes on every task.

## What the skill says

The durable-objects skill (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc) opens with a scope claim: build stateful, coordinated applications on Cloudflare's edge using Durable Objects. It then lists 6 trigger conditions under When to Use:

1. Creating new Durable Object classes for stateful coordination
2. Implementing RPC methods, alarms, or WebSocket handlers
3. Reviewing existing DO code for best practices
4. Configuring wrangler.jsonc/toml for DO bindings and migrations
5. Writing tests with `@cloudflare/vitest-pool-workers`
6. Designing sharding strategies and parent-child relationships

The skill also draws a hard boundary in its Guidelines section: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job." A request that names a trigger without the artifact it acts on routes to the owning surface instead of being improvised inside this skill (source doc, Examples section, Boundary case note).

## The use and non-use tables

The skill's Core Principles section gives two tables that are the core decision aid (source doc):

Use Durable Objects for:

| Need | Example |
|------|---------|
| Coordination | Chat rooms, multiplayer games, collaborative docs |
| Strong consistency | Inventory, booking systems, turn-based games |
| Per-entity storage | Multi-tenant SaaS, per-user data |
| Persistent connections | WebSockets, real-time notifications |
| Scheduled work per entity | Subscription renewals, game timeouts |

Do NOT use Durable Objects for:

- Stateless request handling (use plain Workers)
- Maximum global distribution needs
- High fan-out independent requests

Cloudflare's own docs back the coordination framing: the Durable Objects overview describes them for "applications that need coordination among multiple clients, like collaborative editing tools, interactive chat, multiplayer games, live notifications, and deep distributed systems" (https://developers.cloudflare.com/durable-objects/, jev weight 0.97). The concepts page names the same 4 axes the skill encodes: identity, storage, lifecycle, and coordination (https://developers.cloudflare.com/durable-objects/concepts/, weight 0.97). The product page adds an AI-agents framing, memory plus task coordination for agents (https://www.cloudflare.com/en-gb/developer-platform/products/durable-objects/, weight 0.64).

The non-use list has direct support in the rules: the Rules of Durable Objects guide is explicitly "design guidelines for building correct and effective Durable Objects applications, covering when and how to use them" (https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/, weight 0.97). A customer quote on the vendor page illustrates the persistent-connections row: without Durable Objects, "hosting WebSocket servers might have required at least four additional people just for management" (https://www.cloudflare.com/products/durable-objects/, weight 0.68).

## The retrieval-first rule

The skill's first substantive section is not code at all. It states: "Your knowledge of Durable Objects APIs and configuration may be outdated. Prefer retrieval over pre-training for any Durable Objects task" (source doc). It then pins 4 canonical sources:

| Resource | URL |
|----------|-----|
| Docs | https://developers.cloudflare.com/durable-objects/ |
| API Reference | https://developers.cloudflare.com/durable-objects/api/ |
| Best Practices | https://developers.cloudflare.com/durable-objects/best-practices/ |
| Examples | https://developers.cloudflare.com/durable-objects/examples/ |

The instruction is operational, not decorative: fetch the relevant doc page when implementing features (source doc). The skill also seeds a search list of the APIs that recur in review work: `blockConcurrencyWhile`, `idFromName`, `getByName`, `setAlarm`, `sql.exec` (source doc, Reference Documentation section). Those 5 symbols map 1:1 onto the later sections of this corpus: routing (doc 02), storage (doc 04), alarms (doc 06), and the concurrency hazards in the anti-pattern review (doc 08).

## How to apply this in review

When triaging a request against this skill, the sequence the source doc implies is: match the trigger (one of the 6), check the need table for the right justification, then refuse the anti-cases. A stateless request handler that does no coordination fails the table and should stay a plain Worker. A booking system passes the strong-consistency row. Per-user data with per-entity alarms passes both the per-entity storage and scheduled-work rows at once, which is a common and legitimate overlap.

Weak-backing note: third-party comparison posts in the dig (for example https://zairalabs.ai/guide/compare/cloudflare-durable-objects-vs-cloudflare-workers-kv/, jev weight 0.10) were weighted low and are not used as backing here; the decision tables above rest on the source doc plus Cloudflare first-party pages at weight 0.64 or higher.
