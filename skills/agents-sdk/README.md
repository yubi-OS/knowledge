# skills/agents-sdk

A knowledge corpus explicating the yubiOS skill **agents-sdk** (ground source: yubi-OS/yubiOS skills/agents-sdk/SKILL.md). The skill teaches how to build AI agents on Cloudflare Workers using the Agents SDK; this corpus deepens it doc by doc, following the SKILL.md's own section joints.

Every factual claim cites either the source doc or its dig source URL with the jev noul weight (0 to 1) that backed it. Weights below 0.5 are labeled weak in the text.

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | [01-setup-and-configuration.md](01-setup-and-configuration.md) | Installation verification, npm packages, starter scaffolding, wrangler.jsonc bindings and migrations, config gotchas |
| 02 | [02-agent-class-core.md](02-agent-class-core.md) | The Agent class, Durable Object instance model, lifecycle hooks, core API surface, the Counter example |
| 03 | [03-state-management.md](03-state-management.md) | setState, validateStateChange, SQLite via this.sql, client sync, best practices |
| 04 | [04-routing.md](04-routing.md) | URL scheme, routeAgentRequest, naming patterns, basePath and getAgentByName, routing options |
| 05 | [05-callable-rpc.md](05-callable-rpc.md) | @callable WebSocket RPC, streaming callables, errors, retries, timeouts, when not to use the decorator |
| 06 | [06-scheduling-background.md](06-scheduling-background.md) | schedule, scheduleEvery, cron, AgentWorkflow, runFiber and stash, queue, retry |
| 07 | [07-chat-and-client.md](07-chat-and-client.md) | AIChatAgent, resumable streaming, useAgent and useAgentChat, server-driven messages, human in the loop |
| 08 | [08-mcp-integration.md](08-mcp-integration.md) | MCP client APIs, building MCP servers, McpAgent deprecation drift, transports, OAuth security |
| 09 | [09-integrations-experimental.md](09-integrations-experimental.md) | Email, webhooks, push notifications, observability, cross-domain auth, voice, browser tools, think, package map |

## Research summary

- Results collected: 108 (18 searXNG queries, top 6 kept per query, 9 subtopics x 2 queries)
- Weight split: 31 high (>= 0.5) / 77 low (< 0.5) of 108; 0 unweighted
- jev requests: 10 (1 outline score validation batch of 9 questions, 9 noul weighting batches of 12 questions); usage 11648 input tokens / 2119 output tokens
- Redos: 0 (no dig was thin enough to require a redo; subtopic 09 leaned on the source doc where the dig returned aggregator pages)
- Skipped docs: 0 of 9
- Gaps: subtopic 09 (integrations-experimental) has several sections grounded only in the source doc or the Agents API overview because the dig pull returned aggregator and boilerplate pages; a follow-up refresh should re-dig with feature-page-specific queries
- Dated corrections recorded: server-side state hook is onStateChanged (not onStateUpdate as the source doc shows); McpAgent is deprecated and feature-frozen with createMcpHandler as the new path for stateless MCP servers

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); weighting ran against DefAPI https://api.defapi.org/api/v1/decisions with jev-1.13 directly, agent-side probe skipped for speed per the mint brief. The steady-orbit /api/decide relay was not needed (zero DefAPI failures).

## Ground source

yubi-OS/yubiOS skills/agents-sdk/SKILL.md (13005 B). The corpus explicates the skill; it does not replace it.
