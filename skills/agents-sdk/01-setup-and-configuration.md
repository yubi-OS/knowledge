# 01 Setup and configuration

Scope: verifying the agents package is installed, installing it with the right companions, scaffolding through the Cloudflare starter, wiring wrangler.jsonc with Durable Object bindings and SQLite migrations, and the configuration gotchas that break agents at boot.

Grounding note for all corpus docs: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Every other claim cites its dig source URL plus the jev noul weight (a 0 to 1 probability) that backed it. Weights below 0.5 are labeled weak.

## Verify installation first

The source doc's FIRST: Verify Installation section makes this the mandatory opening move of any Agents SDK task: run `npm ls agents` and confirm the agents package shows up. If it is missing, install it with `npm install agents`. For chat agents the source doc requires four packages together: `npm install agents @cloudflare/ai-chat ai @ai-sdk/react`. The retrieval-first stance of the skill exists because Agents SDK knowledge ages fast; the docs themselves carry a "Last updated" date on every page (source doc; corroborated by the quick-start page header, https://developers.cloudflare.com/agents/getting-started/quick-start/, jev 0.92).

## Scaffold from the starter

The official quick start builds a counter agent with persistent state that syncs to a React frontend in real time, in about 10 minutes (https://developers.cloudflare.com/agents/getting-started/quick-start/, jev 0.92). The scaffold command is:

```
npm create cloudflare@latest -- --template cloudflare/agents-starter
```

That creates `src/server.ts` (your agent code), `src/client.tsx` (React frontend), `wrangler.jsonc`, a `tsconfig.json` extending `agents/tsconfig`, and a `vite.config.ts` including the `agents()` Vite plugin (https://developers.cloudflare.com/agents/getting-started/quick-start/, jev 0.92).

Two SDK integrations matter when you set a project up manually instead of via the starter (https://developers.cloudflare.com/agents/getting-started/quick-start/, jev 0.92):

1. `tsconfig.json` should extend `agents/tsconfig`, which sets `target: "ES2021"` and the other recommended compiler options.
2. `vite.config.ts` should include the `agents()` plugin, which performs the TC39 decorator transform required for `@callable()` under Vite 8.

## Wrangler configuration

The source doc's canonical wrangler.jsonc block has three parts: `"compatibility_flags": ["nodejs_compat"]`, a `durable_objects.bindings` entry naming the agent class, and a `migrations` entry with `new_sqlite_classes: ["MyAgent"]`. Agents require Cloudflare Durable Objects; the Agents API page states this plainly and points to Configuration for the bindings (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90). The migration uses `new_sqlite_classes` because agents store state in an embedded SQLite database; the chat agents page confirms the same requirement for AIChatAgent subclasses (https://developers.cloudflare.com/agents/communication-channels/chat/chat-agents/, jev 0.87). General wrangler configuration semantics are documented separately (https://developers.cloudflare.com/workers/wrangler/configuration/, jev 0.57).

Per the source doc, each agent class needs its own DO binding and its own migration entry. For AI inference the source doc requires adding `"ai": { "binding": "AI" }` to the config; the Agents API surface lists Workers AI, OpenAI, and Anthropic bindings as first-class model access (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90). Durable Objects migration rules, including the never-edit-old-migrations discipline, are documented in the DO migration reference (https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/, jev 0.57).

## Gotchas

The source doc lists four, and the digs corroborate the two that bite hardest:

- Do NOT enable `experimentalDecorators` in tsconfig. The SDK uses TC39 standard decorators; enabling the legacy flag applies an incompatible transform that silently breaks `@callable()` at runtime (source doc; same warning appears on https://developers.cloudflare.com/agents/runtime/lifecycle/callable-methods/, jev 0.92).
- Never edit old migrations; always add a new migration tag (source doc; consistent with the DO migrations reference, https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/, jev 0.57).
- Each agent class needs its own DO binding and migration entry (source doc).
- Add `"ai": { "binding": "AI" }` when the agent calls Workers AI (source doc).

## The deployment posture this configuration produces

An agent project is a Worker plus one or more SQLite-backed Durable Object classes. The agent instance is the DO; state, SQL, schedules, and WebSocket connections all live inside it. Getting the config right up front matters because the DO binding and migration are exactly the two things that fail at deploy time rather than at code review time (source doc; corroborated by https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).
